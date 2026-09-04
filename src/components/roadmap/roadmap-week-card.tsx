import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  GRAMMAR: "Grammar",
  VOCABULARY: "Vocabulary",
  LISTENING: "Listening",
  SPEAKING: "Speaking",
  READING: "Reading",
  WRITING: "Writing",
};

interface Week {
  id: string;
  weekIndex: number;
  title: string;
  focus: string;
  topics: { id: string; type: string; title: string; description: string }[];
}

export function RoadmapWeekCard({ week, isCurrent }: { week: Week; isCurrent: boolean }) {
  return (
    <details
      open={isCurrent}
      className={cn("group border bg-card", isCurrent ? "border-primary" : "border-border")}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Week {week.weekIndex}</span>
            {isCurrent && (
              <span className="bg-primary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary-foreground">
                Current
              </span>
            )}
          </div>
          <h3 className="mt-0.5 font-display text-base font-semibold tracking-tight">{week.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{week.focus}</p>
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>

      <ul className="divide-y divide-border border-t border-border">
        {week.topics.map((topic) => (
          <li key={topic.id} className="flex gap-4 px-5 py-3">
            <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {TYPE_LABELS[topic.type] ?? topic.type}
            </span>
            <div>
              <p className="text-sm font-medium">{topic.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{topic.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
