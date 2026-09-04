import { subDays, startOfDay, isEqual } from "date-fns";
import { prisma } from "@/lib/prisma";

export type DayStatus = "complete" | "partial" | "missed" | "none";

export interface DayStatusEntry {
  date: Date;
  status: DayStatus;
  completedMinutes: number;
  goalMinutes: number;
}

/**
 * Returns day-by-day completion status for the last `days` days (oldest
 * first), excluding today. Used to render the streak ledger strip and the
 * calendar view.
 */
export async function getRecentDayStatuses(userId: string, days = 13): Promise<DayStatusEntry[]> {
  const today = startOfDay(new Date());
  const since = subDays(today, days);

  const logs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: since, lt: today } },
    include: { tasks: true },
    orderBy: { date: "asc" },
  });

  const byDate = new Map(logs.map((log) => [startOfDay(log.date).getTime(), log]));

  const entries: DayStatusEntry[] = [];
  for (let i = days; i >= 1; i--) {
    const date = subDays(today, i);
    const log = byDate.get(date.getTime());
    if (!log) {
      entries.push({ date, status: "none", completedMinutes: 0, goalMinutes: 0 });
      continue;
    }
    const completedCount = log.tasks.filter((t) => t.status === "COMPLETED").length;
    const status: DayStatus =
      completedCount === 0 ? "missed" : completedCount === log.tasks.length ? "complete" : "partial";
    entries.push({ date, status, completedMinutes: log.completedMinutes, goalMinutes: log.goalMinutes });
  }
  return entries;
}

export function isSameDate(a: Date, b: Date) {
  return isEqual(startOfDay(a), startOfDay(b));
}
