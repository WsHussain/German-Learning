import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reminderUpdateSchema } from "@/lib/validations/settings";

async function assertOwnership(id: string, userId: string) {
  const reminder = await prisma.reminder.findUnique({ where: { id } });
  if (!reminder || reminder.userId !== userId) return null;
  return reminder;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await assertOwnership(params.id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  try {
    const body = reminderUpdateSchema.parse(await req.json());
    const reminder = await prisma.reminder.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ reminder });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await assertOwnership(params.id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.reminder.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
