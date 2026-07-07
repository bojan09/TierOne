import { createContext } from 'react';
import type { UserStats } from '@/shared/types';

export interface QuizStats {
  /** Number of lessons with at least one passing attempt. */
  passed: number;
  /** Average of best score per attempted quiz (0-100). */
  avg: number;
  /** Best score per lesson id. */
  bestByLesson: Record<string, number>;
  /** Lesson ids with at least one passing attempt. */
  passedIds: string[];
}

export interface AcademyProgressValue {
  /** Lesson ids the user has completed. */
  completedSet: Set<string>;
  isLessonCompleted: (lessonId: string) => boolean;
  /** Server-computed gamification rollup, or null when signed out / unloaded. */
  stats: UserStats | null;
  /** Quiz attempt rollup. */
  quizStats: QuizStats;
  /** Days (toDateString) the user was active in the last ~2 weeks, for the streak heatmap. */
  activityDates: Set<string>;
  /** Lessons the user completed today (local day), for the daily goal. */
  todayCompleted: number;
  /** Count of lessons due for spaced review. */
  dueReviewCount: number;
  loading: boolean;
  /** Calls the server-authoritative complete_lesson RPC. No-op when signed out. */
  completeLesson: (lessonId: string) => Promise<void>;
  /** Records the most recently opened lesson (server-side resume). No-op when signed out. */
  setLastLesson: (lessonId: string) => Promise<void>;
  /** Re-fetch completed lessons + stats from the server (e.g. after a quiz pass). */
  refresh: () => Promise<void>;
}

export const ProgressContext = createContext<AcademyProgressValue | null>(null);
