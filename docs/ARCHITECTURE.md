# IT Academy — Architecture

> Status: **approved blueprint**. Build proceeds in phases; each phase ends buildable, deployable, and independently shippable.

## Product

A two-track IT learning platform:

- **Track 1 — Help Desk / Tier-1 / Desktop Support** (entry level). Mostly new content.
- **Track 2 — SysAdmin** (advanced). Repurposes the existing deep content.

DevOps is **out of scope** (removed). Cybersecurity/hardening content is folded into both tracks rather than kept standalone. The "60-day" framing is a structured study path, not a promise.

## Architecture decision

**Option B — major restructuring, preserve reusable assets.** The curriculum content (~36k lines) and design system are kept; the backend, type-safety, data model, and product differentiators are built. Full rebuild (C) was rejected as wasteful of existing content; in-place refactor (A) was rejected because there is no backend/auth/TS to refactor toward.

## Core technical decisions

| Area | Decision | Reasoning |
|---|---|---|
| Content model | **Hybrid** | Typed curriculum spine in Supabase drives nav/locking/routing; lesson bodies stay as lazy-loaded code (MDX going forward, JSX migrated opportunistically); quizzes + scenarios are structured data. Fixes routing/bundle/progress without a lossy content rewrite. |
| TypeScript | **Incremental** | `strict` + `allowJs`, `checkJs: false`. All *logic* is TS; *content* stays JSX. Quality gate = `tsc --noEmit` clean over TS files. Avoids typing 36k lines of markup for no safety gain. |
| Backend | **Supabase, server-authoritative** | Auth (email/password + magic link + Google), `profiles` + role enum, default-deny RLS. XP/levels/badges/streaks computed in Postgres RPCs; `user_stats` is read-only to clients so progress can't be forged. |
| Roles | `student`, `admin` | No content-editor role / CMS until there's a content team. |
| Labs / Help Desk | **Simulated, in-browser** | Scripted state machines and fake terminals/tools. No VMs or containers. |

## Data model (RLS default-deny on every table)

- `profiles` — `id` (FK `auth.users`), `display_name`, `role`, `track`, `created_at`. User reads/writes own row; admin reads all.
- `curriculum` — seeded from the typed spine. Authenticated read; **client writes blocked** (migrations/service-role only).
- `lesson_progress` — `user_id`, `lesson_id`, `status`, `completed_at`, `xp_awarded`. Row access where `user_id = auth.uid()`.
- `quiz_results` — `user_id`, `quiz_id`, `score`, `passed`, `answers` (jsonb), `taken_at`.
- `scenario_state` — `user_id`, `scenario_id`, `state` (jsonb), `status`, `score`, `updated_at`.
- `user_stats` — `total_xp`, `level`, `streak`, `last_study_date`, `earned_badges` (jsonb). **Read-only to clients**; written only inside RPCs.

## Folder structure (target)

```
src/
  app/        router (data-driven), providers, shell
  features/   auth, curriculum, lessons, progress, gamification,
              quizzes, helpdesk, labs, interview, analytics,
              certificates, ai
  content/    lessons/ (MDX/JSX, lazy by slug), curriculum/ (typed spine),
              quizzes/, scenarios/
  shared/     types/ (domain contracts), ui/ (design system),
              lib/ (supabase, env, utils), hooks/
  styles/
supabase/
  migrations/ schema + RLS + RPC functions
  seed/       curriculum seed
```

The restructure is incremental: new homes and foundational typed files are created first; existing files migrate as the phases that touch them (P2 routing, P5 content) run, so the app stays stable throughout.

## Migration strategy

- `courses.json` → retired; the typed spine becomes the single source of truth, seeded to `curriculum`.
- `localStorage` progress → one-time import into Supabase on first authenticated load, then the `localStorage` model is removed.
- 114 hand-wired routes → generated from the spine.
- JSX lessons → MDX opportunistically, not big-bang.

## Quality gates (per phase)

`tsc --noEmit` clean · lint passes (on covered surface) · build succeeds · tests pass where applicable · no critical console errors · responsive + accessibility reviewed · RLS/security checklist (from P3 on) · acceptance criteria met.

> Lint coverage is incremental: strict on TS/TSX, expanding to content as files migrate. This is intentional, not a bypass.

## Deployment

SPA on Vercel/Netlify + managed Supabase (DB, Auth, Storage, Edge Functions). Client env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Service-role key is server-only and never shipped.

## Phase roadmap (14 phases; MVP ships at P6)

1. **P1** Foundation & toolchain — TS, lint, CI, Supabase client, domain types, structure.
2. **P2** Curriculum spine + data-driven routing + lazy loading.
3. **P3** Auth + profiles + RLS.
4. **P4** Server-authoritative progress + gamification.
5. **P5** Content repackaging + Help Desk track authoring.
6. **P6** Quizzes & assessments. — **MVP ships**
7. **P7** Virtual Help Desk (headline differentiator).
8. **P8** Simulated labs.
9. **P9** Interview prep + documentation practice.
10. **P10** Learning analytics & employability dashboard.
11. **P11** Certificates (depends on trustworthy P4 progress).
12. **P12** AI features (mentor, ticket review, interview simulator).
13. **P13** Polish — a11y, performance budget, design consistency, SysAdmin track fill-out.
14. **P14** Hardening, security audit, docs, deployment.

## Top risks

- **Typed↔untyped seam** — mitigated by keeping all logic on the TS side, only content on the JS side.
- **`user_stats` drift** — mitigated by updating it only inside the RPCs that write progress.
- **Scope** — months of work; phase independence allows stopping/reprioritizing at any checkpoint.
- **Content gap** — the entry-level Help Desk core is largely new authoring (P5), the heaviest lift.


## Data-driven lesson model (P18)

Lessons can be authored as structured data (`LessonContent` in `src/content/lessons/model.ts`) instead of hand-written JSX. `StructuredLesson.tsx` renders that data into the same semantic markup as the JSX bodies, so styling is identical. `getLessonBody(id)` resolves the JSX registry first, then falls back to `structuredLessons[id]`. Windows Server content is generated from `p18_manifest.json` via `emit_p18.py`, which writes `src/content/lessons/structured/*`, replaces the region between `// P18-GENERATED-START/END` in `sysadmin.ts`, and emits seed migrations 0029/0030. This keeps large content sets consistent and re-generatable.
