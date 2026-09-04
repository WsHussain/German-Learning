"use client";

import { useEffect, useState } from "react";
import { useReminderNotifications } from "@/hooks/use-reminder-notifications";

interface Reminder {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

export function NotificationScheduler() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetch("/api/reminders")
      .then((res) => (res.ok ? res.json() : { reminders: [] }))
      .then((data) => setReminders(data.reminders ?? []))
      .catch(() => {});
  }, []);

  useReminderNotifications(reminders);
  return null;
}
