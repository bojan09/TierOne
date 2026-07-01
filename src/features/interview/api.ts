import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface InterviewQuestion {
  id: number;
  category: string;
  track: string | null;
  difficulty: string;
  prompt: string;
  sample_answer: string;
  key_points: string[];
  sort: number;
}

export async function listInterviewQuestions(): Promise<InterviewQuestion[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('interview_questions')
    .select('id, category, track, difficulty, prompt, sample_answer, key_points, sort')
    .order('category', { ascending: true })
    .order('sort', { ascending: true });
  if (error) {
    console.error('listInterviewQuestions failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as InterviewQuestion[];
}
