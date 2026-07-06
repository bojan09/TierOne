# Memory — TierZero (through Phase 22)

Last updated: 2026-07-06

## P22 ENGAGEMENT & SEARCH — COMPLETE (no DB changes)

Frontend phase. Gates green. Onboarding DEFERRED (approved). Recommended defaults used: custom matcher (no Fuse dep), augment /learn, defer onboarding.

**P22.1 global search:** `src/features/search/searchIndex.ts` builds a spine-driven index (curriculum courses + lessons w/ structuredLessons body text + key pages + GLOSSARY_DATA); `searchItems(q,limit)` AND-tokenised scorer (title>body), `defaultItems()`. Replaced the STALE hardcoded index in `src/components/CommandPalette.jsx` (was pointing at deleted legacy routes) — now imports searchIndex; ⌘K wiring already existed in Layout.jsx. Rewrote `src/pages/SearchResults.jsx` (/search) spine-driven. Verified P19/P20 titles in bundle.
**P22.2 resume+streak:** ResumeBanner (reads localStorage lastVisited, href=window.location.pathname = correct /learn path) rendered atop LearnHome; StreakTracker compact in LearnLayout sidebar (persistent + drawer).
**P22.3 learning-path:** `src/features/curriculum/LearningPath.tsx` — per-track connected course nodes (complete/active/todo, progress bar, difficulty). LearnHome rewritten to render ResumeBanner + LearningPath per track (replaced flat card grid).

**DEBT (unchanged):** resume/streak use legacy localStorage useProgress (per-device); server-authoritative streak = activity table+RPC, future. Legacy useProgress retirement still pending.

**NEXT: P23** — authoring tooling (generalize/CLI for content pipeline), light/dark theme toggle (currently dark-only), a11y deepening (focus mgmt on route change, ARIA live for quiz results, keyboard flow), + optional server-authoritative streak/onboarding. Pipeline: structured-lesson model + emit_content.py (<phase> config, emits difficulty).
## P21 LESSON-EXPERIENCE UX — COMPLETE (no DB changes)

Frontend/UX phase. Gates green. NO new/changed migrations (difficulty is client-side spine data only).

**P21.1 in-lesson:** `src/features/lessons/LessonToc.tsx` — TOC via DOM-scan of `.lesson-content` h2s (MutationObserver for lazy bodies + IntersectionObserver scroll-spy); sidebar variant (desktop) + collapsible inline variant (mobile). Added difficulty badge + 'Lesson N of M' to header (LessonLayout.jsx props difficulty/position/total; LessonView computes position via getOrderedLessons; LessonChrome types extended). Prev/next + reading time already existed in legacy LessonLayout.jsx.
**P21.2 sidebar:** `src/features/curriculum/CourseTree.tsx` (tracks->courses->lessons, completion tick/lock/active) + `LearnLayout.tsx` (persistent left sidebar on xl, slide-over drawer <xl with backdrop/scroll-lock/close-on-route). Routes nested: App.jsx `/learn` now a layout route (index=LearnHome, :courseSlug=CourseView, :courseSlug/:lessonSlug=LessonView). Added @keyframes slideIn to styles/index.css.
**P21.3 difficulty taxonomy (P20 debt RESOLVED):** addCourse (both helpdesk 5-arg + sysadmin 3-arg) now take optional course.difficulty (default beginner/intermediate resp.); emit_content.py emits difficulty:'X' in course object; manifests patched per-course. Badges on lesson header + LearnHome cards. Map: nw-fundamentals=beginner; ws-active-directory/group-policy/hyperv/security/powershell/backup-ha + nw-routing/nw-security=advanced; rest sysadmin=intermediate; all t2-*=intermediate.

**Still deferred:** legacy useProgress localStorage in LessonLayout.jsx (setLastVisited + non-override completion) NOT retired — spine lessons use override; full retirement is a separate refactor. Original hand-written sysadmin/helpdesk courses keep default difficulty.

**NEXT: P22 engagement + global search** (skill-tree/learning-path view, streaks surfaced, onboarding, real content search over lessons). Then P23 authoring tooling + light/dark + a11y deepening. Pipeline: structured-lesson model + emit_content.py (<phase> config; now also emits difficulty).

## P20 HELP DESK TIER 2 — COMPLETE

Added a Tier 2 track to Help Desk (25 -> 45 lessons): **5 sub-courses / 20 lessons / 60 quizzes / 3 Tier 2 scenarios / 2 labs**, 2 diagrams. Gates green; migrations 0035/0036/0037/0038 validated + idempotent on PG16. Tier-1 untouched.

**Emitter generalized further:** `emit_content.py` now has per-phase `spine_style` ('sysadmin' 3-arg vs 'helpdesk' 5-arg addCourse). helpdesk courses need module_slug + module_title in the manifest. P18/P19 verified to regenerate identically. `// P20-GENERATED` region in helpdesk.ts.

**Sub-courses (t2- ids, track helpdesk, orders 20-24):** t2-windows-troubleshooting(5), t2-active-directory(4), t2-m365-admin(5), t2-network-troubleshooting(3), t2-itil-escalation(3). Areas: t2-windows, t2-ad, t2-m365, t2-network, t2-itil. Titled 'Tier 2: ...'; sort 4001-4020.
**Scenarios (0037):** sim-t2-boot, sim-t2-m365-license, sim-t2-vpn (4 stages each, Virtual Help Desk schema: scenarios/scenario_stages/scenario_options via CTE join on sort).
**Labs (0038):** lab-t2-ad-unlock (PowerShell AD recovery), lab-t2-winre (sfc/DISM/bootrec/chkdsk).
Author scripts /home/claude/p20_author_1..2.py -> p20_manifest.json -> emit_content.py p20.

**KNOWN DEBT:** helpdesk addCourse hardcodes difficulty:'beginner' -> Tier 2 distinguished by title only; a first-class tier/difficulty field is a P21 item.

**NEXT: P21 lesson-experience UX** (left sidebar course tree in /learn, in-lesson prev/next + TOC + reading time, more diagrams, callout components, and the tier/difficulty taxonomy). Then P22 engagement+search, P23 authoring tooling + light/dark + a11y. Structured-lesson model + emit_content.py are the reusable pipeline.

## P19 NETWORKING — COMPLETE

**P19 shipped:** 8 sub-courses / 35 lessons / 105 quizzes / 6 inline SVG diagrams / 2 capstone labs. Gates green; migrations 0032/0033/0034 validated + idempotent on PG16. Decisions taken: diagrams NOW (added `svg`+`caption` to LessonSection + StructuredLesson render) and emitter GENERALIZED (`emit_content.py <phase>` config-driven; index scans all area files; P18 parity verified). Sub-course areas: net-fundamentals, net-ipv4, net-ipv6, net-switching, net-routing, net-wireless, net-security, net-troubleshooting (ids `nw-*`, sort 3001-3035, `// P19-GENERATED` region in sysadmin.ts). Labs: lab-nw-subnet (exact-answer subnetting), lab-nw-cli (CLI tools). Subnetting math verified with Python (ipaddress). Author scripts /home/claude/p19_author_1..3.py -> p19_manifest.json -> emit_content.py p19.


Expand Networking 7 -> ~35 lessons on the **sysadmin track**, reusing the P18 structured-lesson pipeline. Existing courses stay untouched (protect progress): sysadmin `networking` course (7 lessons `networking-01..07`, module `networking-m1`, order 5) and helpdesk `networking-basics` (`net-01..03`).

**Locked design:**
- New lesson id prefix **`nw-`** (verified `net-` and `networking-` are taken — do NOT reuse).
- New spine region **`// P19-GENERATED-START/END`** in `sysadmin.ts`, separate from the P18 region so P18 is never touched.
- curriculum_lessons **sort_order base 3001**; track `sysadmin`.
- Migrations **0032** (curriculum_lessons), **0033** (quizzes), **0034** (labs) — idempotent, PG-validated.
- Vendor-neutral framing to avoid duplicating P18's Windows DNS/DHCP lessons.

**8 sub-courses (~35 lessons), each lesson = 3 quiz Qs + hands-on task:**
Network Fundamentals(5), IPv4 Addressing & Subnetting(6, incl. subnetting practice+VLSM), IPv6(3), Switching(5: Ethernet/MAC, VLANs, 802.1Q trunking, STP, port security), Routing(5: concepts, static, dynamic OSPF/EIGRP, inter-VLAN, NAT/PAT), Wireless(3), Network Security & Services(4: firewalls/ACLs, VPN/IPsec, segmentation, DHCP/DNS in-context), Monitoring/Tools/Troubleshooting(4: CLI tools, OSI method, packet analysis, SNMP/NetFlow/syslog).

**Labs (0034, sysadmin):** subnetting practice (regex answer-matching on computed network/broadcast/host), network CLI troubleshooting (ping/traceroute/nslookup/ipconfig/arp); optional 3rd VLAN/trunk sim.

**TWO OPEN DECISIONS before authoring:**
1. Inline-SVG diagrams now (recommended: add optional `svg` field to LessonSection, ~5 original diagrams — OSI/subnet/VLAN/routing) vs defer to P21.
2. Emitter: generalize `emit_p18.py` -> `emit_content.py <phase>` config-driven (recommended; P20 also needs it) vs clone to `emit_p19.py`.

**Enrichment note:** project repo has CompTIA Network+ / A+ study guides + networking PDFs — use them to cross-check subnetting math and terminology during authoring (optional, not mandatory).

**Reuse:** same manifest+emitter+StructuredLesson model as P18; author scripts pattern `p19_author_*.py` appending to a `p19_manifest.json`.

## PHASE 18 COMPLETE — Windows Server 2025 mastery expansion

Delivered the accepted WinServer expansion: **11 new sub-courses, 67 lessons, 201 quiz questions, 2 capstone labs.** Gates green; migrations 0029/0030/0031 validated + idempotent on PG16.

**Data-driven lesson model (P18.1) — reusable for future big content sets:**
- `src/content/lessons/model.ts` = `LessonContent {intro, sections:[{h,p?,ul?,code?,note?}], practice?}` (Bullet = string | {b,t}).
- `src/content/lessons/StructuredLesson.tsx` renders it to the same semantic markup as JSX bodies (inherits `.lesson-content`), with tip/warn/info notes, code blocks, and a "🧪 Try it yourself" practice callout.
- `src/content/lessons/structured/*` = generated per-area maps aggregated in `index.ts` into `structuredLessons`.
- `getLessonBody(id)` (registry.ts) tries the JSX registry first, then falls back to `structuredLessons[id]` via `createElement(StructuredLesson,{content})` (registry stays .ts). Existing JSX lessons untouched.

**Generation pipeline (idempotent, re-runnable):**
- Manifest `/home/claude/p18_manifest.json`; emitter `/home/claude/emit_p18.py` writes structured TS + replaces spine region between `// P18-GENERATED-START/END` in `sysadmin.ts` (addCourse blocks, track sysadmin) + writes seeds 0029 (curriculum_lessons, sort_order 2001+) and 0030 (lesson_quizzes 70/30 + quiz_questions).
- Authoring scripts `/home/claude/p18_author_1..5.py` append courses to the manifest; re-run all authors + emitter to rebuild. (These live in /home/claude, NOT in the repo/zip.)

**Sub-courses (ids):** ws-foundations(6), ws-active-directory(8), ws-group-policy(6), ws-dns-dhcp(7), ws-file-storage(6), ws-hyperv(6), ws-security(7), ws-powershell(6), ws-backup-ha(5), ws-remote-access(5), ws-monitoring(5). Original 12-lesson `windows-server-2025` course retained unchanged (protects existing progress).

**Capstone labs (0031, sysadmin track):** `lab-ws-ad-ps` (bulk AD via PowerShell, 7 steps), `lab-ws-dns-dhcp` (stand up DNS+DHCP, 7 steps). Lab command matching made **case-insensitive** (LabPlayer.tsx: `new RegExp(pattern,'i')`) — safe, only loosens existing lowercase patterns.

**Next per IMPROVEMENT-PLAN:** P19 Networking (7→~35), P20 Help Desk Tier 2, P21 lesson-UX (sidebar/prev-next/TOC/diagrams), P22 engagement+search, P23 authoring tooling + light/dark + a11y. The P18 structured model + emitter should be reused/generalised for P19/P20.

## ACCEPTED DIRECTION — mastery/job-readiness, depth over breadth (see docs/IMPROVEMENT-PLAN.md)

Stan wants the curriculum expanded substantially; several sections are too shallow. Locked expansion targets:
- **Windows Server 2025: 12 -> ~75 lessons**, split into sub-courses (Foundations/Install, Active Directory, Group Policy, DNS & DHCP, File & Storage, Hyper-V, Networking & Remote Access, Security & Hardening, PowerShell Automation, Backup/Recovery/HA, Monitoring & Troubleshooting, Capstone projects) + labs + enterprise scenarios + a project per sub-course.
- **Networking: 7 -> ~35 lessons** (OSI/TCP-IP, IPv4 subnetting multi-lesson, IPv6, switching/VLAN/STP, routing, wireless, services, VPNs, firewalls, WAN, monitoring, packet analysis, troubleshooting) + CLI/subnetting/packet labs.
- **Help Desk: 25 -> ~45**, add a **Tier 2 Support** track (advanced Windows troubleshooting, advanced AD, M365 admin incl. Intune, ITIL/escalation, scripting for support, print server, endpoint mgmt) + Tier 2 scenarios/labs/projects.
- Cross-platform: grow labs 3->20+, scenarios 7->25+, interview Qs 12->60+, doc exercises 3->15+; each lesson should end with a hands-on task, not just a quiz; add per-track capstone PROJECTS.

**Design/UX accepted:** group Academy menu into Learn/Practice/Career; left sidebar course tree in /learn; global content search; in-lesson prev/next + TOC + reading time; reusable callout/code components; **add SVG diagrams to lessons** (currently text-only); readable max line length + type scale; surface streaks/daily goal + skill-tree/learning-path view + badge showcase; first-run onboarding; light/dark toggle; deeper a11y (ARIA live quiz results, keyboard flow, focus mgmt on route change, reduced-motion); consider a content-authoring generator/CLI to speed the manual lesson pipeline.

**Build sequence:** P18 WinServer expansion, P19 Networking, P20 Help Desk Tier 2, P21 lesson-experience UX, P22 engagement + search, P23 authoring tooling + light/dark + a11y. Each phase buildable + validated migrations (continue from 0028) + ZIP.

**Also decided (P17.1):** grade-doc Edge Function is OPTIONAL — /practice degrades to intentional self-assessment mode without it; not required to launch. Docker not required to deploy functions (only the local emulator needs it) — deploy via `npx supabase functions deploy`, or run the function directly with Deno against the hosted project.

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
