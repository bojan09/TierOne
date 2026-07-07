import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';
import type { QuizResultItem } from '@/features/quiz/api';

export interface DueReview {
  lesson_id: string;
  due_at: string;
  reps: number;
}

export interface GradeResult {
  score_pct: number;
  correct: number;
  total: number;
  passed: boolean;
  pass_pct: number;
  results: QuizResultItem[];
}

export interface ScheduleResult {
  interval_days: number;
  next_due: string;
}

/** Lessons the user has passed that are due (or never scheduled = due now). */
export async function getDueReviews(): Promise<DueReview[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('get_due_reviews', {} as never);
  if (error) {
    console.error('get_due_reviews failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as DueReview[];
}

/** Grade a review answer set server-side (read-only; no scheduling). */
export async function gradeReview(lessonId: string, answers: number[]): Promise<GradeResult | null> {
  if (!hasSupabaseConfig()) return null;
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('grade_review', {
    p_lesson_id: lessonId,
    p_answers: answers,
  } as never);
  if (error) {
    console.error('grade_review failed:', error.message);
    return null;
  }
  return data as unknown as GradeResult;
}

/** Reschedule via SM-2 from a recall self-rating. quality: 0=Again,1=Hard,2=Good,3=Easy. */
export async function scheduleReview(lessonId: string, quality: number): Promise<ScheduleResult | null> {
  if (!hasSupabaseConfig()) return null;
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('schedule_review', {
    p_lesson_id: lessonId,
    p_quality: quality,
  } as never);
  if (error) {
    console.error('schedule_review failed:', error.message);
    return null;
  }
  return data as unknown as ScheduleResult;
}
