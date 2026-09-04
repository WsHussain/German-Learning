import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateTodaysLog } from "@/lib/routine/daily-log";
import { getOrCreateWeeklyGoal } from "@/lib/routine/weekly-goal";
import { getRecentDayStatuses } from "@/lib/routine/history";
import { RoutineBoard, type TaskClient } from "@/components/dashboard/routine-board";
import { RoadmapProgressCard } from "@/components/dashboard/roadmap-progress-card";
import { VideoCard } from "@/components/videos/video-card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [user, dailyLog, historyDays] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { settings: true } }),
    getOrCreateTodaysLog(userId),
    getRecentDayStatuses(userId, 13),
  ]);

  const weeklyGoal = await getOrCreateWeeklyGoal(userId, new Date(), user.settings?.dailyGoalMinutes ?? 60);
  const totalWeeks = await prisma.roadmapWeek.count();

  const recommendedProgress = await prisma.videoProgress.findMany({
    where: { userId, status: { in: ["RECOMMENDED", "SAVED"] } },
    include: { video: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const recommendedVideos = recommendedProgress
    .map((p) => p.video)
    .filter((v) => v.id !== dailyLog.tasks.find((t) => t.type === "YOUTUBE")?.videoId)
    .slice(0, 2);

  const tasks: TaskClient[] = dailyLog.tasks.map((t) => ({
    id: t.id,
    type: t.type,
    title: t.title,
    durationMinutes: t.durationMinutes,
    xpValue: t.xpValue,
    order: t.order,
    externalUrl: t.externalUrl,
    status: t.status,
  }));

  return (
    <div className="space-y-8">
      <RoutineBoard
        dayNumber={dailyLog.dayNumber}
        initialTasks={tasks}
        initialGoalMinutes={dailyLog.goalMinutes}
        initialCompletedMinutes={dailyLog.completedMinutes}
        initialXpTotal={user.xpTotal}
        initialCurrentStreak={user.currentStreak}
        initialBestStreak={user.bestStreak}
        initialWeeklyGoal={{
          completedDays: weeklyGoal.completedDays,
          targetDays: weeklyGoal.targetDays,
          completedMinutes: weeklyGoal.completedMinutes,
          targetMinutes: weeklyGoal.targetMinutes,
        }}
        historyDays={historyDays}
      />

      <RoadmapProgressCard
        currentLevel={user.currentLevel}
        currentWeekOrder={dailyLog.roadmapWeek?.order ?? 1}
        totalWeeks={totalWeeks}
        weekTitle={dailyLog.roadmapWeek?.title}
      />

      {recommendedVideos.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-sm font-semibold tracking-tight">Recommended for you</h2>
            <a href="/videos" className="text-xs text-primary hover:underline">
              Browse all
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendedVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
