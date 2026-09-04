"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const LEVELS = ["A0", "A1", "A2", "B1"] as const;
const GOALS = [
  { value: "SPEAK_GERMAN", label: "Speak German confidently" },
  { value: "MOVE_TO_GERMANY", label: "Move to Germany" },
  { value: "WORK_IN_GERMANY", label: "Work in a German-speaking environment" },
  { value: "TRAVEL", label: "Travel" },
  { value: "GENERAL_LEARNING", label: "General learning" },
] as const;
const DAILY_MINUTES = [15, 30, 45, 60, 90] as const;

export interface SettingsFormProps {
  initialCurrentLevel: string;
  initialTargetLevel: string;
  initialGoal: string;
  initialDailyGoalMinutes: number;
  initialInterfaceLanguage: string;
  initialNotificationsEnabled: boolean;
  initialYoutubeApiKey: string;
}

export function SettingsForm(props: SettingsFormProps) {
  const [currentLevel, setCurrentLevel] = useState(props.initialCurrentLevel);
  const [targetLevel, setTargetLevel] = useState(props.initialTargetLevel);
  const [goal, setGoal] = useState(props.initialGoal);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(props.initialDailyGoalMinutes);
  const [interfaceLanguage, setInterfaceLanguage] = useState(props.initialInterfaceLanguage);
  const [notificationsEnabled, setNotificationsEnabled] = useState(props.initialNotificationsEnabled);
  const [youtubeApiKey, setYoutubeApiKey] = useState(props.initialYoutubeApiKey);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLevel,
          targetLevel,
          goal,
          dailyGoalMinutes,
          interfaceLanguage,
          notificationsEnabled,
          youtubeApiKey: youtubeApiKey || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved.");
    } catch {
      toast.error("Couldn't save settings. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <SettingsSection title="Level">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <LevelPicker label="Current level" value={currentLevel} onChange={setCurrentLevel} />
          <LevelPicker label="Target level" value={targetLevel} onChange={setTargetLevel} />
        </div>
      </SettingsSection>

      <SettingsSection title="Goal">
        <div className="grid gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={cn(
                "border px-3 py-2 text-left text-sm transition-colors",
                goal === g.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Daily learning time">
        <div className="grid grid-cols-5 gap-2">
          {DAILY_MINUTES.map((m) => (
            <button
              key={m}
              onClick={() => setDailyGoalMinutes(m)}
              className={cn(
                "border py-2 text-center font-mono text-sm transition-colors",
                dailyGoalMinutes === m ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50",
              )}
            >
              {m}
              {m === 90 ? "+" : ""}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Interface language">
        <div className="flex gap-2">
          {[
            { value: "en", label: "English" },
            { value: "de", label: "Deutsch" },
          ].map((l) => (
            <button
              key={l.value}
              onClick={() => setInterfaceLanguage(l.value)}
              className={cn(
                "border px-3 py-1.5 text-sm transition-colors",
                interfaceLanguage === l.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Stored for future use — the interface currently ships in English only.
        </p>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Reminder notifications</p>
            <p className="text-xs text-muted-foreground">Show browser notifications for enabled reminders.</p>
          </div>
          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
        </div>
      </SettingsSection>

      <SettingsSection title="YouTube API key" subtitle="Optional — enables live, personalized video recommendations.">
        <Label htmlFor="yt-key">Personal API key</Label>
        <Input
          id="yt-key"
          placeholder="Falls back to the server YOUTUBE_API_KEY if left blank"
          value={youtubeApiKey}
          onChange={(e) => setYoutubeApiKey(e.target.value)}
          className="mt-1.5 font-mono text-sm"
        />
      </SettingsSection>

      <Button onClick={save} disabled={saving}>
        {saving && <Loader2 className="size-3.5 animate-spin" />}
        Save changes
      </Button>
    </div>
  );
}

function LevelPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-1.5">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => onChange(l)}
            className={cn(
              "flex-1 border py-1.5 text-center font-mono text-xs transition-colors",
              value === l ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50",
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card p-5">
      <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
