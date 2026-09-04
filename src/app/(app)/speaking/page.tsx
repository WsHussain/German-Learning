import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDailySpeakingSentences } from "@/lib/speaking/daily";
import { SpeakingSession } from "@/components/speaking/speaking-session";

export default async function SpeakingPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const sentences = await getDailySpeakingSentences(userId, user.currentLevel, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Speaking practice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Say each sentence out loud. Listen to the pronunciation, record yourself, and compare
          if your browser supports speech recognition.
        </p>
      </div>

      <SpeakingSession sentences={sentences} />
    </div>
  );
}
