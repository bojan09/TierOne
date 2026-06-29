import type { Difficulty, Track, Uuid } from './common';

/**
 * The curriculum spine. This metadata is the single source of truth for
 * navigation, ordering, prerequisites and locking. It is seeded to the
 * Supabase `curriculum` tables and is read-only to clients.
 *
 * Lesson *bodies* are NOT part of the spine — they live as lazy-loaded code
 * modules keyed by `Lesson.slug` (hybrid content model).
 */

/** Determines when a lesson becomes available to a student. */
export type LockRule =
  | { type: 'none' }
  | { type: 'sequential' } // unlocked once the previous lesson in order is complete
  | { type: 'prerequisites'; lessonIds: Uuid[] }; // unlocked once all listed lessons are complete

export interface Course {
  id: Uuid;
  slug: string;
  title: string;
  description: string;
  icon: string;
  track: Track;
  difficulty: Difficulty;
  /** Display order within its track. */
  order: number;
  moduleIds: Uuid[];
}

export interface Module {
  id: Uuid;
  slug: string;
  title: string;
  courseId: Uuid;
  order: number;
  lessonIds: Uuid[];
}

export interface Lesson {
  id: Uuid;
  slug: string;
  title: string;
  courseId: Uuid;
  moduleId: Uuid;
  order: number;
  /** XP awarded on completion. Awarded server-side, never trusted from client. */
  xp: number;
  track: Track;
  difficulty: Difficulty;
  estimatedMinutes: number;
  lockRule: LockRule;
  /** Whether an assessment is attached (resolved against the quiz set). */
  hasQuiz: boolean;
}

/** A fully resolved spine, convenient for building navigation. */
export interface Curriculum {
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
}
