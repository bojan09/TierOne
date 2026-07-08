import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculum } from '@/content/curriculum'
import { useAcademyProgress } from '@/features/progress/useAcademyProgress'

// Spine-driven course cards. Counts, XP, links and progress all derive from the
// curriculum spine + server progress — no hardcoded lists to drift out of date.
const COURSES = curriculum.courses
  .slice()
  .sort((a, b) => (a.track === b.track ? a.order - b.order : a.track === 'helpdesk' ? -1 : 1))
  .map((c) => {
    const lessons = curriculum.lessons.filter((l) => l.courseId === c.id)
    return {
      id: c.id,
      slug: c.slug,
      icon: c.icon,
      title: c.title,
      description: c.description,
      track: c.track,
      href: `/learn/${c.slug}`,
      lessonIds: lessons.map((l) => l.id),
      lessonCount: lessons.length,
      totalXP: lessons.reduce((s, l) => s + (l.xp ?? 0), 0),
    }
  })

const TOTAL_LESSONS = curriculum.lessons.length

const TRACK_TABS = [
  { id: 'all', label: 'All Courses' },
  { id: 'helpdesk', label: 'Help Desk' },
  { id: 'sysadmin', label: 'SysAdmin' },
]

const TRACK_BADGE = {
  helpdesk: { label: 'Help Desk', cls: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20' },
  sysadmin: { label: 'SysAdmin', cls: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20' },
  comptia: { label: 'CompTIA A+', cls: 'bg-accent-green/10 text-accent-green border-accent-green/20' },
  scripting: { label: 'Scripting', cls: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20' },
}

const FEATURES = [
  { icon: '🎫', title: 'Virtual Help Desk', desc: 'Work real support tickets end to end — triage, diagnose, resolve, and communicate like the job demands.' },
  { icon: '💻', title: 'Simulated Labs', desc: 'Practice real commands in a safe in-browser terminal — nothing to install, nothing to break.' },
  { icon: '📝', title: 'AI Documentation Feedback', desc: 'Write resolution notes and KB articles, then get scored against a professional rubric.' },
  { icon: '🎯', title: 'Interview Prep', desc: 'Rehearse the behavioral and technical questions you\'ll actually be asked, with model answers.' },
  { icon: '📊', title: 'Career Readiness', desc: 'A live employability score shows exactly how job-ready you are and what to do next.' },
  { icon: '🏅', title: 'Verifiable Certificates', desc: 'Finish a track and claim a shareable certificate employers can verify by code.' },
]

const QUICK_ACCESS = [
  { href: '/learn', icon: '📚', label: 'Academy', desc: 'All lessons & tracks' },
  { href: '/simulator', icon: '🎫', label: 'Help Desk', desc: 'Practice tickets' },
  { href: '/labs', icon: '💻', label: 'Labs', desc: 'Terminal practice' },
  { href: '/practice', icon: '📝', label: 'Doc Practice', desc: 'AI-graded writing' },
  { href: '/interview', icon: '🎯', label: 'Interview Prep', desc: 'Common questions' },
  { href: '/analytics', icon: '📊', label: 'Career Readiness', desc: 'Employability score' },
  { href: '/certificates', icon: '🏅', label: 'Certificates', desc: 'Proof of skills' },
  { href: '/dashboard', icon: '👤', label: 'My Progress', desc: 'XP & badges' },
]

function ProgressPill({ completed, total }) {
  if (completed === 0 || total === 0) return null
  const pct = Math.round((completed / total) * 100)
  const color = pct === 100 ? 'from-accent-green to-emerald-400' : 'from-brand-500 to-brand-400'
  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
        <span>{completed}/{total} lessons</span><span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function CourseCard({ course, completedSet }) {
  const completed = course.lessonIds.filter((id) => completedSet.has(id)).length
  const total = course.lessonCount
  const isComplete = completed === total && total > 0
  const badge = TRACK_BADGE[course.track] || { label: course.track, cls: 'bg-surface-700 text-slate-300 border-surface-600' }
  return (
    <Link
      to={course.href}
      className="course-card block group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      aria-label={`${course.title} — ${total} lessons`}
    >
      <div className="pt-4 pb-5 px-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-2xl leading-none">{course.icon}</span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isComplete ? (
              <span className="tag text-[10px] bg-accent-green/10 text-accent-green border-accent-green/20 py-0.5">✓ Complete</span>
            ) : (
              <span className={`tag text-[10px] border py-0.5 ${badge.cls}`}>{badge.label}</span>
            )}
          </div>
        </div>
        <h3 className="font-bold text-white text-sm leading-snug mb-1.5 group-hover:text-brand-300 transition-colors">{course.title}</h3>
        <p className="text-slate-400 text-[12px] leading-relaxed line-clamp-2 mb-3">{course.description}</p>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>{course.lessonCount} lessons</span>
          <span className="text-slate-700">·</span>
          <span className="text-accent-amber">{course.totalXP} XP</span>
        </div>
        <ProgressPill completed={completed} total={total} />
      </div>
    </Link>
  )
}

export default function Home() {
  const { completedSet, stats } = useAcademyProgress()
  const xp = stats?.totalXp ?? 0
  const completedCount = completedSet.size
  const hasStarted = completedCount > 0

  const [activeTrack, setActiveTrack] = useState('all')
  const filteredCourses = useMemo(
    () => (activeTrack === 'all' ? COURSES : COURSES.filter((c) => c.track === activeTrack)),
    [activeTrack],
  )
  const spotlightCourses = COURSES.slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-surface-700/50">
        <div className="absolute inset-0 pointer-events-none select-none" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-6 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-semibold text-brand-300 tracking-wide">Two tracks · Help Desk → SysAdmin · Hands-on, job-focused</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-5 fade-up">
            Break into IT, <span className="text-brand-400">one skill at a time.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed fade-up">
            TierZero turns real IT work into hands-on practice — {TOTAL_LESSONS} lessons, live support tickets,
            terminal labs, and AI feedback — so you learn the job, not just the theory.
          </p>
          <div className="flex flex-wrap gap-3 justify-center fade-up">
            <Link to={hasStarted ? '/learn' : '/login'} className="btn-primary">
              {hasStarted ? 'Resume learning →' : 'Start learning free →'}
            </Link>
            <Link to="/learn" className="btn-secondary">Explore the Academy</Link>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono mb-1">Start here</p>
            <h2 className="section-title">Popular starting points</h2>
          </div>
          <Link to="/learn" className="btn-ghost text-sm">All courses →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {spotlightCourses.map((course, i) => (
            <div key={course.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <CourseCard course={course} completedSet={completedSet} />
            </div>
          ))}
        </div>
      </section>

      {/* ── ALL COURSES + TRACK TABS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono mb-1">Complete library</p>
            <h2 className="section-title">All Learning Paths</h2>
          </div>
          <p className="text-slate-500 text-xs font-mono">
            {filteredCourses.length} courses · {filteredCourses.reduce((s, c) => s + c.lessonCount, 0)} lessons
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter courses by track">
          {TRACK_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTrack === tab.id}
              onClick={() => setActiveTrack(tab.id)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                activeTrack === tab.id
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                  : 'bg-surface-800 text-slate-400 border-surface-700 hover:border-surface-600 hover:text-slate-300',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course, i) => (
            <div key={course.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <CourseCard course={course} completedSet={completedSet} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-t border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono text-center mb-2">What makes this different</p>
          <h2 className="section-title text-center mb-2">Practice the job, not just the theory</h2>
          <p className="text-slate-400 text-sm text-center mb-10 max-w-xl mx-auto leading-relaxed">
            Every track pairs lessons with the real work — tickets, terminals, documentation, and interviews — and tracks your progress to hire-ready.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card p-6 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-bold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS ── */}
      <section className="border-t border-surface-700/50 bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="section-title mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACCESS.map((t) => (
              <Link key={t.href} to={t.href} className="card p-4 flex flex-col gap-2 hover:border-brand-600/40 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">{t.label}</p>
                  <p className="text-slate-500 text-[11px] font-mono">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-surface-700/50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            {hasStarted ? 'Keep the momentum going.' : 'Ready to level up?'}
          </h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-lg mx-auto">
            {hasStarted
              ? `You've completed ${completedCount} lessons and earned ${xp} XP. The next lesson is waiting.`
              : 'Start with the Help Desk track — the fastest path to your first IT role — or jump to whichever skill you need right now.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to={hasStarted ? '/learn' : '/login'} className="btn-primary">
              {hasStarted ? 'Resume learning →' : 'Start learning free →'}
            </Link>
            <Link to="/analytics" className="btn-secondary">
              {hasStarted ? 'View career readiness' : 'See how it works'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
