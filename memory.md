# Memory — TierZero (through Phase 17)

Last updated: 2026-06-30 02:30 UTC

## Project at a glance
- React + Vite + TypeScript SPA, server-authoritative via Supabase. Two tracks: **helpdesk** (lead) + **sysadmin**. DevOps cut. Brand: **TierZero**.
- Working repo: `/home/claude/it-academy` (from github.com/bojan09/it-academy). Deliverable ZIPs → `/mnt/user-data/outputs/` (exclude node_modules, dist, .git, .env, .env.example).
- Supabase project id `esfmeeclqctegnitbkpg`. Credentials live ONLY in local `.env` (gitignored) — not stored here. Client reads `VITE_SUPABASE_PUBLISHABLE_KEY` (anon fallback).
- Local Postgres 16 (`itacad_test`, auth stub at /tmp/stub.sql resolving `auth.uid()` from `app.uid`) is used to validate every migration. Sandbox CANNOT reach *.supabase.co — developer applies migrations + live-tests.
- Gate every phase: `npm run typecheck` + `npm run lint` + `npm run build` all green; ship a ZIP.

## What was built (cumulative, P1–P8.1)
- **Toolchain/architecture**: incremental TS (logic TS, content JSX), ESLint flat (TS/TSX), CI, feature-based structure, curriculum "spine" drives nav/locking/routing, lazy lesson bodies.
- **Auth + RLS** (0001): email/magic-link/Google, profiles + role enum, default-deny RLS, self-promotion blocked.
- **Server progress** (0002): curriculum_lessons (XP authority), lesson_progress, read-only user_stats, level_for_xp, complete_lesson RPC.
- **Content**: both tracks spine-native — **98 lessons / 15 courses** (Help Desk 25, SysAdmin 73) (13 helpdesk authored fresh; 73 sysadmin migrated from legacy pages, stripped to pure bodies). Seeds 0003/0004.
- **Quizzes** (0005): server-graded, answer key never sent (get_lesson_quiz/submit_quiz). **Full coverage: 294 questions / 98 lessons** (seeds 0006,0007,0008,0012,0013). Pass-to-unlock: quiz lessons complete by passing.
- **Virtual Help Desk** (0009): linear staged ticket sim (triage→diagnose→resolve→communicate), get_scenario/submit_scenario. **4 scenarios** (seeds 0010,0011): Outlook, locked account, wifi-no-internet, printer. At /simulator.
- **AI doc practice** (P12; 0019/0020 + Edge Function `grade-doc`): write IT docs, AI-graded vs rubric. Provider-agnostic OpenAI-compatible, key as Supabase secret (free tier: Groq/Gemini/OpenRouter). Daily cap 10, 4000-char limit. Regular (non-AI) fallback = rubric self-check + model answer. Client `features/docs/` at /practice. NOT sandbox-testable (Deno+network) — developer deploys `supabase functions deploy grade-doc` + `supabase secrets set AI_API_KEY/AI_BASE_URL/AI_MODEL`.
- **Certificates** (0018): per-track verifiable certs; claim_certificate server-verifies full track completion (idempotent), verify_certificate public/anon. Client /certificates (claim/view, printable) + public /verify/:code. Code via md5 (no pgcrypto). `features/certificates/`.
- **Analytics** (P10, no migration): /analytics employability score (weighted lessons/quizzes/scenarios/labs) + 14-day activity chart + skills coverage + next step. `quizStats.passedIds` added. `features/analytics/`.
- **Interview Prep** (0016/0017): readable question bank (12 Qs), flashcard deck at /interview, no XP. Documentation-writing half deferred to P12 (AI grading).
- **Simulated Labs** (0014): scripted terminal sim, get_lab/complete_lab. **1 lab** (0015) "Navigate the Linux filesystem". At /labs. Client `features/labs/`.
- UI: TierZero rebrand, terminal-prompt favicon+navbar glyph, Google logo on login, spine-driven landing hero + dashboard "Your Tracks" + quiz stats, navbar Academy menu links to Learn/Simulator/Labs.

## Decisions made (locked)
- Single `_recompute_user_stats(uid)` is the ONE authoritative XP rollup: total = lesson XP + quiz bonus + scenario bonus + lab bonus. complete_lesson/submit_quiz/submit_scenario/complete_lab all call it → no drift. (Redefined in 0005, 0009, 0014.)
- Answer keys (quiz correct_index; scenario is_correct/points/feedback) have NO client grant — served sans-answer via SECURITY DEFINER fns, graded server-side. Lab step patterns ARE client-side (immediate validation; low stakes, completion-bonus only).
- Lesson registry keyed by lesson **id** (globally unique); LessonView resolves body by id.
- Scoring model #2 (linear staged) chosen for scenarios.
- Roadmap (14 phases): P6 MVP=quizzes ✓, P7 Virtual Help Desk ✓, **P8 Simulated labs (in progress)**, P9 interview/docs, P10 analytics, P11 certificates ✓, P12 AI ✓, P13 polish (in progress: Home spine-driven ✓, vendor split ✓, a11y baseline ✓; gen types + legacy cleanup remain — +SysAdmin fill-out, legacy grid replacement), P14 hardening ✓ (SECURITY.md audit clean, DEPLOYMENT.md, _headers, grade-doc ALLOWED_ORIGIN). Roadmap P1-P14 complete.

## Problems solved
- Infinite render loop ("Maximum update depth") — `useLocalStorage` setValue depended on `[key, storedValue]`; made it use the functional updater, deps `[key]` only (stable identity). 
- Rebrand missed split `SysAdmin`+`Pro` navbar spans; fixed.
- Lesson list misalignment — `.lesson-content ul/ol li` was `display:flex` (split `<strong>` + text into columns); switched to relative + absolutely-positioned markers.
- Favicon "mismatch" was browser cache → busted with `?v=2`.
- Legacy `<Quiz>` localStorage blocks removed from all migrated bodies.

## Current state
- All gates green through **P8.1**. Migrations 0001–0015 validated on local PG.
- Everything works end-to-end pending the developer applying migrations **through 0028** to the live project; deploy grade-doc + set AI secrets (see supabase/functions/grade-doc/README.md) (in order) and setting Auth redirect URLs.

## Content expansion (P15) — COMPLETE

Help Desk track expanded 13 -> 25 lessons across 6 courses (A+-aligned). Batches: 1 Security Essentials (hdsec, 0021/0022), 2 Devices & Peripherals (hddev, 0023/0024), 3 gap-fillers hdf-04/hwos-04/hwos-05/work-05 (0025/0026). Lesson pipeline = spine (helpdesk.ts) + body (content/lessons/helpdesk/*.jsx) + registry (features/lessons/registry.ts) + curriculum_lessons seed + quiz seed. Migrations now through **0028** (added 0027 scenarios, 0028 helpdesk labs). Further growth = more of the same (author into spine + body + registry + 2 seeds).

## Next session starts with
- Continue **P8**: author more labs (pure content — labs + lab_steps seeds; e.g. PowerShell, Windows admin, networking command labs), and/or richen the lab engine (multi-line output, reset, per-step check marks). Then **P9 (interview/documentation practice)**.
- Optional polish backlog (P13): replace legacy Home course grid with spine cards; vendor-split the ~495kB entry bundle; run `supabase gen types --project-id esfmeeclqctegnitbkpg` to drop the temporary `as never`/`as unknown` + supabase-generic casts.

## Open questions / known debt
- 3 labs (Linux filesystem + 2 helpdesk CLI labs: net-cli, win-toolkit; seeds 0015/0028) + 4 scenarios authored (more = content).
- localStorage→Supabase progress import dropped (spine re-keying made old ids non-matching; new completions persist server-side).
- Legacy cleanup done (P16): removed 19 dead files (7 DevOps + Docker + dup networking body; 10 legacy course-index pages). /networking/troubleshooting 404 orphan resolved.
- Home spine-driven; bundle vendor-split (entry 157kB); a11y baseline. Legacy cleanup (P16): 19 dead files removed. STILL LIVE debt: legacy `useProgress` localStorage hook used by routed legacy Dashboard/Certificate + shared Quiz/LessonLayout/LevelBadge/StudyTimer — retiring it is a scoped refactor (migrate to useAcademyProgress). 73 sysadmin bodies still under pages/lessons/ (registry imports them; could move to content/lessons/sysadmin).
