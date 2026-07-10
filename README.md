# TierZero

Practical, hands-on IT training — Help Desk, SysAdmin, CompTIA A+, and Scripting & Automation, in one platform. Lessons, quizzes, in-browser labs, spaced-repetition review, ticket simulations, and server-authoritative progress tracking.

Live: https://tier-one-tau.vercel.app

## Stack

- **React 18** + **Vite** — SPA, code-split by route
- **TypeScript** (new/modern code) + **JavaScript** (legacy pages, being migrated)
- **React Router v6** — data-driven route manifest (`src/app/routes.jsx`), auth-gated `/learn` subtree
- **Tailwind CSS** — tokenized surface scale for light/dark theming
- **Supabase** — Postgres, auth, and RLS-secured RPCs for all grading/progress/XP logic (never trust the client for scores)

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

| Script | Does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |

## Architecture

Feature-sliced. The short version:

```
src/
  app/routes.jsx          # lazy legacy route manifest (~work-in-progress migration to /learn)
  content/curriculum/      # the curriculum spine — track -> course -> module -> lesson data
  content/lessons/         # lesson body content, lazy-loaded per lesson
  features/                # canonical app logic: auth, curriculum, lessons, quiz, exam,
                            # review (spaced repetition), scenario (ticket sims), labs,
                            # interview, analytics, certificates, docs, progress, theme, search
  shared/{types,lib,ui}    # cross-cutting types, the Supabase client, primitive components
  pages/                   # legacy standalone pages + lesson bodies referenced by features/lessons/registry.ts
supabase/
  migrations/               # sequential SQL migrations — schema + SECURITY DEFINER RPCs
  functions/                 # edge functions
scripts/                    # Python content-authoring pipeline (emit_content.py) that seeds curriculum + migrations
```

**Grading and progress are server-authoritative.** Quiz/exam answers are never shipped to the client — `submit_quiz`, `grade_review`, `submit_exam`, etc. are Postgres RPCs that grade server-side and return only the result. XP, streaks, and completion all live in Supabase, synced across devices.

**Curriculum changes go through the pipeline**, not hand-edited SQL — see `scripts/emit_content.py` and the manifests under `scripts/manifests/`. The spine (`src/content/curriculum/*.ts`) is the source of truth for what's taught; the emitter generates the matching migration.

## Four tracks

Help Desk (Tier 0-2) · SysAdmin (Windows/Linux/Networking/PowerShell) · CompTIA A+ · Scripting & Automation (PowerShell + Python, 25 lessons each).

## Notes for contributors

- `memory.md` is a running development log (phase-by-phase decisions and why) — check it before touching a feature you don't recognize, it usually explains a non-obvious constraint.
- Dark theme is the default and the most-tested path; light theme is a CSS-variable overlay (`html[data-theme="light"]`) — verify both when touching shared components.
- Don't hand-edit `supabase/migrations/*.sql` for curriculum content; regenerate via the emitter.
