import { startOfWeek, endOfWeek, subDays, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getWeeklyStats(userId: string, referenceDate: Date = new Date()) {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });

  const [logs, xpAgg, videosWatched, speakingSessions, vocabLearnedThisMonth] = await Promise.all([
    prisma.dailyLog.findMany({
      where: { userId, date: { gte: weekStart, lte: weekEnd } },
      include: { tasks: true },
    }),
    prisma.xPTransaction.aggregate({
      where: { userId, createdAt: { gte: weekStart, lte: weekEnd } },
      _sum: { amount: true },
    }),
    prisma.videoProgress.count({
      where: { userId, status: { in: ["WATCHED", "COMPLETED"] }, updatedAt: { gte: weekStart, lte: weekEnd } },
    }),
    prisma.speakingLog.count({ where: { userId, practicedAt: { gte: weekStart, lte: weekEnd } } }),
    prisma.vocabularyProgress.count({
      where: { userId, status: "MASTERED", updatedAt: { gte: subDays(new Date(), 30) } },
    }),
  ]);

  const daysCompleted = logs.filter((l) => l.allTasksCompleted).length;
  const totalMinutes = logs.reduce((sum, l) => sum + l.completedMinutes, 0);
  const completionRate = logs.length > 0 ? Math.round((daysCompleted / 7) * 100) : 0;

  return {
    daysCompleted,
    totalMinutes,
    xpEarned: xpAgg._sum.amount ?? 0,
    videosWatched,
    speakingSessions,
    vocabLearnedThisMonth,
    completionRate,
  };
}

export async function getDailyMinutesSeries(userId: string, days = 14) {
  const today = startOfDay(new Date());
  const since = subDays(today, days - 1);

  const logs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: since, lte: today } },
    select: { date: true, completedMinutes: true, goalMinutes: true },
  });
  const byDate = new Map(logs.map((l) => [startOfDay(l.date).getTime(), l]));

  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const log = byDate.get(date.getTime());
    series.push({
      date,
      minutes: log?.completedMinutes ?? 0,
      goal: log?.goalMinutes ?? 60,
    });
  }
  return series;
}
