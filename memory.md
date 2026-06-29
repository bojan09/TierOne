# Memory — IT Academy rebuild (through Phase 2.2)

Last updated: 2026-06-29 06:50 UTC

## What was built

- **P1 (foundation/toolchain)** — TS toolchain (`strict`+`allowJs`), shared domain types (`src/shared/types/`), lazy typed Supabase client (`src/shared/lib/`), ESLint 9 flat config + Prettier, GitHub Actions CI (typecheck→lint→build), feature-based scaffolding. Gates green and proven non-vacuous.
- **P2 (curriculum spine + data-driven routing + lazy loading) — vertical slice** — typed spine (`src/content/curriculum/`), engine (`src/features/curriculum/selectors.ts`, `locking.ts`), lazy lesson registry (`src/features/lessons/registry.ts`), spine-driven `LessonView`/`CourseView`/`LearnHome`, typed seams `LessonChrome.tsx` (wraps legacy LessonLayout) and `useProgressView.ts` (wraps legacy useProgress), 3 real Help Desk lessons (`src/content/lessons/helpdesk/`). Routes `/learn`, `/learn/:courseSlug`, `/learn/:courseSlug/:lessonSlug` + Academy navbar dropdown. Per-lesson chunk-splitting verified in build.

## Decisions made (locked)

- Architecture **Option B** (restructure, preserve content+design). Two tracks: `helpdesk` (entry, mostly new), `sysadmin` (advanced, repurpose existing). DevOps cut; cybersecurity folded into both.
- **Hybrid content**: typed spine drives nav/locking/routing; lesson bodies = lazy code modules; quizzes/scenarios = structured data.
- **Incremental TS**: strict on logic, content stays JSX; gate = `tsc --noEmit` clean on TS.
- **Server-authoritative backend** (P3+): Supabase Auth (email/pw + magic link + Google), `profiles`+role enum (`student`,`admin`), default-deny RLS, XP/levels/badges via Postgres RPCs, `user_stats` read-only to clients.
- Labs/Help Desk simulated in-browser, no VMs. 14-phase roadmap, MVP at P6, Virtual Help Desk = P7.
- **Vertical-slice strategy (b)**: prove the pipeline on one Help Desk course before mass-migrating the 82 lessons.

## Problems solved / gotchas

- Legacy `LessonLayout` import infers a bad type under `allowJs`; cast through `unknown` in `LessonChrome.tsx` (`as unknown as ComponentType<...>`). Keep the seam there.
- Legacy `useProgress()` returns `{ state }` with `state.completedLessons: string[]` (localStorage key `sysadminpro_progress`); lock logic reads it via `useProgressView`. LessonLayout calls `completeLesson(lessonId, xp)` with the spine lesson `id` — keep spine lesson ids stable (`hdf-01`…).
- Lesson registry slugs MUST match spine lesson slugs.
- Main bundle still ~1.58 MB — legacy lessons still statically imported in `App.jsx`. Not fixed by the slice.

## Current state

- Build/typecheck/lint all green. `/learn` works end-to-end (lazy bodies, sequential locks, XP via legacy progress).
- **P2.2 done:** `App.jsx` 355->56 lines; ~110 hand-wired routes replaced by generated lazy manifest `src/app/routes.jsx`; single Suspense boundary in `Layout.jsx`; `Placeholder` extracted to `src/shared/ui/`. Initial JS bundle **1,572 kB -> 267 kB (gzip 437 -> 81 kB)**, 109 on-demand chunks. All URLs preserved; no lesson content touched.
- Legacy lesson pages still self-render (own chrome) under preserved URLs; they migrate to spine bodies in P5 (then `lessonRoutes` empties and `routes.jsx` is deleted). DevOps routes still live; dropped in P5.
- No backend wired to UI yet. Progress still localStorage.
- **Supabase project exists** (developer-provisioned) with Google sign-in connected — ready for P3. Credentials go in local `.env` only (never repo/memory).

## Next session starts with

**P3 — Auth + profiles + RLS.** Replace `src/shared/types/database.ts` with `supabase gen types` output; create `profiles` table + `role` enum (`student`,`admin`) + `track`; wire Supabase Auth (email/password + magic link + Google) using the existing lazy client (`src/shared/lib/supabase.ts`); add auth context/provider, protected routes, and default-deny RLS on all tables. Then P4 swaps the localStorage progress bridge for server-authoritative progress.

## Open questions

- Should Cybersecurity remain a visibly browsable section in the UI even though its content folds into both tracks?
- Confirm whether to do the full legacy migration (P2.2) before P3, or proceed to auth and migrate content in parallel later.
