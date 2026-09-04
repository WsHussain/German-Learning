"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Volume2, Mic, Square, Play, Check, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  speakGerman,
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  similarity,
} from "@/lib/speech";

export interface SpeakingSentenceData {
  id: string;
  german: string;
  english: string;
  topic: string;
}

export function SpeakingSession({ sentences }: { sentences: SpeakingSentenceData[] }) {
  const [index, setIndex] = useState(0);
  const [practicedCount, setPracticedCount] = useState(0);

  const current = sentences[index];

  function next() {
    if (index + 1 >= sentences.length) {
      setIndex(sentences.length);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (!current) {
    return (
      <div className="border border-dashed border-border p-8 text-center">
        <p className="text-sm font-medium">
          {practicedCount > 0 ? `Great — you practiced ${practicedCount} sentences today.` : "No sentences right now."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Head back to the dashboard to mark today&rsquo;s task done.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{current.topic}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {index + 1} / {sentences.length}
        </span>
      </div>
      <SentenceCard
        key={current.id}
        sentence={current}
        onPracticed={() => {
          setPracticedCount((c) => c + 1);
          next();
        }}
        onSkip={next}
      />
    </div>
  );
}

function SentenceCard({
  sentence,
  onPracticed,
  onSkip,
}: {
  sentence: SpeakingSentenceData;
  onPracticed: () => void;
  onSkip: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Microphone access denied or unavailable.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function checkPronunciation() {
    if (!isSpeechRecognitionAvailable()) {
      toast("Speech recognition isn't supported in this browser.");
      return;
    }
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "de-DE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setMatchScore(Math.round(similarity(transcript, sentence.german) * 100));
    };
    recognition.onerror = () => toast.error("Couldn't hear that clearly — try again.");
    recognition.start();
  }

  async function markPracticed() {
    setSaving(true);
    try {
      await fetch(`/api/speaking/${sentence.id}/practice`, { method: "POST" });
      onPracticed();
    } catch {
      toast.error("Couldn't save that. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-border bg-card p-6 sm:p-8">
      <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{sentence.german}</p>
      <p className="mt-2 text-sm text-muted-foreground">{sentence.english}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!isSpeechSynthesisAvailable()}
          onClick={() => speakGerman(sentence.german)}
        >
          <Volume2 className="size-3.5" />
          Play pronunciation
        </Button>

        {!recording ? (
          <Button variant="secondary" size="sm" onClick={startRecording}>
            <Mic className="size-3.5" />
            Record yourself
          </Button>
        ) : (
          <Button variant="destructive" size="sm" onClick={stopRecording}>
            <Square className="size-3.5" />
            Stop
          </Button>
        )}

        {audioUrl && (
          <audio controls src={audioUrl} className="h-8 align-middle">
            <track kind="captions" />
          </audio>
        )}

        {isSpeechRecognitionAvailable() && (
          <Button variant="ghost" size="sm" onClick={checkPronunciation}>
            <Play className="size-3.5" />
            Check pronunciation
          </Button>
        )}
      </div>

      {matchScore !== null && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Match with target sentence: <span className="text-foreground">{matchScore}%</span>
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <Button disabled={saving} onClick={markPracticed}>
          <Check className="size-3.5" />
          Mark as practiced
        </Button>
        <Button variant="ghost" onClick={onSkip}>
          <SkipForward className="size-3.5" />
          Skip
        </Button>
      </div>
    </div>
  );
}
