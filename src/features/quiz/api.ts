import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface QuizQuestion {
  id: number;
  sort: number;
  prompt: string;
  options: string[];
}

export interface QuizResultItem {
  question_id: number;
  correct: boolean;
}

export interface QuizResult {
  score_pct: number;
  correct: number;
  total: number;
  passed: boolean;
  pass_pct: number;
  results: QuizResultItem[];
  total_xp: number;
  level: number;
}

/** Fetch a lesson's questions WITHOUT the answer key (server strips it). */
export async function getLessonQuiz(lessonId: string): Promise<QuizQuestion[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('get_lesson_quiz', {
    p_lesson_id: lessonId,
  } as never);
  if (error) {
    console.error('get_lesson_quiz failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as QuizQuestion[];
}

/** Submit answers for server-side grading. Returns score + per-question correctness. */
export async function submitQuiz(
  lessonId: string,
  answers: number[],
): Promise<QuizResult | null> {
  if (!hasSupabaseConfig()) return null;
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('submit_quiz', {
    p_lesson_id: lessonId,
    p_answers: answers,
  } as never);
  if (error) {
    console.error('submit_quiz failed:', error.message);
    return null;
  }
  return data as unknown as QuizResult;
}
