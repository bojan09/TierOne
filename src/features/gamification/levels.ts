import type { Level, LevelProgress } from '@/shared/types';

/**
 * Level thresholds — MUST mirror public.level_for_xp() in
 * supabase/migrations/0002_progress.sql. The server is authoritative for the
 * numeric level; these titles + thresholds are for display only.
 */
export const LEVELS: Level[] = [
  { level: 1, title: 'Tier-0 Initiate', minXp: 0 },
  { level: 2, title: 'Help Desk Trainee', minXp: 100 },
  { level: 3, title: 'Help Desk Technician', minXp: 250 },
  { level: 4, title: 'Support Specialist', minXp: 500 },
  { level: 5, title: 'Senior Support', minXp: 1000 },
  { level: 6, title: 'Junior SysAdmin', minXp: 2000 },
  { level: 7, title: 'SysAdmin', minXp: 3500 },
  { level: 8, title: 'Senior SysAdmin', minXp: 5500 },
  { level: 9, title: 'Infrastructure Engineer', minXp: 8000 },
  { level: 10, title: 'Infrastructure Architect', minXp: 11000 },
];

export function levelProgress(totalXp: number): LevelProgress {
  let current = LEVELS[0];
  for (const l of LEVELS) if (totalXp >= l.minXp) current = l;
  const next = LEVELS.find((l) => l.level === current.level + 1) ?? null;
  const span = next ? next.minXp - current.minXp : 1;
  const into = totalXp - current.minXp;
  const percent = next ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return { current, next, percent };
}
