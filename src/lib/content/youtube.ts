import { CefrLevel, ContentSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CURATED_YOUTUBE_SOURCES, pickCuratedYoutubeSource } from "./curated-channels";

const API_BASE = "https://www.googleapis.com/youtube/v3";

/** In-memory cache: channel handle -> resolved channelId. Resets on server restart. */
const channelIdCache = new Map<string, string>();

function getApiKey(userOverride?: string | null): string | null {
  return userOverride?.trim() || process.env.YOUTUBE_API_KEY?.trim() || null;
}

function parseIsoDuration(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h ?? 0) * 3600) + (Number(m ?? 0) * 60) + Number(s ?? 0);
}

function difficultyForLevel(level: CefrLevel): number {
  switch (level) {
    case "A0":
    case "A1":
      return 2;
    case "A2":
      return 3;
    case "B1":
      return 4;
    default:
      return 3;
  }
}

async function resolveChannelId(handle: string, apiKey: string): Promise<string | null> {
  const cached = channelIdCache.get(handle);
  if (cached) return cached;

  const url = `${API_BASE}/channels?part=id&forHandle=${encodeURIComponent(
    handle.replace(/^@/, ""),
  )}&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return null;
  const data = await res.json();
  const id = data?.items?.[0]?.id as string | undefined;
  if (id) channelIdCache.set(handle, id);
  return id ?? null;
}

interface LiveSearchResult {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
}

async function searchChannelVideos(
  channelId: string,
  query: string,
  apiKey: string,
  maxResults = 3,
): Promise<LiveSearchResult[]> {
  const url =
    `${API_BASE}/search?part=snippet&type=video&order=relevance&relevanceLanguage=de` +
    `&safeSearch=strict&maxResults=${maxResults}&channelId=${channelId}` +
    `&q=${encodeURIComponent(query)}&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } });
  if (!res.ok) return [];
  const data = await res.json();

  return (data?.items ?? [])
    .filter((item: { id?: { videoId?: string } }) => item.id?.videoId)
    .map((item: {
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails?: { medium?: { url: string }; default?: { url: string } };
      };
    }) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl:
        item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? "",
      publishedAt: item.snippet.publishedAt,
    }));
}

async function getVideoDurations(
  videoIds: string[],
  apiKey: string,
): Promise<Record<string, number>> {
  if (videoIds.length === 0) return {};
  const url = `${API_BASE}/videos?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return {};
  const data = await res.json();
  const out: Record<string, number> = {};
  for (const item of data?.items ?? []) {
    out[item.id] = parseIsoDuration(item.contentDetails.duration);
  }
  return out;
}

/**
 * Fetch (and cache in the DB) real, level-appropriate videos for a topic from
 * our curated list of educational channels, using the live YouTube Data API.
 * Falls back to a channel-level curated resource when no API key is set, or
 * when the API returns nothing useful.
 */
export async function fetchAndCacheRecommendations(params: {
  level: CefrLevel;
  topic: string;
  userApiKey?: string | null;
  limit?: number;
}) {
  const { level, topic, userApiKey, limit = 3 } = params;
  const apiKey = getApiKey(userApiKey);

  if (apiKey) {
    try {
      const sources = CURATED_YOUTUBE_SOURCES.filter((s) => s.levels.includes(level));
      const results: Awaited<ReturnType<typeof upsertVideo>>[] = [];

      for (const source of sources) {
        if (results.length >= limit) break;
        const channelId = await resolveChannelId(source.handle, apiKey);
        if (!channelId) continue;

        const hits = await searchChannelVideos(channelId, `${topic} Deutsch lernen`, apiKey, 2);
        if (hits.length === 0) continue;

        const durations = await getVideoDurations(
          hits.map((h) => h.videoId),
          apiKey,
        );

        for (const hit of hits) {
          const video = await upsertVideo({
            source: "YOUTUBE",
            externalId: hit.videoId,
            url: `https://www.youtube.com/watch?v=${hit.videoId}`,
            title: hit.title,
            description: hit.description,
            channelName: hit.channelTitle,
            thumbnailUrl: hit.thumbnailUrl,
            durationSeconds: durations[hit.videoId] ?? null,
            level,
            topic,
            vocabDifficulty: difficultyForLevel(level),
            listeningDifficulty: difficultyForLevel(level),
            publishedAt: hit.publishedAt ? new Date(hit.publishedAt) : null,
          });
          results.push(video);
        }
      }

      if (results.length > 0) return results;
    } catch (error) {
      console.error("YouTube API recommendation fetch failed, using fallback.", error);
    }
  }

  // Fallback: curated channel-level resource (real, verified channel/playlist — no fabricated video metadata).
  const source = pickCuratedYoutubeSource(level, topic.length);
  const fallbackVideo = await upsertVideo({
    source: "YOUTUBE",
    externalId: null,
    url: source.playlistUrl ?? source.channelUrl,
    title: `${source.channelName}: content for "${topic}"`,
    description: source.description,
    channelName: source.channelName,
    thumbnailUrl: null,
    durationSeconds: null,
    level,
    topic,
    vocabDifficulty: difficultyForLevel(level),
    listeningDifficulty: difficultyForLevel(level),
    publishedAt: null,
  });
  return [fallbackVideo];
}

async function upsertVideo(data: {
  source: ContentSource;
  externalId: string | null;
  url: string;
  title: string;
  description: string | null;
  channelName: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  level: CefrLevel;
  topic: string;
  vocabDifficulty: number;
  listeningDifficulty: number;
  publishedAt: Date | null;
}) {
  return prisma.video.upsert({
    where: { source_url: { source: data.source, url: data.url } },
    update: {},
    create: data,
  });
}
