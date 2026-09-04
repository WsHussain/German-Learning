import { startOfDay } from "date-fns";
import { CefrLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fetchAndCacheRecommendations } from "@/lib/content/youtube";
import { checkForBrokenStreak } from "@/lib/gamification/streak";
import { CURATED_YOUTUBE_SOURCES } from "@/lib/content/curated-channels";

const CORE_TASKS = [
  { type: "DUOLINGO" as const, title: "Duolingo", durationMinutes: 15, xpValue: 15 },
  { type: "NICOS_WEG" as const, title: "Nicos Weg / DW Learn German", durationMinutes: 20, xpValue: 20 },
  { type: "ANKI" as const, title: "Anki review", durationMinutes: 10, xpValue: 10 },
  { type: "YOUTUBE" as const, title: "Recommended video", durationMinutes: 10, xpValue: 10 },
  { type: "SPEAKING" as const, title: "Speaking practice", durationMinutes: 5, xpValue: 15 },
];

function nicosWegUrl(level: CefrLevel): string {
  const source = CURATED_YOUTUBE_SOURCES.find(
    (s) => s.id === (level === "A0" || level === "A1" ? "dw-nicos-weg-a1" : "dw-nicos-weg-b1"),
  );
  return source?.playlistUrl ?? "https://learngerman.dw.com/en/nicos-weg/c-36519";
}

function externalLinkFor(type: string, level: CefrLevel): string | undefined {
  switch (type) {
    case "DUOLINGO":
      return "https://www.duolingo.com/learn";
    case "ANKI":
      return "https://apps.ankiweb.net/";
    case "NICOS_WEG":
      return nicosWegUrl(level);
    case "SPEAKING":
      return "/speaking";
    default:
      return undefined;
  }
}

async function getCurrentRoadmapWeek(dayNumber: number) {
  const order = Math.max(1, Math.ceil(dayNumber / 7));
  const week =
    (await prisma.roadmapWeek.findFirst({
      where: { order },
      include: { topics: { orderBy: { order: "asc" } } },
    })) ??
    (await prisma.roadmapWeek.findFirst({
      orderBy: { order: "desc" },
      include: { topics: { orderBy: { order: "asc" } } },
    }));
  return week;
}

/**
 * Returns today's DailyLog for the user, creating it (with its 5 generated
 * tasks) on first visit of the day. Idempotent — safe to call on every
 * dashboard load.
 */
export async function getOrCreateTodaysLog(userId: string) {
  const today = startOfDay(new Date());

  const existing = await prisma.dailyLog.findUnique({
    where: { userId_date: { userId, date: today } },
    include: {
      tasks: { orderBy: { order: "asc" }, include: { video: true } },
      roadmapWeek: { include: { topics: { orderBy: { order: "asc" } } } },
    },
  });
  if (existing) return existing;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  // Lazily detect a broken streak on read, so the dashboard is accurate even
  // if the user hasn't completed anything in a few days.
  const streakState = checkForBrokenStreak(
    {
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      lastActiveDate: user.lastActiveDate,
    },
    today,
  );
  if (streakState.currentStreak !== user.currentStreak) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentStreak: streakState.currentStreak },
    });
  }

  const dayNumber = user.dayNumber + 1;
  const week = await getCurrentRoadmapWeek(dayNumber);
  const dayOfWeekIndex = dayNumber % 7;
  const topic = week?.topics[dayOfWeekIndex % Math.max(week.topics.length, 1)]?.title ?? "German basics";

  const excludeUrls = (
    await prisma.videoProgress.findMany({
      where: { userId, status: { in: ["WATCHED", "COMPLETED"] } },
      select: { video: { select: { url: true } } },
    })
  ).map((v) => v.video.url);

  let recommendedVideo = null;
  try {
    const [candidate] = await fetchAndCacheRecommendations({
      level: user.currentLevel,
      topic,
      limit: 3,
    });
    if (candidate && !excludeUrls.includes(candidate.url)) {
      recommendedVideo = candidate;
    } else {
      const alt = await prisma.video.findFirst({
        where: {
          level: user.currentLevel,
          url: { notIn: excludeUrls },
        },
        orderBy: { createdAt: "desc" },
      });
      recommendedVideo = alt ?? candidate ?? null;
    }
  } catch (error) {
    console.error("Failed to fetch video recommendation for daily log", error);
  }

  const goalMinutes = CORE_TASKS.reduce((sum, t) => sum + t.durationMinutes, 0);

  const created = await prisma.dailyLog.create({
    data: {
      userId,
      date: today,
      dayNumber,
      roadmapWeekId: week?.id,
      goalMinutes,
      tasks: {
        create: CORE_TASKS.map((task, index) => ({
          type: task.type,
          title:
            task.type === "YOUTUBE" && recommendedVideo ? recommendedVideo.title : task.title,
          durationMinutes: task.durationMinutes,
          xpValue: task.xpValue,
          order: index,
          externalUrl:
            task.type === "YOUTUBE" ? recommendedVideo?.url : externalLinkFor(task.type, user.currentLevel),
          videoId: task.type === "YOUTUBE" ? recommendedVideo?.id : undefined,
        })),
      },
    },
    include: {
      tasks: { orderBy: { order: "asc" }, include: { video: true } },
      roadmapWeek: { include: { topics: { orderBy: { order: "asc" } } } },
    },
  });

  await prisma.user.update({ where: { id: userId }, data: { dayNumber } });

  if (recommendedVideo) {
    await prisma.videoProgress.upsert({
      where: { userId_videoId: { userId, videoId: recommendedVideo.id } },
      update: {},
      create: { userId, videoId: recommendedVideo.id, status: "RECOMMENDED" },
    });
  }

  return created;
}
