import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations/settings";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = settingsSchema.parse(await req.json());
    const { currentLevel, targetLevel, ...settingsFields } = body;

    if (currentLevel || targetLevel) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(currentLevel ? { currentLevel } : {}),
          ...(targetLevel ? { targetLevel } : {}),
        },
      });
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: settingsFields,
      create: { userId: session.user.id, ...settingsFields },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("Settings update error", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
