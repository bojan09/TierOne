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
  /** P21: difficulty badge + position within the course. */
  difficulty?: string;
  position?: number;
  total?: number;
  /** Server-authoritative completion override (spine usage). */
  isCompletedOverride?: boolean;
  onComplete?: () => void;
  requiresQuiz?: boolean;
  /** True when there's no session — completion can't actually be saved. */
  signedOut?: boolean;
}

/** The legacy layout, surfaced through a typed contract. */
const LessonChrome = RawLessonLayout as unknown as ComponentType<LessonChromeProps>;

export default LessonChrome;
