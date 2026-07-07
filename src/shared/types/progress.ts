import type { IsoTimestamp, LessonStatus, Uuid } from './common';

/**
 * Per-user progress. All writes go through server-side RPCs; the client never
 * writes XP/level/stats directly. These types describe what the client *reads*.
 */

export interface LessonProgress {
  userId: Uuid;
  lessonId: Uuid;
  status: LessonStatus;
  completedAt: IsoTimestamp | null;
  /** XP actually awarded for this lesson (recorded server-side). */
  xpAwarded: number;
}

/**
 * Denormalized rollup of a user's gamification state. Read-only to clients;
 * written only inside the same RPCs that record progress, to prevent drift.
 */
export interface UserStats {
  userId: Uuid;
  totalXp: number;
  level: number;
  streak: number;
  lastStudyDate: IsoTimestamp | null;
  lastLessonId: string | null;
  earnedBadges: string[]; // badge ids
}
