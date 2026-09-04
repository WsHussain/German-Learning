import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateTodaysLog } from "@/lib/routine/daily-log";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapWeekCard } from "@/components/roadmap/roadmap-week-card";

const LEVELS = ["A0", "A1", "A2", "B1"] as const;

export default async function RoadmapPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [weeks, dailyLog] = await Promise.all([
    prisma.roadmapWeek.findMany({
      include: { topics: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    }),
    getOrCreateTodaysLog(userId),
  ]);

  const currentWeekId = dailyLog.roadmapWeekId;
  const defaultLevel = dailyLog.roadmapWeek?.level ?? "A0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Roadmap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A structured 26-week path from absolute beginner to B1, built around grammar,
          vocabulary, listening, speaking, reading and writing.
        </p>
      </div>

      <Tabs defaultValue={defaultLevel}>
        <TabsList>
          {LEVELS.map((level) => (
            <TabsTrigger key={level} value={level}>
              {level}
            </TabsTrigger>
          ))}
        </TabsList>

        {LEVELS.map((level) => (
          <TabsContent key={level} value={level} className="mt-6 space-y-3">
            {weeks
              .filter((w) => w.level === level)
              .map((week) => (
                <RoadmapWeekCard key={week.id} week={week} isCurrent={week.id === currentWeekId} />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
