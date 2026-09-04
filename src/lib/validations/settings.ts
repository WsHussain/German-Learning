import { z } from "zod";

export const settingsSchema = z.object({
  currentLevel: z.enum(["A0", "A1", "A2", "B1"]).optional(),
  targetLevel: z.enum(["A0", "A1", "A2", "B1"]).optional(),
  goal: z
    .enum(["SPEAK_GERMAN", "MOVE_TO_GERMANY", "WORK_IN_GERMANY", "TRAVEL", "GENERAL_LEARNING"])
    .optional(),
  dailyGoalMinutes: z.number().int().min(15).max(180).optional(),
  interfaceLanguage: z.enum(["en", "de"]).optional(),
  notificationsEnabled: z.boolean().optional(),
  youtubeApiKey: z.string().max(200).optional().nullable(),
});

export const reminderSchema = z.object({
  label: z.string().trim().min(1).max(60),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  taskType: z.enum(["DUOLINGO", "NICOS_WEG", "ANKI", "YOUTUBE", "TIKTOK", "SPEAKING", "VOCABULARY"]).optional().nullable(),
});

export const reminderUpdateSchema = reminderSchema.partial().extend({
  enabled: z.boolean().optional(),
});
