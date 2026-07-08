import { Link } from 'react-router-dom';
import type { Track } from '@/shared/types';
import { curriculum } from '@/content/curriculum';
import { getOrderedLessons, lessonHref, getLessonAndCourseById } from '@/features/curriculum/selectors';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useAuth } from '@/features/auth/useAuth';

const TRACK_LABEL: Record<Track, string> = {
  helpdesk: 'Help Desk', sysadmin: 'SysAdmin', comptia: 'CompTIA A+', scripting: 'Scripting',
};

function firstIncomplete(track: Track, done: Set<string>) {
  const courses = curriculum.courses.filter((c) => c.track === track).slice().sort((a, b) => a.order - b.order);
  for (const c of courses) {
    for (const l of getOrderedLessons(c)) {
      if (!done.has(l.id)) return { course: c, lesson: l };
    }
  }
  return null;
}

export default function NextStep() {
  const { profile } = useAuth();
  const { completedSet, stats } = useAcademyProgress();
  if (!profile) return null;

  const track = (profile.track ?? 'helpdesk') as Track;

  // Prefer resuming the last opened lesson if it's still incomplete and in-track.
  let target = null as null | { course: (typeof curriculum.courses)[number]; lesson: (typeof curriculum.lessons)[number] };
  const last = stats?.lastLessonId ? getLessonAndCourseById(stats.lastLessonId) : undefined;
  if (last && last.course.track === track && !completedSet.has(last.lesson.id)) {
    target = last;
  }
  if (!target) target = firstIncomplete(track, completedSet);

  if (!target) {
    return (
      <div className="card p-5 border-accent-green/30 bg-accent-green/5">
        <p className="text-sm font-semibold text-white">🎉 You've finished the {TRACK_LABEL[track]} track!</p>
        <p className="text-xs text-slate-400 mt-1">Explore another track or review what you've learned.</p>
        <div className="flex gap-3 mt-3">
          <Link to="/learn" className="btn-secondary text-xs">Browse tracks</Link>
          <Link to="/review" className="btn-primary text-xs">Review</Link>
        </div>
      </div>
    );
  }

  const resuming = !!last && last.lesson.id === target.lesson.id;
  return (
    <Link
      to={lessonHref(target.course, target.lesson)}
      className="card p-5 flex items-center gap-4 border-brand-500/40 hover:border-brand-500 transition-colors"
    >
      <span className="text-3xl flex-shrink-0">{target.course.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-brand-300 uppercase tracking-widest">
          {resuming ? 'Continue where you left off' : 'Your next step'} · {TRACK_LABEL[track]}
        </p>
        <p className="text-base font-bold text-white truncate">{target.lesson.title}</p>
        <p className="text-xs text-slate-500 truncate">{target.course.title}</p>
      </div>
      <span className="btn-primary text-sm flex-shrink-0">{resuming ? 'Resume' : 'Start'} →</span>
    </Link>
  );
}
