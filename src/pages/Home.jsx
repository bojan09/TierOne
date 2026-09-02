import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculum } from '@/content/curriculum'
import { useAcademyProgress } from '@/features/progress/useAcademyProgress'
import { TRACK_META, DEFAULT_TRACK_META } from '@/features/curriculum/trackMeta'
import { useSeo } from '@/shared/lib/seo'

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
const TOTAL_COURSES = curriculum.courses.length
const TOTAL_QUIZZES = curriculum.lessons.filter((l) => l.hasQuiz).length

const TRACK_TABS = [
  { id: 'all', label: 'All Courses' },
  { id: 'helpdesk', label: 'Help Desk' },
  { id: 'sysadmin', label: 'SysAdmin' },
  { id: 'comptia', label: 'CompTIA A+' },
  { id: 'scripting', label: 'Scripting' },
]

const HERO_STATS = [
  { value: '4', label: 'Tracks' },
  { value: String(TOTAL_COURSES), label: 'Courses' },
  { value: String(TOTAL_LESSONS), label: 'Lessons' },
  { value: String(TOTAL_QUIZZES), label: 'Quizzes' },
]

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
  const meta = TRACK_META[course.track] || DEFAULT_TRACK_META
  return (
    <Link
      to={course.href}
      style={{ '--tc': meta.color }}
      className="course-card track-card block group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Track-coloured top accent */}
      <div className="track-accent-bar" />
      <div className="pt-4 pb-5 px-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className="grid place-items-center w-10 h-10 rounded-xl text-xl leading-none border"
            style={{
              background: 'color-mix(in srgb, var(--tc) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--tc) 26%, transparent)',
            }}
          >
            {course.icon}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isComplete ? (
              <span className="tag text-[10px] bg-accent-green/10 text-accent-green border-accent-green/20 py-0.5">✓ Complete</span>
            ) : (
              <span className="badge track-chip text-[10px] py-0.5">{meta.label}</span>
            )}
          </div>
        </div>
        <h3 className="font-bold text-white text-sm leading-snug mb-1.5 transition-colors group-hover:text-brand-300">{course.title}</h3>
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

  useSeo({
    title: 'Free Hands-On IT Training',
    description: `TierOne turns real IT work into hands-on practice — ${TOTAL_LESSONS} lessons, live support tickets, terminal labs, and AI feedback across Help Desk, SysAdmin, CompTIA A+, and Scripting.`,
    path: '/',
  })

  const [activeTrack, setActiveTrack] = useState('all')
  const filteredCourses = useMemo(
    () => (activeTrack === 'all' ? COURSES : COURSES.filter((c) => c.track === activeTrack)),
    [activeTrack],
  )
  const spotlightCourses = COURSES.slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-surface-700/50 aurora-bg">
        <div className="absolute inset-0 pointer-events-none select-none grid-overlay" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-8 items-center">
            {/* Left — copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 mb-6 fade-up backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="hero-eyebrow text-xs font-semibold text-brand-200 tracking-wide">4 tracks · Help Desk → SysAdmin · Hands-on, job-focused</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 fade-up text-white">
                Break into IT,<br />
                <span className="aurora-text">one skill at a time.</span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed fade-up">
                TierOne turns real IT work into hands-on practice — {TOTAL_LESSONS} lessons, live support tickets,
                terminal labs, and AI feedback — so you learn the job, not just the theory.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start fade-up mb-10">
                <Link to={hasStarted ? '/learn' : '/login'} className="btn-primary">
                  {hasStarted ? 'Resume learning →' : 'Start learning free →'}
                </Link>
                <Link to="/learn" className="btn-secondary">Explore the Academy</Link>
              </div>
              {/* Real spine stats */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0 fade-up">
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{s.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — terminal motif */}
            <div className="fade-up hidden sm:block" style={{ animationDelay: '120ms' }}>
              <div className="terminal-window max-w-md mx-auto">
                <div className="terminal-bar">
                  <span className="terminal-dot bg-accent-red" />
                  <span className="terminal-dot bg-accent-amber" />
                  <span className="terminal-dot bg-accent-green" />
                  <span className="ml-2 text-[11px] text-slate-500 font-mono">tierone — ticket #4821</span>
                </div>
                <div className="terminal-body space-y-1.5">
                  <p><span className="text-accent-green">➜</span> <span className="text-slate-400">whoami</span></p>
                  <p className="text-brand-200">tier-1 support · on shift</p>
                  <p className="mt-2"><span className="text-accent-green">➜</span> <span className="text-slate-400">diagnose --user jsmith --issue "no vpn"</span></p>
                  <p className="text-slate-500">→ checking client build…        <span className="text-accent-green">ok</span></p>
                  <p className="text-slate-500">→ testing gateway 10.0.0.1…      <span className="text-accent-green">ok</span></p>
                  <p className="text-slate-500">→ auth token…                    <span className="text-accent-red">expired</span></p>
                  <p className="mt-2 text-accent-cyan">✔ resolution: re-issue MFA token</p>
                  <p className="text-slate-400">➜ <span className="blink-cursor" /></p>
                </div>
              </div>
            </div>
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
