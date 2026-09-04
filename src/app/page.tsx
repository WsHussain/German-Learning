import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const ROUTINE = [
  { time: "Morning", item: "Duolingo", minutes: 15 },
  { time: "During the day", item: "Nicos Weg / DW Learn German", minutes: 20 },
  { time: "Evening", item: "Anki review", minutes: 10 },
  { time: "Evening", item: "German video (YouTube / TikTok)", minutes: 10 },
  { time: "Anytime", item: "Speak 5–10 sentences out loud", minutes: 5 },
];

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect(session.user.onboardingCompleted ? "/dashboard" : "/onboarding");
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground">
            S
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">Studienbuch</span>
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" render={<Link href="/login">Sign in</Link>} />
          <Button render={<Link href="/register">Get started</Link>} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-12 sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          A0 → B1 in six months
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          German fluency isn&rsquo;t a course. It&rsquo;s a routine you actually finish.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Studienbuch turns Duolingo, Nicos Weg, Anki, and real German media into one daily
          mission — tracked, scored, and impossible to quietly skip.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" render={<Link href="/register">Start your streak <ArrowRight className="size-4" /></Link>} />
          <Button size="lg" variant="outline" render={<Link href="/login">I already have an account</Link>} />
        </div>

        <section className="mt-20 border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              The daily routine — about 60 minutes
            </p>
          </div>
          <ul className="divide-y divide-border">
            {ROUTINE.map((r, i) => (
              <li key={i} className="flex items-center justify-between px-6 py-3.5 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">{r.time}</span>
                  <span>{r.item}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{r.minutes} min</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 grid gap-8 sm:grid-cols-3">
          <Feature
            title="A real curriculum"
            body="26 weeks of structured grammar, vocabulary, listening, speaking, reading and writing — from the alphabet to B1."
          />
          <Feature
            title="Content that matches your level"
            body="Videos from Easy German, Nicos Weg, and other trusted channels, recommended by CEFR level and current topic."
          />
          <Feature
            title="A streak you can see"
            body="Every day you complete becomes a square on your ledger. Miss a day and it shows — no hiding from the record."
          />
        </section>
      </main>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
