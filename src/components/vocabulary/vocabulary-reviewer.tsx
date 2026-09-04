"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { speakGerman } from "@/lib/speech";

export interface ReviewCard {
  progressId: string;
  german: string;
  article: string | null;
  english: string;
  exampleSentence: string;
  exampleTranslation: string;
  pronunciation: string | null;
  isNew: boolean;
}

const GRADES = [
  { value: "again", label: "Again", hint: "Didn't know it" },
  { value: "hard", label: "Hard", hint: "Struggled" },
  { value: "good", label: "Good", hint: "Got it" },
  { value: "easy", label: "Easy", hint: "Instantly" },
] as const;

export function VocabularyReviewer({ initialCards }: { initialCards: ReviewCard[] }) {
  const [queue, setQueue] = useState(initialCards);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const current = queue[0];

  async function handleGrade(grade: (typeof GRADES)[number]["value"]) {
    if (!current || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/vocabulary/${current.progressId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade }),
      });
      if (!res.ok) throw new Error();
      setQueue((q) => q.slice(1));
      setReviewedCount((c) => c + 1);
      setFlipped(false);
    } catch {
      toast.error("Couldn't save that review. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!current) {
    return (
      <div className="border border-dashed border-border p-8 text-center">
        <p className="text-sm font-medium">
          {reviewedCount > 0 ? `Nice — you reviewed ${reviewedCount} words.` : "Nothing due right now."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Check back later, or come back tomorrow for new words.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {current.isNew ? "New word" : "Review"}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{queue.length} left</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-56 w-full flex-col items-center justify-center gap-3 border border-border bg-card p-8 text-center"
      >
        {!flipped ? (
          <>
            <p className="font-display text-3xl font-semibold tracking-tight">
              {current.article ? `${current.article} ` : ""}
              {current.german}
            </p>
            {current.pronunciation && (
              <p className="font-mono text-sm text-muted-foreground">/{current.pronunciation}/</p>
            )}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                speakGerman(current.german);
              }}
              className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Volume2 className="size-3.5" /> Play pronunciation
            </span>
            <p className="mt-4 text-xs text-muted-foreground">Tap to reveal</p>
          </>
        ) : (
          <>
            <p className="font-display text-2xl font-semibold tracking-tight">{current.english}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">“{current.exampleSentence}”</p>
            <p className="text-xs text-muted-foreground">{current.exampleTranslation}</p>
          </>
        )}
      </button>

      {flipped && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <Button
              key={g.value}
              variant={g.value === "again" ? "destructive" : g.value === "easy" ? "default" : "secondary"}
              disabled={submitting}
              onClick={() => handleGrade(g.value)}
              className="flex-col gap-0.5 py-3"
            >
              <span className="text-xs font-medium">{g.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
