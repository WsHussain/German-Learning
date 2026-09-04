import { Smartphone, GraduationCap, Layers, PlayCircle, Video, Mic, BookOpen } from "lucide-react";
import type { TaskType } from "@prisma/client";

export const TASK_META: Record<TaskType, { icon: typeof Smartphone; verb: string }> = {
  DUOLINGO: { icon: Smartphone, verb: "Open Duolingo" },
  NICOS_WEG: { icon: GraduationCap, verb: "Open lesson" },
  ANKI: { icon: Layers, verb: "Open Anki" },
  YOUTUBE: { icon: PlayCircle, verb: "Watch video" },
  TIKTOK: { icon: Video, verb: "Open TikTok" },
  SPEAKING: { icon: Mic, verb: "Start practice" },
  VOCABULARY: { icon: BookOpen, verb: "Review words" },
};
