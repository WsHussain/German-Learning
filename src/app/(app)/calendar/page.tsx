import Link from "next/link";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { getMonthDailyLogs } from "@/lib/routine/month";
import { CalendarGrid, type CalendarDay } from "@/components/calendar/calendar-grid";
import { StreakLedgerLegend } from "@/components/dashboard/streak-ledger";

export default async function CalendarPage({ searchParams }: { searchParams: { month?: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const now = searchParams.month ? new Date(`${searchParams.month}-01`) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const logs = await getMonthDailyLogs(userId, year, month);
  const days: CalendarDay[] = logs.map((log) => ({
    date: format(log.date, "yyyy-MM-dd"),
    dayNumber: log.dayNumber,
    completedMinutes: log.completedMinutes,
    goalMinutes: log.goalMinutes,
    allTasksCompleted: log.allTasksCompleted,
    tasks: log.tasks.map((t) => ({
      id: t.id,
      type: t.type,
      title: t.title,
      status: t.status,
      durationMinutes: t.durationMinutes,
    })),
  }));

  const prevMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tap a day to see what you completed.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/calendar?month=${format(prevMonth, "yyyy-MM")}`} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="size-4" />
          </Link>
          <span className="font-mono text-sm">{format(now, "MMMM yyyy")}</span>
          <Link href={`/calendar?month=${format(nextMonth, "yyyy-MM")}`} className="text-muted-foreground hover:text-foreground">
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <CalendarGrid monthDate={now.toISOString()} days={days} />
      <StreakLedgerLegend />
    </div>
  );
}
