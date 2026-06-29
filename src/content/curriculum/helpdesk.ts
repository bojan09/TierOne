import type { Course, Lesson, Module } from '@/shared/types';

/**
 * Help Desk track — "IT Support Foundations" course (vertical slice for P2).
 *
 * This is the seed of the entry-level Help Desk track (expanded in P5). It
 * exists to prove the full data-driven pipeline end to end: spine -> routing
 * -> lazy-loaded body -> lock rules -> prev/next, against real content.
 *
 * Lesson `slug` values MUST match keys in the lesson registry
 * (src/features/lessons/registry.ts).
 */

const COURSE_ID = 'helpdesk-foundations';
const MODULE_ID = 'hdf-getting-started';

export const helpdeskLessons: Lesson[] = [
  {
    id: 'hdf-01',
    slug: 'what-is-it-support',
    title: 'What IT Support Actually Is',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    order: 1,
    xp: 40,
    track: 'helpdesk',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    lockRule: { type: 'none' },
    hasQuiz: false,
  },
  {
    id: 'hdf-02',
    slug: 'troubleshooting-methodology',
    title: 'A Repeatable Troubleshooting Method',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    order: 2,
    xp: 50,
    track: 'helpdesk',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    lockRule: { type: 'sequential' },
    hasQuiz: false,
  },
  {
    id: 'hdf-03',
    slug: 'tickets-and-documentation',
    title: 'Writing Tickets People Can Use',
    courseId: COURSE_ID,
    moduleId: MODULE_ID,
    order: 3,
    xp: 50,
    track: 'helpdesk',
    difficulty: 'beginner',
    estimatedMinutes: 14,
    lockRule: { type: 'sequential' },
    hasQuiz: false,
  },
];

export const helpdeskModules: Module[] = [
  {
    id: MODULE_ID,
    slug: 'getting-started',
    title: 'Getting Started on the Help Desk',
    courseId: COURSE_ID,
    order: 1,
    lessonIds: helpdeskLessons.map((l) => l.id),
  },
];

export const helpdeskCourses: Course[] = [
  {
    id: COURSE_ID,
    slug: 'it-support-foundations',
    title: 'IT Support Foundations',
    description:
      'The mindset, method, and habits of an effective Tier-1 support technician — the foundation everything else builds on.',
    icon: '🎧',
    track: 'helpdesk',
    difficulty: 'beginner',
    order: 1,
    moduleIds: helpdeskModules.map((m) => m.id),
  },
];
