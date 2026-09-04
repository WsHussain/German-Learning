import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DayStatus } from "@/lib/routine/history";

export interface LedgerDay {
  date: Date;
  status: DayStatus;
}

const STATUS_STYLES: Record<DayStatus, string> = {
  complete: "bg-success",
  partial: "bg-xp",
  missed: "bg-streak/70",
  none: "bg-muted",
};

/**
 * The "streak ledger" — a punch-card style strip of squares, one per day.
 * This is the product's signature motif: a physical, at-a-glance record of
 * consistency, echoed on the dashboard and expanded on the Calendar page.
 */
export function StreakLedger({ days }: { days: LedgerDay[] }) {
  return (
    <div className="flex items-end gap-1">
      {days.map((day, i) => (
        <div
          key={i}
          title={`${format(day.date, "EEE, MMM d")} — ${day.status}`}
          className={cn("size-3.5 rounded-[2px] transition-colors sm:size-4", STATUS_STYLES[day.status])}
        />
      ))}
    </div>
  );
}

export function StreakLedgerLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
      <LegendItem className="bg-success" label="Full day" />
      <LegendItem className="bg-xp" label="Partial" />
      <LegendItem className="bg-streak/70" label="Missed" />
      <LegendItem className="bg-muted" label="No data" />
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-[2px]", className)} />
      {label}
    </span>
  );
}
