import type { Curriculum } from '@/shared/types';
import { helpdeskCourses, helpdeskModules, helpdeskLessons } from './helpdesk';
import { sysadminCourses, sysadminModules, sysadminLessons } from './sysadmin';

/**
 * The assembled curriculum spine — single source of truth for navigation,
 * ordering, prerequisites and locking. Both tracks are now spine-native.
 */
export const curriculum: Curriculum = {
  courses: [...helpdeskCourses, ...sysadminCourses],
  modules: [...helpdeskModules, ...sysadminModules],
  lessons: [...helpdeskLessons, ...sysadminLessons],
};
