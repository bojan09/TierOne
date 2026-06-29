import type { Course, Curriculum, Lesson } from '@/shared/types';
import { curriculum } from '@/content/curriculum';

/** A breadcrumb entry for lesson/course chrome. */
export interface Crumb {
  label: string;
  href: string;
}

/** Lesson link used for prev/next navigation. */
export interface LessonLink {
  title: string;
  href: string;
}

export function getCourseBySlug(
  slug: string,
  data: Curriculum = curriculum,
): Course | undefined {
  return data.courses.find((c) => c.slug === slug);
}

/** All lessons belonging to a course, in display order. */
export function getOrderedLessons(
  course: Course,
  data: Curriculum = curriculum,
): Lesson[] {
  return data.lessons
    .filter((l) => l.courseId === course.id)
    .slice()
    .sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(
  course: Course,
  lessonSlug: string,
  data: Curriculum = curriculum,
): Lesson | undefined {
  return data.lessons.find((l) => l.courseId === course.id && l.slug === lessonSlug);
}

export function lessonHref(course: Course, lesson: Lesson): string {
  return `/learn/${course.slug}/${lesson.slug}`;
}

export function courseHref(course: Course): string {
  return `/learn/${course.slug}`;
}

/** Previous/next lessons within the course order. */
export function getAdjacentLessons(
  course: Course,
  lesson: Lesson,
  data: Curriculum = curriculum,
): { prev: LessonLink | null; next: LessonLink | null } {
  const ordered = getOrderedLessons(course, data);
  const idx = ordered.findIndex((l) => l.id === lesson.id);
  const prevLesson = idx > 0 ? ordered[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
  return {
    prev: prevLesson
      ? { title: prevLesson.title, href: lessonHref(course, prevLesson) }
      : null,
    next: nextLesson
      ? { title: nextLesson.title, href: lessonHref(course, nextLesson) }
      : null,
  };
}

export function getLessonBreadcrumbs(course: Course, lesson: Lesson): Crumb[] {
  return [
    { label: 'Academy', href: '/learn' },
    { label: course.title, href: courseHref(course) },
    { label: lesson.title, href: lessonHref(course, lesson) },
  ];
}
