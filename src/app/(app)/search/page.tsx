import { Suspense } from "react";
import Link from "next/link";
import { CefrLevel } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { VideoCard } from "@/components/videos/video-card";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; level?: string; type?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const level = searchParams.level as CefrLevel | undefined;
  const type = searchParams.type ?? "All";
  const hasQuery = q.length > 0;

  const [videos, words, topics, sentences] = await Promise.all([
    type === "All" || type === "video"
      ? prisma.video.findMany({
          where: {
            ...(level ? { level } : {}),
            ...(hasQuery
              ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { topic: { contains: q, mode: "insensitive" } }] }
              : {}),
          },
          take: 12,
        })
      : [],
    type === "All" || type === "vocabulary"
      ? prisma.vocabularyWord.findMany({
          where: {
            ...(level ? { level } : {}),
            ...(hasQuery
              ? {
                  OR: [
                    { german: { contains: q, mode: "insensitive" } },
                    { english: { contains: q, mode: "insensitive" } },
                    { topic: { contains: q, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
          take: 16,
        })
      : [],
    type === "All" || type === "grammar"
      ? prisma.roadmapTopic.findMany({
          where: {
            ...(level ? { roadmapWeek: { level } } : {}),
            ...(hasQuery
              ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }
              : {}),
          },
          include: { roadmapWeek: true },
          take: 12,
        })
      : [],
    type === "All" || type === "speaking"
      ? prisma.speakingSentence.findMany({
          where: {
            ...(level ? { level } : {}),
            ...(hasQuery
              ? { OR: [{ german: { contains: q, mode: "insensitive" } }, { english: { contains: q, mode: "insensitive" } }] }
              : {}),
          },
          take: 12,
        })
      : [],
  ]);

  const totalResults = videos.length + words.length + topics.length + sentences.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find videos, vocabulary, grammar lessons, and speaking sentences.
        </p>
      </div>

      <Suspense>
        <SearchBar />
      </Suspense>
      <Suspense>
        <SearchFilters />
      </Suspense>

      {!hasQuery && level === undefined && type === "All" ? (
        <p className="text-sm text-muted-foreground">Start typing, or use the filters to browse by level and type.</p>
      ) : totalResults === 0 ? (
        <p className="text-sm text-muted-foreground">No results. Try a different term or filter.</p>
      ) : (
        <div className="space-y-8">
          {videos.length > 0 && (
            <ResultSection title="Videos">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </ResultSection>
          )}

          {words.length > 0 && (
            <ResultSection title="Vocabulary">
              <ul className="divide-y divide-border border-y border-border">
                {words.map((w) => (
                  <li key={w.id} className="flex items-center gap-4 py-2.5 text-sm">
                    <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{w.level}</span>
                    <span className="w-40 shrink-0 font-medium">
                      {w.article ? `${w.article} ` : ""}
                      {w.german}
                    </span>
                    <span className="flex-1 text-muted-foreground">{w.english}</span>
                    <span className="font-mono text-xs text-muted-foreground">{w.topic}</span>
                  </li>
                ))}
              </ul>
            </ResultSection>
          )}

          {topics.length > 0 && (
            <ResultSection title="Grammar & lessons">
              <ul className="divide-y divide-border border-y border-border">
                {topics.map((t) => (
                  <li key={t.id} className="py-2.5">
                    <Link href="/roadmap" className="text-sm font-medium hover:text-primary">
                      {t.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.roadmapWeek.level} · Week {t.roadmapWeek.weekIndex} — {t.description}
                    </p>
                  </li>
                ))}
              </ul>
            </ResultSection>
          )}

          {sentences.length > 0 && (
            <ResultSection title="Speaking">
              <ul className="divide-y divide-border border-y border-border">
                {sentences.map((s) => (
                  <li key={s.id} className="py-2.5 text-sm">
                    <p className="font-medium">{s.german}</p>
                    <p className="text-xs text-muted-foreground">{s.english}</p>
                  </li>
                ))}
              </ul>
            </ResultSection>
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-sm font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
