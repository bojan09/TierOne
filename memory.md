# Memory — TierZero (through Phase 32 + roadmap)

Last updated: 2026-07-10

## P39 PHASE 5 PERF — supabase async code-split + font non-blocking
ROOT CAUSE of Lighthouse mobile LCP 4.0s / unused-js 223KB / mainthread-work 7.5s: `main.jsx` statically imports AuthProvider -> supabase.ts -> `@supabase/supabase-js` at module scope. Despite `vendor-supabase` already being its own manualChunks bucket, a STATIC import chain still forces the browser to fetch+parse+execute that whole chunk (207KB/54KB gzip) before React can render ANYTHING — including the hero (LCP element) — because ESM static imports are resolved before dependent code runs.
FIX: `shared/lib/supabase.ts` — `getSupabaseClient()` now dynamically `import('@supabase/supabase-js')`, memoized via a shared promise; genuine async chunk boundary, not just a build-time bucket. Verified in dist/index.html: vendor-supabase dropped OUT of `<link rel=modulepreload>` entirely (only vendor.js + vendor-react.js remain preloaded) — confirms it's now truly deferred, loaded only once `getSupabaseClient()` is actually called (inside AuthProvider/ProgressProvider's mount effect, i.e. AFTER first paint commits). Critical-path gzip JS: ~218KB -> ~165KB (53KB / ~24% cut from what blocks LCP).
Blast radius: `getSupabaseClient()` is now `Promise<Client>` not `Client` — updated all 12 call sites. 9 api.ts files (analytics/certificates/docs/exam/interview/quiz/labs/scenario/review) were already `async function` bodies calling `const client = getSupabaseClient()`; mechanical `await` insertion via sed, confirmed complete by clean `tsc --noEmit` (would've flagged any missed site). AuthProvider.tsx + ProgressProvider.tsx restructured from `useRef`-cached-sync-client to `useEffect`-resolved-async-client (session/profile effects gated behind the resolved client; user-triggered actions — signIn/signUp/signOut/updateProfile — each `await getSupabaseClient()` directly rather than depending on a possibly-not-yet-resolved shared ref, so a user clicking "Sign in" during the first ~100ms isn't hit with a false "not configured" error).
Font loading (index.html): Google Fonts `<link rel=stylesheet>` was render-blocking (~550ms per Lighthouse render-blocking-insight). Converted to `<link rel=preload as=style onload="...rel='stylesheet'">` + `<noscript>` fallback — hero text now paints in fallback font immediately, swaps to Sora once it arrives (display=swap already present). BONUS bug fix found while trimming: weight list was `300;400;500;600;700;800` but `font-black` (900) is used throughout the app (Home hero, StudyTimer, DocPractice, etc.) and was NEVER loaded — silently rendering as synthetic-bold 800 this whole time. New list: `400;500;600;700;800;900` (dropped unused 300/light, added missing 900/black).
Verified: typecheck/lint/build green; dist/index.html confirms both fixes present; fresh dev-server restart + Home renders full content instantly + zero server errors; /login renders full working form (email/password/Google/magic-link/signup) confirming the async auth refactor didn't break the auth surface. 
NOTE: console_logs tool showed a batch of AuthProvider/ProgressProvider "error occurred" entries with `?t=` HMR timestamps that were IDENTICAL across a full dev-server restart (new serverId, fresh process) — since Vite's `?t=` is `Date.now()`-based, identical values surviving a process restart is only possible if it's stale buffered log data being replayed, not a real recurring error. 3rd occurrence of this exact tool artifact this session (also seen in P34, P38) — server-side logs clean each time, DOM/a11y-tree renders fully correct each time. Treating as a known tool quirk, not a product bug.

## P38 MEGA-MENU MODERNIZED
Courses mega-panel (Navbar.jsx MegaPanel): was flat 3-col dropdown, no per-category distinction, and — real content-discovery gap — never surfaced the 25-lesson Scripting track or CompTIA A+ track (only legacy single-page /powershell, /python etc). FIX: added 4th column "Certifications & Tracks" (CompTIA A+ → /learn/ca-hardware, PowerShell Track → /learn/sc-powershell-scripting, Python Track → /learn/sc-python-scripting, all "· new" tagged). Each of the 4 columns now has a `color` (Windows violet #8b5cf6, Linux/Unix orange #fb923c, Infrastructure cyan #22d3ee, Certs emerald #34d399) driving a `track-accent-bar` top strip + tinted icon tile (reuses P34's `--tc`/color-mix pattern). Panel widened 700px→820px for 4 cols. Footer got a subtle aurora-tinted gradient strip. typecheck/lint/build green; verified via computed-style eval (accent bars render correct per-column gradients) + a11y tree (all 27 panel links present, correct hrefs) — screenshot tool was hung this session, non-blocking. NOTE: console_logs tool showed a stale "TRACK_META redeclared" HMR error that did NOT reproduce in a fresh `npm run build` or in the actual file (verified via Read) — confirmed same stale-buffer artifact as the P34 incident (buffer persists across reload/server-restart independent of real page state); a11y tree rendering 48 clean interactive elements proves the page is not actually broken.

## P37 PHASE 2 VISUAL ROLLOUT COMPLETE — CourseTree + Dashboard
Extended trackMeta.ts with TRACK_LABELS (long section headings) + TRACK_ORDER — now the single source for all 4 curriculum-browsing surfaces. Deduped 3x-copied TRACK_LABELS/TRACK_ORDER out of CourseTree.tsx + Dashboard.jsx (LearnHome already done in P36). Applied track color: CourseTree section dot + active-lesson highlight (was hardcoded brand/10); Dashboard section dot + per-course progress bar + `.track-card` hover (was hardcoded bg-brand-500). Complete-state stays green everywhere (universal signal). 
SCOPE DECISION: lesson chrome/TOC (LessonChrome, LessonToc) intentionally NOT track-colored — single-course detail view has no cross-track comparison to disambiguate, brand purple stays correct there. Track-color system now covers all multi-track browsing surfaces: Home, /learn, CourseTree sidebar, Dashboard. Phase 2 (UI/UX visual consistency) rollout considered done.
typecheck/lint/build green. Dashboard + CourseTree are auth-gated, could not screenshot-verify live — reuse identical `--tc`/`.track-card` pattern already visually confirmed on Home.

## P36 TRACK-COLOR ROLLOUT TO ACADEMY HUB (DRY)
Extracted per-track color map out of Home.jsx into shared `src/features/curriculum/trackMeta.ts` (TRACK_META/DEFAULT_TRACK_META/trackMeta()) — single source of truth for the P34 track-color system, mirrors tailwind `track.*` palette. Home.jsx now imports it (was a local dup). Applied to `/learn` Academy hub: LearnHome.tsx section headings get a colored dot per track; LearningPath.tsx timeline rail "active" node + progress-bar fill now use the track's accent color via `--tc` (same custom-prop pattern as Home's `.track-card`), course card gets `.track-card` hover glow. Complete-state stays green (universal "done" signal, not track-tinted — intentional). typecheck/lint/build green. NOTE: /learn is auth-gated, could not screenshot-verify live; change reuses the exact pattern already visually confirmed on Home cards.

## P35 LOGO + MOBILE THEME TOGGLE + FAVICON
Bug: ThemeToggle was `hidden lg:flex`-only → invisible mobile/tablet. Fix: moved into new `lg:hidden` cluster next to hamburger (Navbar.jsx). Logo: was 3 divergent inline copies (Navbar old chevron-on-flat-blue, Footer different mark, drawer reused Navbar's) → unified `src/components/Logo.jsx` (ascending-tier bars + ring glyph on aurora gradient tile, matches P34 identity), used by Navbar/drawer/Footer. `.logo-zero` theme-aware CSS class for wordmark tint. Favicon (public/favicon.svg) rebuilt to match — cache-busted `?v=3` in index.html. Also fixed hardcoded "0 XP earned" in mobile drawer → real `stats.totalXp`. Verified via a11y tree at 375px (screenshot tool was hung, non-blocking); build/lint/typecheck green.

## P34 REDESIGN — "Terminal Aurora" + prod Lighthouse + bug fixes
PROD Lighthouse (tier-one-tau.vercel.app): desktop perf 97 / mobile 82, a11y 96, BP 100, SEO 100. Mobile weak: LCP 4.0s, render-blocking CSS ~550ms, unused-css 11KB, unused-js 223KB (Phase 5 targets). a11y fails: color-contrast + label-content-name-mismatch. agentic: llms.txt format.
FIXED bugs: (1) **invisible .btn-secondary in light mode** — `text-slate-200` is @applied internally so the attribute-overlay couldn't reach it → light-grey-on-light-grey. Added explicit `html[data-theme=light] .btn-secondary` override (bg #fff, text #1e293b). (2) **Home TRACK_TABS missing comptia+scripting** (only 3 of 4 tracks filterable) → added all 4. (3) stale hero "Two tracks" → "4 tracks". 
REDESIGN (Terminal Aurora): brand palette → electric indigo-violet (#6d5cf5; was flat #3b62f6); glow shadows re-hued. Added accent.violet + **track color system** (helpdesk=cyan, sysadmin=violet, comptia=emerald, scripting=amber) for "color order". tailwind: aurora + shimmer-x keyframes, backgroundSize.aurora. index.css (src/styles/ — the LIVE one): `.aurora-bg` animated mesh (light variant + reduced-motion), `.grid-overlay` masked grid, `.aurora-text` gradient, `.terminal-window/.terminal-bar/.terminal-body` motif (pinned dark in light theme), `.track-accent-bar/.track-chip/.track-card` via `--tc` + color-mix, `.blink-cursor`. btn-primary → gradient. Home hero rewritten: 2-col (copy + terminal ticket demo), aurora bg, real spine stats (4/50/337/337), fixed copy. CourseCard → per-track accent bar + tinted icon + track chip + colored hover glow. typecheck+lint+build green, 54 cards render, no runtime errors (324 console errs were 1 stale HMR snapshot, non-reproducing).
NOTE: root /index.css (894 lines) is DEAD — main.jsx imports src/styles/index.css. Flag for Phase 6 cleanup. HERO 2-col only shows >lg (browser pane ~800px shows stacked).

## P33 IT MODELS → REAL ROUTES (supersedes P7 ?m= fix)
User re-flagged IT Models dropdown ("every button same page"). P7's `?m=slug` query-param tabs were the half-measure. FIX: real nested routes `/it-models/:model`. routes.jsx: shared `ITModels` lazy const, added `it-models` + `it-models/:model` entries. ITModels.jsx: param-driven via `useParams()`, MODELS registry [{slug,tab,tagline}], per-model H1+tagline+breadcrumb (`Home / IT Models / <name>`), tabs are `<Link>` w/ `aria-current="page"`, bare/unknown slug → `<Navigate to="/it-models/osi" replace>`. Removed useSearchParams/useState tab logic. Navbar hrefs `/it-models?m=x` → `/it-models/x`. typecheck+build green. Content dicts (OSI/TCP/ITIL/CIA/ZeroTrust/DevOps) unchanged.

## P1 DONE — Footer.jsx rewritten spine-driven (stats from curriculum: Tracks/Courses/Lessons/Quizzes), brand=TierZero, real 4 tracks->/​learn, real tools (labs/review/simulator/interview/glossary), platform (/learn,/dashboard,/certificates,/search), featured=first course per track via courseHref, accurate free-beta copy, removed SysAdminPro/VMware/open-beta/Phase17/localStorage. Gates green.

## P2 DONE — Guided 'next step'. src/features/curriculum/NextStep.tsx: resolves resume (stats.lastLessonId if in-track & incomplete) else first incomplete lesson in profile.track; celebratory state when track complete. Placed top of LearnHome + Dashboard. Reduces overwhelm.

## P3 DONE — Practice exams. Migration 0052: get_exam(p_track,p_count) random N questions (no answers) join curriculum_lessons on track; submit_exam(p_ids bigint[],p_answers int[]) grades server-side, returns score/passed(>=70%)/results[{id,correct,correct_index}]. No XP/attempt. Validated PG16. Client: src/features/exam/{api.ts,Exam.tsx} — setup(pick track)->active(20 Q, 20min timer, auto-submit)->done(score+review w/ correct answers). Route /exam. Entries: searchIndex + Navbar Tools. Migrations through 0052.

## P4 (scripting) DONE — Scripting expanded 12->18 lessons (54 quizzes). PowerShell +error-handling/remoting-modules/real-scripts (sc-ps-07..09); Python +regex/apis/log-parsing (sc-py-07..09). Each advanced lesson has an 'In the real world:' info callout. Author /home/claude/p29_expand.py (+scripts/). Seeds 0048/0049 regenerated, validated PG16.

## P4b DONE — Tier 2 (helpdesk) expanded 20->30 lessons (90 quizzes). +2 per t2 course: profile/login+performance (win), gpo+lockouts (ad), exchange-mailflow+teams-sharepoint (m365), vpn+dns (net), effective-escalation+change-problem (itil). Each has 'In the real world:' callout. Author /home/claude/p20_expand.py (+scripts/). Seeds 0035/0036 regenerated, validated PG16.
## P4a INTERACTIVE — 3 new ticket sims (migration 0056): sim-vpn-remote, sim-lockout, sim-printer (4 stages/scored options each, existing scenario engine, no client change). Validated PG16 idempotent. Migrations through 0056. PHASE 4 REMAINING: guided-troubleshooting decision-tree feature (new); gamification/XP balance + achievements.

## P3a POWERSHELL EXPANSION — 9->25 lessons (sc-ps-10..25; +rest-apis,log-analysis,monitoring,backup,group-policy,troubleshooting,modules,capstone-onboarding). Authors p29_ps_expand.py + p29_ps_expand2.py.
Added sc-ps-10..17: files-folders, services-processes, events-registry, networking, ad-users, scheduled-wmi, data-formats, capstone(health report). Real-world callouts + code. Author /home/claude/p29_ps_expand.py (+scripts/). Seeds 0048/0049 regen, PG-validated. Scripting track=26 lessons/78 quizzes.
PS+PY BOTH 25 (scripting track=50 lessons/150 quizzes). 3b Python authors: p29_py_expand.py (sc-py-10..25: lists/dicts/csv/json/xml/apis-advanced/ssh-paramiko/networking/psutil-monitoring/email/file-automation/report-gen/ticket-automation/helpdesk-automation/sysadmin-project/capstone). 3c DONE: new p33 helpdesk phase (spine_style helpdesk, sort_base 7000, marker P33-GENERATED, migs 0054/0055). 3 courses/15 lessons (hd-essentials, hd-everyday, hd-tier1-win; ids hd-*). Helpdesk track=70 lessons. Author p33_author.py. PHASE 3 COMPLETE (scripting 50 + helpdesk expanded). Migrations through 0055. Optional future: more Tier2/base-course depth; interactive labs/sims (Phase 4).

## P2 (master roadmap) — UX/A11Y/PERF from Lighthouse
Lighthouse reports were DEV-SERVER runs (localhost:5173, unminified) -> perf 52/63 inflated (FCP 15s mobile is a dev artifact; prod/Vercel minified is far better). Real fixes done:
- SEO: added public/robots.txt (valid) + public/llms.txt (fixes robots-txt + llms-txt/agentic-browsing audits).
- A11y label-content-name-mismatch (52): removed course-card aria-label in Home.jsx (accessible name now derives from visible content).
- A11y color-contrast: narrowed light-mode keep-white rule to .btn-primary ONLY (was [class*=bg-brand-5/6] -> forced white text on translucent tint chips like review badge = ~1.24:1). Fixes the light-mode contrast failures.
- Perf code-splitting: App.jsx 16 eager feature imports -> React.lazy (Suspense already in Layout). Main chunk 392KB->291KB (-26%).
Gates green. REMAINING (note): re-run Lighthouse on PROD build for real perf numbers; dark-mode contrast on small text-brand-400/text-slate (pre-existing, needs focused token-bump sub-phase); search-button aria kbd; robots sitemap.xml not yet generated.

## P7 IT MODELS ROUTING FIX + MASTER ROADMAP
IT Models dropdown bug: all 6 items href '/it-models' -> same default tab. FIX: ITModels.jsx now URL-driven via useSearchParams ?m=slug (SLUG_TO_TAB: osi/tcpip/itil/cia/zero-trust/devops), useEffect reacts to param changes, selectTab updates ?m. Navbar hrefs -> /it-models?m=<slug>. All 6 tabs already had content. Gates green.
MASTER-PROMPT ROADMAP (user wants full platform expansion; phased). NOTE much already exists (4 tracks, exam/review/labs/onboarding/XP/light theme). Remaining big items:
- Ph2 UX/A11y/Perf audit (needs Lighthouse reports — user to provide).
- Ph3 CURRICULUM (biggest): Scripting PS 9->~25 + Py 9->~25 (full topic lists); Help Desk Tier0/1/2 expansion; +labs/scenarios/capstones. Via pipeline (emit_content).
- Ph4 Interactive: ticket sims, guided troubleshooting, decision trees, assessments, gamification/XP balance.
- Ph5 Perf: code-split/lazy/bundle/CWV per Lighthouse.
- Ph6 polish/e2e/docs.

## P6.1 LIGHT THEME — component-class text fix
Follow-up: attribute overlay [class*=text-white] can't reach classes that @apply text-white INTERNALLY (class attr = 'section-title', not 'text-white') -> section headings ('Popular starting points','All Learning Paths','Quick Access','Practice the job...') rendered white/invisible on light. FIX: explicit light overrides for component classes: .section-title/.stat-card-value/.info-card-title/.lesson-content h2/h3/strong/.callout-body strong -> #0f172a; .lesson-content p/li/blockquote + .tag -> #334155; .gradient-text stops darkened (#2563eb->#0891b2) for light. Gates green.

## P6 LIGHT THEME — PROPER TOKENIZATION (fixes color mismatch)
Root cause of light-mode breakage: CSS class-overlay couldn't override gradient/opacity/@apply card backgrounds -> course cards stayed dark navy w/ invisible text. FIX: tokenized the `surface` scale in tailwind.config.js to `rgb(var(--s-N) / <alpha-value>)`. index.css :root defines --s-950..500 = ORIGINAL dark values (dark byte-identical) + html[data-theme=light] redefines them as an INVERTED light ramp (page #f1f5f9, cards #fff, borders #e2e8f0/#cbd5e1). Now ALL bg/border/gradient(from/to)/opacity surface utilities + @apply .card flip automatically. Text overlay kept ([class*=text-white/slate-1/2/3]->#0f172a, slate-4/5/6->#475569) + KEEP-WHITE rule for .btn-primary/bg-brand-5/6 so button labels stay white. Old bulky per-utility overlay removed. Gates green. Dark unchanged.
NOTE: replaces P30/P31 overlay approach. Remaining light polish if QA finds edge cases: colored badges w/ text-white on accent (not brand) bg; verify chart/svg colors.

## P5 A+ DEPTH + EXAM HISTORY + ONBOARDING POLISH
- A+ depth2: +1 lesson/domain -> 42 lessons/126 quizzes (ca-*-07: bios-uefi, ports-protocols, cloud-models-deep, windows-tools, access-control, boot-recovery). Author p28_expand2.py. Seeds 0045/0046 regenerated. PG-validated.
- Exam history (migration 0053): exam_attempts table (RLS self) + submit_exam now (p_ids,p_answers,p_track) records attempt + get_exam_history(). Client: api getExamHistory + submitExam(track); Exam.tsx shows 'Recent attempts' on setup. Validated PG16.
- Onboarding selector polish: track cards with selected ✓ badge + ring-2 + equal height, aria-pressed.
Migrations through 0053.
ROADMAP P1-P4b COMPLETE. Remaining nice-to-haves: A+ more depth; light-theme full tokenization (QA); onboarding selector polish; exam_attempts history table (optional).
User feedback: landing/footer stale+misleading; onboarding overwhelming; wants more Scripting, more Tier1/2, practical exams, real-world explanations.
- **P1 Truth-up marketing:** Footer.jsx is FULLY STALE/HARDCODED (brand 'SysAdminPro', dead /windows-server-2025 links, stats '82 lessons/82 VMware Labs/400+', 'open beta', 'Phase 17'). FIX: spine-driven stats (count from curriculum), accurate copy (4 tracks: helpdesk/sysadmin/comptia/scripting; in-browser labs NOT VMware; spaced review; progress), real learning-paths+featured, accurate free-beta line. Also check any hero/stats bar for same.
- **P2 Guided experience:** curated 'Start here' path per track (ordered milestone roadmap) + persistent 'Your next step' CTA on Dashboard & /learn (use ResumeBanner/lastLessonId + next-lesson). Reduce overwhelm.
- **P3 Practice exams:** exam mode — N random questions across track/course, timed, scored, pass/fail. New RPCs get_exam/submit_exam over quiz_questions. Big for A+ cert prep.
- **P4 Content depth:** Scripting+ (PS: error handling/remoting/modules; Python: regex/APIs/log parsing/projects + labs); Tier1/2+ lessons + more Virtual Help Desk scenarios; 'In the real world' note callouts (model supports notes).
Sequence P1->P2->P3->P4. All feasible with existing pipeline (emit_content.py) + schema.

## P32 BUGFIX + NAV
FIXED runtime crash: Home.jsx TRACK_BADGE only had helpdesk/sysadmin -> comptia/scripting courses hit undefined.cls. Added comptia+scripting badges + fallback guard (badge = TRACK_BADGE[track] || default). Added /review to Navbar Tools dropdown (/labs already there). Gates green.

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
