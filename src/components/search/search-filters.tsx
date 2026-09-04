"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LEVELS = ["All", "A0", "A1", "A2", "B1"] as const;
const TYPES = [
  { value: "All", label: "Everything" },
  { value: "video", label: "Videos" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "grammar", label: "Grammar & lessons" },
  { value: "speaking", label: "Speaking" },
] as const;

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const level = searchParams.get("level") ?? "All";
  const type = searchParams.get("type") ?? "All";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <FilterGroup label="Type">
        {TYPES.map((t) => (
          <Pill key={t.value} active={type === t.value} onClick={() => update("type", t.value)}>
            {t.label}
          </Pill>
        ))}
      </FilterGroup>
      <FilterGroup label="Level">
        {LEVELS.map((l) => (
          <Pill key={l} active={level === l} onClick={() => update("level", l)}>
            {l}
          </Pill>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border px-2.5 py-1 font-mono text-xs transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}
