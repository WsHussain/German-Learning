import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validations/onboarding";

const DEFAULT_REMINDERS: Array<{ label: string; time: string; taskType: string | null }> = [
  { label: "Duolingo", time: "08:00", taskType: "DUOLINGO" },
  { label: "German lesson (Nicos Weg / DW)", time: "13:00", taskType: "NICOS_WEG" },
  { label: "Anki review", time: "19:00", taskType: "ANKI" },
  { label: "Watch a German video", time: "20:00", taskType: "YOUTUBE" },
  { label: "Speaking practice", time: "21:00", taskType: "SPEAKING" },
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const input = onboardingSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          currentLevel: input.currentLevel,
          onboardingCompleted: true,
        },
      });

      await tx.userSettings.upsert({
        where: { userId: session.user.id },
        update: {
          goal: input.goal,
          dailyGoalMinutes: input.dailyGoalMinutes,
          preferredStudyTime: input.preferredStudyTime,
        },
        create: {
          userId: session.user.id,
          goal: input.goal,
          dailyGoalMinutes: input.dailyGoalMinutes,
          preferredStudyTime: input.preferredStudyTime,
        },
      });

      const existingReminders = await tx.reminder.count({ where: { userId: session.user.id } });
      if (existingReminders === 0) {
        await tx.reminder.createMany({
          data: DEFAULT_REMINDERS.map((r) => ({
            userId: session.user.id,
            label: r.label,
            time: r.time,
            taskType: r.taskType as never,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("Onboarding error", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
