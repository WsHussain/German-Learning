"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-2 text-muted-foreground" onClick={() => setOpen(true)}>
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Search</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] translate-y-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Studienbuch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              autoFocus
              placeholder="Videos, vocabulary, grammar, lessons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
