# Changelog

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
