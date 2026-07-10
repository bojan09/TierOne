import { Link } from 'react-router-dom';
import type { Track } from '@/shared/types';
import { curriculum } from '@/content/curriculum';
import { courseHref, getOrderedLessons } from '@/features/curriculum/selectors';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { TRACK_META } from '@/features/curriculum/trackMeta';

const DIFF_BADGE: Record<string, string> = {
  advanced: 'text-brand-300 border-brand-500/30 bg-brand-500/5',
  intermediate: 'text-accent-amber border-accent-amber/30 bg-accent-amber/5',
  beginner: 'text-accent-green border-accent-green/30 bg-accent-green/5',
};

export default function LearningPath({ track }: { track: Track }) {
  const { isLessonCompleted } = useAcademyProgress();
  const accent = TRACK_META[track].color;
  const courses = curriculum.courses
    .filter((c) => c.track === track)
    .slice()
    .sort((a, b) => a.order - b.order);
  if (courses.length === 0) return null;

  return (
    <ol className="relative" style={{ '--tc': accent } as React.CSSProperties}>
      {courses.map((course, i) => {
        const lessons = getOrderedLessons(course);
        const done = lessons.filter((l) => isLessonCompleted(l.id)).length;
        const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
        const state = pct === 100 ? 'complete' : done > 0 ? 'active' : 'todo';
        const isLast = i === courses.length - 1;

        return (
          <li key={course.id} className="relative flex gap-4 pb-3">
            {/* Rail: node + connector */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 z-10 ${
                  state === 'complete'
                    ? 'bg-accent-green/15 border-accent-green text-accent-green'
                    : state === 'active'
                      ? 'text-white'
                      : 'bg-surface-800 border-surface-600 text-slate-500'
                }`}
                style={
                  state === 'active'
                    ? { backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`, borderColor: accent, color: accent }
                    : undefined
                }
              >
                {state === 'complete' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-base">{course.icon}</span>
                )}
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-surface-700 -mt-1" />}
            </div>

            {/* Course card */}
            <Link
              to={courseHref(course)}
              className="card track-card p-4 flex-1 min-w-0 transition-colors -mt-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white">{course.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{course.description}</p>
                </div>
                <span
                  className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    DIFF_BADGE[course.difficulty] || DIFF_BADGE.beginner
                  }`}
                >
                  {course.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-1.5 rounded-full bg-surface-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${state === 'complete' ? 'bg-accent-green' : ''}`}
                    style={state === 'complete' ? { width: `${pct}%` } : { width: `${pct}%`, backgroundColor: accent }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">
                  {done}/{lessons.length}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
