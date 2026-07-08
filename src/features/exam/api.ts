import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface ExamQuestion { id: number; lesson_id: string; prompt: string; options: string[]; }
export interface ExamResult {
  total: number; correct: number; score_pct: number; passed: boolean;
  results: { id: number; correct: boolean; correct_index: number }[];
}

export async function getExam(track: string, count = 20): Promise<ExamQuestion[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('get_exam', { p_track: track, p_count: count } as never);
  if (error) { console.error('get_exam failed:', error.message); return []; }
  return (data ?? []) as unknown as ExamQuestion[];
}

export interface ExamHistoryRow { track: string; score_pct: number; passed: boolean; total: number; created_at: string; }

export async function getExamHistory(limit = 10): Promise<ExamHistoryRow[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('get_exam_history', { p_limit: limit } as never);
  if (error) { console.error('get_exam_history failed:', error.message); return []; }
  return (data ?? []) as unknown as ExamHistoryRow[];
}

export async function submitExam(ids: number[], answers: number[], track?: string): Promise<ExamResult | null> {
  if (!hasSupabaseConfig()) return null;
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('submit_exam', { p_ids: ids, p_answers: answers, p_track: track ?? null } as never);
  if (error) { console.error('submit_exam failed:', error.message); return null; }
  return data as unknown as ExamResult;
}
