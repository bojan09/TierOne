import type { Track } from '@/shared/types';
import LearningPath from './LearningPath';
import NextStep from './NextStep';

const TRACK_LABELS: Record<Track, string> = {
  helpdesk: 'Help Desk / Tier-1 Support',
  sysadmin: 'SysAdmin (Advanced)',
  comptia: 'CompTIA A+ (Certification)',
  scripting: 'Scripting & Automation',
};
const TRACK_ORDER: Track[] = ['helpdesk', 'sysadmin', 'comptia', 'scripting'];

export default function LearnHome() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-8"><NextStep /></div>

      <h1 className="text-2xl font-bold text-white mb-1">Academy</h1>
      <p className="text-sm text-slate-400 mb-10">
        Follow the path through each track — your progress updates as you complete lessons.
      </p>

      {TRACK_ORDER.map((track) => (
        <section key={track} className="mb-12">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            {TRACK_LABELS[track]}
          </h2>
          <LearningPath track={track} />
        </section>
      ))}
    </div>
  );
}
