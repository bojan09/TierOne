import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useAuth } from '@/features/auth/useAuth';

// Daily-goal loop: shows today's lessons vs the user's goal and ties it to the
// streak. Server-driven (todayCompleted from lesson_progress, goal from profile).
export default function DailyGoal() {
  const { todayCompleted, stats } = useAcademyProgress();
  const { profile } = useAuth();
  if (!profile) return null;

  const goal = profile.dailyGoal || 1;
  const met = todayCompleted >= goal;
  const pct = Math.min(100, Math.round((todayCompleted / goal) * 100));
  const streak = stats?.streak ?? 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">Today’s goal</span>
        <span className="text-xs font-mono text-slate-400">{Math.min(todayCompleted, goal)}/{goal}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${met ? 'bg-accent-green' : 'bg-brand-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {met
          ? `✅ Goal met${streak > 0 ? ` — ${streak}-day streak 🔥` : ''}`
          : `${goal - todayCompleted} more ${goal - todayCompleted === 1 ? 'lesson' : 'lessons'} to hit today’s goal`}
      </p>
    </div>
  );
}
