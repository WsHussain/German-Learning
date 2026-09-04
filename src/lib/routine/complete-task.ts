import { prisma } from "@/lib/prisma";
import {
  DAILY_BONUS_XP,
  STREAK_MILESTONE_BONUS_XP,
  STREAK_MILESTONE_INTERVAL,
  TASK_TYPE_TO_XP_REASON,
  getLevelInfo,
} from "@/lib/gamification/xp";
import { applyCompletedDay } from "@/lib/gamification/streak";
import { getOrCreateWeeklyGoal } from "@/lib/routine/weekly-goal";

export class TaskActionError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

async function loadTaskForUser(taskId: string, userId: string) {
  const task = await prisma.dailyTask.findUnique({
    where: { id: taskId },
    include: { dailyLog: true },
  });
  if (!task || task.dailyLog.userId !== userId) {
    throw new TaskActionError("Task not found.", 404);
  }
  return task;
}

export async function completeTask(taskId: string, userId: string) {
  const task = await loadTaskForUser(taskId, userId);

  if (task.status === "COMPLETED") {
    return summarize(userId, task.dailyLogId, 0, false);
  }

  await prisma.dailyTask.update({
    where: { id: task.id },
    data: { status: "COMPLETED", completedAt: new Date(), actualMinutes: task.durationMinutes },
  });

  await prisma.dailyLog.update({
    where: { id: task.dailyLogId },
    data: { completedMinutes: { increment: task.durationMinutes } },
  });

  await prisma.xPTransaction.create({
    data: { userId, amount: task.xpValue, reason: TASK_TYPE_TO_XP_REASON[task.type] },
  });
  const userAfterTaskXp = await prisma.user.update({
    where: { id: userId },
    data: { xpTotal: { increment: task.xpValue } },
  });

  if (task.type === "YOUTUBE" && task.videoId) {
    await prisma.videoProgress.upsert({
      where: { userId_videoId: { userId, videoId: task.videoId } },
      update: { status: "COMPLETED", watchedAt: new Date() },
      create: { userId, videoId: task.videoId, status: "COMPLETED", watchedAt: new Date() },
    });
  }

  let xpAwarded = task.xpValue;
  const levelBefore = getLevelInfo(userAfterTaskXp.xpTotal - task.xpValue).level;

  const remainingTasks = await prisma.dailyTask.findMany({ where: { dailyLogId: task.dailyLogId } });
  const allCompleted = remainingTasks.every((t) => t.status === "COMPLETED");
  const dailyLog = await prisma.dailyLog.findUniqueOrThrow({ where: { id: task.dailyLogId } });

  let dayJustCompleted = false;

  if (allCompleted && !dailyLog.bonusAwarded) {
    dayJustCompleted = true;
    xpAwarded += DAILY_BONUS_XP;

    await prisma.xPTransaction.create({
      data: { userId, amount: DAILY_BONUS_XP, reason: "DAILY_BONUS" },
    });

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const streak = applyCompletedDay(
      {
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        lastActiveDate: user.lastActiveDate,
      },
      dailyLog.date,
    );

    let milestoneBonus = 0;
    if (streak.currentStreak > user.currentStreak && streak.currentStreak % STREAK_MILESTONE_INTERVAL === 0) {
      milestoneBonus = STREAK_MILESTONE_BONUS_XP;
      await prisma.xPTransaction.create({
        data: { userId, amount: milestoneBonus, reason: "STREAK_BONUS" },
      });
      xpAwarded += milestoneBonus;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        xpTotal: { increment: DAILY_BONUS_XP + milestoneBonus },
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        lastActiveDate: streak.lastActiveDate,
      },
    });

    await prisma.dailyLog.update({
      where: { id: dailyLog.id },
      data: { allTasksCompleted: true, bonusAwarded: true },
    });

    const settings = await prisma.userSettings.findUnique({ where: { userId } });
    const weeklyGoal = await getOrCreateWeeklyGoal(userId, dailyLog.date, settings?.dailyGoalMinutes ?? 60);
    await prisma.weeklyGoal.update({
      where: { id: weeklyGoal.id },
      data: {
        completedDays: { increment: 1 },
        // dailyLog.completedMinutes already reflects this task's minutes (updated above).
        completedMinutes: { increment: dailyLog.completedMinutes },
      },
    });
  }

  const finalUser = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const levelAfter = getLevelInfo(finalUser.xpTotal).level;

  return summarize(userId, task.dailyLogId, xpAwarded, dayJustCompleted, levelAfter > levelBefore);
}

export async function skipTask(taskId: string, userId: string) {
  const task = await loadTaskForUser(taskId, userId);
  if (task.status !== "PENDING") return summarize(userId, task.dailyLogId, 0, false);

  await prisma.dailyTask.update({ where: { id: task.id }, data: { status: "SKIPPED" } });
  return summarize(userId, task.dailyLogId, 0, false);
}

async function summarize(
  userId: string,
  dailyLogId: string,
  xpAwarded: number,
  dayJustCompleted: boolean,
  leveledUp = false,
) {
  const dailyLog = await prisma.dailyLog.findUniqueOrThrow({
    where: { id: dailyLogId },
    include: { tasks: { orderBy: { order: "asc" }, include: { video: true } } },
  });
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const tasksRemaining = dailyLog.tasks.filter((t) => t.status === "PENDING").length;

  return {
    dailyLog,
    xpAwarded,
    dayJustCompleted,
    leveledUp,
    tasksRemaining,
    xpTotal: user.xpTotal,
    level: getLevelInfo(user.xpTotal),
    currentStreak: user.currentStreak,
    bestStreak: user.bestStreak,
  };
}
