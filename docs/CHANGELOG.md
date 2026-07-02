# Changelog

## Phase 18 — Windows Server 2025 mastery expansion

Expanded Windows Server from 12 lessons into a full **11-sub-course track (67 new lessons, 201 quiz questions)**, plus 2 hands-on capstone labs. Depth-over-breadth: every lesson ends with a graded quiz and a hands-on 'Try it yourself' task.

**P18.1 — data-driven lesson model (infrastructure).** Added a structured content model so large lesson sets need no per-file JSX:
- `src/content/lessons/model.ts` (LessonContent types) + `StructuredLesson.tsx` (renders to the same semantic markup, inheriting `.lesson-content` styling).
- `src/content/lessons/structured/*` — generated content maps aggregated in `index.ts`.
- `getLessonBody(id)` now falls back to structured content when a lesson isn't in the JSX registry — existing JSX lessons are untouched.
- Authoring pipeline: `p18_manifest.json` + `emit_p18.py` generate the content TS, the spine region (between `// P18-GENERATED` markers in `sysadmin.ts`), and the seed migrations — idempotent and re-runnable.

**P18.2 — sub-courses (67 lessons):** Foundations & Deployment (6), Active Directory Deep Dive (8), Group Policy Mastery (6), DNS & DHCP In Depth (7), File & Storage Services (6), Hyper-V & Virtualization (6), Server Security & Hardening (7), PowerShell Automation (6), Backup/Recovery & HA (5), Networking & Remote Access (5), Monitoring & Troubleshooting (5). The original 12-lesson `windows-server-2025` course is retained as-is (no id/progress changes).

**P18.3 — capstone labs:** two simulated PowerShell labs (bulk Active Directory administration; standing up DNS & DHCP). Lab command matching is now case-insensitive.

**Migrations:** 0029 (curriculum_lessons), 0030 (quizzes), 0031 (labs) — all validated on Postgres 16 and idempotent.

---

# Changelog

## Phase 17.1 — Doc Practice self-assessment copy + improvement plan

- `/practice` regular mode reworded as an intentional **self-assessment** ("grade your own answer" against the rubric + model answer) rather than hinting AI is missing. Build green.
- Added **`docs/IMPROVEMENT-PLAN.md`** — accepted direction for content, design, and a major curriculum expansion (Windows Server 2025 12→~75, Networking 7→~35, Help Desk 25→~45 incl. a Tier 2 track), with a P18–P23 build sequence. Depth/mastery over breadth.

---

# Changelog

## Phase 17 — Editor/Deno fix + dependency audit

**Edge Function “Cannot find name 'Deno'” (editor-only, not a runtime bug):** the React app's TypeScript server was analysing a Deno file. Fixed by scoping Deno to the functions folder:
- Added a Deno type reference at the top of `supabase/functions/grade-doc/index.ts`.
- Added `supabase/functions/deno.json` and `.vscode/settings.json` (`deno.enablePaths: ["supabase/functions"]`) + `.vscode/extensions.json` recommending the Deno extension.
- The app build was never affected (`tsconfig` already scopes to `src`).

**npm audit: 7 → 1.** `npm audit fix` (non-breaking) patched **picomatch** (high), **postcss**, and **react-router-dom** (→ 6.30.4, open-redirect). Added an `overrides` pin of **esbuild → 0.25.12** to clear the transitive esbuild advisory without a major bump. Build stays green.
- **Remaining (1 high): vite dev-server advisories** (path traversal in optimised-deps `.map`, plus two Windows-only dev-server issues). **Dev-server only — no effect on the production build or the deployed app.** Fixable only by upgrading to vite 7/8 (breaking; requires Node 20.19+), tracked as an optional migration.

No migration change (through 0028).

---

# Changelog

## Phase 16 — Legacy cleanup

Removed **19 provably-dead files** (verified zero inbound imports before deletion; gates green after):
- 9 orphaned lesson bodies in `src/pages/lessons/` — the 7 cut **DevOps** lessons, `DockerContainers`, and a duplicate `NetworkingTroubleshootingLesson` (the source of the old `/networking/troubleshooting` 404).
- 10 legacy course-index pages in `src/pages/` (Cybersecurity, DevOps, Linux, Networking, PowerShell, Python, Troubleshooting, Unix, Windows, WindowsServer2025) — all superseded by the spine-driven `/learn` routes + `legacyCourseRedirects`.

Verified safe: the lesson registry still imports all **73** sysadmin lesson bodies from `src/pages/lessons/`; nothing referenced the deleted files.

### Still deferred (needs a scoped refactor, not a delete)
- The legacy localStorage `useProgress` hook is **still live** — used by the routed legacy `Dashboard`/`Certificate` pages and the shared `Quiz`/`LessonLayout`/`LevelBadge`/`StudyTimer` components. Migrating those to server progress (`useAcademyProgress`) and retiring `useProgress` is a proper phase, not a cleanup.
- Cosmetic: move the 73 sysadmin bodies from `pages/lessons/` into `content/lessons/sysadmin/` for consistency.
- `supabase gen types` + drop temporary RPC casts (needs network).

No migration change (through 0028).

---

# Changelog

## Phase 15.4 — More Help Desk scenarios & labs

Pure DB content (Simulator/Labs pages list from the DB — no app code change).

**Scenarios (`0027`) — 3 new tickets, now 7 total:**
- Suspicious email (phishing / BEC) — ties to Security Essentials
- Second monitor "No Signal" (dock/display) — ties to Devices & Peripherals
- Can't find a shared file / OneDrive not syncing — ties to Collaboration

**Labs (`0028`) — 2 new command-line labs, now 3 total:**
- Diagnose connectivity from the command line (ipconfig, ping, nslookup, flushdns, renew)
- Windows support command toolkit (hostname, whoami, tasklist, sfc, gpupdate)

Validated on PG (scenario grading 100% on correct path; labs fetch with intact regex/output). Gates green. Apply migrations through **0028**.

---

# Changelog

## Phase 15.3 — Help Desk expansion: gap-fillers (batch 3)

Four lessons added into existing courses to close real Tier-1 gaps:
- **Command-Line Basics for Support** → IT Support Foundations
- **Windows Tools & the Control Panel** → Hardware & Operating Systems
- **Backup & Data Recovery** → Hardware & Operating Systems
- **Collaboration: Teams, SharePoint & OneDrive** → Workplace IT

Full pipeline each (appended to existing spine course arrays + JSX body + registry + `curriculum_lessons` seed `0025` + quiz seed `0026`, 12 Qs, quiz-gated). Validated on PG; gates green.

**Help Desk: 21 → 25 lessons across 6 courses. Platform: 98 lessons / 294 quiz questions.** Apply migrations through **0026**.

This completes **P15** — the Help Desk track grew from 13 to **25 lessons**, a full A+-aligned entry-level curriculum (Foundations, Hardware & OS, Networking, Workplace IT, Security Essentials, Devices & Peripherals).

---

# Changelog

## Phase 15.2 — Help Desk expansion: Devices & Peripherals (batch 2)

New A+-aligned Help Desk course **Devices & Peripherals** (🖨️, order 6), 4 lessons:
- Laptops & Mobile Devices
- Printers & Scanners
- Peripherals & Display Connectivity
- Remote Support Tools

Full pipeline each (spine + JSX body + registry + `curriculum_lessons` seed `0023` + quiz seed `0024`, 12 Qs, quiz-gated). Validated on PG; gates green.

**Help Desk: 17 → 21 lessons. Platform: 94 lessons / 282 quiz questions.** Apply migrations through **0024**.

### P15 remaining
- Gap-fillers in existing courses (Windows tools/Control Panel, backup & data protection) — optional final batch.

---

# Changelog

## Phase 15.1 — Help Desk expansion: Security Essentials (batch 1)

New A+-aligned Help Desk course **Security Essentials for Support** (🔒, order 5), 4 lessons:
- Malware, Phishing & Social Engineering
- Authentication, MFA & Passwords
- Physical & Data Security
- Secure Disposal, Mobile & BYOD

Full lesson pipeline per lesson: spine entry (`helpdesk.ts`) + JSX body (`content/lessons/helpdesk/`) + registry mapping + `curriculum_lessons` XP seed (`0021`) + 3-question quiz (`0022`, 12 Qs total, quiz-gated). Validated on PG (grading 100% on correct answers); gates green.

**Help Desk track: 13 → 17 lessons. Platform total: 86 → 90 lessons, 258 → 270 quiz questions.** Apply migrations through **0022**.

### P15 remaining (next batches)
- Course 2: **Devices & Peripherals** (laptops/mobile, printers/scanners, peripheral & display connectivity, remote-support tools).
- Gap-fillers in existing courses (Windows tools/Control Panel, backup & data protection).

---

# Changelog

## Phase 14.1 — Hardening & deployment

- **Security audit (automated over all migrations): no gaps.** Every one of the 18 tables has RLS + default-deny; users see only their own rows; answer keys (`quiz_questions`, `scenario_options`) have no client grant and are served/graded via `SECURITY DEFINER` RPCs; all 15 definer functions pin `set search_path = public`; `user_stats` is read-only to clients; `profiles` blocks role escalation; only `verify_certificate` is anon-executable. Documented in `docs/SECURITY.md`.
- **Edge Function CORS** now honours an `ALLOWED_ORIGIN` secret (default `*`) so production can restrict origins.
- **Production security headers** shipped via `public/_headers` (X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, HSTS); CSP provided as a tested-recommendation in the deploy guide.
- **`docs/DEPLOYMENT.md`**: ordered go-live checklist (migrations 0001–0020, auth redirect URLs, optional `grade-doc` deploy + secrets, frontend env/build, headers, post-deploy smoke test).
- **Secret scan clean** — no keys in source; `.env`/`.env.example` gitignored and excluded from ZIPs.

Gates green. No migration change (through 0020). This completes the P1–P14 roadmap.

---

# Changelog

## Phase 13.1 — Polish: spine-driven Home, vendor split, a11y baseline

- **Landing page is now spine-driven.** The old hardcoded course grid (stale lesson counts, legacy lesson ids that never matched, dead links) is replaced by cards generated from the curriculum spine: accurate lesson counts and XP, correct `/learn/:slug` links, **real server progress** (via `useAcademyProgress` instead of localStorage), and a Help Desk / SysAdmin track filter. Features and Quick Access copy/links refreshed to the actual product (tickets, labs, doc practice, interview prep, career readiness, certificates).
- **Bundle vendor-split.** Vite `manualChunks` splits `@supabase`, React/Router, and other deps into long-cacheable vendor chunks. **Entry chunk 539 kB → 157 kB** (vendor-supabase 206 kB, vendor-react 152 kB load/cache separately).
- **Accessibility baseline verified:** skip-to-content link + `main` landmark, `lang="en"`, aria-labelled icon buttons, focus-visible rings, and role=tablist on the new track filter.

Gates green. No migration change (still through 0020).

### Still open in P13 (developer / later)
- Run `supabase gen types typescript --project-id esfmeeclqctegnitbkpg` and drop the temporary RPC casts (`as never` / `as unknown`) — needs network to supabase.co, so it's a developer step.
- Optional: retire now-unused legacy redirect pages + the localStorage `useProgress` hook once nothing references them.

---

# Changelog

## Phase 12.1 — AI-graded documentation practice

Closes the P9 deferral. Learners write real IT docs (resolution notes, KB articles) and get graded against a rubric.

- **DB (`0019`,`0020`, validated on PG):** `doc_exercises` (rubric + model answer, readable) and `doc_submissions` (content + AI score/feedback, RLS select-own; also backs the daily cap). Seeded 3 help-desk exercises.
- **Edge Function `grade-doc` (Deno):** holds the provider key as a **Supabase secret** (never in the client). **Provider-agnostic / OpenAI-compatible**, so any free tier works (Groq, Gemini's compatible endpoint, OpenRouter). Verifies the caller's JWT, enforces a per-user **daily cap** (default 10) and a 4000-char limit, grades, and stores the submission. See `supabase/functions/grade-doc/README.md` for deploy + `supabase secrets set`.
- **Client `features/docs/` at `/practice`:** scenario + task, editor, submit → AI score, per-criterion ✓/✗ + notes, and a reveal-able model answer.
- **Graceful "regular" mode:** if no key is configured (or the function isn't deployed / provider hiccups), the app automatically falls back to a rubric self-check + model answer — so the feature is useful before/without AI.

**Cannot be fully validated in the build sandbox** (Deno + external network): the DB + client are validated and green; deploy `grade-doc` and set secrets on the live project to enable AI grading. Apply migrations through **0020**.

---

# Changelog

## Phase 11.1 — Certificates

- **Backend `0018_certificates.sql`** (validated on PG): `certificates` table (one per user+track, unique verification `code`, holder name snapshot; RLS select-own). `claim_certificate(track)` SECURITY DEFINER **server-verifies** every track lesson is completed before issuing — idempotent (re-claim returns the same code). `verify_certificate(code)` is public (anon-executable) returning holder name / track / date.
- Code generation uses core `md5(random()||clock_timestamp())` — no pgcrypto dependency. Policies made re-runnable (drop-if-exists).
- **Client `features/certificates/`**: `/certificates` (claim when a track is fully complete, otherwise progress; view earned), a branded printable `CertificateView` (Print / Save PDF), and a **public** `/verify/:code` page for employers.
- Linked from navbar Academy ("Certificates").

Gates green. Apply migrations through **0018**.

---

# Changelog

## Phase 10.1 — Learning analytics & employability dashboard

- **`/analytics` (Career Readiness)** — a 0–100 **job-readiness score** (weighted: Help Desk lessons 40%, Help Desk quizzes passed 30%, tickets resolved 20%, labs completed 10%) with a labelled tier, a transparent component breakdown, a **14-day activity chart** (lesson completions + quiz/scenario/lab attempts), **skills-coverage** bars per course for both tracks, and a **recommended next step**.
- `features/analytics/` (api.ts aggregates scenario/lab/lesson/quiz timestamps; Analytics.tsx). No new tables — reads existing data. `quizStats` now also exposes `passedIds` (per-lesson pass set) for track-level breakdown.
- Linked from navbar Academy ("Career Readiness").

Gates green. No new migration (still through 0017).

---

# Changelog

## Phase 9.1 — Interview Prep (vertical slice)

- **Backend** `0016_interview_prep.sql` + seed `0017` (12 questions: 4 behavioral, 8 technical across both tracks). Readable study content — no grading/XP.
- **Client** `features/interview/`: `/interview` flashcard deck — category filter (All/Behavioral/Technical), reveal sample answer + "a good answer hits" key points, prev/next, session-local reviewed counter. Linked from navbar Academy ("Interview Prep").
- Documentation-writing practice (free-text grading) deferred to pair with P12 AI grading.

Gates green. Apply migrations through **0017**.

---

# Changelog

## Phase 8.1 — Simulated labs (vertical slice)

**Backend (`0014_labs.sql`, validated on PG):** `labs` / `lab_steps` / `lab_attempts` (default-deny RLS; step content served via `get_lab`). `complete_lab` records completion idempotently and folds a one-time bonus into the authoritative total via `_recompute_user_stats` — now **lesson + quiz + scenario + lab XP**. Seed `0015` adds the first lab, "Navigate the Linux filesystem" (6 scripted terminal steps).

**Client (`features/labs/`):** `LabsHome` at `/labs`, `LabPlayer` at `/labs/:slug` — a simulated terminal that validates each typed command against the step's pattern, shows simulated output, reveals hints after misses, and calls `complete_lab` on finish (XP refreshes live). Behind RequireAuth; linked from navbar Academy ("Simulated Labs").

Engine is reusable — more labs are pure content (labs + lab_steps seed). Gates green.

---

# Changelog

## Phase 7.3 — SysAdmin quiz fill-out complete

- `0013_seed_quizzes_sysadmin_rest.sql`: quizzes for the final 6 SysAdmin courses (unix, networking, powershell, python, cybersecurity, troubleshooting) — 135 questions, `hasQuiz` enabled.
- **Every lesson now has a quiz: 258 questions / 86 lessons** (13 Help Desk + 73 SysAdmin). Validated on local PG; gates green.

---

# Changelog

## Phase 7.2 — More tickets + SysAdmin quiz fill-out

**Virtual Help Desk content (`0011_seed_scenarios_batch.sql`):** 3 new tickets — Account locked out, Wi-Fi connected but no internet, Can't print — each a full triage → diagnose → resolve → communicate flow. **4 scenarios total** (64 options), validated on PG.

**SysAdmin quizzes (`0012_seed_quizzes_sysadmin_wsl.sql`):** quizzes added for the **Windows Server 2025 (12)** and **Linux (10)** courses — 66 new questions, `hasQuiz` enabled. With prior seeds: **123 questions / 41 lessons**. (This is part of P13's "SysAdmin track fill-out," done incrementally now.)

Quiz/scenario engines were unchanged — both additions are pure content on the existing server-graded systems. Gates green.

### Remaining SysAdmin quiz courses
- unix (5), networking (7), powershell (8), python (9), cybersecurity (10), troubleshooting (6) — still to author.

---

# Changelog

## Phase 7.1 — Virtual Help Desk (linear staged sim, vertical slice)

**Backend (`0009_scenarios.sql`, validated on local PG):**
- Tables `scenarios`, `scenario_stages`, `scenario_options` (answer key — `is_correct`/`points`/`feedback` — has NO client grant), `scenario_attempts` (read-own). Default-deny RLS.
- `get_scenario(id)` serves the ticket + stages + options WITHOUT the answer key (verified: only id/sort/text exposed).
- `submit_scenario(id, choices)` grades server-side with partial credit (points per stage), records the attempt, returns per-stage feedback + score.
- `_recompute_user_stats` redefined again so the authoritative total is now **lesson XP + quiz bonus + scenario bonus** — all three award paths share one total (no drift). Verified: perfect run 100% pass → +60 XP; weak run 0% fail → no bonus.
- Seed `0010_seed_scenario_outlook.sql`: "Outlook is disconnected" — 4 staged decisions (triage → diagnose → resolve → communicate).

**Client (`features/scenario/`):**
- `SimulatorHome` (ticket list) at `/simulator`; `ScenarioPlayer` at `/simulator/:slug` — a chat-style ticket that reveals stages progressively, then an end scorecard with per-stage feedback. Passing refreshes XP live.
- Added under `RequireAuth`; linked from the navbar Academy menu ("Virtual Help Desk").

Scoring model #2 (linear staged) as chosen. Gates green.

### Remaining for P7
- Author more scenarios (system is complete — content only); optional: light branching, timed mode, scenario list tied to track/skill.

---

# Changelog

## Phase 6.3 — Pass-to-unlock, dashboard quiz results, SysAdmin quiz slice

- **Pass-to-unlock:** lessons with a quiz are now completed by *passing the quiz* (the manual "Mark Complete" buttons are hidden on those lessons; a passing submission marks the lesson complete, awarding lesson XP + the bonus, which unlocks the next lesson via the existing sequential lock). Non-quiz lessons keep the mark-complete button.
- **Dashboard quiz results:** `ProgressProvider` now fetches `quiz_attempts` and exposes `quizStats` (lessons passed, average best score, best-per-lesson). The dashboard "Quizzes Passed" and "Avg Quiz Score" cards read real server data, with the platform's total available quizzes as the denominator.
- **SysAdmin cross-track proof:** `0008_seed_quizzes_sysadmin_windows.sql` adds quizzes for the 6 Windows Desktop Administration lessons (18 questions) and enables `hasQuiz` for them. Confirms the quiz system is fully track-agnostic. Total now **57 questions / 19 lessons**, validated on local PG.

### Deferred
- Quizzes for the remaining 8 SysAdmin courses (~67 lessons) — incremental content authoring (each needs questions written against its lesson; the provided reference PDFs are image-only and can't be auto-mined).

---

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
