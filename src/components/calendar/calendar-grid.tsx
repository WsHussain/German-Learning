"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isFuture,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TASK_META } from "@/lib/task-meta";
import type { TaskType } from "@prisma/client";

export interface CalendarTask {
  id: string;
  type: TaskType;
  title: string;
  status: "PENDING" | "COMPLETED" | "SKIPPED";
  durationMinutes: number;
}

export interface CalendarDay {
  date: string; // ISO yyyy-MM-dd
  dayNumber: number;
  completedMinutes: number;
  goalMinutes: number;
  allTasksCompleted: boolean;
  tasks: CalendarTask[];
}

const STATUS_CLASS = {
  complete: "bg-success text-success-foreground",
  partial: "bg-xp text-xp-foreground",
  missed: "bg-streak/70 text-streak-foreground",
  none: "bg-transparent text-muted-foreground",
} as const;

function dayStatus(day: CalendarDay | undefined): keyof typeof STATUS_CLASS {
  if (!day) return "none";
  if (day.allTasksCompleted) return "complete";
  if (day.tasks.some((t) => t.status === "COMPLETED")) return "partial";
  return "missed";
}

export function CalendarGrid({ monthDate, days }: { monthDate: string; days: CalendarDay[] }) {
  const [selected, setSelected] = useState<CalendarDay | null>(null);
  const byDate = new Map(days.map((d) => [d.date, d]));

  const month = new Date(monthDate);
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="font-mono text-[11px] text-muted-foreground">
            {d}
          </div>
        ))}
        {allDays.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          const day = byDate.get(key);
          const status = dayStatus(day);
          const future = isFuture(date);
          const inMonth = isSameMonth(date, month);

          return (
            <button
              key={key}
              disabled={!day}
              onClick={() => day && setSelected(day)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 border text-xs transition-colors",
                inMonth ? "border-border" : "border-transparent opacity-30",
                day && "hover:border-primary",
                isToday(date) && "ring-1 ring-primary",
              )}
            >
              <span className="font-mono">{format(date, "d")}</span>
              {!future && inMonth && (
                <span className={cn("size-2 rounded-[2px]", STATUS_CLASS[status].split(" ")[0])} />
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {format(new Date(selected.date), "EEEE, MMMM d")} — Day {selected.dayNumber}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                {selected.completedMinutes} / {selected.goalMinutes} minutes completed
              </p>
              <ul className="mt-2 divide-y divide-border">
                {selected.tasks.map((task) => {
                  const meta = TASK_META[task.type];
                  return (
                    <li key={task.id} className="flex items-center gap-3 py-2 text-sm">
                      <meta.icon className="size-4 text-muted-foreground" />
                      <span
                        className={cn("flex-1", task.status !== "COMPLETED" && "text-muted-foreground")}
                      >
                        {task.title}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{task.status.toLowerCase()}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
