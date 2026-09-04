# Studienbuch — German Learning Coach

A daily-routine coach for going from absolute beginner (A0) to B1 German in six
months. It doesn't just show information — it generates your daily tasks,
tracks completion, scores XP, and keeps a visible streak so skipping a day is
never invisible.

Demo login (after seeding): **demo@deutschcoach.app / demo1234**

---

## 1. Project structure

```
prisma/
  schema.prisma            All models (see §8) — PostgreSQL
  seed.ts                  Seed entrypoint
  seed-data/
    roadmap.ts              26-week A0→B1 curriculum (grammar/vocab/listening/speaking/reading/writing)
    vocabulary.ts            Starter vocabulary bank (~85 words, expandable)
    speaking.ts               Starter speaking-sentence bank (~60 sentences)

src/
  app/
    page.tsx                 Public landing page
    login/, register/        Auth pages (credentials)
    onboarding/               4-step setup wizard
    (app)/                    Authenticated route group — shares AppShell layout
      layout.tsx               Session gate + shell
      dashboard/                "What should I do right now" — the core screen
      roadmap/                  26-week curriculum browser
      videos/, videos/[id]/     Recommended content + detail/actions
      vocabulary/                Spaced-repetition flashcard review
      speaking/                  TTS + recording + speech-recognition practice
      progress/                  Weekly stats + chart
      calendar/                  Month grid, click a day for detail
      settings/                  Level, goal, reminders, YouTube API key, theme
      search/                    Cross-entity search with filters
    api/                      Route handlers for all mutations (see §5)
  components/
    dashboard/, videos/, vocabulary/, speaking/, roadmap/,
    calendar/, settings/, search/, layout/, auth/, onboarding/, charts/, ui/
  lib/
    auth.ts                   NextAuth config
    prisma.ts                 Prisma client singleton
    gamification/              XP levels + streak logic (pure functions, unit-testable)
    routine/                   Daily task generator, task completion, weekly goals, history, month view
    content/                   YouTube Data API client + curated fallback channels
    vocabulary/, speaking/     Spaced repetition (SM-2) + daily sentence picking
    stats/                     Weekly aggregate queries
    validations/                Zod schemas for every mutation
  hooks/                     useReminderNotifications (browser Notifications)
  types/                     next-auth + Web Speech API ambient types
```

## 2. Installation

Requires Node 20+ and a PostgreSQL database.

```bash
cd deutsch-coach
npm install
cp .env.example .env   # then fill in the values (see §3)
```

## 3. Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes (dev) | `http://localhost:3000` |
| `YOUTUBE_API_KEY` | No | Enables live YouTube recommendations. Without it, the app falls back to curated real channel/playlist links — never fabricated video data. Users can also set a personal key in Settings, which overrides the server key per-request. |

## 4. Database setup

Option A — Docker (a `docker-compose.yml` is included):

```bash
docker compose up -d
```

Option B — local PostgreSQL via apt:

```bash
sudo apt-get update && sudo apt-get install -y postgresql
sudo -u postgres psql -c "CREATE USER deutsch WITH PASSWORD 'deutsch' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE deutsch_coach OWNER deutsch;"
```

Option C — any hosted Postgres (Neon, Supabase, Railway free tiers all work) —
just paste the connection string into `DATABASE_URL`.

Then, from the project root:

```bash
npm run db:push     # creates all tables from prisma/schema.prisma
npm run db:seed     # loads the roadmap, vocabulary, speaking sentences, and a demo user
```

(Use `npm run db:migrate` instead of `db:push` if you want tracked migration
files rather than a direct schema push — recommended once you start changing
the schema going forward.)

## 5. API setup

**YouTube Data API (optional, recommended):**
1. Create a project at the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable "YouTube Data API v3".
3. Create an API key and restrict it to that API.
4. Put it in `YOUTUBE_API_KEY` (or paste it into Settings → YouTube API key as a signed-in user).

Without a key, `src/lib/content/youtube.ts` automatically falls back to
`src/lib/content/curated-channels.ts` — real, verified channel and playlist
URLs for Easy German, DW Learn German (Nicos Weg), YourGermanTeacher, and
Learn German with Anja, plus curated TikTok profile links. No fake video
titles, thumbnails, or durations are ever invented.

**TikTok:** there is no public API suitable for this use case, so TikTok is
always the curated profile-link list (by design — see the product spec this
was built from).

## 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`, register an account (or sign in with the demo
account above), complete onboarding, and you land on the dashboard.

Other scripts:
```bash
npm run build        # production build
npm run start         # run the production build
npm run lint          # ESLint
npm run db:studio     # Prisma Studio — browse/edit data visually
```

## 7. Deployment

The app is a standard Next.js 14 App Router project — deploy to Vercel,
Railway, Fly.io, or any Node host.

1. Provision a PostgreSQL database (Neon/Supabase/Railway).
2. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your production
   domain), and optionally `YOUTUBE_API_KEY` in the host's environment
   variables.
3. Run `npx prisma migrate deploy` (or `db:push` for a first deploy) against
   the production database, then `npm run db:seed` once to load the
   curriculum/vocabulary/speaking content.
4. Build with `npm run build`, start with `npm run start` (or let the
   platform's Next.js buildpack handle it).

## 8. Architecture

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui
(Base UI primitives) · PostgreSQL · Prisma · NextAuth (Credentials + JWT
sessions).

**Why this stack:** it's the one requested, and there was no case for
deviating. One adjustment made along the way: the shadcn CLI's current
default component style targets Tailwind v4's CSS-first `@theme` syntax, which
doesn't run under the Tailwind v3 that `create-next-app` scaffolds — so the
project was upgraded to Tailwind v4 (`@tailwindcss/postcss`) to match, rather
than fighting the generated components. Its newer components also compose on
[Base UI](https://base-ui.com/) (a Radix-adjacent primitives library) instead
of Radix directly; the API is nearly identical (`render` prop instead of
`asChild`), so this doesn't change anything architecturally.

**Server-first data flow.** Nearly every page is a Server Component that
queries Prisma directly — there's no REST layer for reads. API routes exist
only for mutations that need to happen from client interactivity (completing
a task, reviewing a flashcard, saving a video, updating settings). This
keeps the client bundle small and avoids an unnecessary API-design exercise
for data that's only ever read by this app's own server.

**The daily routine engine** (`lib/routine/`):
- `daily-log.ts` — `getOrCreateTodaysLog()` is called on every dashboard/roadmap
  load. It's idempotent: if today's `DailyLog` already exists it's returned as-is;
  otherwise it's generated — walks the roadmap to find this user's current week
  (one week per seven active days), picks that week's topic for the day, fetches
  or falls back to a matching video recommendation, and creates the five core
  tasks (Duolingo 15m, Nicos Weg 20m, Anki 10m, a recommended video 10m, speaking
  5m — the exact 60-minute structure from the product brief's worked dashboard
  example).
- `complete-task.ts` — the single place XP, streak, weekly-goal, and
  daily-bonus logic live. Completing the last task in a day triggers the
  streak update (`gamification/streak.ts`) and the +50 XP daily bonus; hitting
  a 7-day streak multiple adds a milestone bonus.
- `gamification/xp.ts` — pure functions for XP→level conversion, so the level
  curve can be unit-tested and tuned without touching any route handler.

**Content recommendations** (`lib/content/youtube.ts`): with an API key, it
resolves each curated channel's ID once (cached in-memory), searches within
that channel for the current topic, fetches real durations via
`videos.list`, and caches results into the `Video` table. Without a key, it
upserts a channel/playlist-level fallback entry — real and verified, just
less specific than a single video.

**Vocabulary spaced repetition** (`lib/vocabulary/srs.ts`): a simplified SM-2
scheduler (the same algorithm family Anki uses) — four-button grading
(Again/Hard/Good/Easy), ease factor and interval tracked per user per word.

**Design system.** The visual language (`src/app/globals.css`) is deliberately
not generic-SaaS-blue-and-white: a Bauhaus-informed palette (warm paper /
near-black ink neutrals, with cobalt blue, ochre gold, and brick red used only
as functional signals — action, XP, streak/urgency — never decoration),
squared-off geometry, and mono numerals (IBM Plex Mono) for anything counted
or tracked. The signature UI motif is the "streak ledger" — a punch-card strip
of squares, one per day — echoed on the dashboard and expanded into the full
Calendar page.

## 9. Implemented features

- Email/password auth (NextAuth Credentials + Prisma adapter), protected
  routes via middleware
- 4-step onboarding (level, goal, daily time, study time) → generates initial
  settings + reminders
- Dashboard: "next task" hero, full task checklist, live XP/level/streak/
  weekly-goal stat strip, streak ledger, roadmap progress, recommended videos
- Daily task generator (idempotent, one routine per user per day) tied to a
  26-week A0→B1 roadmap (grammar/vocabulary/listening/speaking/reading/writing
  per week)
- XP + leveling system with a tunable curve; daily-completion and 7-day
  streak-milestone bonuses
- Streak tracking with lazy break-detection (no cron needed) and a
  best-streak record
- Real YouTube content via the YouTube Data API when a key is configured
  (server env var or per-user in Settings), with an honest, real-channel
  fallback when it isn't
- Curated TikTok profile links (by design — no scraping, no fabricated posts)
- Video detail page: watch / save / mark-completed, with per-user progress
  tracking and a "why recommended" explanation
- Vocabulary: daily new-word provisioning, SM-2 spaced repetition, flashcard
  review UI, New/Learning/Review/Mastered stats + accuracy
- Speaking practice: daily level-appropriate sentences, browser
  text-to-speech playback, MediaRecorder-based recording + playback, optional
  SpeechRecognition-based pronunciation comparison — all with no paid API
- Weekly progress page with a minutes-per-day chart and aggregate stats
- Calendar with per-day completion status and a detail view
- Reminders: CRUD, enable/disable, and real browser Notifications while the
  app is open
- Settings: level, target level, goal, daily time, interface language field,
  notifications toggle, personal YouTube API key, light/dark/system theme
- Global search across videos, vocabulary, grammar/roadmap topics, and
  speaking sentences, with level/type filters
- Responsive layout: dark persistent sidebar on desktop, bottom nav on
  mobile, full keyboard/semantic-HTML support
- Seed system (`prisma/seed.ts`) as the content-management path for this MVP
  (see below for the admin-UI alternative)

## 10. Future improvements

- **Admin UI.** The spec allows either an admin interface or a seed system;
  this ships the seed system. A `/admin` CRUD UI for adding videos/vocabulary/
  grammar without touching code is the natural next step.
- **Background jobs.** Streak-break detection and reminder notifications are
  both lazy/client-side right now (checked on page load / while the tab is
  open). A real cron + a service worker with Web Push would make both work
  correctly even when the user isn't actively in the app.
- **TaskCompletion as its own audit table.** The schema currently tracks
  completion as a status + timestamp directly on `DailyTask` rather than a
  separate `TaskCompletion` table, since it's a 1:1 relationship in practice —
  worth splitting out if you need a fuller audit trail (e.g. multiple
  completion attempts).
- **Voice recordings aren't persisted.** Recordings stay in-browser as blob
  URLs for immediate playback; wiring up object storage (S3/R2) would let
  users review past recordings and would enable real pronunciation-diffing.
- **Deeper personalization.** The recommendation engine matches level + topic;
  it doesn't yet learn from what a user skips vs. completes vs. re-watches.
- **i18n.** Settings has an interface-language field wired up in the schema,
  but the UI only ships in English — a real i18n pass (next-intl or similar)
  would use it.
- **Tests.** The gamification and SRS logic is written as pure functions
  specifically so it's easy to unit test — none are included yet.
- **Expand the seed content.** ~85 vocabulary words and ~60 speaking
  sentences are enough to demo the mechanics end-to-end; a production
  deployment would want several hundred of each per level.
