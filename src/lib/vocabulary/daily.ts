import { CefrLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const LEVEL_ORDER: CefrLevel[] = ["A0", "A1", "A2", "B1"];

/**
 * Ensures the user has at least `target` NEW vocabulary words queued,
 * pulling from their current level first, then earlier levels. Idempotent —
 * only provisions the gap.
 */
export async function ensureDailyVocabulary(userId: string, level: CefrLevel, target = 20) {
  const newCount = await prisma.vocabularyProgress.count({ where: { userId, status: "NEW" } });
  const gap = target - newCount;
  if (gap <= 0) return;

  const startedWordIds = (
    await prisma.vocabularyProgress.findMany({ where: { userId }, select: { wordId: true } })
  ).map((p) => p.wordId);

  const eligibleLevels = LEVEL_ORDER.slice(0, LEVEL_ORDER.indexOf(level) + 1);

  const candidates = await prisma.vocabularyWord.findMany({
    where: { level: { in: eligibleLevels }, id: { notIn: startedWordIds } },
    orderBy: [{ level: "asc" }, { topic: "asc" }],
    take: gap,
  });

  if (candidates.length === 0) return;

  await prisma.vocabularyProgress.createMany({
    data: candidates.map((word) => ({ userId, wordId: word.id, status: "NEW" as const })),
    skipDuplicates: true,
  });
}

export async function getVocabularyBoard(userId: string) {
  const [newWords, dueWords, stats] = await Promise.all([
    prisma.vocabularyProgress.findMany({
      where: { userId, status: "NEW" },
      include: { word: true },
      orderBy: { createdAt: "asc" },
      take: 20,
    }),
    prisma.vocabularyProgress.findMany({
      where: { userId, status: { in: ["LEARNING", "REVIEW"] }, nextReviewAt: { lte: new Date() } },
      include: { word: true },
      orderBy: { nextReviewAt: "asc" },
      take: 30,
    }),
    prisma.vocabularyProgress.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
  ]);

  const counts = { NEW: 0, LEARNING: 0, REVIEW: 0, MASTERED: 0 };
  for (const row of stats) counts[row.status] = row._count;

  const totals = await prisma.vocabularyProgress.aggregate({
    where: { userId },
    _sum: { correctCount: true, incorrectCount: true },
  });
  const correct = totals._sum.correctCount ?? 0;
  const incorrect = totals._sum.incorrectCount ?? 0;
  const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : null;

  return { newWords, dueWords, counts, accuracy };
}
