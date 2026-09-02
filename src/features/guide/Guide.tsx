import { Link } from 'react-router-dom';
import { useSeo } from '@/shared/lib/seo';

interface GuideItem {
  icon: string;
  title: string;
  desc: string;
  href: string;
}

interface GuideGroup {
  title: string;
  blurb: string;
  items: GuideItem[];
}

const PATH_STEPS = [
  { label: 'Learn', href: '/learn', icon: '📚' },
  { label: 'Practice', href: '/simulator', icon: '🎫' },
  { label: 'Review', href: '/review', icon: '🔁' },
  { label: 'Exam', href: '/exam', icon: '⏱️' },
  { label: 'Certificate', href: '/certificates', icon: '🏅' },
];

const GROUPS: GuideGroup[] = [
  {
    title: 'Learn',
    blurb: 'The curriculum. Every lesson lives here, across 4 tracks — pick any order, nothing is locked.',
    items: [
      {
        icon: '📚',
        title: 'Academy',
        desc: 'Browse tracks → courses → lessons. Each lesson has a short quiz worth XP.',
        href: '/learn',
      },
    ],
  },
  {
    title: 'Practice',
    blurb: 'Apply what you just learned in something closer to the real job.',
    items: [
      { icon: '🎫', title: 'Virtual Help Desk', desc: 'Work real support tickets end to end.', href: '/simulator' },
      { icon: '💻', title: 'Simulated Labs', desc: 'Run real commands in a safe in-browser terminal.', href: '/labs' },
      { icon: '📝', title: 'Documentation Practice', desc: 'Write resolution notes, get AI feedback.', href: '/practice' },
    ],
  },
  {
    title: 'Reinforce',
    blurb: 'Make it stick, and check it under time pressure.',
    items: [
      { icon: '🔁', title: 'Spaced Review', desc: 'Lessons you passed resurface right before you’d forget them.', href: '/review' },
      { icon: '⏱️', title: 'Practice Exam', desc: 'Timed, cert-style exam across what you’ve completed.', href: '/exam' },
    ],
  },
  {
    title: 'Prove it',
    blurb: 'Turn progress into something you can show an employer.',
    items: [
      { icon: '🎯', title: 'Interview Prep', desc: 'Rehearse real interview questions with model answers.', href: '/interview' },
      { icon: '📊', title: 'Career Readiness', desc: 'A live employability score and what to improve next.', href: '/analytics' },
      { icon: '🏅', title: 'Certificates', desc: 'Finish a track, claim a certificate anyone can verify.', href: '/certificates' },
    ],
  },
  {
    title: 'Reference tools',
    blurb: 'Not curriculum — quick lookups for when you’re working and need an answer fast.',
    items: [
      { icon: '📇', title: 'Cheat Sheets', desc: 'Linux, PowerShell, and networking command references.', href: '/cheatsheets' },
      { icon: '🔌', title: 'Port Lookup', desc: 'Search 35+ common ports and what uses them.', href: '/port-lookup' },
      { icon: '📖', title: 'Glossary', desc: '70+ IT terms defined in plain language.', href: '/glossary' },
      { icon: '🧭', title: 'IT Models', desc: 'OSI, TCP/IP, ITIL, CIA Triad, Zero Trust, DevOps — one-page references.', href: '/it-models' },
      { icon: '🖥️', title: 'VMware Lab Setup', desc: 'Configure a local VM lab to follow along with server lessons.', href: '/vmware-setup' },
    ],
  },
  {
    title: 'Track it',
    blurb: 'See what you’ve done and what’s next, in one place.',
    items: [
      { icon: '👤', title: 'My Progress', desc: 'XP, level, streak, badges, and where you left off.', href: '/dashboard' },
    ],
  },
];

export default function Guide() {
  useSeo({
    title: 'Guide — How TierOne Works',
    description: 'A map of every TierOne feature — Academy, practice tools, review, exams, and career prep — and how they fit together.',
    path: '/guide',
    noindex: true,
  });

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">How TierOne works</h1>
      <p className="text-sm text-slate-400 mb-10 max-w-2xl">
        A map of everything on the platform, grouped by what it&rsquo;s for. Nothing here is
        required in order — jump to whatever&rsquo;s useful right now.
      </p>

      {/* Suggested path */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          A typical path
        </h2>
        <div className="card p-4 sm:p-5 flex flex-wrap items-center gap-2 sm:gap-3">
          {PATH_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-3">
              <Link
                to={step.href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/80 border border-surface-700
                           hover:border-brand-500/50 hover:bg-surface-700 transition-colors"
              >
                <span aria-hidden="true">{step.icon}</span>
                <span className="text-sm font-medium text-white whitespace-nowrap">{step.label}</span>
              </Link>
              {i < PATH_STEPS.length - 1 && (
                <span className="hidden sm:inline text-slate-600 flex-shrink-0" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Groups */}
      <div className="space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              {group.title}
            </h2>
            <p className="text-sm text-slate-400 mb-5 max-w-2xl">{group.blurb}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="card p-4 flex items-start gap-3 hover:border-brand-500/40 transition-colors"
                >
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-white text-sm">{item.title}</span>
                    <span className="block text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
