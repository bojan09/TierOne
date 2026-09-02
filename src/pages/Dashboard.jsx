import { Link } from 'react-router-dom'
import { getLevelForXP, BADGES } from '../hooks/useProgress.js'
import { useAcademyProgress } from '@/features/progress/useAcademyProgress'
import { curriculum } from '@/content/curriculum'
import { courseHref, getOrderedLessons } from '@/features/curriculum/selectors'
import StreakTracker from '../components/StreakTracker.jsx'
import DailyGoal from '@/features/progress/DailyGoal'
import NextStep from '@/features/curriculum/NextStep'
import StudyTimer from '../components/StudyTimer.jsx'
import { TRACK_META, TRACK_LABELS, TRACK_ORDER } from '@/features/curriculum/trackMeta'

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
        <span>{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { stats, completedSet, quizStats, loading, dueReviewCount } = useAcademyProgress()

  if (!stats && !loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-3">My Progress</h1>
        <p className="text-slate-400 mb-6">Sign in to track XP, streaks, and course progress across devices.</p>
        <Link to="/learn" className="btn-primary">Browse the Academy</Link>
      </div>
    )
  }

  const xp = stats?.totalXp ?? 0
  const { current, next, progress } = getLevelForXP(xp)
  const streak = stats?.streak ?? 0
  const earned = new Set(stats?.earnedBadges ?? [])
  const quizzesPassed = quizStats?.passed ?? 0

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">My Progress</h1>
      <p className="text-sm text-slate-400 mb-1">Server-synced across every device you sign in on.</p>
      <p className="text-xs text-slate-500 mb-8">
        New here?{' '}
        <Link to="/guide" className="text-brand-300 hover:text-brand-200 underline underline-offset-2">
          See the guide
        </Link>{' '}
        for a map of everything on the platform.
      </p>

      <div className="mb-6"><NextStep /></div>

      {dueReviewCount > 0 && (
        <Link to="/review"
          className="card p-4 mb-6 flex items-center gap-3 border-brand-500/40 hover:border-brand-500 transition-colors">
          <span className="text-2xl">🔁</span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-white">
              {dueReviewCount} lesson{dueReviewCount > 1 ? 's' : ''} due for review
            </span>
            <span className="block text-xs text-slate-400">Spaced repetition keeps what you've learned from fading.</span>
          </span>
          <span className="text-sm font-semibold text-brand-300">Start →</span>
        </Link>
      )}

      {/* Level + XP */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className={`text-lg font-bold ${current.color}`}>{current.title}</div>
            <div className="text-xs text-slate-500">Level {current.level}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white font-mono">{xp.toLocaleString()}</div>
            <div className="text-xs text-slate-500">total XP</div>
          </div>
        </div>
        <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-slate-500 mt-1.5">
          {next ? `${next.minXP - xp} XP to ${next.title}` : 'Max level reached 🏆'}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon="✅" label="Lessons" value={completedSet.size} sub="completed" />
        <StatCard icon="📝" label="Quizzes" value={quizzesPassed} sub="passed" />
        <StatCard icon="🔥" label="Streak" value={streak} sub={streak === 1 ? 'day' : 'days'} />
        <StatCard icon="🏅" label="Badges" value={earned.size} sub={`of ${BADGES.length}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Per-track course progress */}
          {TRACK_ORDER.map((track) => {
            const courses = curriculum.courses
              .filter((c) => c.track === track)
              .slice()
              .sort((a, b) => a.order - b.order)
            if (!courses.length) return null
            const accent = TRACK_META[track].color
            return (
              <section key={track}>
                <h2 className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} aria-hidden="true" />
                  {TRACK_LABELS[track]}
                </h2>
                <div className="space-y-2" style={{ '--tc': accent }}>
                  {courses.map((course) => {
                    const lessons = getOrderedLessons(course)
                    const done = lessons.filter((l) => completedSet.has(l.id)).length
                    const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0
                    return (
                      <Link key={course.id} to={courseHref(course)}
                        className="card track-card p-3 flex items-center gap-3 transition-colors">
                        <span className="text-xl flex-shrink-0">{course.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{course.title}</div>
                          <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full ${pct === 100 ? 'bg-accent-green' : ''}`}
                              style={pct === 100 ? { width: `${pct}%` } : { width: `${pct}%`, backgroundColor: accent }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 flex-shrink-0">{done}/{lessons.length}</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}

          {/* Badges */}
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Badges</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {BADGES.map((b) => {
                const has = earned.has(b.id)
                return (
                  <div key={b.id} title={b.desc}
                    className={`card p-3 text-center ${has ? '' : 'opacity-40 grayscale'}`}>
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{b.label}</div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DailyGoal />
          <StreakTracker />
          <StudyTimer />
        </div>
      </div>
    </div>
  )
}
