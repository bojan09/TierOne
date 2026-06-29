import { Link } from 'react-router-dom';
import type { Track } from '@/shared/types';
import { curriculum } from '@/content/curriculum';
import { courseHref, getOrderedLessons } from '@/features/curriculum/selectors';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';

const TRACK_LABELS: Record<Track, string> = {
  helpdesk: 'Help Desk / Tier-1 Support',
  sysadmin: 'SysAdmin (Advanced)',
};

const TRACK_ORDER: Track[] = ['helpdesk', 'sysadmin'];

export default function LearnHome() {
  const { isLessonCompleted } = useAcademyProgress();

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Academy</h1>
      <p className="text-slate-400 mb-10 max-w-2xl">
        Structured, hands-on tracks that take you from the fundamentals to job-ready
        support and administration skills.
      </p>

      {TRACK_ORDER.map((track) => {
        const courses = curriculum.courses
          .filter((c) => c.track === track)
          .slice()
          .sort((a, b) => a.order - b.order);

        if (courses.length === 0) return null;

        return (
          <section key={track} className="mb-12">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              {TRACK_LABELS[track]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.map((course) => {
                const lessons = getOrderedLessons(course);
                const done = lessons.filter((l) => isLessonCompleted(l.id)).length;
                return (
                  <Link
                    key={course.id}
                    to={courseHref(course)}
                    className="card p-5 block hover:border-brand-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{course.icon}</span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white">{course.title}</h3>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-3 font-mono">
                          {done} / {lessons.length} lessons
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
