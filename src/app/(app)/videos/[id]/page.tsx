import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Clapperboard, Music2 } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VideoActions } from "@/components/videos/video-actions";

function difficultyLabel(n: number) {
  return ["Very easy", "Easy", "Moderate", "Challenging", "Advanced"][Math.min(4, Math.max(0, n - 1))];
}

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video) notFound();

  const progress = await prisma.videoProgress.findUnique({
    where: { userId_videoId: { userId, videoId: video.id } },
  });

  const duration = video.durationSeconds ? `${Math.round(video.durationSeconds / 60)} min` : "Length varies";

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted">
        {video.thumbnailUrl ? (
          <Image src={video.thumbnailUrl} alt="" fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            {video.source === "TIKTOK" ? <Music2 className="size-10" /> : <Clapperboard className="size-10" />}
          </div>
        )}
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {video.channelName} · {video.source === "TIKTOK" ? "TikTok" : "YouTube"}
        </p>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">{video.title}</h1>
        {video.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{video.description}</p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-4">
        <Field label="Level" value={video.level} />
        <Field label="Duration" value={duration} />
        <Field label="Topic" value={video.topic} />
        <Field label="Vocabulary" value={difficultyLabel(video.vocabDifficulty)} />
      </dl>

      <div className="border border-border bg-card p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Why this was recommended
        </p>
        <p className="mt-1.5 text-sm">
          You&rsquo;re currently studying <strong>{video.topic}</strong> at level <strong>{video.level}</strong>. This
          content is matched to that level and topic.
        </p>
      </div>

      <VideoActions videoId={video.id} url={video.url} initialStatus={progress?.status ?? "RECOMMENDED"} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
