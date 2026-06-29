# Memory — IT Academy rebuild (through Phase 6.2 / MVP)

Last updated: 2026-06-29 16:45 UTC

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

- All gates green. **P6 quizzes live as a vertical slice.** Server-graded: `0005_quizzes.sql` (lesson_quizzes/quiz_questions/quiz_attempts, `get_lesson_quiz`, `submit_quiz`, `_recompute_user_stats`, redefined `complete_lesson`). `0006_seed_quizzes_helpdesk.sql` seeds quizzes for hdf-01/02/03. Validated on local PG (grading, one-time bonus, no drift, fail=0, answer key not exposed).
- Client `features/quiz/` (api.ts, Quiz.tsx); `ProgressProvider.refresh()` added; `LessonView` renders `<Quiz>` when `lesson.hasQuiz` (true for hdf-01..03).
- Recent fixes also in: lesson list alignment (CSS flex→relative markers), favicon cache-bust, navbar logo=TierZero, Google logo, infinite-render-loop fix (useLocalStorage stable setter), DevOps cut, both tracks spine-native (86 lessons/6,350 XP base + quiz bonuses).
- Zips exclude node_modules/dist/.git/.env/.env.example.

### Known debt / deferred
- Quizzes cover all 13 Help Desk lessons (39 questions; seeds 0006+0007). SysAdmin-track quizzes still pending (optional).
- localStorage→Supabase import dropped (re-keying). Legacy Home grid via redirects (P13 polish). 2 supabase-generic casts in ProgressProvider + quiz api uses `as never`/`as unknown` at the rpc boundary (removed by `supabase gen types`). 1 orphaned legacy lesson.

## Next session starts with

**MVP reached** (P6 Help Desk quiz coverage complete). Options next: **P6.3** (pass-to-unlock + dashboard quiz results + SysAdmin-track quizzes), or **P7 — Virtual Help Desk** (interactive ticket simulation, the first post-MVP expansion). Developer must apply migrations to the live project in order through **0007**.

## Open questions
