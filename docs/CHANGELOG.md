# Changelog

## Phase 6.2 — Quiz rollout across the full Help Desk track

- **All 13 Help Desk lessons now have server-graded quizzes** (`hasQuiz` enabled across the track). New seed `0007_seed_quizzes_helpdesk_rest.sql` adds 30 original questions for the remaining 10 lessons (Hardware & OS, Networking Basics, Workplace IT). With 0006, that's **39 questions / 13 lessons**, validated on local PG (grading + pass/fail verified).
- Questions are original, written to the same CompTIA A+ / Tier-1 scope as the provided reference material (the scanned A+ PDFs / 7-Day `.docx` guides could not be imported — image-only PDFs and the `.docx` files don't open as valid Word packages — so nothing was copied from them).
- Help Desk track quiz coverage is complete → **MVP cut line reached.**

### Deferred (optional P6.3)
- Pass-to-unlock (gate the next lesson on a passed quiz); quiz results on the dashboard; quizzes for the SysAdmin track.

---

# Changelog

## Phase 6.1 — Quizzes & assessments (server-graded, vertical slice)

**Backend (`0005_quizzes.sql`, validated on local PG):**
- Tables `lesson_quizzes` (pass %, bonus XP), `quiz_questions` (answer key locked — no client grant), `quiz_attempts` (read-own). Default-deny RLS.
- `get_lesson_quiz(lesson_id)` serves questions WITHOUT the answer key (definer).
- `submit_quiz(lesson_id, answers[])` grades server-side, records the attempt, returns score + per-question correctness (never the key).
- `_recompute_user_stats()` is now the single authoritative rollup: `total_xp = completed-lesson XP + one-time bonus per passed quiz`. `complete_lesson` was redefined to delegate to it, so lesson and quiz XP can't drift. Verified: pass = +25 once, wrong resubmit = no double-award, later lesson completion retains the bonus, fail = 0.
- Seed `0006_seed_quizzes_helpdesk.sql`: quizzes for the 3 IT Support Foundations lessons.

**Client:**
- `features/quiz/` — typed `get_lesson_quiz`/`submit_quiz` wrappers + a server-graded `Quiz` component (per-question right/wrong feedback, pass banner, retry).
- `ProgressProvider` exposes `refresh()`; a passing quiz refreshes XP so the navbar/dashboard update immediately.
- Wired into `LessonView` via `lesson.hasQuiz` (enabled for hdf-01/02/03).

Gates green. Remaining for full P6: author quiz data across the rest of Help Desk (and optionally SysAdmin); optional pass-to-unlock.

---

# Changelog

## Phase 5.5.3 — Lesson list alignment + favicon

- **Fixed list misalignment in lessons.** `.lesson-content ul li` / `ol li` used `display:flex`, which split `<li><strong>Term</strong> — text</li>` into separate columns (bold term wrapping in a narrow column, description floating beside it). Switched to relative positioning with absolutely-placed markers so inline `<strong>` + text flow normally on one line. Affects every lesson.
- **Favicon** cache-busted (`/favicon.svg?v=2`) so the browser tab shows the terminal-prompt mark that matches the navbar logo (the old icon was a stale browser-cached favicon).

---

# Changelog

## Phase 5.5.2 — Fix: infinite render loop on lessons

- **"Maximum update depth exceeded" fixed.** Root cause: `useLocalStorage`'s `setValue` was memoized on `[key, storedValue]`, so its identity changed on every state update. That cascaded through `useProgress.setLastVisited` into `LessonLayout`'s `useEffect` (which lists it as a dependency), creating an infinite set-state loop. `setValue` now uses the functional updater and depends only on `[key]`, so it's stable.
- Silenced the React Router v7 future-flag warnings via `future={{ v7_startTransition, v7_relativeSplatPath }}`.

---

# Changelog

## Phase 5.5.1 — Fixes (rebrand gaps, login, dashboard, lessons)

- **Navbar logo** now reads **TierZero** (was a split `SysAdmin`+`Pro` span the rebrand sed missed). Logo glyph + favicon changed to a tech-y terminal-prompt mark.
- **"Continue with Google"** button now shows the Google logo.
- **Dashboard** "Your Tracks" section is now spine-driven: real per-course completion for both tracks from server progress (replaces the legacy localStorage `PlatformProgress`).
- **Lessons:** removed the legacy localStorage `<Quiz>` blocks (and imports) from all migrated lesson bodies — noted P6 debt and the most likely render/runtime error source. Build green.

---

# Changelog

## Phase 5.5 — Legacy migration: both tracks spine-native

- **73 of 74 legacy SysAdmin lessons stripped to pure spine bodies** (scripted, conservative transform; LessonLayout wrapper removed, content kept). 1 file (`TroubleshootingNetworking`) skipped — it never used LessonLayout — and is left out of the spine.
- **SysAdmin track generated** (`src/content/curriculum/sysadmin.ts`): 9 courses (Windows, Windows Server 2025, Linux, Unix, Networking, PowerShell, Python, Cybersecurity, Troubleshooting), 73 lessons, sequential locking.
- **Registry re-keyed by lesson id** (globally unique, avoids cross-course slug collisions); `LessonView` now resolves bodies by id. Help Desk + SysAdmin bodies both lazy-loaded.
- **Server seed** `0004_seed_sysadmin.sql` (73 lessons, 5,720 XP). Validated on local PG → totals: helpdesk 13/630 + sysadmin 73/5,720 = **86 lessons / 6,350 XP**.
- **Legacy routes retired:** `lessonRoutes` and `placeholderRoutes` emptied; legacy course-index URLs (`/windows`, `/linux`, …) now **redirect to `/learn/<course>`** so existing links/menus keep working.
- Both tracks now render under `/learn` with the same server-authoritative completion + XP model.

### Notes / deferred
- **localStorage→Supabase import dropped:** the spine re-keyed lesson ids, so legacy local ids no longer map; new completions already persist to the server (P5.2). Documented rather than built.
- Migrated SysAdmin lesson bodies still contain their original (localStorage-based) `<Quiz>` blocks; these are superseded by the real quiz system in **P6**.
- The legacy Home course grid still renders (functional via redirects, stale per-card numbers); `LearnHome` is the real spine-driven browse page. Cleanup deferred to polish (P13).
- 1 orphaned lesson URL (`/networking/troubleshooting`) now 404s.

---

# Changelog

## Phase 5.4 — Help Desk track build-out

- **Help Desk track expanded to 13 lessons across 4 courses** (spine-native): IT Support Foundations, Hardware & Operating Systems, Networking Basics for Support, Workplace IT (Accounts, M365 & Tickets). 10 new lesson bodies authored as pure content modules; spine + lazy registry rewritten.
- **Server seed:** `0003_seed_helpdesk.sql` upserts all 13 lessons into `curriculum_lessons` (XP authority). Idempotent; validated on local PG (13 lessons, 630 XP).
- **DevOps fully cut** from the UI: routes (manifest), navbar, footer, command palette, dashboard course list, and home grid.
- Hero stats now read 4 courses / 13 lessons / 630 XP automatically (spine-driven).
- Each lesson code-splits into its own chunk. Gates green.

### Deferred to P5.5
- Migrating the ~70 legacy SysAdmin lesson pages to pure spine bodies + SysAdmin spine track; retiring the legacy lesson route manifest + Home course grid; the localStorage→Supabase progress import (needs matching ids from the full seed).

---

# Changelog

## Phase 5.1–5.3 — Rebrand, progress fix, landing redesign

### P5.1 Rebrand → TierZero
- All "SysAdminPro/SysAdmin Pro" → **TierZero** across UI + content; localStorage keys and `*.dev` text renamed.
- Level titles retitled to a tier-themed, two-track ladder (Tier-0 Initiate → Infrastructure Architect), thresholds aligned with `level_for_xp` (legacy `LEVELS` + new `src/features/gamification/levels.ts`, both mirroring the SQL).

### P5.2 Progress visibility fix
- Navbar XP chip and the **My Progress** dashboard (Total XP, Level + ring, Lessons Done, Day Streak, Badges) now read **server `user_stats`** when signed in, falling back to legacy localStorage when signed out. Fixes "completed lesson doesn't show in My Progress."
- Dashboard "lessons done" denominator now reflects the real curriculum total, not a hardcoded 82.

### P5.3 Landing redesign + honest info
- New hero: two-track positioning (Help Desk → SysAdmin), new copy + CTAs ("Start learning free" → /login, "Explore the Academy" → /learn).
- Removed false/dropped-scope claims: DevOps course + tab, "VMware Lab Exercises", inflated "82 lessons / 10 courses / 6,670 XP". Hero stats are now **spine-driven** (auto-update as content is seeded).

Gates: typecheck/lint/build green.

---

# Changelog

## Phase 4 — Server-authoritative progress & gamification

XP, levels, streaks, and badges now live in the database and are computed server-side. Clients can read their progress but cannot forge it.

### Added — database (`supabase/migrations/0002_progress.sql`)

- **`curriculum_lessons`** — minimal XP authority (id, slug, title, track, xp). Seeded with the slice's 3 lessons; P5 expands it (generated from the spine). Read-only to clients.
- **`lesson_progress`** — per (user, lesson). Read-own via RLS; **no client write grants** — completion only happens through the RPC.
- **`user_stats`** — denormalised rollup (total_xp, level, streak, last_study_date, earned_badges). Read-own; **never client-writable**.
- **`level_for_xp(xp)`** — single source of level thresholds (mirrored in TS for display only).
- **`complete_lesson(lesson_id)`** — `SECURITY DEFINER` RPC, the only path that awards XP. Idempotent (re-completion is a no-op), recomputes total XP authoritatively (drift-proof), updates streak, and awards badges. Returns the updated `user_stats`.

### Added — client (`src/features/progress/`)

- `ProgressProvider` (Supabase-backed) + `context.ts` + `useAcademyProgress` — reads completed lessons + stats, routes completion through the RPC. Replaces the localStorage `useProgressView` bridge (removed).
- `LessonView`/`CourseView`/`LearnHome` now use server progress.

### Changed

- `LessonLayout` gained optional `onComplete` / `isCompletedOverride` props. The spine passes them so completion is server-authoritative; legacy lesson pages omit them and keep their localStorage behaviour unchanged.
- `main.jsx` wraps the app in `<ProgressProvider>` (inside `<AuthProvider>`).
- `database.ts` extended with the progress tables, `lesson_status` enum, and RPC signatures.

### Verified

- **Both migrations applied to a real local Postgres 16; 9 assertions passed:** XP award (40 → 90), idempotent re-completion, streak + first-lesson badge, unknown-lesson rejected, **clients blocked from writing `user_stats` and `lesson_progress` directly**, stats unchanged after blocked writes, and per-user isolation.
- `tsc --noEmit`, `eslint`, `vite build` all green.

### Notes / deferred

- Two localized casts at the supabase generic boundary (hand-authored `database.ts` vs the newer client); they're removed by running `supabase gen types` against the project.
- **localStorage → Supabase import deferred to P5.** It only becomes useful once the full lesson set (with matching ids) is seeded; importing now would match almost nothing.
- The legacy Dashboard still reflects only localStorage XP; it's replaced by real analytics in P10. Spine `/learn` progress is the server-authoritative source.

### Requires the developer to run

1. Apply `0002_progress.sql` (after `0001`).
2. Re-test `/learn`: complete a lesson while signed in → XP/level/streak update and persist across reload; the next lesson unlocks.

---

## Phase 3 — Authentication, profiles & RLS

First backend phase. Adds real accounts, server-side identity, and a default-deny security model.

### Added — database (`supabase/migrations/0001_profiles.sql`)

- **Enums** `app_role` (`student`/`admin`) and `track` (`helpdesk`/`sysadmin`).
- **`profiles`** table, 1:1 with `auth.users`, cascade-deleted with the user.
- **`is_admin()`** — `SECURITY DEFINER` so admin checks bypass RLS and can't trigger recursive policy evaluation.
- **Default-deny RLS** — `anon` gets nothing; `authenticated` can read/insert only their own row and may update **only `display_name` and `track`** (column-level grant), so a user cannot self-promote to admin. Admins read all rows.
- **`handle_new_user()` trigger** — auto-provisions a profile on signup, deriving `display_name` from Google metadata or the email local-part.

### Added — client auth (`src/features/auth/`)

- `AuthProvider` — session lifecycle, profile fetch, and `signInWithPassword` / `signUp` / `signInWithMagicLink` / `signInWithGoogle` / `signOut`. Degrades gracefully (no white screen) if env is missing.
- `context.ts`, `useAuth`, typed `types.ts`.
- `RequireAuth` — protected-route wrapper; redirects to `/login` preserving the attempted path.
- `LoginPage` — password, magic link, and Google, with sign-in/sign-up toggle.
- `AuthCallback` — OAuth/magic-link landing.
- `AuthButton` in the navbar (sign in / sign out + display name).

### Changed

- `main.jsx` wraps the app in `<AuthProvider>`. `/login` and `/auth/callback` routes added; the `/learn` Academy is now behind `RequireAuth`.
- Env now reads `VITE_SUPABASE_PUBLISHABLE_KEY` (preferred) with `VITE_SUPABASE_ANON_KEY` fallback.
- `src/shared/types/database.ts` replaced with a real (hand-authored) schema type matching the migration; regenerate via `supabase gen types` once the CLI is linked.

### Verified

- **Migration applied to a real local Postgres 16** with a Supabase `auth` stub; 7 assertions passed: trigger provisioning + defaults, per-user row isolation, allowed `display_name` edit, **blocked role escalation**, admin read-all, non-admin isolation, anon denied.
- `tsc --noEmit`, `eslint`, `vite build` all green.

### Requires the developer to run (cannot be done from the build sandbox)

1. Apply `0001_profiles.sql` (Supabase SQL editor or `supabase db push`).
2. Supabase → Auth → URL Configuration: add redirect URLs `http://localhost:5173/auth/callback` and the production equivalent.
3. Live check: Google sign-in, email/password signup (confirm email if confirmation is on), magic link, and that `/learn` redirects to `/login` when signed out.

### Notes

- Entry bundle 267 → 487 kB (gzip 81 → 138 kB) because `supabase-js` now loads on startup for the session check. Optimizable later via vendor-splitting; deferred (P13).
- Progress is still localStorage; P4 swaps it for server-authoritative progress and wires `profiles.track`.

---

## Phase 2.2 — Legacy lazy-loading + route-manifest migration

Completes P2's bundle goal without touching lesson content.

### Changed

- **`App.jsx`: 355 → 56 lines.** The ~110 hand-wired `<Route>` lines and their static imports are replaced by a generated, lazily-loaded route manifest. Every existing URL is preserved exactly.
- **Single `Suspense` boundary** added around `<Outlet />` in `Layout.jsx` for all lazy routes.

### Added

- **`src/app/routes.jsx`** — auto-generated manifest: 18 utility/course-index pages, 82 legacy lesson pages, 10 section placeholders, all as `React.lazy` imports. (Transitional: `lessonRoutes` empties out as content migrates to the spine in P5, then the file is deleted.)
- **`src/shared/ui/Placeholder.jsx`** — the "coming soon"/404 component extracted from `App.jsx`.

### Result (measured)

- **Initial JS bundle: 1,572 kB → 267 kB (−83%); gzip 437 kB → 81 kB.**
- 109 on-demand chunks; the >500 kB chunk-size warning is gone.
- Largest non-entry chunk is ~31 kB (Dashboard); lessons are ~3–27 kB each, fetched only when opened.

### Deliberately deferred (with reasoning)

- **Full spine migration of the 82 legacy lessons was NOT done here.** Those files are reorganized into the two tracks and reworked in P5; converting them to pure spine bodies now would mean editing every file twice. They remain self-rendering under preserved URLs until then.
- DevOps routes are still live (behavior unchanged); DevOps is formally dropped during the P5 content reorganization, not in this structural pass.

---

## Phase 2 — Curriculum spine + data-driven routing + lazy loading (vertical slice)

First phase that changes the running app. Stands up the data-driven engine and proves it end-to-end on one real Help Desk course. Legacy routes/content are untouched and still work.

### Added

- **Typed curriculum spine** (`src/content/curriculum/`) — `helpdesk.ts` (the "IT Support Foundations" course: 1 module, 3 lessons) assembled in `index.ts`. Single source of truth for ordering, prerequisites, locking. Replaces the out-of-sync `courses.json` pattern (legacy file left in place until fully migrated).
- **Curriculum engine** (`src/features/curriculum/`) — `selectors.ts` (course/lesson lookup, ordered lessons, prev/next, breadcrumbs) and `locking.ts` (pure, exhaustive evaluation of `none` / `sequential` / `prerequisites` lock rules).
- **Lazy lesson registry** (`src/features/lessons/registry.ts`) — maps lesson slug → `React.lazy` body import. Each body is now its own bundle chunk.
- **Spine-driven views** — `LessonView.tsx` (lock check → lazy body → chrome with spine-derived breadcrumbs/prev/next, inside `Suspense`), `CourseView.tsx` (ordered lessons with lock/complete state + progress bar), `LearnHome.tsx` (courses grouped by track).
- **`LessonChrome.tsx`** — typed wrapper over the legacy `LessonLayout`; the single typed seam for lesson chrome, so the layout keeps owning mark-complete/XP/sidebar.
- **`useProgressView.ts`** — typed bridge over the legacy localStorage progress hook; the single seam to legacy progress (replaced by the Supabase provider in P4).
- **Help Desk content** (`src/content/lessons/helpdesk/`) — three real entry-level lessons (pure body modules): what IT support is, a repeatable troubleshooting method, writing useful tickets. Seed of the P5 Help Desk track.
- **Routes** — `/learn`, `/learn/:courseSlug`, `/learn/:courseSlug/:lessonSlug` added under the existing `Layout`. A new **Academy** dropdown in the navbar (desktop + mobile) makes it discoverable.

### Verified

- Per-lesson code-splitting confirmed in the build: `what-is-it-support` (3.44 kB), `troubleshooting-methodology` (3.72 kB), `tickets-and-documentation` (3.83 kB) emit as separate chunks loaded on demand.
- Sequential locking works against real completion state: lesson 1 open; 2 and 3 unlock as the prior completes.

### Notes / honest limits

- **Main bundle is still ~1.58 MB.** The engine proves lazy loading works, but the 82 legacy lessons remain statically imported in `App.jsx`, so the initial chunk is unchanged. The bundle drops when those lessons migrate onto this engine (or their imports are lazified) — scoped as the next step, not this slice.
- Cross-component progress reactivity is still the legacy localStorage model: completion reflects on route change (re-mount), not live across mounted components. Fixed properly by the P4 provider.

---

## Phase 1 — Foundation & toolchain

Foundation only; no user-facing change. The legacy app builds and runs exactly as before.

### Added

- **TypeScript toolchain** — `tsconfig.json` (`strict: true`, `allowJs: true`, `checkJs: false`), `src/vite-env.d.ts` for typed `import.meta.env`. `npm run typecheck` (`tsc --noEmit`) is the strict gate over `.ts`/`.tsx` only.
- **Shared domain types** (`src/shared/types/`) — `common`, `curriculum`, `user`, `progress`, `quiz`, `gamification`, `scenario`, plus a placeholder `database.ts` (regenerated from the real schema in P3). Barrel export at `src/shared/types/index.ts`.
- **Typed Supabase client** (`src/shared/lib/supabase.ts`) — lazy singleton; never throws at import time. Validated env access in `src/shared/lib/env.ts`.
- **ESLint 9 flat config** (`eslint.config.js`) — strict on `.ts`/`.tsx`; legacy `.js`/`.jsx` excluded until migrated (incremental coverage by design).
- **Prettier** — `.prettierrc.json` + `.prettierignore` (legacy dirs ignored to avoid mass reformatting).
- **CI** — `.github/workflows/ci.yml` runs typecheck → lint → build on push/PR to `main`.
- **Feature-based scaffolding** — `src/features/`, `src/content/{lessons,curriculum,quizzes,scenarios}/`, `src/shared/{ui,lib,hooks}/` with READMEs describing intent.
- **Docs** — `docs/ARCHITECTURE.md` (approved blueprint), `memory.md` (session handoff).
- `.env.example` for client Supabase config.

### Changed

- `package.json` — added `typecheck`, `lint`, `lint:fix`, `format`, `format:check` scripts and the dev-tooling dependencies.

### Notes

- New TS modules are not yet imported by the rendered app, so the production bundle is unchanged (~1.57 MB). Bundle reduction via lazy loading lands in P2.
- No backend is wired into the UI yet; auth arrives in P3. Existing pages still use the legacy `localStorage` progress path until P2–P4 replace it.
