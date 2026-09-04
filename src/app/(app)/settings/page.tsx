import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/settings-form";
import { RemindersManager } from "@/components/settings/reminders-manager";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [user, reminders] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { settings: true } }),
    prisma.reminder.findMany({ where: { userId }, orderBy: { time: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tune your routine, reminders, and appearance.</p>
      </div>

      <section className="flex items-center justify-between border border-border bg-card p-5">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight">Appearance</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Light, dark, or match your system.</p>
        </div>
        <ThemeToggle />
      </section>

      <SettingsForm
        initialCurrentLevel={user.currentLevel}
        initialTargetLevel={user.targetLevel}
        initialGoal={user.settings?.goal ?? "GENERAL_LEARNING"}
        initialDailyGoalMinutes={user.settings?.dailyGoalMinutes ?? 60}
        initialInterfaceLanguage={user.settings?.interfaceLanguage ?? "en"}
        initialNotificationsEnabled={user.settings?.notificationsEnabled ?? true}
        initialYoutubeApiKey={user.settings?.youtubeApiKey ?? ""}
      />

      <section className="border border-border bg-card p-5">
        <h2 className="font-display text-sm font-semibold tracking-tight">Reminders</h2>
        <p className="mt-0.5 mb-4 text-xs text-muted-foreground">
          Times shown in your local timezone. Toggle any reminder off without deleting it.
        </p>
        <RemindersManager initialReminders={reminders} />
      </section>
    </div>
  );
}
