# Memory — IT Academy rebuild (through Phase 5.5)

Last updated: 2026-06-29 13:30 UTC

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

- All gates green. **Both tracks spine-native.** Help Desk 13 lessons/4 courses; SysAdmin 73 lessons/9 courses (migrated from legacy pages, stripped to pure bodies). Total 86 lessons / 6,350 XP.
- Registry keyed by **lesson id** (`src/features/lessons/registry.ts`); `LessonView` resolves body by `lesson.id`. SysAdmin spine auto-generated `src/content/curriculum/sysadmin.ts`; aggregated in `content/curriculum/index.ts`.
- Seeds: 0003 (helpdesk) + 0004 (sysadmin) validated on local PG (13/630 + 73/5720). Developer must apply 0003 + 0004 to project (after 0001/0002).
- Legacy lesson/placeholder routes retired in `src/app/routes.jsx`; legacy course-index URLs redirect to `/learn/<course>` (App.jsx `legacyCourseRedirects`). Utility pageRoutes kept.
- Hero stats spine-driven (now 13 courses / 86 lessons / 6,350 XP).
- Migration script: /tmp/migrate.py (transform pattern: strip `<LessonLayout …>`→`<>`, `</LessonLayout>`→`</>`, drop import; validated by build).

### Known debt / deferred
- localStorage→Supabase import **dropped** (id re-keying mismatch; new completions persist server-side already).
- Migrated SysAdmin bodies still contain legacy localStorage `<Quiz>` blocks → replaced in P6.
- Legacy Home course grid still renders (works via redirects, stale numbers) → polish (P13). Unused legacy CoursePage component now dead.
- 1 lesson skipped (`TroubleshootingNetworking`, non-template) — orphaned, `/networking/troubleshooting` 404s.
- 2 supabase-generic casts in ProgressProvider (removed by `supabase gen types`).

## Next session starts with

**P6 — Quizzes & assessments → MVP.** Structured quiz data + server-graded `submit_quiz` RPC (needs correct answers in DB), wire to lessons (`hasQuiz`), gate next-lesson unlock on passing where desired, surface results on the dashboard. Remove/replace the legacy `<Quiz>` blocks left in migrated SysAdmin bodies. Reaching P6 completes the MVP cut line.

## Open questions
