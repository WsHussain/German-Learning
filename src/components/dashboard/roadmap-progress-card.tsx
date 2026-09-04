import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const LEVELS = ["A0", "A1", "A2", "B1"] as const;

export function RoadmapProgressCard({
  currentLevel,
  currentWeekOrder,
  totalWeeks,
  weekTitle,
}: {
  currentLevel: string;
  currentWeekOrder: number;
  totalWeeks: number;
  weekTitle: string | undefined;
}) {
  const percent = Math.min(100, Math.round((currentWeekOrder / totalWeeks) * 100));

  return (
    <div className="border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-tight">Path to B1</h2>
        <Link href="/roadmap" className="text-xs text-primary hover:underline">
          View roadmap
        </Link>
      </div>

      <div className="mb-3 flex items-center gap-1.5">
        {LEVELS.map((lvl) => (
          <span
            key={lvl}
            className={
              "flex-1 border-t-2 pt-1.5 text-center font-mono text-[11px] " +
              (lvl === currentLevel
                ? "border-primary font-semibold text-primary"
                : LEVELS.indexOf(lvl) < LEVELS.indexOf(currentLevel as (typeof LEVELS)[number])
                  ? "border-success text-success"
                  : "border-border text-muted-foreground")
            }
          >
            {lvl}
          </span>
        ))}
      </div>

      <Progress value={percent} className="h-1.5" />
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        Week {currentWeekOrder} of {totalWeeks} · {weekTitle ?? "—"}
      </p>
    </div>
  );
}
