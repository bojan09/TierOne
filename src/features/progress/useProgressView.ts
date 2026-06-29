import { useProgress } from '@/hooks/useProgress';

/**
 * Typed bridge over the legacy localStorage progress hook.
 *
 * This is the ONE place the typed engine touches the untyped legacy progress
 * code. Keeping the seam here means the rest of the data-driven layer stays
 * fully typed. Replaced wholesale by the Supabase-backed progress provider in
 * P4 — at which point only this file changes.
 */

interface LegacyProgressState {
  completedLessons?: string[];
}

export interface ProgressView {
  completedLessons: string[];
  completedSet: Set<string>;
  isLessonCompleted: (lessonId: string) => boolean;
}

export function useProgressView(): ProgressView {
  const raw = useProgress() as { state?: LegacyProgressState };
  const completedLessons = raw.state?.completedLessons ?? [];
  const completedSet = new Set(completedLessons);
  return {
    completedLessons,
    completedSet,
    isLessonCompleted: (id: string) => completedSet.has(id),
  };
}
