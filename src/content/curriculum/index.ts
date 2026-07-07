import type { Curriculum } from '@/shared/types';
import { helpdeskCourses, helpdeskModules, helpdeskLessons } from './helpdesk';
import { sysadminCourses, sysadminModules, sysadminLessons } from './sysadmin';
import { comptiaCourses, comptiaModules, comptiaLessons } from './comptia';
import { scriptingCourses, scriptingModules, scriptingLessons } from './scripting';

/**
 * The assembled curriculum spine — single source of truth for navigation,
 * ordering, prerequisites and locking. Both tracks are now spine-native.
 */
export const curriculum: Curriculum = {
  courses: [...helpdeskCourses, ...sysadminCourses, ...comptiaCourses, ...scriptingCourses],
  modules: [...helpdeskModules, ...sysadminModules, ...comptiaModules, ...scriptingModules],
  lessons: [...helpdeskLessons, ...sysadminLessons, ...comptiaLessons, ...scriptingLessons],
};
