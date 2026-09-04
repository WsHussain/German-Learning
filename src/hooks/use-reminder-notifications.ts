"use client";

import { useEffect, useRef } from "react";

interface Reminder {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

/**
 * Fires a browser Notification when the current time matches an enabled
 * reminder. This only works while the app is open in a tab — a real
 * background-push implementation would need a service worker + push server,
 * which is a documented future improvement (see README).
 */
export function useReminderNotifications(reminders: Reminder[]) {
  const firedToday = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const interval = setInterval(() => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      for (const reminder of reminders) {
        if (!reminder.enabled || reminder.time !== hhmm) continue;
        const key = `${reminder.id}-${now.toDateString()}`;
        if (firedToday.current.has(key)) continue;
        firedToday.current.add(key);
        new Notification("Studienbuch", { body: reminder.label });
      }
    }, 20_000);

    return () => clearInterval(interval);
  }, [reminders]);
}

export function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return Promise.resolve("unsupported" as const);
  return Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}
