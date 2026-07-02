# TierZero — Improvement & Expansion Plan

Accepted direction for future phases. Goal: **mastery and job-readiness, depth over breadth.**
Current baseline: 98 lessons / 15 courses, 294 quizzes, 7 scenarios, 3 labs, interview prep, AI doc grading, analytics, certificates.

---

## 1. Curriculum expansion (priority)

### Windows Server 2025 — expand 12 → ~75 lessons (one course → a full track of sub-courses)
- **Foundations & Install** (6): editions, install, Server Core vs Desktop, initial config, Windows Admin Center, licensing/activation.
- **Active Directory** (10): AD DS install, forests/trees/domains, OUs, users/groups, FSMO roles, sites & replication, trusts, RODC, delegation, AD maintenance.
- **Group Policy** (7): architecture, processing order/LSDOU, security settings, preferences, folder redirection, software deployment, troubleshooting (gpresult/RSoP).
- **DNS & DHCP** (7): zones, record types, forwarders/conditional forwarders, DNSSEC; DHCP scopes, reservations, options, failover, relay.
- **File & Storage** (7): NTFS vs share perms, DFS-N/DFS-R, FSRM quotas/screens, Storage Spaces, iSCSI, dedup, shadow copies.
- **Hyper-V & Virtualization** (6): install, virtual switches, VM config, checkpoints, live migration, replica.
- **Networking & Remote Access** (5): NIC teaming, RRAS/VPN, NPS, Always On VPN, Web Application Proxy.
- **Security & Hardening** (7): least privilege, LAPS, Defender, firewall, BitLocker, Credential Guard, tiered admin, WSUS/patching.
- **PowerShell Automation** (6): cmdlets, remoting, bulk AD, scheduled tasks, DSC, reporting.
- **Backup, Recovery & HA** (5): Windows Server Backup, failover clustering, restore, DR planning, 3-2-1.
- **Monitoring & Troubleshooting** (5): Event Viewer, Performance Monitor, BPA, Server Manager, common failure patterns.
- **Capstone projects** (4): stand up a domain, GPO rollout, file-server migration, DR drill.
- **Labs**: PowerShell/AD/DNS/DHCP simulated terminals. **Scenarios**: enterprise admin tickets. **Project** per sub-course.

### Networking — expand 7 → ~35 lessons
- OSI/TCP-IP deep dive + encapsulation; IPv4 addressing & **subnetting** (multi-lesson: CIDR, VLSM, practice); **IPv6** (addressing, SLAAC, transition).
- **Switching**: MAC tables, VLANs, trunking (802.1Q), STP, port security.
- **Routing**: static, default routes, dynamic (OSPF/EIGRP concepts), inter-VLAN.
- **Wireless**: standards, bands, WPA2/3, controllers, troubleshooting.
- **Services**: DNS, DHCP, NAT/PAT, DHCP relay.
- **VPNs**: site-to-site, client, IPsec, SSL.
- **Firewalls & security**: ACLs, zones, NGFW, segmentation.
- **WAN/Internet**: fiber/broadband, SD-WAN concept.
- **Monitoring**: SNMP, NetFlow, syslog.
- **Packet analysis**: Wireshark-style labs.
- **Troubleshooting**: methodology + CLI labs (ping/tracert/nslookup/ipconfig/arp/netstat).
- **Labs** (simulated CLI): subnetting practice, VLAN config, routing, packet-capture reading. **Scenarios**: outage triage.

### Help Desk / IT Support — expand 25 → ~45 lessons (add a Tier 2 track)
Keep the 6 Tier-1 courses; add **Tier 2 Support**:
- Advanced Windows troubleshooting: boot/BSOD, safe mode, system restore, registry basics, imaging/reimaging.
- Advanced AD tasks: account/OU management, GPO troubleshooting, delegation.
- **Microsoft 365 admin**: Exchange Online basics, licensing, shared mailboxes, MFA/conditional access admin, Intune/MDM basics.
- Advanced networking issues; print server management; endpoint management.
- **ITIL & process**: incident/problem/change, SLAs, escalation, knowledge management.
- Asset management; scripting for support (PowerShell for helpdesk).
- **More scenarios** (Tier 2 tickets), **labs** (AD tasks, M365 tasks), **projects** (fleet imaging, onboarding automation).

### Cross-platform content
- **Projects/capstones** per track (portfolio pieces students can show employers).
- Grow **labs** (target 3 → 20+), **scenarios** (7 → 25+), **interview questions** (12 → 60+ incl. sysadmin/network), **doc-practice exercises** (3 → 15+).
- Depth tactic: each lesson ends with a hands-on task or mini-lab, not just a quiz.

---

## 2. Design / UX recommendations

### Navigation & IA
- Academy mega-menu is crowded → group into **Learn / Practice / Career** sections.
- Add a persistent **left sidebar inside `/learn`**: course→lesson tree with inline progress and locking.
- Global **content search** (wire a real search over lessons; a legacy SearchResults page exists to repurpose).
- Mobile: bottom tab bar for the core areas.

### Lesson experience
- In-lesson **prev/next** nav, **table of contents** for long lessons, reading-time, and a sticky progress bar.
- Reusable **callout/note/warning** components and **code-block** styling.
- **Diagrams**: lessons are text-only today — add SVG diagrams (networking, AD, OSI). High impact for comprehension.
- Enforce readable **max line length** (~70ch) and a consistent typographic scale.

### Engagement & retention
- Surface **streaks/daily goal** on the dashboard; "continue where you left off" hero.
- **Skill tree / learning path** view mapping lessons → job-readiness milestones.
- **Badge/achievement showcase**; optional leaderboard.
- Optional **email/push reminders** (needs a provider) for streaks and next lesson.
- First-run **onboarding**: pick track + goal, optional placement check.

### Consistency, readability, a11y
- Consolidate card/badge/button variants into a small design-token set (reduce one-off styles).
- Add **light/dark toggle** (currently dark-only).
- A11y beyond baseline: ARIA live region for quiz results, keyboard flow through quiz/lab, focus management on route change, `prefers-reduced-motion`, contrast audit.

### Authoring velocity (internal)
- The lesson pipeline is manual (spine + body + registry + 2 seeds). For an expansion this size, add a **content generator/CLI** or a DB-driven lesson-body model to cut per-lesson overhead and keep consistency.

---

## 3. Suggested build sequence (phases)
- **P18** Windows Server 2025 expansion (sub-course batches, same pipeline, quiz-gated + labs).
- **P19** Networking expansion (+ subnetting/packet labs).
- **P20** Help Desk Tier 2 track (+ scenarios/labs/projects).
- **P21** Lesson-experience UX (sidebar, prev/next, TOC, diagrams, callouts).
- **P22** Engagement (skill tree, streaks surfaced, onboarding) + global search.
- **P23** Authoring tooling + light/dark + a11y deepening.
- Content (labs/scenarios/interview/doc exercises) grown continuously alongside.

Constraint reminder: each phase ends buildable (typecheck+lint+build green) with validated migrations and a ZIP; migrations continue sequentially from 0028.
