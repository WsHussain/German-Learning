/**
 * Manually curated, real content sources — used as the fallback recommendation
 * system when no YOUTUBE_API_KEY is configured (see src/lib/content/youtube.ts).
 *
 * These are real channels/playlists (verified), not fabricated videos. Once an
 * API key is added, live individual-video recommendations replace this list
 * automatically for YouTube; TikTok always uses curated profile links since
 * there is no public TikTok content API available for this use case.
 */

export interface CuratedYoutubeSource {
  id: string;
  channelName: string;
  handle: string;
  channelUrl: string;
  /** A specific level-appropriate playlist when we have a verified one. */
  playlistUrl?: string;
  description: string;
  levels: Array<"A0" | "A1" | "A2" | "B1">;
  topics: string[];
}

export const CURATED_YOUTUBE_SOURCES: CuratedYoutubeSource[] = [
  {
    id: "easy-german",
    channelName: "Easy German",
    handle: "@easygerman",
    channelUrl: "https://www.youtube.com/@easygerman",
    description:
      "Street interviews with native speakers, subtitled in German and English. 'Super Easy German' episodes are slowed down for beginners.",
    levels: ["A1", "A2", "B1"],
    topics: ["listening", "culture", "everyday-life", "conversation"],
  },
  {
    id: "dw-nicos-weg-a1",
    channelName: "DW Learn German — Nicos Weg (A1)",
    handle: "@DeutscheWelle",
    channelUrl: "https://www.youtube.com/@DeutscheWelle",
    playlistUrl: "https://www.youtube.com/playlist?list=PLs7zUO7VPyJ6eoN6SmB1UcwvPUagK87ix",
    description:
      "DW's official beginner course following Nico, a newcomer to Germany. Structured episodes matching A1 grammar and vocabulary.",
    levels: ["A0", "A1"],
    topics: ["grammar", "everyday-life", "beginner"],
  },
  {
    id: "dw-nicos-weg-b1",
    channelName: "DW Learn German — Nicos Weg (B1)",
    handle: "@DeutscheWelle",
    channelUrl: "https://www.youtube.com/@DeutscheWelle",
    playlistUrl: "https://www.youtube.com/playlist?list=PLs7zUO7VPyJ5razSfhOUVbTv9q6SAuPx-",
    description: "The B1 continuation of Nicos Weg, covering more complex grammar and topics.",
    levels: ["A2", "B1"],
    topics: ["grammar", "intermediate"],
  },
  {
    id: "your-german-teacher",
    channelName: "YourGermanTeacher",
    handle: "@yourgermanteacher",
    channelUrl: "https://www.youtube.com/@yourgermanteacher/videos",
    description:
      "Grammar-focused lessons on articles, cases, verb conjugation, and common mistakes, taught by experienced DaF teachers.",
    levels: ["A1", "A2", "B1"],
    topics: ["grammar", "articles", "cases"],
  },
  {
    id: "learn-german-with-anja",
    channelName: "Learn German with Anja",
    handle: "@LearnGermanwithAnja",
    channelUrl: "https://www.youtube.com/@LearnGermanwithAnja/videos",
    description:
      "Energetic, personality-driven lessons covering A1 basics through intermediate grammar and expressions.",
    levels: ["A1", "A2"],
    topics: ["grammar", "vocabulary", "expressions"],
  },
];

export interface CuratedTiktokSource {
  id: string;
  handle: string;
  profileUrl: string;
  description: string;
}

export const CURATED_TIKTOK_SOURCES: CuratedTiktokSource[] = [
  {
    id: "easygerman",
    handle: "@easygerman",
    profileUrl: "https://www.tiktok.com/@easygerman",
    description: "Short street-interview clips and bite-sized listening practice.",
  },
  {
    id: "germanwithanja",
    handle: "@germanwithanja",
    profileUrl: "https://www.tiktok.com/@germanwithanja",
    description: "Quick grammar tips and common-mistake corrections.",
  },
  {
    id: "yourgermanteacher",
    handle: "@yourgermanteacher",
    profileUrl: "https://www.tiktok.com/@yourgermanteacher",
    description: "Fast explanations of articles, cases, and verb forms.",
  },
  {
    id: "deutschmitmarija",
    handle: "@deutschmitmarija",
    profileUrl: "https://www.tiktok.com/@deutschmitmarija",
    description: "Everyday vocabulary and pronunciation drills.",
  },
  {
    id: "dw_deutschlernen",
    handle: "@dw_deutschlernen",
    profileUrl: "https://www.tiktok.com/@dw_deutschlernen",
    description: "DW's short-form companion clips to Nicos Weg.",
  },
];

export function pickCuratedYoutubeSource(
  level: "A0" | "A1" | "A2" | "B1",
  seed: number,
): CuratedYoutubeSource {
  const matches = CURATED_YOUTUBE_SOURCES.filter((s) => s.levels.includes(level));
  const pool = matches.length > 0 ? matches : CURATED_YOUTUBE_SOURCES;
  return pool[seed % pool.length];
}

export function pickCuratedTiktokSource(seed: number): CuratedTiktokSource {
  return CURATED_TIKTOK_SOURCES[seed % CURATED_TIKTOK_SOURCES.length];
}
