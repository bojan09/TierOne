import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LearningPath from './LearningPath';
import NextStep from './NextStep';
import { TRACK_META, TRACK_LABELS, TRACK_ORDER } from './trackMeta';
import { useSeo } from '@/shared/lib/seo';

export default function LearnHome() {
  const { hash } = useLocation();

  // Jumps to a track section for links like /learn#track-comptia (the
  // Academy mega-menu's "Browse all N courses" links). A browser's native
  // scroll-to-hash-on-load only works if the target element already exists
  // at parse time — it doesn't for a client-rendered id, so this does it
  // manually once the section is actually in the DOM. Layout's own
  // scroll-to-top effect defers to this when a hash is present.
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [hash]);

  useSeo({
    title: 'Academy — All Courses & Tracks',
    description:
      'Browse every TierOne course: Help Desk, SysAdmin, CompTIA A+, and Scripting & Automation. Free, hands-on IT lessons with quizzes and labs.',
    path: '/learn',
  });

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-8"><NextStep /></div>

      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Academy</h1>
          <p className="text-sm text-slate-400">
            Follow the path through each track — lessons unlock in order as you complete them, so
            you always know what&rsquo;s next.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('academy:open-search'))}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800/80
                     border border-surface-700 text-slate-400 hover:text-white
                     hover:border-slate-500 transition-all duration-150 flex-shrink-0 whitespace-nowrap"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[13px]">Search all lessons</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-700 border border-surface-600 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {TRACK_ORDER.map((track) => (
        // id lets nav/guide links jump straight to a track (e.g. /learn#track-helpdesk)
        // instead of dumping the visitor at the top of a long, all-tracks page.
        <section key={track} id={`track-${track}`} className="mb-12 scroll-mt-20">
          <h2 className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: TRACK_META[track].color }}
              aria-hidden="true"
            />
            {TRACK_LABELS[track]}
          </h2>
          <LearningPath track={track} />
        </section>
      ))}
    </div>
  );
}
