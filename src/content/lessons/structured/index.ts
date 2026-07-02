import type { LessonContent } from '../model';
import { winserveradLessons } from './winserver-ad';
import { winservergpLessons } from './winserver-gp';
import { winserverdnsLessons } from './winserver-dns';
import { winserverstorageLessons } from './winserver-storage';
import { winserverhypervLessons } from './winserver-hyperv';
import { winserversecurityLessons } from './winserver-security';
import { winserverpowershellLessons } from './winserver-powershell';
import { winserverbackupLessons } from './winserver-backup';
import { winserverfoundationsLessons } from './winserver-foundations';
import { winserverremoteLessons } from './winserver-remote';
import { winservermonitoringLessons } from './winserver-monitoring';

export const structuredLessons: Record<string, LessonContent> = {
  ...winserveradLessons,
  ...winservergpLessons,
  ...winserverdnsLessons,
  ...winserverstorageLessons,
  ...winserverhypervLessons,
  ...winserversecurityLessons,
  ...winserverpowershellLessons,
  ...winserverbackupLessons,
  ...winserverfoundationsLessons,
  ...winserverremoteLessons,
  ...winservermonitoringLessons,
};
