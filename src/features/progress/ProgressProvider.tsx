import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { UserStats } from '@/shared/types';
import { hasSupabaseConfig } from '@/shared/lib/env';
import { getSupabaseClient, type AppSupabaseClient } from '@/shared/lib/supabase';
import { useAuth } from '@/features/auth/useAuth';
import type { QuizStats } from './context';
import { ProgressContext, type AcademyProgressValue } from './context';

interface StatsRow {
  user_id: string;
  total_xp: number;
  level: number;
  streak: number;
  last_study_date: string | null;
  last_lesson_id: string | null;
  earned_badges: unknown;
}

function mapStats(row: StatsRow): UserStats {
  return {
    userId: row.user_id,
    totalXp: row.total_xp,
    level: row.level,
    streak: row.streak,
    lastStudyDate: row.last_study_date,
    lastLessonId: row.last_lesson_id ?? null,
    earnedBadges: Array.isArray(row.earned_badges) ? (row.earned_badges as string[]) : [],
  };
}

/**
 * Server-authoritative progress for the spine-driven Academy. Reads the user's
 * completed lessons and stats, and routes completion through the
 * `complete_lesson` RPC. Replaces the legacy localStorage bridge for /learn.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quizStats, setQuizStats] = useState<QuizStats>({ passed: 0, avg: 0, bestByLesson: {}, passedIds: [] });
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set());
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [client, setClient] = useState<AppSupabaseClient | null>(null);
  useEffect(() => {
    let active = true;
    if (hasSupabaseConfig()) {
      getSupabaseClient().then((c) => {
        if (active) setClient(c);
      });
    }
    return () => {
      active = false;
    };
  }, []);

  const loadFor = useCallback(
    async (active: () => boolean) => {
      if (!client || !userId) {
        setCompletedSet(new Set());
        setStats(null);
        setQuizStats({ passed: 0, avg: 0, bestByLesson: {}, passedIds: [] });
        setActivityDates(new Set());
        setTodayCompleted(0);
        setDueReviewCount(0);
        return;
      }
      setLoading(true);
      const since = new Date(Date.now() - 13 * 86400000).toISOString().slice(0, 10);
      const [progressRes, statsRes, attemptsRes, activityRes, dueRes] = await Promise.all([
        client.from('lesson_progress').select('lesson_id, completed_at').eq('status', 'completed'),
        client.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
        client.from('quiz_attempts').select('lesson_id, score_pct, passed'),
        client.from('user_activity').select('activity_date').gte('activity_date', since),
        client.rpc('get_due_reviews', {} as never),
      ]);
      if (!active()) return;
      const progress = (progressRes.data ?? []) as Array<{ lesson_id: string; completed_at: string | null }>;
      const statsRow = statsRes.data as StatsRow | null;
      const attempts = (attemptsRes.data ?? []) as Array<{
        lesson_id: string;
        score_pct: number;
        passed: boolean;
      }>;
      const bestByLesson: Record<string, number> = {};
      const passedLessons = new Set<string>();
      for (const a of attempts) {
        bestByLesson[a.lesson_id] = Math.max(bestByLesson[a.lesson_id] ?? 0, a.score_pct);
        if (a.passed) passedLessons.add(a.lesson_id);
      }
      const bestScores = Object.values(bestByLesson);
      const avg = bestScores.length
        ? Math.round(bestScores.reduce((s, n) => s + n, 0) / bestScores.length)
        : 0;
      setCompletedSet(new Set(progress.map((r) => r.lesson_id)));
      setStats(statsRow ? mapStats(statsRow) : null);
      setQuizStats({ passed: passedLessons.size, avg, bestByLesson, passedIds: [...passedLessons] });
      const activity = (activityRes.data ?? []) as Array<{ activity_date: string }>;
      setActivityDates(new Set(activity.map((a) => new Date(a.activity_date).toDateString())));
      const todayStr = new Date().toDateString();
      setTodayCompleted(
        progress.filter((r) => r.completed_at && new Date(r.completed_at).toDateString() === todayStr).length,
      );
      setDueReviewCount(((dueRes.data ?? []) as unknown[]).length);
      setLoading(false);
    },
    [client, userId],
  );

  useEffect(() => {
    let active = true;
    void loadFor(() => active);
    return () => {
      active = false;
    };
  }, [loadFor]);

  const refresh = useCallback(() => loadFor(() => true), [loadFor]);

  const completeLesson = useCallback(
    async (lessonId: string) => {
      if (!client || !userId) return;
      const { data, error } = await client.rpc('complete_lesson', {
        p_lesson_id: lessonId,
      } as never);
      if (error) {
        console.error('complete_lesson failed:', error.message);
        return;
      }
      setCompletedSet((prev) => new Set(prev).add(lessonId));
      if (data) setStats(mapStats(data as unknown as StatsRow));
    },
    [client, userId],
  );

  const setLastLesson = useCallback(
    async (lessonId: string) => {
      if (!client || !userId) return;
      // Fire-and-forget; reflect optimistically so ResumeBanner updates at once.
      setStats((prev) => (prev ? { ...prev, lastLessonId: lessonId } : prev));
      const { error } = await client.rpc('set_last_lesson', {
        p_lesson_id: lessonId,
      } as never);
      if (error) console.error('set_last_lesson failed:', error.message);
    },
    [client, userId],
  );

  const value = useMemo<AcademyProgressValue>(
    () => ({
      completedSet,
      isLessonCompleted: (id: string) => completedSet.has(id),
      stats,
      quizStats,
      loading,
      completeLesson,
      setLastLesson,
      activityDates,
      todayCompleted,
      dueReviewCount,
      refresh,
    }),
    [completedSet, stats, quizStats, loading, completeLesson, setLastLesson, activityDates, todayCompleted, dueReviewCount, refresh],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
