import { describe, expect, it } from 'vitest';
import { isLessonLocked } from './locking';
import { fixtureCurriculum } from './__fixtures__/curriculum';
import { curriculum } from '@/content/curriculum';

const data = fixtureCurriculum;
const courseA = data.courses[0];
const [lessonA1, lessonA2, lessonA3] = data.lessons;

describe('isLessonLocked', () => {
  it('a lockRule of "none" is never locked, regardless of progress', () => {
    expect(isLessonLocked(lessonA1, courseA, new Set(), data)).toBe(false);
    expect(isLessonLocked(lessonA1, courseA, new Set(['a2', 'a3']), data)).toBe(false);
  });

  describe('sequential', () => {
    it('is locked until the previous lesson in course order is completed', () => {
      expect(isLessonLocked(lessonA2, courseA, new Set(), data)).toBe(true);
      expect(isLessonLocked(lessonA2, courseA, new Set(['a1']), data)).toBe(false);
    });

    it('does not unlock from completing an unrelated lesson', () => {
      expect(isLessonLocked(lessonA2, courseA, new Set(['a3']), data)).toBe(true);
    });
  });

  describe('prerequisites', () => {
    it('is locked until every listed prerequisite is completed', () => {
      expect(isLessonLocked(lessonA3, courseA, new Set(['a1']), data)).toBe(true);
      expect(isLessonLocked(lessonA3, courseA, new Set(['a1', 'a2']), data)).toBe(false);
    });

    it('accepts a plain array as well as a Set', () => {
      expect(isLessonLocked(lessonA3, courseA, ['a1', 'a2'], data)).toBe(false);
      expect(isLessonLocked(lessonA3, courseA, ['a1'], data)).toBe(true);
    });
  });

  it('the current live spine has no lesson locked behind unresolvable prerequisites', () => {
    // Regression guard for content-authoring mistakes: every `prerequisites`
    // lockRule must reference lesson ids that actually exist in the spine —
    // otherwise that lesson can never be unlocked.
    const knownIds = new Set(curriculum.lessons.map((l) => l.id));
    for (const lesson of curriculum.lessons) {
      if (lesson.lockRule.type === 'prerequisites') {
        for (const id of lesson.lockRule.lessonIds) {
          expect(knownIds.has(id), `${lesson.id} requires unknown prerequisite ${id}`).toBe(true);
        }
      }
    }
  });
});
