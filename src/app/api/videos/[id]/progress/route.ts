import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { setVideoProgress } from "@/lib/videos/progress";
import { getLevelInfo } from "@/lib/gamification/xp";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ status: z.enum(["SAVED", "WATCHED", "COMPLETED"]) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video) return NextResponse.json({ error: "Video not found." }, { status: 404 });

  const { progress, xpAwarded } = await setVideoProgress(session.user.id, params.id, parsed.data.status);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  return NextResponse.json({ progress, xpAwarded, xpTotal: user.xpTotal, level: getLevelInfo(user.xpTotal) });
}
