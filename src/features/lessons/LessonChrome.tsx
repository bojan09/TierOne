import type { ComponentType, ReactNode } from 'react';
import RawLessonLayout from '@/components/LessonLayout.jsx';
import type { Crumb, LessonLink } from '@/features/curriculum/selectors';

/**
 * Typed props for the lesson chrome. This wraps the existing (untyped)
 * LessonLayout so the spine-driven view can pass strongly-typed, spine-derived
 * data into it. The legacy layout keeps owning the mark-complete / XP / sidebar
 * behaviour (localStorage-backed until P4).
 */
export interface LessonChromeProps {
  lessonId: string;
  courseId: string;
  title: string;
  courseTitle: string;
  courseHref: string;
  xp: number;
  readTime?: string;
  icon?: string;
  breadcrumbs: Crumb[];
  prev: LessonLink | null;
  next: LessonLink | null;
  objectives?: string[];
  children: ReactNode;
  /** Server-authoritative completion override (spine usage). */
  isCompletedOverride?: boolean;
  onComplete?: () => void;
}

/** The legacy layout, surfaced through a typed contract. */
const LessonChrome = RawLessonLayout as unknown as ComponentType<LessonChromeProps>;

export default LessonChrome;
