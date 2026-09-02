import type { Course, Lesson, LockRule, Module } from '@/shared/types';

/**
 * Help Desk / Tier-1 track. Spine-native: lesson `slug`s map to body modules
 * in the lesson registry. Server XP authority is seeded from these same values
 * (supabase/migrations/0003_seed_helpdesk.sql).
 */

interface Seed {
  id: string;
  slug: string;
  title: string;
  xp: number;
  minutes: number;
  hasQuiz?: boolean;
}

const courses: Course[] = [];
const modules: Module[] = [];
const lessons: Lesson[] = [];

function addCourse(
  course: Omit<Course, 'moduleIds' | 'track' | 'difficulty'> & { difficulty?: Course['difficulty'] },
  moduleId: string,
  moduleSlug: string,
  moduleTitle: string,
  seeds: Seed[],
) {
  const level = course.difficulty ?? 'beginner';
  const built: Lesson[] = seeds.map((s, i) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    courseId: course.id,
    moduleId,
    order: i + 1,
    xp: s.xp,
    track: 'helpdesk',
    difficulty: level,
    estimatedMinutes: s.minutes,
    lockRule: { type: 'none' } as LockRule,
    hasQuiz: Boolean(s.hasQuiz),
  }));
  lessons.push(...built);
  modules.push({
    id: moduleId,
    slug: moduleSlug,
    title: moduleTitle,
    courseId: course.id,
    order: 1,
    lessonIds: built.map((l) => l.id),
  });
  courses.push({ ...course, track: 'helpdesk', difficulty: level, moduleIds: [moduleId] });
}

addCourse(
  {
    id: 'helpdesk-foundations',
    slug: 'it-support-foundations',
    title: 'IT Support Foundations',
    description:
      'The mindset, method, and habits of an effective Tier-1 support technician — the foundation everything else builds on.',
    icon: '🎧',
    order: 1,
  },
  'hdf-getting-started',
  'getting-started',
  'Getting Started on the Help Desk',
  [
    { id: 'hdf-01', hasQuiz: true, slug: 'what-is-it-support', title: 'What IT Support Actually Is', xp: 40, minutes: 12 },
    { id: 'hdf-02', hasQuiz: true, slug: 'troubleshooting-methodology', title: 'A Repeatable Troubleshooting Method', xp: 50, minutes: 15 },
    { id: 'hdf-03', hasQuiz: true, slug: 'tickets-and-documentation', title: 'Writing Tickets People Can Use', xp: 50, minutes: 14 },
    { id: 'hdf-04', hasQuiz: true, slug: 'command-line-basics', title: 'Command-Line Basics for Support', xp: 50, minutes: 14 },
  ],
);

addCourse(
  {
    id: 'hardware-and-os',
    slug: 'hardware-and-os',
    title: 'Hardware & Operating Systems',
    description:
      'Recognise the parts of a machine and how operating systems manage them — the physical and software ground floor of support.',
    icon: '🖥️',
    order: 2,
  },
  'hwos-m1',
  'the-basics',
  'Machines & Operating Systems',
  [
    { id: 'hwos-01', hasQuiz: true, slug: 'hardware-essentials', title: 'Inside the Machine: Hardware Essentials', xp: 40, minutes: 12 },
    { id: 'hwos-02', hasQuiz: true, slug: 'operating-systems-overview', title: 'Operating Systems at a Glance', xp: 45, minutes: 12 },
    { id: 'hwos-03', hasQuiz: true, slug: 'files-users-permissions', title: 'Files, Users & Permissions', xp: 50, minutes: 13 },
    { id: 'hwos-04', hasQuiz: true, slug: 'windows-tools', title: 'Windows Tools & the Control Panel', xp: 50, minutes: 13 },
    { id: 'hwos-05', hasQuiz: true, slug: 'backup-and-recovery', title: 'Backup & Data Recovery', xp: 50, minutes: 13 },
  ],
);

addCourse(
  {
    id: 'networking-basics',
    slug: 'networking-basics',
    title: 'Networking Basics for Support',
    description:
      'A working mental model of how devices reach the network — and a repeatable ladder for diagnosing connectivity.',
    icon: '🌐',
    order: 3,
  },
  'net-m1',
  'networks-for-support',
  'Networks for Support',
  [
    { id: 'net-01', hasQuiz: true, slug: 'how-networks-work', title: 'How Networks Actually Work', xp: 45, minutes: 13 },
    { id: 'net-02', hasQuiz: true, slug: 'connectivity-troubleshooting', title: 'Diagnosing Connectivity Problems', xp: 55, minutes: 15 },
    { id: 'net-03', hasQuiz: true, slug: 'wifi-vpn-remote', title: 'Wi-Fi, VPN & Remote Work', xp: 50, minutes: 13 },
  ],
);

addCourse(
  {
    id: 'workplace-it',
    slug: 'workplace-it',
    title: 'Workplace IT: Accounts, M365 & Tickets',
    description:
      'The day-to-day of corporate support: identities and access, the Microsoft 365 stack, email, and communicating like a pro.',
    icon: '🏢',
    order: 4,
  },
  'work-m1',
  'daily-support',
  'The Daily Work',
  [
    { id: 'work-01', hasQuiz: true, slug: 'active-directory-basics', title: 'Active Directory for Tier-1', xp: 55, minutes: 14 },
    { id: 'work-02', hasQuiz: true, slug: 'microsoft-365-essentials', title: 'Microsoft 365 Essentials', xp: 50, minutes: 13 },
    { id: 'work-03', hasQuiz: true, slug: 'email-troubleshooting', title: 'Troubleshooting Email & Outlook', xp: 55, minutes: 14 },
    { id: 'work-04', hasQuiz: true, slug: 'customer-communication', title: 'Customer Communication & Escalation', xp: 45, minutes: 12 },
    { id: 'work-05', hasQuiz: true, slug: 'collaboration-teams-sharepoint', title: 'Collaboration: Teams, SharePoint & OneDrive', xp: 50, minutes: 13 },
  ],
);

addCourse(
  {
    id: 'security-essentials',
    slug: 'security-essentials',
    title: 'Security Essentials for Support',
    description:
      'The security every Tier-1 technician needs on the front line — spotting threats, protecting accounts and data, and responding when something goes wrong. Aligned to CompTIA A+ security topics.',
    icon: '🔒',
    order: 5,
  },
  'sec-m1',
  'security-for-support',
  'Security on the Front Line',
  [
    { id: 'hdsec-01', hasQuiz: true, slug: 'malware-and-phishing', title: 'Malware, Phishing & Social Engineering', xp: 50, minutes: 14 },
    { id: 'hdsec-02', hasQuiz: true, slug: 'authentication-and-passwords', title: 'Authentication, MFA & Passwords', xp: 50, minutes: 13 },
    { id: 'hdsec-03', hasQuiz: true, slug: 'physical-and-data-security', title: 'Physical & Data Security', xp: 50, minutes: 13 },
    { id: 'hdsec-04', hasQuiz: true, slug: 'secure-disposal-and-byod', title: 'Secure Disposal, Mobile & BYOD', xp: 50, minutes: 13 },
  ],
);

addCourse(
  {
    id: 'devices-and-peripherals',
    slug: 'devices-and-peripherals',
    title: 'Devices & Peripherals',
    description:
      'The hardware users actually touch — laptops and phones, printers, monitors and peripherals — plus supporting them remotely. High-volume, everyday help-desk work, aligned to CompTIA A+ hardware topics.',
    icon: '🖨️',
    order: 6,
  },
  'dev-m1',
  'devices-for-support',
  'Devices, Displays & Remote Support',
  [
    { id: 'hddev-01', hasQuiz: true, slug: 'laptops-and-mobile-devices', title: 'Laptops & Mobile Devices', xp: 50, minutes: 13 },
    { id: 'hddev-02', hasQuiz: true, slug: 'printers-and-scanners', title: 'Printers & Scanners', xp: 50, minutes: 13 },
    { id: 'hddev-03', hasQuiz: true, slug: 'peripherals-and-displays', title: 'Peripherals & Display Connectivity', xp: 50, minutes: 13 },
    { id: 'hddev-04', hasQuiz: true, slug: 'remote-support-tools', title: 'Remote Support Tools', xp: 50, minutes: 12 },
  ],
);

// P20-GENERATED-START
addCourse({ id:'t2-windows-troubleshooting', slug:'t2-windows-troubleshooting', title:"Tier 2: Advanced Windows Troubleshooting", description:"Go beyond restarts — diagnose boot failures, blue screens, and broken profiles, and recover Windows with the tools Tier 2 is expected to wield.", icon:'🩺', order:20, difficulty:'intermediate' }, 't2-win-m1', 'advanced-windows', "Advanced Windows Troubleshooting", [
    { id:'t2-win-01', hasQuiz:true, slug:'boot-process', title:"Boot Process & Startup Failures", xp:80, minutes:26 },
    { id:'t2-win-02', hasQuiz:true, slug:'bsod', title:"Blue Screens & Crash Analysis", xp:80, minutes:24 },
    { id:'t2-win-03', hasQuiz:true, slug:'safe-mode-winre', title:"Safe Mode & Windows Recovery", xp:80, minutes:24 },
    { id:'t2-win-04', hasQuiz:true, slug:'restore-reset-registry', title:"System Restore, Reset & the Registry", xp:80, minutes:24 },
    { id:'t2-win-05', hasQuiz:true, slug:'imaging', title:"Imaging & Reimaging", xp:80, minutes:22 },
    { id:'t2-win-06', hasQuiz:true, slug:'profile-login', title:"Profile & Login Issues", xp:55, minutes:18 },
    { id:'t2-win-07', hasQuiz:true, slug:'performance', title:"Performance & Resource Troubleshooting", xp:55, minutes:18 }
]);

addCourse({ id:'t2-active-directory', slug:'t2-active-directory', title:"Tier 2: Active Directory for Support", description:"Handle the AD tasks that land on Tier 2 — managing accounts and OUs, fixing access via groups, resolving lockouts, and knowing what Group Policy is doing.", icon:'🗝️', order:21, difficulty:'intermediate' }, 't2-ad-m1', 'ad-for-support', "Active Directory for Support", [
    { id:'t2-ad-01', hasQuiz:true, slug:'accounts-ous', title:"Managing Accounts & OUs", xp:80, minutes:24 },
    { id:'t2-ad-02', hasQuiz:true, slug:'groups-access', title:"Groups & Access", xp:80, minutes:22 },
    { id:'t2-ad-03', hasQuiz:true, slug:'lockouts', title:"Passwords, Lockouts & Unlocks", xp:80, minutes:22 },
    { id:'t2-ad-04', hasQuiz:true, slug:'gpo-basics', title:"Group Policy Basics for Support", xp:80, minutes:22 },
    { id:'t2-ad-05', hasQuiz:true, slug:'gpo-troubleshoot', title:"Group Policy Troubleshooting", xp:55, minutes:18 },
    { id:'t2-ad-06', hasQuiz:true, slug:'lockout-root-cause', title:"Account Lockouts & Password Issues", xp:55, minutes:16 }
]);

addCourse({ id:'t2-m365-admin', slug:'t2-m365-admin', title:"Tier 2: Microsoft 365 Administration", description:"Support the cloud productivity stack every business runs on — the admin center, licensing, Exchange Online, identity and MFA, and Teams/SharePoint/Intune basics.", icon:'☁️', order:22, difficulty:'intermediate' }, 't2-m365-m1', 'm365-admin', "Microsoft 365 Administration", [
    { id:'t2-m365-01', hasQuiz:true, slug:'admin-center', title:"The Microsoft 365 Admin Center", xp:80, minutes:24 },
    { id:'t2-m365-02', hasQuiz:true, slug:'licensing', title:"Licensing & Plans", xp:80, minutes:22 },
    { id:'t2-m365-03', hasQuiz:true, slug:'exchange-online', title:"Exchange Online Basics", xp:80, minutes:22 },
    { id:'t2-m365-04', hasQuiz:true, slug:'identity-mfa', title:"Identity, MFA & Conditional Access", xp:85, minutes:24 },
    { id:'t2-m365-05', hasQuiz:true, slug:'teams-sharepoint-intune', title:"Teams, SharePoint & Intune Intro", xp:80, minutes:22 },
    { id:'t2-m365-06', hasQuiz:true, slug:'exchange-mailflow', title:"Exchange Online & Mail Flow", xp:55, minutes:18 },
    { id:'t2-m365-07', hasQuiz:true, slug:'teams-sharepoint', title:"Teams & SharePoint Basics", xp:50, minutes:16 }
]);

addCourse({ id:'t2-network-troubleshooting', slug:'t2-network-troubleshooting', title:"Tier 2: Network Troubleshooting", description:"Resolve the connectivity tickets that get escalated past Tier 1 — client addressing and DNS, VPN and remote access, and networked printers.", icon:'🔎', order:23, difficulty:'intermediate' }, 't2-net-m1', 'tier2-network', "Tier 2 Network Troubleshooting", [
    { id:'t2-net-01', hasQuiz:true, slug:'client-connectivity', title:"Client Connectivity Issues", xp:80, minutes:22 },
    { id:'t2-net-02', hasQuiz:true, slug:'vpn-remote', title:"VPN & Remote Access Issues", xp:80, minutes:22 },
    { id:'t2-net-03', hasQuiz:true, slug:'printers', title:"Printers & Peripherals on the Network", xp:80, minutes:22 },
    { id:'t2-net-04', hasQuiz:true, slug:'vpn-remote-routing', title:"VPN & Remote Access Issues", xp:55, minutes:18 },
    { id:'t2-net-05', hasQuiz:true, slug:'dns-resolution', title:"DNS & Name Resolution", xp:55, minutes:16 }
]);

addCourse({ id:'t2-itil-escalation', slug:'t2-itil-escalation', title:"Tier 2: ITIL & Escalation", description:"Work like a professional service desk — incident vs problem vs change, priorities and SLAs, escalation paths, and documentation that makes you trusted.", icon:'📋', order:24, difficulty:'intermediate' }, 't2-itil-m1', 'itil-escalation', "ITIL & Escalation", [
    { id:'t2-itil-01', hasQuiz:true, slug:'incident-problem-change', title:"Incident, Problem & Change", xp:80, minutes:22 },
    { id:'t2-itil-02', hasQuiz:true, slug:'sla-escalation', title:"SLAs, Priority & Escalation", xp:85, minutes:22 },
    { id:'t2-itil-03', hasQuiz:true, slug:'documentation', title:"Documentation & Knowledge", xp:80, minutes:22 },
    { id:'t2-itil-04', hasQuiz:true, slug:'effective-escalation', title:"Writing Effective Escalations", xp:50, minutes:16 },
    { id:'t2-itil-05', hasQuiz:true, slug:'change-problem', title:"Change & Problem Management", xp:50, minutes:16 }
]);
// P20-GENERATED-END

// P33-GENERATED-START
addCourse({ id:'hd-essentials', slug:'hd-essentials', title:"Help Desk Essentials", description:"The non-technical core of great support: communication, professionalism, documentation, and the ticket process.", icon:'🎧', order:30, difficulty:'beginner' }, 'hd-ess-m1', 'help-desk-essentials', "Help Desk Essentials", [
    { id:'hd-ess-01', hasQuiz:true, slug:'intro-helpdesk', title:"Introduction to Help Desk", xp:45, minutes:16 },
    { id:'hd-ess-02', hasQuiz:true, slug:'customer-communication', title:"Customer Communication", xp:50, minutes:18 },
    { id:'hd-ess-03', hasQuiz:true, slug:'professionalism', title:"Professionalism & Ethics", xp:45, minutes:16 },
    { id:'hd-ess-04', hasQuiz:true, slug:'documentation-kb', title:"Documentation & Knowledge Bases", xp:50, minutes:18 },
    { id:'hd-ess-05', hasQuiz:true, slug:'ticket-lifecycle', title:"Ticket Lifecycle & Prioritization", xp:50, minutes:18 }
]);

addCourse({ id:'hd-everyday', slug:'hd-everyday', title:"Everyday Support Tasks", description:"The bread-and-butter tickets a Tier-1 tech resolves daily — accounts, printing, remote access, email, and browsers.", icon:'🛠️', order:31, difficulty:'beginner' }, 'hd-eve-m1', 'everyday-support', "Everyday Support Tasks", [
    { id:'hd-eve-01', hasQuiz:true, slug:'password-mfa', title:"Password Resets & MFA", xp:50, minutes:16 },
    { id:'hd-eve-02', hasQuiz:true, slug:'printer-support', title:"Printer Support", xp:45, minutes:16 },
    { id:'hd-eve-03', hasQuiz:true, slug:'vpn-remote', title:"VPN & Remote Support", xp:50, minutes:18 },
    { id:'hd-eve-04', hasQuiz:true, slug:'email-troubleshooting', title:"Email Troubleshooting", xp:50, minutes:16 },
    { id:'hd-eve-05', hasQuiz:true, slug:'browser-troubleshooting', title:"Browser Troubleshooting", xp:45, minutes:14 }
]);

addCourse({ id:'hd-tier1-win', slug:'hd-tier1-win', title:"Tier 1: Windows & Accounts", description:"The Tier-1 Windows toolkit: troubleshooting, drivers, updates, remote desktop, and permissions.", icon:'🪟', order:32, difficulty:'beginner' }, 'hd-t1-m1', 'tier1-windows', "Tier 1: Windows & Accounts", [
    { id:'hd-t1-01', hasQuiz:true, slug:'windows-troubleshooting', title:"Windows Troubleshooting", xp:50, minutes:18 },
    { id:'hd-t1-02', hasQuiz:true, slug:'device-manager-drivers', title:"Device Manager & Drivers", xp:50, minutes:16 },
    { id:'hd-t1-03', hasQuiz:true, slug:'windows-updates', title:"Windows Updates", xp:45, minutes:14 },
    { id:'hd-t1-04', hasQuiz:true, slug:'remote-desktop', title:"Remote Desktop & Access", xp:45, minutes:14 },
    { id:'hd-t1-05', hasQuiz:true, slug:'permissions-shares', title:"Permissions & File Shares", xp:55, minutes:18 }
]);
// P33-GENERATED-END

export const helpdeskCourses = courses;
export const helpdeskModules = modules;
export const helpdeskLessons = lessons;
