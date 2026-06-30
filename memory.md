# Memory — IT Academy rebuild (through Phase 8.1)

Last updated: 2026-06-29 19:40 UTC

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

- All gates green. **P7 Virtual Help Desk live as a vertical slice** (scoring model #2, linear staged). Backend `0009_scenarios.sql` (scenarios/stages/options/attempts, `get_scenario`, `submit_scenario`, `_recompute_user_stats` now folds lesson+quiz+scenario XP). Seed `0010_seed_scenario_outlook.sql` (1 scenario, 4 stages). Validated on local PG (answer-key hidden, grading, XP fold).
- Client `features/scenario/` (api.ts, SimulatorHome at /simulator, ScenarioPlayer at /simulator/:slug). Linked in navbar Academy menu. Behind RequireAuth.
- Prior: P6.3 pass-to-unlock + dashboard quiz results + SysAdmin Windows quizzes (0008). Quizzes: 57 Qs / 19 lessons. Both tracks spine-native, 86 lessons.
- Migrations to apply on live project in order through **0010**.

### Known debt / deferred
- 4 scenarios authored (Outlook, locked account, wifi-no-internet, printer; seeds 0010+0011). More are pure content.
- All 86 lessons now have quizzes (258 Qs; seeds 0006-0008,0012,0013). Full quiz coverage.
- localStorage import dropped; legacy Home grid via redirects (P13 polish); supabase-generic casts + `as never`/`as unknown` at rpc boundaries (removed by `supabase gen types`); 1 orphaned legacy lesson.

## Next session starts with

**P8 — Simulated labs** is the next roadmap phase after P7. Alternatively continue content (remaining 6 SysAdmin quiz courses; more scenarios). Migrations now run through **0012**; apply in order on the live project.

## Open questions
