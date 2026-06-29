import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Maps a lesson `slug` to a lazily-imported body component. Each dynamic
 * import becomes its own bundle chunk, so lesson content is only downloaded
 * when a student opens that lesson. This is what breaks the monolithic bundle.
 *
 * Lesson bodies are pure content (no chrome) — the chrome is supplied by the
 * spine-driven LessonView via LessonChrome.
 *
 * As lessons migrate to the spine, they are registered here.
 */
type LazyBody = LazyExoticComponent<ComponentType>;

export const lessonRegistry: Record<string, LazyBody> = {
  'what-is-it-support': lazy(
    () => import('@/content/lessons/helpdesk/what-is-it-support.jsx'),
  ),
  'troubleshooting-methodology': lazy(
    () => import('@/content/lessons/helpdesk/troubleshooting-methodology.jsx'),
  ),
  'tickets-and-documentation': lazy(
    () => import('@/content/lessons/helpdesk/tickets-and-documentation.jsx'),
  ),
};

export function getLessonBody(slug: string): LazyBody | undefined {
  return lessonRegistry[slug];
}
