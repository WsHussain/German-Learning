import { VocabStatus } from "@prisma/client";
import { addDays } from "date-fns";

export type ReviewGrade = "again" | "hard" | "good" | "easy";

const GRADE_QUALITY: Record<ReviewGrade, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  correctCount: number;
  incorrectCount: number;
}

export interface SrsResult extends SrsState {
  status: VocabStatus;
  nextReviewAt: Date;
  lastReviewedAt: Date;
}

/**
 * Simplified SM-2 spaced-repetition scheduler (as used by Anki-style apps).
 */
export function scheduleReview(
  state: SrsState,
  grade: ReviewGrade,
  now: Date = new Date(),
): SrsResult {
  const quality = GRADE_QUALITY[grade];
  let { easeFactor, intervalDays, correctCount, incorrectCount } = state;

  if (quality < 3) {
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    incorrectCount += 1;
  } else {
    if (intervalDays === 0) intervalDays = 1;
    else if (intervalDays === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);

    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );
    correctCount += 1;
  }

  const status: VocabStatus =
    intervalDays >= 21 ? "MASTERED" : intervalDays >= 6 ? "REVIEW" : "LEARNING";

  return {
    easeFactor,
    intervalDays,
    correctCount,
    incorrectCount,
    status,
    nextReviewAt: addDays(now, intervalDays),
    lastReviewedAt: now,
  };
}
