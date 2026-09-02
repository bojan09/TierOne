import { describe, expect, it } from 'vitest';
import { curriculum } from './index';
import { lessonRegistry } from '@/features/lessons/registry';
import { structuredLessons } from '@/content/lessons/structured';

/**
 * Structural integrity checks on the curriculum spine — the kind of mistake
 * that's easy to make hand-authoring 350+ lessons across 4 track files
 * (duplicate id, dangling foreign key, empty course) and easy to miss in
 * review, but breaks navigation/locking/XP silently at runtime.
 */
describe('curriculum spine integrity', () => {
  it('has no duplicate course ids or slugs', () => {
    const ids = curriculum.courses.map((c) => c.id);
    const slugs = curriculum.courses.map((c) => c.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has no duplicate lesson ids', () => {
    const ids = curriculum.lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no duplicate lesson slugs within the same course', () => {
    const byCourse = new Map<string, string[]>();
    for (const lesson of curriculum.lessons) {
      const slugs = byCourse.get(lesson.courseId) ?? [];
      slugs.push(lesson.slug);
      byCourse.set(lesson.courseId, slugs);
    }
    for (const [courseId, slugs] of byCourse) {
      expect(new Set(slugs).size, `duplicate lesson slug in course ${courseId}`).toBe(slugs.length);
    }
  });

  it('every lesson.courseId points to a course that exists', () => {
    const courseIds = new Set(curriculum.courses.map((c) => c.id));
    for (const lesson of curriculum.lessons) {
      expect(courseIds.has(lesson.courseId), `${lesson.id} references missing course ${lesson.courseId}`).toBe(true);
    }
  });

  it('every module.courseId points to a course that exists', () => {
    const courseIds = new Set(curriculum.courses.map((c) => c.id));
    for (const mod of curriculum.modules) {
      expect(courseIds.has(mod.courseId), `module ${mod.id} references missing course ${mod.courseId}`).toBe(true);
    }
  });

  it('every course has at least one lesson', () => {
    const lessonCounts = new Map<string, number>();
    for (const lesson of curriculum.lessons) {
      lessonCounts.set(lesson.courseId, (lessonCounts.get(lesson.courseId) ?? 0) + 1);
    }
    for (const course of curriculum.courses) {
      expect(lessonCounts.get(course.id) ?? 0, `course ${course.id} has zero lessons`).toBeGreaterThan(0);
    }
  });

  it('every lesson has positive XP and a positive estimated duration', () => {
    for (const lesson of curriculum.lessons) {
      expect(lesson.xp, `${lesson.id} has non-positive XP`).toBeGreaterThan(0);
      expect(lesson.estimatedMinutes, `${lesson.id} has non-positive duration`).toBeGreaterThan(0);
    }
  });

  it('every lesson resolves to a body — either the legacy registry or structured content', () => {
    const missing = curriculum.lessons
      .filter((l) => !lessonRegistry[l.id] && !structuredLessons[l.id])
      .map((l) => l.id);
    expect(missing, `lessons with no body: ${missing.join(', ')}`).toEqual([]);
  });

  it('every lesson within a course shares that course’s track', () => {
    const trackByCourse = new Map(curriculum.courses.map((c) => [c.id, c.track]));
    for (const lesson of curriculum.lessons) {
      expect(lesson.track, `${lesson.id} track mismatches its course`).toBe(trackByCourse.get(lesson.courseId));
    }
  });
});
