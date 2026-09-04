import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scheduleReview } from "@/lib/vocabulary/srs";

const REVIEW_XP = 2;

const bodySchema = z.object({ grade: z.enum(["again", "hard", "good", "easy"]) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid grade." }, { status: 400 });

  const progress = await prisma.vocabularyProgress.findUnique({ where: { id: params.id } });
  if (!progress || progress.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const result = scheduleReview(progress, parsed.data.grade);

  const updated = await prisma.vocabularyProgress.update({
    where: { id: progress.id },
    data: result,
  });

  await prisma.xPTransaction.create({ data: { userId: session.user.id, amount: REVIEW_XP, reason: "VOCABULARY" } });
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { xpTotal: { increment: REVIEW_XP } },
  });

  return NextResponse.json({ progress: updated, xpAwarded: REVIEW_XP, xpTotal: user.xpTotal });
}
