import type { LessonContent } from '../model';
import { cahardwareLessons } from './ca-hardware';
import { camcLessons } from './ca-mc';
import { canetLessons } from './ca-net';
import { caosLessons } from './ca-os';
import { casecLessons } from './ca-sec';
import { catsLessons } from './ca-ts';
import { hdessentialsLessons } from './hd-essentials';
import { hdeverydayLessons } from './hd-everyday';
import { hdtier1winLessons } from './hd-tier1-win';
import { netfundamentalsLessons } from './net-fundamentals';
import { netipv4Lessons } from './net-ipv4';
import { netipv6Lessons } from './net-ipv6';
import { netroutingLessons } from './net-routing';
import { netsecurityLessons } from './net-security';
import { netswitchingLessons } from './net-switching';
import { nettroubleshootingLessons } from './net-troubleshooting';
import { netwirelessLessons } from './net-wireless';
import { scpsLessons } from './sc-ps';
import { scpyLessons } from './sc-py';
import { t2adLessons } from './t2-ad';
import { t2itilLessons } from './t2-itil';
import { t2m365Lessons } from './t2-m365';
import { t2networkLessons } from './t2-network';
import { t2windowsLessons } from './t2-windows';
import { winserveradLessons } from './winserver-ad';
import { winserverbackupLessons } from './winserver-backup';
import { winserverdnsLessons } from './winserver-dns';
import { winserverfoundationsLessons } from './winserver-foundations';
import { winservergpLessons } from './winserver-gp';
import { winserverhypervLessons } from './winserver-hyperv';
import { winservermonitoringLessons } from './winserver-monitoring';
import { winserverpowershellLessons } from './winserver-powershell';
import { winserverremoteLessons } from './winserver-remote';
import { winserversecurityLessons } from './winserver-security';
import { winserverstorageLessons } from './winserver-storage';

export const structuredLessons: Record<string, LessonContent> = {
  ...cahardwareLessons,
  ...camcLessons,
  ...canetLessons,
  ...caosLessons,
  ...casecLessons,
  ...catsLessons,
  ...hdessentialsLessons,
  ...hdeverydayLessons,
  ...hdtier1winLessons,
  ...netfundamentalsLessons,
  ...netipv4Lessons,
  ...netipv6Lessons,
  ...netroutingLessons,
  ...netsecurityLessons,
  ...netswitchingLessons,
  ...nettroubleshootingLessons,
  ...netwirelessLessons,
  ...scpsLessons,
  ...scpyLessons,
  ...t2adLessons,
  ...t2itilLessons,
  ...t2m365Lessons,
  ...t2networkLessons,
  ...t2windowsLessons,
  ...winserveradLessons,
  ...winserverbackupLessons,
  ...winserverdnsLessons,
  ...winserverfoundationsLessons,
  ...winservergpLessons,
  ...winserverhypervLessons,
  ...winservermonitoringLessons,
  ...winserverpowershellLessons,
  ...winserverremoteLessons,
  ...winserversecurityLessons,
  ...winserverstorageLessons,
};
