import type { Difficulty, IsoTimestamp, Uuid } from './common';

/**
 * Virtual Help Desk scenarios (built out in P7). Scenarios are scripted
 * in-browser state machines — no VMs. The definition lives as structured
 * data/content; per-user run state is persisted to `scenario_state`.
 *
 * Kept intentionally minimal here; expanded when P7 begins.
 */

export type ScenarioStatus = 'not_started' | 'in_progress' | 'resolved' | 'closed';

export type ScenarioCategory =
  'email' | 'printing' | 'network' | 'account' | 'performance' | 'hardware' | 'software';

export interface ScenarioSummary {
  id: Uuid;
  slug: string;
  title: string;
  category: ScenarioCategory;
  difficulty: Difficulty;
  /** XP awarded on successful resolution. Awarded server-side. */
  xp: number;
}

/** Per-user run state. `state` is an opaque snapshot of the state machine. */
export interface ScenarioState {
  userId: Uuid;
  scenarioId: Uuid;
  status: ScenarioStatus;
  state: Record<string, unknown>;
  score: number | null;
  updatedAt: IsoTimestamp;
}
