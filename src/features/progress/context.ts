import { createContext } from 'react';
import type { UserStats } from '@/shared/types';

export interface AcademyProgressValue {
  /** Lesson ids the user has completed. */
  completedSet: Set<string>;
  isLessonCompleted: (lessonId: string) => boolean;
  /** Server-computed gamification rollup, or null when signed out / unloaded. */
  stats: UserStats | null;
  loading: boolean;
  /** Calls the server-authoritative complete_lesson RPC. No-op when signed out. */
  completeLesson: (lessonId: string) => Promise<void>;
  /** Re-fetch completed lessons + stats from the server (e.g. after a quiz pass). */
  refresh: () => Promise<void>;
}

export const ProgressContext = createContext<AcademyProgressValue | null>(null);
