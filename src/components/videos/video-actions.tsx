"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink, Bookmark, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { VideoStatus } from "@prisma/client";

export function VideoActions({
  videoId,
  url,
  initialStatus,
}: {
  videoId: string;
  url: string;
  initialStatus: VideoStatus;
}) {
  const [status, setStatus] = useState<VideoStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  function updateStatus(next: VideoStatus) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/videos/${videoId}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStatus(next);
        if (data.xpAwarded > 0) {
          toast.success(`+${data.xpAwarded} XP`, { description: "Video marked as completed." });
        } else if (next === "SAVED") {
          toast("Saved for later.");
        }
      } catch {
        toast.error("Couldn't save that. Try again.");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        render={
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={() => status === "RECOMMENDED" && updateStatus("WATCHED")}
          >
            Watch
            <ExternalLink className="size-3.5" />
          </a>
        }
      />
      <Button variant="secondary" disabled={isPending || status === "COMPLETED"} onClick={() => updateStatus("COMPLETED")}>
        <Check className="size-3.5" />
        {status === "COMPLETED" ? "Completed" : "Mark as completed"}
      </Button>
      <Button variant="ghost" disabled={isPending || status === "SAVED"} onClick={() => updateStatus("SAVED")}>
        <Bookmark className="size-3.5" />
        Save
      </Button>
    </div>
  );
}
