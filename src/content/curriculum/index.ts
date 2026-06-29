import type { Curriculum } from '@/shared/types';
import { helpdeskCourses, helpdeskModules, helpdeskLessons } from './helpdesk';

/**
 * The assembled curriculum spine — the single source of truth for navigation,
 * ordering, prerequisites and locking. Seeded to Supabase `curriculum` later;
 * for now it is read directly in-app.
 *
 * Currently contains the Help Desk vertical slice. The SysAdmin track and the
 * remaining Help Desk courses are added here as they migrate (P5), without any
 * change to the routing/locking engine that consumes this.
 */
export const curriculum: Curriculum = {
  courses: [...helpdeskCourses],
  modules: [...helpdeskModules],
  lessons: [...helpdeskLessons],
};
