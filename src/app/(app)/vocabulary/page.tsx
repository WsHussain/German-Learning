import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDailyVocabulary, getVocabularyBoard } from "@/lib/vocabulary/daily";
import { VocabularyReviewer, type ReviewCard } from "@/components/vocabulary/vocabulary-reviewer";

export default async function VocabularyPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  await ensureDailyVocabulary(userId, user.currentLevel, 20);
  const { newWords, dueWords, counts, accuracy } = await getVocabularyBoard(userId);

  const cards: ReviewCard[] = [
    ...dueWords.map((p) => toCard(p, false)),
    ...newWords.map((p) => toCard(p, true)),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Vocabulary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Spaced repetition — new words daily, reviews scheduled automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="New" value={counts.NEW} />
        <Stat label="Learning" value={counts.LEARNING} />
        <Stat label="Review" value={counts.REVIEW} />
        <Stat label="Mastered" value={counts.MASTERED} />
      </div>

      {accuracy !== null && (
        <p className="font-mono text-xs text-muted-foreground">Review accuracy: {accuracy}%</p>
      )}

      <VocabularyReviewer initialCards={cards} />
    </div>
  );
}

function toCard(
  p: { id: string; word: { german: string; article: string | null; english: string; exampleSentence: string; exampleTranslation: string; pronunciation: string | null } },
  isNew: boolean,
): ReviewCard {
  return {
    progressId: p.id,
    german: p.word.german,
    article: p.word.article,
    english: p.word.english,
    exampleSentence: p.word.exampleSentence,
    exampleTranslation: p.word.exampleTranslation,
    pronunciation: p.word.pronunciation,
    isNew,
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="font-mono text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
