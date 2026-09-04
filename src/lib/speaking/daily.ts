import { CefrLevel } from "@prisma/client";
import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";

/** Picks 5-10 level-appropriate sentences, preferring ones not practiced recently. */
export async function getDailySpeakingSentences(userId: string, level: CefrLevel, count = 8) {
  const recentlyPracticedIds = (
    await prisma.speakingLog.findMany({
      where: { userId, practicedAt: { gte: subDays(new Date(), 5) } },
      select: { sentenceId: true },
    })
  ).map((l) => l.sentenceId);

  const fresh = await prisma.speakingSentence.findMany({
    where: { level, id: { notIn: recentlyPracticedIds } },
    take: count,
  });

  if (fresh.length >= count) return fresh;

  const fillIds = fresh.map((s) => s.id);
  const fill = await prisma.speakingSentence.findMany({
    where: { level, id: { notIn: fillIds } },
    take: count - fresh.length,
  });

  return [...fresh, ...fill];
}
