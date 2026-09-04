import { z } from "zod";

export const onboardingSchema = z.object({
  currentLevel: z.enum(["A0", "A1", "A2", "B1"]),
  goal: z.enum(["SPEAK_GERMAN", "MOVE_TO_GERMANY", "WORK_IN_GERMANY", "TRAVEL", "GENERAL_LEARNING"]),
  dailyGoalMinutes: z.number().int().min(15).max(180),
  preferredStudyTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
