import { describe, expect, it } from 'vitest';
import {
  courseHref,
  getAdjacentLessons,
  getCourseBySlug,
  getLessonAndCourseById,
  getLessonBreadcrumbs,
  getLessonBySlug,
  getOrderedLessons,
  lessonHref,
} from './selectors';
import { fixtureCurriculum } from './__fixtures__/curriculum';

const data = fixtureCurriculum;
const courseA = data.courses[0];
const courseB = data.courses[1];

describe('getCourseBySlug', () => {
  it('finds a course by slug', () => {
    expect(getCourseBySlug('course-b', data)?.id).toBe('course-b');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getCourseBySlug('nope', data)).toBeUndefined();
  });
});

describe('getOrderedLessons', () => {
  it('returns only that course’s lessons, sorted by order', () => {
    const lessons = getOrderedLessons(courseA, data);
    expect(lessons.map((l) => l.id)).toEqual(['a1', 'a2', 'a3']);
  });

  it('does not mutate the source array order', () => {
    const shuffled = { ...data, lessons: [...data.lessons].reverse() };
    const lessons = getOrderedLessons(courseA, shuffled);
    expect(lessons.map((l) => l.id)).toEqual(['a1', 'a2', 'a3']);
  });
});

describe('getLessonBySlug', () => {
  it('finds a lesson within its course', () => {
    expect(getLessonBySlug(courseA, 'second', data)?.id).toBe('a2');
  });

  it('does not find a lesson slug that belongs to a different course', () => {
    expect(getLessonBySlug(courseA, 'only', data)).toBeUndefined();
  });
});

describe('getLessonAndCourseById', () => {
  // No `data` override on this one — it reads the real spine (used for
  // server-side "resume" by lesson id), so assert against a lesson id that's
  // actually in it rather than the fixture.
  it('resolves a real lesson id back to its lesson + course', () => {
    const result = getLessonAndCourseById('hdf-01');
    expect(result).toBeDefined();
    expect(result?.lesson.courseId).toBe(result?.course.id);
  });

  it('returns undefined for an unknown id', () => {
    expect(getLessonAndCourseById('does-not-exist')).toBeUndefined();
  });
});

describe('lessonHref / courseHref', () => {
  it('builds /learn/<course>/<lesson> and /learn/<course>', () => {
    expect(courseHref(courseA)).toBe('/learn/course-a');
    expect(lessonHref(courseA, data.lessons[0])).toBe('/learn/course-a/first');
  });
});

describe('getAdjacentLessons', () => {
  it('has no prev on the first lesson and no next on the last', () => {
    const first = getAdjacentLessons(courseA, data.lessons[0], data);
    expect(first.prev).toBeNull();
    expect(first.next?.title).toBe('Second');

    const last = getAdjacentLessons(courseA, data.lessons[2], data);
    expect(last.next).toBeNull();
    expect(last.prev?.title).toBe('Second');
  });

  it('has both prev and next for a middle lesson', () => {
    const mid = getAdjacentLessons(courseA, data.lessons[1], data);
    expect(mid.prev?.title).toBe('First');
    expect(mid.next?.title).toBe('Third');
  });

  it('single-lesson courses have neither prev nor next', () => {
    const only = getAdjacentLessons(courseB, data.lessons[3], data);
    expect(only.prev).toBeNull();
    expect(only.next).toBeNull();
  });
});

describe('getLessonBreadcrumbs', () => {
  it('builds Academy > course > lesson', () => {
    const crumbs = getLessonBreadcrumbs(courseA, data.lessons[1]);
    expect(crumbs.map((c) => c.label)).toEqual(['Academy', 'Course A', 'Second']);
    expect(crumbs[2].href).toBe('/learn/course-a/second');
  });
});
