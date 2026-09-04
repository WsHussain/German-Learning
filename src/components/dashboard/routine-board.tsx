"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check, ExternalLink, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TASK_META } from "@/lib/task-meta";
import { getLevelInfo, type LevelInfo } from "@/lib/gamification/xp";
import { StreakLedger, StreakLedgerLegend, type LedgerDay } from "@/components/dashboard/streak-ledger";

export interface TaskClient {
  id: string;
  type: keyof typeof TASK_META;
  title: string;
  durationMinutes: number;
  xpValue: number;
  order: number;
  externalUrl: string | null;
  status: "PENDING" | "COMPLETED" | "SKIPPED";
}

export interface RoutineBoardProps {
  dayNumber: number;
  initialTasks: TaskClient[];
  initialGoalMinutes: number;
  initialCompletedMinutes: number;
  initialXpTotal: number;
  initialCurrentStreak: number;
  initialBestStreak: number;
  initialWeeklyGoal: { completedDays: number; targetDays: number; completedMinutes: number; targetMinutes: number };
  historyDays: LedgerDay[];
}

export function RoutineBoard(props: RoutineBoardProps) {
  const [tasks, setTasks] = useState(props.initialTasks);
  const [goalMinutes] = useState(props.initialGoalMinutes);
  const [completedMinutes, setCompletedMinutes] = useState(props.initialCompletedMinutes);
  const [xpTotal, setXpTotal] = useState(props.initialXpTotal);
  const [currentStreak, setCurrentStreak] = useState(props.initialCurrentStreak);
  const [bestStreak, setBestStreak] = useState(props.initialBestStreak);
  const [weeklyGoal, setWeeklyGoal] = useState(props.initialWeeklyGoal);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const level: LevelInfo = getLevelInfo(xpTotal);
  const nextTask = tasks.find((t) => t.status === "PENDING");
  const remaining = tasks.filter((t) => t.status === "PENDING").length;
  const allDone = remaining === 0;

  const todayStatus: LedgerDay = {
    date: new Date(),
    status: allDone ? "complete" : completedMinutes > 0 ? "partial" : "none",
  };
  const ledgerDays = [...props.historyDays, todayStatus];

  async function handleComplete(taskId: string) {
    setPendingId(taskId);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();

        setTasks(data.dailyLog.tasks);
        setCompletedMinutes(data.dailyLog.completedMinutes);
        setXpTotal(data.xpTotal);
        setCurrentStreak(data.currentStreak);
        setBestStreak(data.bestStreak);

        if (data.dayJustCompleted) {
          setWeeklyGoal((w) => ({
            ...w,
            completedDays: w.completedDays + 1,
            completedMinutes: w.completedMinutes + data.dailyLog.completedMinutes,
          }));
        }

        if (data.xpAwarded > 0) {
          toast.success(`+${data.xpAwarded} XP`, {
            description: data.dayJustCompleted
              ? `Full routine complete. Day ${currentStreakLabel(data.currentStreak)}.`
              : `${data.tasksRemaining} task${data.tasksRemaining === 1 ? "" : "s"} remaining today.`,
          });
        }
        if (data.leveledUp) {
          toast(`Level up — you're now level ${getLevelInfo(data.xpTotal).level}`, { duration: 5000 });
        }
      } catch {
        toast.error("Couldn't save that. Try again.");
      } finally {
        setPendingId(null);
      }
    });
  }

  async function handleSkip(taskId: string) {
    setPendingId(taskId);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}/skip`, { method: "POST" });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setTasks(data.dailyLog.tasks);
      } catch {
        toast.error("Couldn't save that. Try again.");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* NEXT — hero */}
      <section className="border border-border bg-card p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Today — Day {props.dayNumber}
        </p>

        {nextTask ? (
          <>
            <h1 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {nextTask.title}
            </h1>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              {nextTask.durationMinutes} min · +{nextTask.xpValue} XP
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {nextTask.externalUrl &&
                (nextTask.externalUrl.startsWith("/") ? (
                  <Button render={<Link href={nextTask.externalUrl}>{TASK_META[nextTask.type].verb}</Link>} />
                ) : (
                  <Button
                    render={
                      <a href={nextTask.externalUrl} target="_blank" rel="noreferrer">
                        {TASK_META[nextTask.type].verb}
                        <ExternalLink className="size-3.5" />
                      </a>
                    }
                  />
                ))}
              <Button
                variant="secondary"
                disabled={isPending && pendingId === nextTask.id}
                onClick={() => handleComplete(nextTask.id)}
              >
                <Check className="size-3.5" />
                Mark as done
              </Button>
              <Button
                variant="ghost"
                disabled={isPending && pendingId === nextTask.id}
                onClick={() => handleSkip(nextTask.id)}
              >
                <SkipForward className="size-3.5" />
                Skip for today
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Today&rsquo;s routine is complete.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Come back tomorrow to keep day {currentStreak + 1} of your streak alive.
            </p>
          </>
        )}
      </section>

      {/* Progress + task list */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-sm font-semibold tracking-tight">Today&rsquo;s tasks</h2>
          <p className="font-mono text-xs text-muted-foreground">
            {completedMinutes} / {goalMinutes} minutes
          </p>
        </div>
        <Progress value={Math.min(100, (completedMinutes / goalMinutes) * 100)} className="mb-4 h-1.5" />

        <ul className="divide-y divide-border border-y border-border">
          {tasks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                busy={isPending && pendingId === task.id}
                onComplete={() => handleComplete(task.id)}
                onSkip={() => handleSkip(task.id)}
              />
            ))}
        </ul>
      </section>

      {/* Stat strip */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Streak">
          <p className="font-mono text-2xl font-semibold tabular-nums">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">days · best {bestStreak}</p>
          <div className="mt-3">
            <StreakLedger days={ledgerDays} />
          </div>
        </StatCard>

        <StatCard label="Level">
          <p className="font-mono text-2xl font-semibold tabular-nums">Lvl {level.level}</p>
          <p className="text-xs text-muted-foreground">
            {level.xpIntoLevel} / {level.xpForNextLevel} XP · {xpTotal.toLocaleString()} total
          </p>
          <Progress value={level.progressPercent} className="mt-3 h-1.5" />
        </StatCard>

        <StatCard label="Weekly goal">
          <p className="font-mono text-2xl font-semibold tabular-nums">
            {weeklyGoal.completedDays} / {weeklyGoal.targetDays}
          </p>
          <p className="text-xs text-muted-foreground">days this week</p>
          <Progress
            value={Math.min(100, (weeklyGoal.completedDays / weeklyGoal.targetDays) * 100)}
            className="mt-3 h-1.5"
          />
        </StatCard>
      </section>

      <StreakLedgerLegend />
    </div>
  );
}

function TaskRow({
  task,
  busy,
  onComplete,
  onSkip,
}: {
  task: TaskClient;
  busy: boolean;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const meta = TASK_META[task.type];
  const done = task.status === "COMPLETED";
  const skipped = task.status === "SKIPPED";

  return (
    <li className="flex items-center gap-4 py-3">
      <button
        onClick={onComplete}
        disabled={done || skipped || busy}
        aria-label={done ? `${task.title} completed` : `Mark ${task.title} as done`}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border transition-colors",
          done ? "border-success bg-success text-success-foreground" : "border-border hover:border-primary",
        )}
      >
        {done && <Check className="size-3.5" />}
      </button>

      <meta.icon className="size-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", (done || skipped) && "text-muted-foreground line-through")}>
          {task.title}
        </p>
      </div>

      <span className="font-mono text-xs tabular-nums text-muted-foreground">{task.durationMinutes} min</span>
      <span className="hidden font-mono text-xs tabular-nums text-xp sm:inline">+{task.xpValue} XP</span>

      {task.status === "PENDING" && (
        <button
          onClick={onSkip}
          disabled={busy}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Skip
        </button>
      )}
    </li>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function currentStreakLabel(streak: number) {
  return `${streak} in a row`;
}
