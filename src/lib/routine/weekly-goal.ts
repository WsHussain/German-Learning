import { startOfWeek } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getOrCreateWeeklyGoal(userId: string, date: Date, dailyGoalMinutes: number) {
  const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });

  const existing = await prisma.weeklyGoal.findUnique({
    where: { userId_weekStartDate: { userId, weekStartDate } },
  });
  if (existing) return existing;

  return prisma.weeklyGoal.create({
    data: {
      userId,
      weekStartDate,
      targetDays: 7,
      targetMinutes: dailyGoalMinutes * 7,
    },
  });
}
