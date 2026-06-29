/**
 * Gamification config. Level thresholds and badge definitions live in code
 * (config, not user data); the *awarding* of XP/levels/badges happens
 * server-side. These types describe the config and the computed result shape.
 */

export interface Level {
  level: number;
  title: string;
  minXp: number;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
}

/** Result of resolving an XP total against the level table. */
export interface LevelProgress {
  current: Level;
  next: Level | null;
  /** Percent (0–100) toward the next level. */
  percent: number;
}
