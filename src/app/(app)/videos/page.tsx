import { Suspense } from "react";
import { CefrLevel, ContentSource } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { VideoFilters } from "@/components/videos/video-filters";
import { VideoCard } from "@/components/videos/video-card";
import { CURATED_YOUTUBE_SOURCES, CURATED_TIKTOK_SOURCES } from "@/lib/content/curated-channels";

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { level?: string; source?: string };
}) {
  const level = searchParams.level as CefrLevel | undefined;
  const source = searchParams.source as ContentSource | undefined;

  const videos = await prisma.video.findMany({
    where: {
      ...(level ? { level } : {}),
      ...(source ? { source } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Videos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real content from Easy German, Nicos Weg, and other trusted channels — cached here as
          it&rsquo;s recommended to you.
        </p>
      </div>

      <Suspense>
        <VideoFilters />
      </Suspense>

      {videos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No cached recommendations match these filters yet. Complete a few daily routines and
          they&rsquo;ll start appearing here — or explore the channels below directly.
        </div>
      )}

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">YouTube channels</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CURATED_YOUTUBE_SOURCES.map((s) => (
            <a
              key={s.id}
              href={s.playlistUrl ?? s.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <p className="text-sm font-medium">{s.channelName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                {s.levels.join(" · ")}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">TikTok accounts</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURATED_TIKTOK_SOURCES.map((s) => (
            <a
              key={s.id}
              href={s.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <p className="text-sm font-medium">{s.handle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
