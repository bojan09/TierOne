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
  course: Omit<Course, 'moduleIds' | 'track' | 'difficulty'>,
  moduleId: string,
  moduleSlug: string,
  moduleTitle: string,
  seeds: Seed[],
) {
  const built: Lesson[] = seeds.map((s, i) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    courseId: course.id,
    moduleId,
    order: i + 1,
    xp: s.xp,
    track: 'helpdesk',
    difficulty: 'beginner',
    estimatedMinutes: s.minutes,
    lockRule: (i === 0 ? { type: 'none' } : { type: 'sequential' }) as LockRule,
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
  courses.push({ ...course, track: 'helpdesk', difficulty: 'beginner', moduleIds: [moduleId] });
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
  ],
);

export const helpdeskCourses = courses;
export const helpdeskModules = modules;
export const helpdeskLessons = lessons;
