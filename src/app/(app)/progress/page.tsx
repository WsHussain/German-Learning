import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeeklyStats, getDailyMinutesSeries } from "@/lib/stats/weekly";
import { getLevelInfo } from "@/lib/gamification/xp";
import { MinutesBarChart } from "@/components/charts/minutes-bar-chart";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [user, weekly, series] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    getWeeklyStats(userId),
    getDailyMinutesSeries(userId, 14),
  ]);

  const level = getLevelInfo(user.xpTotal);
  const chartData = series.map((s) => ({ date: s.date.toISOString(), minutes: s.minutes, goal: s.goal }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&rsquo;re {level.progressPercent}% through level {level.level}. On day {user.dayNumber} overall.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">Minutes studied — last 14 days</h2>
        <div className="border border-border bg-card p-4">
          <MinutesBarChart data={chartData} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">This week</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Days completed" value={`${weekly.daysCompleted} / 7`} />
          <Stat label="Total time" value={`${weekly.totalMinutes} min`} />
          <Stat label="XP earned" value={weekly.xpEarned.toLocaleString()} />
          <Stat label="Completion rate" value={`${weekly.completionRate}%`} />
          <Stat label="Videos watched" value={String(weekly.videosWatched)} />
          <Stat label="Speaking sessions" value={String(weekly.speakingSessions)} />
          <Stat label="Words mastered (30d)" value={String(weekly.vocabLearnedThisMonth)} />
          <Stat label="Current streak" value={`${user.currentStreak} days`} />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="font-mono text-xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
