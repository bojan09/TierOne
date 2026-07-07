# Memory — TierZero (through Phase 30)

Last updated: 2026-07-06

## P31 THEME POLISH + ONBOARDING GRID
Light overlay now uses [class*=...] attribute selectors so opacity variants (bg-surface-800/40 etc.) also flip in light mode. Onboarding track list -> responsive grid (sm:grid-cols-2) for 4 tracks. Search index verified covering comptia + scripting (structured body text). Gates green.

## P30 A+ LABS + LIGHT THEME (beta)

**A+ labs (migration 0051):** lab-ca-win-cli (dir/ipconfig /all/ping/sfc /scannow/chkdsk), lab-ca-net-ts (ipconfig /all->ping gateway->ping 8.8.8.8->nslookup->flushdns). track=comptia, 2 labs/10 steps. Validated PG16 idempotent.
**Light theme (beta):** CSS-overlay approach (NOT full tokenization). src/features/theme/theme.ts (initTheme/currentTheme/toggleTheme; data-theme on <html>, localStorage 'theme', prefers-color-scheme default). ThemeToggle.jsx (sun/moon) in Navbar. initTheme() called in main.jsx pre-render. index.css appended html[data-theme=light] overrides for bg-surface-*/text-white/text-slate-*/border-surface-*/.card/.glass/.btn-secondary/.code-block. DARK UNTOUCHED (overrides scoped to [data-theme=light]).
KNOWN LIMITS (light beta): opacity variants (bg-surface-800/40 etc.) not overridden (escaped class names) -> minor visual gaps; not full semantic tokenization; NEEDS dev visual QA + polish. A proper tokenization refactor remains the 'correct' long-term path.
Migrations through 0051. Tracks: helpdesk, sysadmin, comptia, scripting.
**REMAINING:** onboarding selector rework (4 tracks); light-theme polish (opacity variants, per-page QA); server tz-aware 'today'; useProgress.js shim by design.## P29 SCRIPTING & AUTOMATION TRACK — COMPLETE

FOURTH track 'scripting'. Same pattern as comptia. Migration 0047 (enum add 'scripting'); Track type common.ts+database.ts; spine src/content/curriculum/scripting.ts (track:'scripting', default beginner, // P29-GENERATED); curriculum/index.ts includes scriptingCourses/Modules/Lessons; emitter p29 config (spine_style sysadmin, sort_base 6000, migs 0048/0049). TRACK_LABELS/ORDER updated (scripting:'Scripting & Automation') in CourseTree/LearnHome/Dashboard; Onboarding 4th option added.
**Content:** 2 courses (sc-powershell-scripting, sc-python-scripting), 12 lessons (sc-ps-01..06, sc-py-01..06), 36 quizzes, code examples in lessons. Author /home/claude/p29_author.py (+scripts/). manifest scripts/manifests/p29.json. sort 6001-6012.
**Labs (migration 0050):** lab-sc-ps (PowerShell pipeline: Get-Command/Get-Process/Where/Select/Export-Csv), lab-sc-py (python --version/print/for-range/pip install/python file.py). 2 labs, 10 steps. NOTE: SQL single-quote escaping needed for print('...') hint (doubled quotes). Validated PG16, idempotent.
**Migrations through 0050.**

**OPEN FOLLOW-UPS (still):** LIGHT THEME (dedicated QA'd pass — needs npm run dev); ONBOARDING SELECTOR rework now that there are 4 tracks (stacked cards work but not ideal); A+ labs (A+ still lesson-only); server tz-aware 'today'; useProgress.js shim by design.
Tracks now: helpdesk, sysadmin, comptia, scripting.## P28.1 A+ EXPANSION — COMPLETE. 36 lessons / 108 quizzes.
Appended 3 lessons per A+ domain (ids ca-hw-04..06, ca-net-04..06, ca-mc-04..06, ca-os-04..06, ca-sec-04..06, ca-ts-04..06). Author: /home/claude/p28_expand.py (also scripts/) — loads scripts/manifests/p28.json, appends, re-emits. Seeds 0045/0046 regenerated (36/108), validated PG16. sort still 5000-block. Extensible.

**OPEN FOLLOW-UPS (user-flagged):**
- SCRIPTING TRACK (PowerShell + Python) — user explicitly wants scripting in BOTH. Recommend NEW 'scripting' track (same proven pattern as comptia): extend Track enum, new spine, emitter target, track maps. PowerShell line (basics->cmdlets->pipeline->scripting->automation) + Python line (basics->control flow->files->automation/APIs). Ground in repo PowerShell_7Day_Guide.docx + PowerShellBeginnerCheatSheet.pdf. NOTE existing ws-powershell (P18 sysadmin) + legacy 'python' course.
- LIGHT THEME — dedicated QA'd pass (semantic tokens + opacity-safe codemod; needs npm run dev visual QA).
- ONBOARDING 3rd option — added comptia as 3rd onboarding track this session; revisit for polish + whether scripting becomes 4th (selector UI may need rework at 4 tracks).
- A+ labs (track is lesson-only; add CLI/troubleshooting sims via LabPlayer).
Migrations through 0046.## P28 COMPTIA A+ TRACK (#1) + CLEANUP (#3) — COMPLETE. LIGHT THEME (#2) DEFERRED.

**New track 'comptia' (#1):** THIRD track added. Track type extended in shared/types/common.ts + database.ts; PG enum via migration 0044 (`alter type public.track add value if not exists 'comptia'`). New spine src/content/curriculum/comptia.ts (modeled on sysadmin.ts, track:'comptia', default difficulty beginner, // P28-GENERATED region). curriculum/index.ts includes comptiaCourses/Modules/Lessons. Emitter p28 config in scripts/emit_content.py (spine_style='sysadmin', spine=comptia.ts, track='comptia', sort_base=5000, migs 0045/0046). TRACK_LABELS/ORDER updated in CourseTree, LearnHome, Dashboard (comptia:'CompTIA A+ (Certification)'); Onboarding got 3rd track option.
**Content:** 6 sub-courses / 18 lessons / 54 quizzes, ca- ids, sort 5001-5018, beginner. Areas: ca-hardware, ca-net, ca-mc, ca-os, ca-sec, ca-ts. Author: /home/claude/p28_author.py (also copied to scripts/). manifest scripts/manifests/p28.json. Validated PG16 (track=comptia, 18/54). Extensible — add lessons to p28.json + re-emit.
**Cleanup (#3):** deleted src/hooks/useLocalStorage.js (unused after P24-M2).
**Migrations through 0046.**

**LIGHT THEME (#2) — DEFERRED (honest call):** needs semantic-token migration across ~128 files (text-white/text-slate/bg-surface + opacity modifiers like bg-surface-800/40 which break under arbitrary CSS-var values). Blind codemod risks breaking DARK too; can't visual-QA here. PLAN for dedicated pass: (1) define semantic CSS vars in :root(dark, =current hex so dark identical) + [data-theme=light]; (2) opacity-safe codemod mapping raw utils->semantic tokens (handle /opacity via rgb(var(--x)/a)); (3) toggle + prefers-color-scheme + persist; (4) programmatic WCAG-AA contrast check; (5) developer visual QA. Do with `npm run dev` available.
**Other deferred:** server tz-aware 'today'; useProgress.js shim (by design). UI needs dev visual pass (new A+ track in /learn, onboarding 3rd option).
## P27 REVIEW POLISH — COMPLETE. NOTE: product is a FREE webapp (no monetization).

**Migration 0043:** split review grading from scheduling.
- grade_review(p_lesson_id,p_answers) -> jsonb {score_pct,correct,total,passed,pass_pct,results}. READ-ONLY (no writes/schedule). Mirrors old grading.
- schedule_review(p_lesson_id,p_quality int) -> jsonb {interval_days,next_due}. p_quality 0=Again/1=Hard/2=Good/3=Easy -> SM-2 q=1/3/4/5; same SM-2 as 0042. Trusts self-rating (no pass floor).
- DROP submit_review(text,integer[]) (retired; replaced by grade+schedule).
Validated PG16: grade read-only; Easy 1->3; Again resets to 1; idempotent.
**Client:** review/api.ts now gradeReview + scheduleReview (removed submitReview). Review.tsx = two-step flow: answer -> Check answers (gradeReview, shows correctness) -> 'How well did you recall?' Again/Hard/Good/Easy (keys 1-4, useCallback rate) -> scheduleReview -> next-due -> Next. refresh() after schedule to update badge.
**Surfacing:** Navbar 🔁 badge (dueReviewCount>0 -> Link /review) — added dueReviewCount to Navbar's useAcademyProgress destructure. LearnLayout ReviewPill component ('N due for review' Link) above DailyGoal in persistent sidebar + drawer.

**Migrations through 0043.** dueReviewCount already in provider/context from P26.
**PRODUCT = FREE webapp** -> monetization dropped from roadmap. Next value levers: content expansion (versioned pipeline), more review/analytics polish, light theme (P23 deferred), a11y. 
**DEFERRED/DEBT:** light theme; server tz-aware 'today'; useProgress.js shim + useLocalStorage.js unused cleanup. UI needs dev visual pass (/review rating flow, navbar badge, /learn pill).
## P26 SPACED-REPETITION REVIEW — COMPLETE

**Schema/RPCs (migration 0042):** review_schedule(user_id,lesson_id,due_at,interval_days,ease,reps,lapses,last_reviewed_at) PK(user_id,lesson_id), RLS select-own; writes via SECURITY DEFINER only. Simplified SM-2.
- get_due_reviews() -> table(lesson_id,due_at,reps): distinct passed lessons (from quiz_attempts) left join review_schedule where unscheduled OR due_at<=now(). LAZY seeding (submit_quiz untouched).
- submit_review(p_lesson_id,p_answers int[]): grades server-side (mirrors submit_quiz answer-check; answers never client-side), SM-2 (q=floor(pct/20); q<3 lapse->interval=1,reps=0,lapses++; else reps++, interval 1/3/ceil(interval*ease); ease=greatest(1.3, ease+(0.1-(5-q)*(0.08+(5-q)*0.02)))). Returns {score_pct,correct,total,passed,pass_pct,results,interval_days,next_due}. NO XP, NO quiz_attempts insert (mastery stats stay first-pass). Validated PG16: due->review->out; pass intervals 1->3->9; idempotent.
**Client:** src/features/review/api.ts (getDueReviews, submitReview reusing quiz QuizResultItem). src/features/review/Review.tsx = /review session page (loads due queue, per-lesson get_lesson_quiz -> render -> submit_review -> next-due -> Next; resolves titles via getLessonAndCourseById; refresh() after submit to update badge). Route /review inside RequireAuth (App.jsx).
**Provider:** dueReviewCount added (5th parallel query client.rpc('get_due_reviews'); count via cast (dueRes.data as unknown[]).length). Exposed in context (AcademyProgressValue.dueReviewCount).
**Surfaced:** searchIndex PAGES += Review (/review, 🔁); Dashboard prompt card when dueReviewCount>0. Note: typed-client rpc/update need `as never` / `as unknown[]` casts.

**Migrations through 0042.**
**DEFERRED/DEBT:** light theme (P23); server timezone-aware 'today' count; useProgress.js shim + useLocalStorage.js unused cleanup; review could later surface a nav badge + due count on /learn sidebar. UI needs dev visual pass (/review flow, Dashboard prompt).
## P25 ONBOARDING + DAILY-GOAL LOOP — COMPLETE

**Persistence (migration 0041):** profiles += daily_goal(int default 1) + onboarded_at(timestamptz); track already existed. Extended column grant: `grant update (display_name, track, daily_goal, onboarded_at)`. Self-update RLS already present -> client writes prefs directly (safe, user-owned; NO RPC). Validated PG16 idempotent.
**Auth:** Profile type (shared/types/user.ts) += dailyGoal, onboardedAt. AuthProvider mapProfile + select ('...daily_goal, onboarded_at...') updated. Added `updateProfile(patch:{track?,dailyGoal?,onboardedAt?})` to AuthContextValue (types.ts) — updates profiles + optimistic setProfile; uses `update(row as never)` cast for typed client.
**Onboarding flow:** src/features/onboarding/Onboarding.tsx (3 steps: track -> daily goal(1/2/3) -> confirm; writes prefs + onboardedAt=now, routes to track's first lesson via getOrderedLessons/lessonHref). Route `/welcome` added inside RequireAuth in App.jsx.
**Guard:** Layout.jsx effect — if session && profile && !profile.onboardedAt && path not in {/welcome,/login,/auth} -> navigate('/welcome',replace). Existing users see it once.
**Daily-goal loop:** ProgressProvider derives todayCompleted from lesson_progress.completed_at (added completed_at to select; count where new Date(completed_at).toDateString()===today). Exposed todayCompleted in context. src/features/progress/DailyGoal.tsx (today vs profile.dailyGoal + streak, celebratory when met) placed in LearnLayout sidebar (persistent+drawer, above StreakTracker) + Dashboard sidebar.

**Migrations through 0041.**
**DEFERRED/DEBT:** light theme (P23); spaced-repetition review (recommended next); server-side timezone-aware 'today' count (MVP uses client-local); useProgress.js shim + useLocalStorage.js unused (cleanup). UI needs dev visual pass (/welcome flow, DailyGoal, redirect guard).
## P24 M3 + DASHBOARD REFRESH — COMPLETE

**Dashboard refresh:** src/pages/Dashboard.jsx rewritten (634->~165 lines) spine+server-driven via useAcademyProgress + curriculum + selectors (courseHref/getOrderedLessons). Real level (getLevelForXP), XP-to-next, streak, lessons done (completedSet.size), quizzes passed (quizStats.passed), badges (BADGES meta filtered by stats.earnedBadges), per-track course progress bars. Signed-out CTA. Reuses StreakTracker + StudyTimer. Removed ALL hardcoded deleted-course data. Dashboard content-staleness debt RESOLVED.

**M3 activity heatmap (migration 0040):** user_activity(user_id, activity_date) PK(user_id,activity_date), RLS select-own only; writes via SECURITY DEFINER. Folded `insert into user_activity (…current_date) on conflict do nothing` into set_last_lesson (recreated in 0040) — opening any lesson marks the day. ProgressProvider: 4th query fetches user_activity >= today-13, builds activityDates:Set<string> (toDateString), exposed in context (AcademyProgressValue.activityDates). StreakTracker.jsx now uses activityDates for the 7-day grid (real, not single-date approximation); getLast7Days already returns toDateString so membership matches. Validated on PG16 (idempotent per day).

**Migrations now through 0040.**

**REMAINING DEFERRED (all documented, none blocking):** onboarding (P22); light theme (P23; needs semantic-token refactor + visual QA); useProgress.js kept as server-backed shim by design (deleting = rewrite 7 consumers, zero gain); useLocalStorage.js now unused (safe to delete later). No open build issues. UI needs dev visual pass (new Dashboard, streak heatmap).
## P24 M2 — LOCALSTORAGE PROGRESS RETIRED (server-authoritative everywhere) — COMPLETE (no DB changes)

Goal achieved: `tierzero_progress` localStorage / per-device state ELIMINATED. All XP/level/streak/badges/completion now server-sourced across every consumer. Gates green.
- **useProgress.js is now a SERVER-BACKED SHIM** over useAcademyProgress (same API: {state, addXP(no-op), completeLesson->server, saveQuizScore(no-op), setLastVisited->setLastLesson, reset(no-op)}; state derives completedLessons/completedCourses/quizScores/totalXP/streak/earnedBadges from server). LEVELS/getLevelForXP/BADGES still exported from it. So NO consumer imports changed.
- **Direct-localStorage readers migrated:** Navbar (now stats.totalXp; removed storage/xp-earned listener), StatsBar (useProgressStats uses shim), CoursePage (useLocalStorage->useProgress shim).
- **Deleted** dead components/Quiz.jsx. **Redirected** legacy /certificate -> /certificates (Certificate.jsx = <Navigate replace>). StudyTimer addXP now no-op.
- `tierzero_progress` grep = NONE in src. useLocalStorage.js now unused (left in place).

**KNOWN / DEFERRED:**
- useProgress.js FILE kept as shim by design (deleting = rewrite 7 consumers to useAcademyProgress for zero gain). LessonLayout still uses shim for non-override completion (2 legacy JSX lessons: what-is-it-support, malware-and-phishing render LessonChrome w/o override -> now server via shim).
- Dashboard.jsx still has STALE hardcoded course cards (deleted-course ids); stats are server-driven now but course list outdated -> separate content refresh task.
- M3 optional: user_activity table for accurate 7-day streak heatmap.
- Other deferred: onboarding, light theme.
Migrations still through 0039. No open build issues; UI needs a dev visual pass (Navbar XP, StatsBar, Dashboard, CoursePage).
## P24 M1 — SERVER-AUTHORITATIVE STREAK & RESUME — COMPLETE

Key finding: **server streak already existed** (user_stats.streak via _recompute_user_stats in 0002) — the UI was reading the localStorage copy. Fixed by repointing.
- **Streak:** StreakTracker.jsx now reads useAcademyProgress().stats.streak (+ normalize lastStudyDate via new Date().toDateString()). Cross-device now.
- **Resume (server):** migration **0039** adds user_stats.last_lesson_id + `set_last_lesson(p_lesson_id text)` SECURITY DEFINER RPC (writes only auth.uid(); inserts default stats row if none). Provider (ProgressProvider.tsx): StatsRow/UserStats += lastLessonId (mapper), added `setLastLesson` method + exposed in context (context.ts AcademyProgressValue). LessonView records on mount (useEffect on lessonId). ResumeBanner.jsx rewritten server-driven — resolves via getLessonAndCourseById (new selector) + lessonHref (no stale hrefs). Removed duplicate ResumeBanner from LearnHome (Layout renders globally).
- Validated on PG16 (create+update+idempotent).

**M2 REMAINING (useProgress full retirement):** LevelBadge.jsx, legacy Quiz.jsx, legacy Dashboard.jsx, Certificate.jsx still use useProgress (localStorage). LessonLayout.jsx still has dead setLastVisited localStorage write (harmless; remove with hook). Then delete src/hooks/useProgress.js + tierzero_progress. Audit legacy Dashboard/Certificate (may be redundant with server-driven views) before migrating.
**M3 OPTIONAL:** user_activity(user_id, activity_date) table for accurate 7-day heatmap (currently single last_study_date approximation).

**Migrations now through 0039.** Other deferred debt unchanged: onboarding, light theme.
## P23 A11Y & AUTHORING TOOLING — COMPLETE (no DB changes); LIGHT THEME DEFERRED

**P23.1 a11y:** Layout.jsx focuses `<main>` (tabIndex=-1, preventScroll) on route change + reduced-motion-aware scrollTo; Quiz.tsx result `<p>` now role=status aria-live=polite (announces score + pass/fail); color-scheme:dark in index.css. SkipLink + global prefers-reduced-motion/forced-colors already existed.
**P23.2 tooling — PIPELINE NOW VERSIONED IN REPO (was sandbox-only, a real risk):** `it-academy/scripts/emit_content.py` (portable, repo-relative; reads scripts/manifests/<phase>.json; regenerates P18-20 identical), `scripts/validate_content.py` (id/sort collision + shape checks, exits 1 on error; verified catches dup ids), `scripts/new_phase.py` (scaffolder), `scripts/manifests/{p18,p19,p20}.json`, `docs/CONTENT-PIPELINE.md`. Sandbox /home/claude/emit_content.py + pXX_manifest.json still exist but the REPO copies are now canonical.
**P23.3 light/dark DEFERRED (deliberate, evidence-based):** raw scale tokens (text-white/text-slate/bg-surface) across ~128 files => needs semantic-token refactor + visual QA; blind light theme would ship broken (invisible text). Path documented: semantic CSS vars -> component migration -> toggle (prefers-color-scheme+persist) -> programmatic WCAG contrast. Do as its own phase.
**Also shipped this session:** vercel.json (SPA rewrite fixed /auth/callback 404 on Vercel + migrated security headers from ignored public/_headers).

**REMAINING DEBT:** legacy useProgress localStorage (resume/streak, LessonLayout); server-authoritative streak; onboarding (deferred P22); light theme (deferred P23); original hand-written courses keep default difficulty. No open build issues.
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
