"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/hooks/use-reminder-notifications";

export interface ReminderData {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

export function RemindersManager({ initialReminders }: { initialReminders: ReminderData[] }) {
  const [reminders, setReminders] = useState(initialReminders);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [permission, setPermission] = useState(() => getNotificationPermission());

  async function toggle(id: string, enabled: boolean) {
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, enabled } : r)));
    await fetch(`/api/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
  }

  async function remove(id: string) {
    setReminders((rs) => rs.filter((r) => r.id !== id));
    await fetch(`/api/reminders/${id}`, { method: "DELETE" });
  }

  async function add() {
    if (!newLabel.trim()) return;
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim(), time: newTime }),
    });
    if (!res.ok) {
      toast.error("Couldn't add reminder.");
      return;
    }
    const { reminder } = await res.json();
    setReminders((rs) => [...rs, reminder].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLabel("");
  }

  async function enableBrowserNotifications() {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") toast.success("Browser notifications enabled.");
    else if (result === "denied") toast.error("Notifications blocked in browser settings.");
  }

  return (
    <div className="space-y-4">
      {permission !== "granted" && permission !== "unsupported" && (
        <div className="flex items-center justify-between border border-border bg-muted/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Enable browser notifications so reminders can alert you while the app is open.
          </p>
          <Button size="sm" variant="secondary" onClick={enableBrowserNotifications}>
            <Bell className="size-3.5" />
            Enable
          </Button>
        </div>
      )}

      <ul className="divide-y divide-border border-y border-border">
        {reminders.map((r) => (
          <li key={r.id} className="flex items-center gap-4 py-2.5">
            <span className="w-16 font-mono text-sm tabular-nums">{r.time}</span>
            <span className="flex-1 text-sm">{r.label}</span>
            <Switch checked={r.enabled} onCheckedChange={(checked) => toggle(r.id, checked)} />
            <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-end gap-2">
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-28"
        />
        <Input
          placeholder="Reminder label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1"
        />
        <Button variant="secondary" onClick={add}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
}
