import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sentence = await prisma.speakingSentence.findUnique({ where: { id: params.id } });
  if (!sentence) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const log = await prisma.speakingLog.create({
    data: { userId: session.user.id, sentenceId: params.id },
  });

  return NextResponse.json({ log });
}
