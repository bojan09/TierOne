import LearningPath from './LearningPath';
import NextStep from './NextStep';
import { TRACK_META, TRACK_LABELS, TRACK_ORDER } from './trackMeta';
import { useSeo } from '@/shared/lib/seo';

export default function LearnHome() {
  useSeo({
    title: 'Academy — All Courses & Tracks',
    description:
      'Browse every TierOne course: Help Desk, SysAdmin, CompTIA A+, and Scripting & Automation. Free, hands-on IT lessons with quizzes and labs.',
    path: '/learn',
  });

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-8"><NextStep /></div>

      <h1 className="text-2xl font-bold text-white mb-1">Academy</h1>
      <p className="text-sm text-slate-400 mb-10">
        Follow the path through each track — your progress updates as you complete lessons.
      </p>

      {TRACK_ORDER.map((track) => (
        <section key={track} className="mb-12">
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
