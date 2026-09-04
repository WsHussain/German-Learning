"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const LEVELS = [
  { value: "A0", label: "A0 — Absolute beginner", body: "I don't know any German yet." },
  { value: "A1", label: "A1 — Beginner", body: "I know some greetings and basic phrases." },
  { value: "A2", label: "A2 — Elementary", body: "I can handle simple everyday conversations." },
  { value: "B1", label: "B1 — Intermediate", body: "I can discuss familiar topics with some fluency." },
] as const;

const GOALS = [
  { value: "SPEAK_GERMAN", label: "Speak German confidently" },
  { value: "MOVE_TO_GERMANY", label: "Move to Germany" },
  { value: "WORK_IN_GERMANY", label: "Work in a German-speaking environment" },
  { value: "TRAVEL", label: "Travel" },
  { value: "GENERAL_LEARNING", label: "General learning" },
] as const;

const DAILY_MINUTES = [15, 30, 45, 60, 90] as const;

const STEPS = ["Level", "Goal", "Daily time", "Study time"] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const { update } = useSession();

  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<(typeof LEVELS)[number]["value"]>("A0");
  const [goal, setGoal] = useState<(typeof GOALS)[number]["value"]>("GENERAL_LEARNING");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(60);
  const [preferredStudyTime, setPreferredStudyTime] = useState("08:00");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLast = step === STEPS.length - 1;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentLevel: level, goal, dailyGoalMinutes, preferredStudyTime }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      await update({ onboardingCompleted: true });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Setup — {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </p>
        <div className="mb-8 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1", i <= step ? "bg-primary" : "bg-border")} />
          ))}
        </div>

        {step === 0 && (
          <Step title="What's your German level?" subtitle="We'll tailor the roadmap and daily routine to this.">
            <div className="space-y-2">
              {LEVELS.map((l) => (
                <OptionCard
                  key={l.value}
                  selected={level === l.value}
                  onClick={() => setLevel(l.value)}
                  title={l.label}
                  body={l.body}
                />
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="What's your goal?" subtitle="This shapes which content we recommend.">
            <div className="space-y-2">
              {GOALS.map((g) => (
                <OptionCard key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)} title={g.label} />
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="How much time can you study per day?" subtitle="You can change this later in Settings.">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {DAILY_MINUTES.map((m) => (
                <button
                  key={m}
                  onClick={() => setDailyGoalMinutes(m)}
                  className={cn(
                    "border py-3 text-center font-mono text-sm transition-colors",
                    dailyGoalMinutes === m
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {m}
                  {m === 90 ? "+" : ""} min
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="What time do you want to study?" subtitle="We'll anchor your reminders around this.">
            <div className="space-y-1.5">
              <Label htmlFor="study-time">Preferred start time</Label>
              <Input
                id="study-time"
                type="time"
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-40"
              />
            </div>
          </Step>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {isLast ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="size-3.5 animate-spin" />}
              Generate my routine
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Continue</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  body,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  body?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full border px-4 py-3 text-left transition-colors",
        selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
      )}
    >
      <p className={cn("text-sm font-medium", selected && "text-primary")}>{title}</p>
      {body && <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>}
    </button>
  );
}
