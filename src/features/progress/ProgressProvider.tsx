import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { UserStats } from '@/shared/types';
import { hasSupabaseConfig } from '@/shared/lib/env';
import { getSupabaseClient, type AppSupabaseClient } from '@/shared/lib/supabase';
import { useAuth } from '@/features/auth/useAuth';
import { ProgressContext, type AcademyProgressValue } from './context';

interface StatsRow {
  user_id: string;
  total_xp: number;
  level: number;
  streak: number;
  last_study_date: string | null;
  earned_badges: unknown;
}

function mapStats(row: StatsRow): UserStats {
  return {
    userId: row.user_id,
    totalXp: row.total_xp,
    level: row.level,
    streak: row.streak,
    lastStudyDate: row.last_study_date,
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
  const [loading, setLoading] = useState(false);

  const clientRef = useRef<AppSupabaseClient | null>(null);
  if (clientRef.current === null && hasSupabaseConfig()) {
    clientRef.current = getSupabaseClient();
  }
  const client = clientRef.current;

  const loadFor = useCallback(
    async (active: () => boolean) => {
      if (!client || !userId) {
        setCompletedSet(new Set());
        setStats(null);
        return;
      }
      setLoading(true);
      const [progressRes, statsRes] = await Promise.all([
        client.from('lesson_progress').select('lesson_id').eq('status', 'completed'),
        client.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
      ]);
      if (!active()) return;
      const progress = (progressRes.data ?? []) as Array<{ lesson_id: string }>;
      const statsRow = statsRes.data as StatsRow | null;
      setCompletedSet(new Set(progress.map((r) => r.lesson_id)));
      setStats(statsRow ? mapStats(statsRow) : null);
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

  const value = useMemo<AcademyProgressValue>(
    () => ({
      completedSet,
      isLessonCompleted: (id: string) => completedSet.has(id),
      stats,
      loading,
      completeLesson,
      refresh,
    }),
    [completedSet, stats, loading, completeLesson, refresh],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
