import { TaskType, XPReason } from "@prisma/client";

/** XP awarded per completed activity, per the product spec. */
export const XP_VALUES: Record<TaskType, number> = {
  DUOLINGO: 15,
  NICOS_WEG: 20,
  ANKI: 10,
  YOUTUBE: 10,
  TIKTOK: 10,
  SPEAKING: 15,
  VOCABULARY: 10,
};

export const DAILY_BONUS_XP = 50;
export const STREAK_MILESTONE_BONUS_XP = 20;
export const STREAK_MILESTONE_INTERVAL = 7;

export const TASK_TYPE_TO_XP_REASON: Record<TaskType, XPReason> = {
  DUOLINGO: "DUOLINGO",
  NICOS_WEG: "NICOS_WEG",
  ANKI: "ANKI",
  YOUTUBE: "VIDEO_WATCHED",
  TIKTOK: "VIDEO_WATCHED",
  SPEAKING: "SPEAKING",
  VOCABULARY: "VOCABULARY",
};

/** XP required to go from level N to N+1 grows slightly each level. */
const BASE_XP_PER_LEVEL = 200;
const XP_GROWTH_PER_LEVEL = 40;

export function xpRequiredForLevel(level: number): number {
  // Total cumulative XP required to *reach* this level (level 1 = 0 XP).
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += BASE_XP_PER_LEVEL + (i - 1) * XP_GROWTH_PER_LEVEL;
  }
  return total;
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  xpTotal: number;
  progressPercent: number;
}

export function getLevelInfo(xpTotal: number): LevelInfo {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= xpTotal) {
    level++;
  }
  const floor = xpRequiredForLevel(level);
  const ceiling = xpRequiredForLevel(level + 1);
  const xpForNextLevel = ceiling - floor;
  const xpIntoLevel = xpTotal - floor;

  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    xpTotal,
    progressPercent: Math.round((xpIntoLevel / xpForNextLevel) * 100),
  };
}
