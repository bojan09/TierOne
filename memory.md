# Memory — IT Academy rebuild (through Phase 4)

Last updated: 2026-06-29 08:55 UTC

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

- All gates green (typecheck/lint/build).
- **P4 done — server-authoritative progress:** migration `0002_progress.sql` (`curriculum_lessons` XP authority + seed, `lesson_progress`, `user_stats`, `level_for_xp()`, `complete_lesson()` RPC) **validated on local PG (9 assertions, incl. clients blocked from writing stats/progress)**. Client: `src/features/progress/` ProgressProvider/context/useAcademyProgress; spine views use it; `LessonLayout` got optional `onComplete`/`isCompletedOverride` (spine = server-authoritative, legacy pages unchanged). `useProgressView` removed. `main.jsx` wraps `<ProgressProvider>` inside `<AuthProvider>`.
- tsconfig `baseUrl` removed (TS7 deprecation fixed); `@/*` paths resolve relative to tsconfig.
- Known: 2 localized casts at supabase generic boundary in ProgressProvider (hand-authored database.ts vs client 2.108); removed by `supabase gen types`.
- Entry bundle ~489 kB (gzip 139).
- **Developer must still:** apply `0001` then `0002` to the project; configure Auth redirect URLs; live-test sign-in AND lesson completion (XP persists, next lesson unlocks).
- Legacy Dashboard still shows only localStorage XP (replaced in P10). Legacy lesson pages still localStorage + self-render (migrate P5). DevOps still live (dropped P5).
- localStorage->Supabase progress import deferred to P5 (ids won't match until full seed).

## Next session starts with

**P5 — Content repackaging + Help Desk track authoring.** Reorganize the 82 legacy lessons into the two tracks (helpdesk/sysadmin); **cut DevOps** (remove its routes/lessons); fold cybersecurity/hardening into both tracks. Migrate legacy lesson pages to pure spine bodies (strip self-rendered LessonLayout; metadata into the spine) and expand `curriculum_lessons` seed (generate from the spine). Author the entry-level Help Desk gaps. Retire `src/app/routes.jsx` lessonRoutes as lessons move to `/learn`. Do the deferred localStorage->Supabase import now that ids match. Alternatively P6 (quizzes) if content reorg is deprioritized.

## Open questions
