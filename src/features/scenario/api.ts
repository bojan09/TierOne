import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface ScenarioSummary {
  id: string;
  slug: string;
  title: string;
  intro_actor: string;
  intro_channel: string;
  intro_message: string;
  bonus_xp: number;
}

export interface ScenarioOption {
  id: number;
  sort: number;
  text: string;
}

export interface ScenarioStage {
  id: number;
  sort: number;
  kind: string;
  prompt: string;
  options: ScenarioOption[];
}

export interface ScenarioFull {
  id: string;
  slug: string;
  title: string;
  pass_pct: number;
  bonus_xp: number;
  intro: { actor: string; channel: string; message: string };
  stages: ScenarioStage[];
}

export interface ScenarioResultItem {
  stage_id: number;
  option_id: number;
  is_correct: boolean;
  points: number;
  feedback: string | null;
}

export interface ScenarioResult {
  score_pct: number;
  earned: number;
  max: number;
  passed: boolean;
  pass_pct: number;
  results: ScenarioResultItem[];
  total_xp: number;
  level: number;
}

export async function listScenarios(): Promise<ScenarioSummary[]> {
  if (!hasSupabaseConfig()) return [];
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from('scenarios')
    .select('id, slug, title, intro_actor, intro_channel, intro_message, bonus_xp')
    .order('sort', { ascending: true });
  if (error) {
    console.error('listScenarios failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as ScenarioSummary[];
}

export async function getScenarioBySlug(slug: string): Promise<ScenarioFull | null> {
  if (!hasSupabaseConfig()) return null;
  const client = await getSupabaseClient();
  const { data: rows, error: e1 } = await client
    .from('scenarios')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (e1 || !rows) {
    if (e1) console.error('scenario lookup failed:', e1.message);
    return null;
  }
  const id = (rows as unknown as { id: string }).id;
  const { data, error } = await client.rpc('get_scenario', { p_scenario_id: id } as never);
  if (error) {
    console.error('get_scenario failed:', error.message);
    return null;
  }
  return data as unknown as ScenarioFull;
}

export async function submitScenario(
  scenarioId: string,
  choices: Array<{ stage_id: number; option_id: number }>,
): Promise<ScenarioResult | null> {
  if (!hasSupabaseConfig()) return null;
  const client = await getSupabaseClient();
  const { data, error } = await client.rpc('submit_scenario', {
    p_scenario_id: scenarioId,
    p_choices: choices,
  } as never);
  if (error) {
    console.error('submit_scenario failed:', error.message);
    return null;
  }
  return data as unknown as ScenarioResult;
}
