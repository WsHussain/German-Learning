import { differenceInCalendarDays, startOfDay } from "date-fns";

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: Date | null;
}

/**
 * Call when a user completes their full daily routine "today".
 * Increments the streak if yesterday was active, resets to 1 otherwise.
 */
export function applyCompletedDay(state: StreakState, today: Date = new Date()): StreakState {
  const day = startOfDay(today);
  const last = state.lastActiveDate ? startOfDay(state.lastActiveDate) : null;

  let currentStreak: number;
  if (!last) {
    currentStreak = 1;
  } else {
    const diff = differenceInCalendarDays(day, last);
    if (diff <= 0) currentStreak = state.currentStreak || 1;
    else if (diff === 1) currentStreak = state.currentStreak + 1;
    else currentStreak = 1;
  }

  return {
    currentStreak,
    bestStreak: Math.max(state.bestStreak, currentStreak),
    lastActiveDate: day,
  };
}

/**
 * Lazily called on read (e.g. dashboard load) to detect a broken streak
 * even if the user hasn't completed a task in a while.
 */
export function checkForBrokenStreak(state: StreakState, today: Date = new Date()): StreakState {
  if (!state.lastActiveDate || state.currentStreak === 0) return state;
  const diff = differenceInCalendarDays(startOfDay(today), startOfDay(state.lastActiveDate));
  if (diff > 1) {
    return { ...state, currentStreak: 0 };
  }
  return state;
}
