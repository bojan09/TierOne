import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Track } from '@/shared/types';
import { curriculum } from '@/content/curriculum';
import { courseHref, lessonHref, getOrderedLessons } from '@/features/curriculum/selectors';
import { isLessonLocked } from '@/features/curriculum/locking';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';

const TRACK_LABELS: Record<Track, string> = {
  helpdesk: 'Help Desk / Tier-1 Support',
  sysadmin: 'SysAdmin (Advanced)',
  comptia: 'CompTIA A+ (Certification)',
  scripting: 'Scripting & Automation',
};
const TRACK_ORDER: Track[] = ['helpdesk', 'sysadmin', 'comptia', 'scripting'];

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="w-3 h-3 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

export default function CourseTree({ onNavigate }: { onNavigate?: () => void }) {
  const { courseSlug, lessonSlug } = useParams();
  const { completedSet, isLessonCompleted } = useAcademyProgress();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <nav aria-label="Course navigation" className="space-y-6">
      {TRACK_ORDER.map((track) => {
        const courses = curriculum.courses
          .filter((c) => c.track === track)
          .slice()
          .sort((a, b) => a.order - b.order);
        if (courses.length === 0) return null;

        return (
          <div key={track}>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2">
              {TRACK_LABELS[track]}
            </p>
            <ul className="space-y-0.5">
              {courses.map((course) => {
                const lessons = getOrderedLessons(course);
                const done = lessons.filter((l) => isLessonCompleted(l.id)).length;
                const isActiveCourse = course.slug === courseSlug;
                const isOpen = collapsed[course.id] === undefined ? isActiveCourse : !collapsed[course.id];

                return (
                  <li key={course.id}>
                    <button
                      onClick={() => setCollapsed((c) => ({ ...c, [course.id]: isOpen }))}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-800/60 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base flex-shrink-0">{course.icon}</span>
                      <span className="flex-1 min-w-0 text-sm font-medium text-slate-200 truncate">
                        {course.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                        {done}/{lessons.length}
                      </span>
                    </button>

                    {isOpen && (
                      <ul className="ml-4 pl-3 border-l border-surface-700 space-y-0.5 mt-0.5 mb-1">
                        {lessons.map((lesson) => {
                          const active = isActiveCourse && lesson.slug === lessonSlug;
                          const completed = isLessonCompleted(lesson.id);
                          const locked = isLessonLocked(lesson, course, completedSet);
                          return (
                            <li key={lesson.id}>
                              <Link
                                to={lessonHref(course, lesson)}
                                onClick={onNavigate}
                                aria-current={active ? 'page' : undefined}
                                className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-md text-xs transition-colors ${
                                  active
                                    ? 'bg-brand-500/10 text-brand-300 font-medium'
                                    : 'text-slate-400 hover:text-white hover:bg-surface-800/40'
                                }`}
                              >
                                <span className="w-3.5 flex-shrink-0 flex justify-center">
                                  {completed ? <CheckIcon /> : locked ? <LockIcon /> : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-surface-600" />
                                  )}
                                </span>
                                <span className="flex-1 min-w-0 truncate leading-snug">{lesson.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                        <li>
                          <Link
                            to={courseHref(course)}
                            onClick={onNavigate}
                            className="block pl-2 py-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            Course overview →
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
