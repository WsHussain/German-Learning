import Link from "next/link";
import Image from "next/image";
import { Clapperboard, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoCardData {
  id: string;
  source: "YOUTUBE" | "TIKTOK";
  title: string;
  channelName: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  level: string;
  topic: string;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.round(seconds / 60);
  return m < 1 ? "<1 min" : `${m} min`;
}

export function VideoCard({ video, reason }: { video: VideoCardData; reason?: string }) {
  const duration = formatDuration(video.durationSeconds);

  return (
    <Link
      href={`/videos/${video.id}`}
      className="group flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary"
    >
      <div className="relative aspect-video w-full bg-muted">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            {video.source === "TIKTOK" ? <Music2 className="size-6" /> : <Clapperboard className="size-6" />}
          </div>
        )}
        <span
          className={cn(
            "absolute left-2 top-2 bg-background/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
          )}
        >
          {video.level}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{video.title}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {video.channelName}
          {duration ? ` · ${duration}` : ""}
        </p>
        {reason && <p className="mt-1 text-[11px] text-muted-foreground">{reason}</p>}
      </div>
    </Link>
  );
}
