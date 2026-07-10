import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsData {
  scenariosPassed: number;
  scenariosTotal: number;
  labsCompleted: number;
  labsTotal: number;
  activity: ActivityDay[]; // last 14 days, oldest first
}

const EMPTY: AnalyticsData = {
  scenariosPassed: 0,
  scenariosTotal: 0,
  labsCompleted: 0,
  labsTotal: 0,
  activity: [],
};

function last14(): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(now.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  if (!hasSupabaseConfig()) return EMPTY;
  const client = await getSupabaseClient();
  const [scenAtt, labAtt, lessons, quizzes, scenAll, labAll] = await Promise.all([
    client.from('scenario_attempts').select('scenario_id, passed, created_at'),
    client.from('lab_attempts').select('lab_id, created_at'),
    client.from('lesson_progress').select('completed_at').eq('status', 'completed'),
    client.from('quiz_attempts').select('created_at'),
    client.from('scenarios').select('id'),
    client.from('labs').select('id'),
  ]);

  const scen = (scenAtt.data ?? []) as Array<{ scenario_id: string; passed: boolean; created_at: string }>;
  const labs = (labAtt.data ?? []) as Array<{ lab_id: string; created_at: string }>;
  const less = (lessons.data ?? []) as Array<{ completed_at: string | null }>;
  const quiz = (quizzes.data ?? []) as Array<{ created_at: string }>;

  const scenariosPassed = new Set(scen.filter((a) => a.passed).map((a) => a.scenario_id)).size;
  const labsCompleted = new Set(labs.map((a) => a.lab_id)).size;

  const buckets: Record<string, number> = {};
  const bump = (ts: string | null) => {
    if (!ts) return;
    const day = ts.slice(0, 10);
    buckets[day] = (buckets[day] ?? 0) + 1;
  };
  less.forEach((l) => bump(l.completed_at));
  quiz.forEach((q) => bump(q.created_at));
  scen.forEach((s) => bump(s.created_at));
  labs.forEach((l) => bump(l.created_at));

  const activity = last14().map((date) => ({ date, count: buckets[date] ?? 0 }));

  return {
    scenariosPassed,
    scenariosTotal: (scenAll.data ?? []).length,
    labsCompleted,
    labsTotal: (labAll.data ?? []).length,
    activity,
  };
}
