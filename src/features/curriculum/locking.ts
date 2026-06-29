import type { Course, Curriculum, Lesson } from '@/shared/types';
import { getOrderedLessons } from './selectors';
import { curriculum } from '@/content/curriculum';

/**
 * Evaluates a lesson's lock state from the spine's lock rule plus the user's
 * completed lessons. Pure and deterministic — no I/O, fully unit-testable.
 *
 * Lock rules:
 *  - none:          always unlocked
 *  - sequential:    unlocked once the previous lesson in course order is complete
 *  - prerequisites: unlocked once every listed lesson is complete
 */
export function isLessonLocked(
  lesson: Lesson,
  course: Course,
  completedLessonIds: ReadonlySet<string> | readonly string[],
  data: Curriculum = curriculum,
): boolean {
  const completed =
    completedLessonIds instanceof Set ? completedLessonIds : new Set(completedLessonIds);

  switch (lesson.lockRule.type) {
    case 'none':
      return false;

    case 'prerequisites':
      return !lesson.lockRule.lessonIds.every((id) => completed.has(id));

    case 'sequential': {
      const ordered = getOrderedLessons(course, data);
      const idx = ordered.findIndex((l) => l.id === lesson.id);
      if (idx <= 0) return false; // first lesson (or not found) is never locked
      const previous = ordered[idx - 1];
      return !completed.has(previous.id);
    }

    default: {
      // Exhaustiveness guard — a new rule type must be handled explicitly.
      const _never: never = lesson.lockRule;
      return Boolean(_never);
    }
  }
}
