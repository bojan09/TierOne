import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface DocExercise {
  id: string;
  track: string;
  title: string;
  prompt: string;
  context: string;
  criteria: string[];
  model_answer: string;
  sort: number;
}

export interface CriterionResult {
  label: string;
  met: boolean;
  note?: string;
}

export type GradeResult =
  | { mode: 'ai'; score: number; feedback: string; criteria: CriterionResult[] }
  | { mode: 'regular' } // AI not configured / unavailable — self-check
  | { mode: 'rate_limited'; cap: number };

export async function listDocExercises(): Promise<DocExercise[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('doc_exercises')
    .select('id, track, title, prompt, context, criteria, model_answer, sort')
    .order('sort', { ascending: true });
  if (error) {
    console.error('listDocExercises failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as DocExercise[];
}

export async function gradeDoc(exerciseId: string, content: string): Promise<GradeResult> {
  if (!hasSupabaseConfig()) return { mode: 'regular' };
  const client = getSupabaseClient();
  try {
    const { data, error } = await client.functions.invoke('grade-doc', {
      body: { exercise_id: exerciseId, content },
    });
    // Function missing / network / non-2xx → fall back to regular self-check.
    if (error) {
      console.warn('grade-doc unavailable, using regular mode:', error.message);
      return { mode: 'regular' };
    }
    const d = data as {
      configured?: boolean;
      rate_limited?: boolean;
      cap?: number;
      error?: string;
      score?: number;
      feedback?: string;
      criteria_results?: CriterionResult[];
    };
    if (!d || d.configured === false || d.error) return { mode: 'regular' };
    if (d.rate_limited) return { mode: 'rate_limited', cap: d.cap ?? 0 };
    return {
      mode: 'ai',
      score: d.score ?? 0,
      feedback: d.feedback ?? '',
      criteria: d.criteria_results ?? [],
    };
  } catch (e) {
    console.warn('grade-doc threw, using regular mode:', e);
    return { mode: 'regular' };
  }
}
