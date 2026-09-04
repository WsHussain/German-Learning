import { startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getMonthDailyLogs(userId: string, year: number, month: number) {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);

  return prisma.dailyLog.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { tasks: { orderBy: { order: "asc" } } },
    orderBy: { date: "asc" },
  });
}
