import { VideoStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { XP_VALUES } from "@/lib/gamification/xp";

export async function setVideoProgress(userId: string, videoId: string, status: VideoStatus) {
  const existing = await prisma.videoProgress.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });

  const progress = await prisma.videoProgress.upsert({
    where: { userId_videoId: { userId, videoId } },
    update: {
      status,
      watchedAt: status === "WATCHED" || status === "COMPLETED" ? new Date() : existing?.watchedAt,
      savedAt: status === "SAVED" ? new Date() : existing?.savedAt,
    },
    create: {
      userId,
      videoId,
      status,
      watchedAt: status === "WATCHED" || status === "COMPLETED" ? new Date() : null,
      savedAt: status === "SAVED" ? new Date() : null,
    },
  });

  let xpAwarded = 0;
  if (status === "COMPLETED" && existing?.status !== "COMPLETED") {
    xpAwarded = XP_VALUES.YOUTUBE;
    await prisma.xPTransaction.create({
      data: { userId, amount: xpAwarded, reason: "VIDEO_WATCHED" },
    });
    await prisma.user.update({ where: { id: userId }, data: { xpTotal: { increment: xpAwarded } } });
  }

  return { progress, xpAwarded };
}
