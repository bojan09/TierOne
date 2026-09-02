import { Link, useParams } from 'react-router-dom';
import {
  courseHref,
  getCourseBySlug,
  getOrderedLessons,
  lessonHref,
} from '@/features/curriculum/selectors';
import { isLessonLocked } from '@/features/curriculum/locking';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useSeo, useJsonLd, SITE_URL } from '@/shared/lib/seo';

export default function CourseView() {
  const { courseSlug } = useParams();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;
  const { completedSet, isLessonCompleted } = useAcademyProgress();

  const courseLessons = course ? getOrderedLessons(course) : [];

  useSeo({
    title: course ? course.title : 'Course not found',
    description: course
      ? `${course.description} ${courseLessons.length} lessons, free and self-paced.`
      : 'This course could not be found.',
    path: course ? courseHref(course) : '/learn',
    noindex: !course,
  });

  useJsonLd(
    'course',
    course
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.description,
          provider: { '@type': 'Organization', name: 'TierOne', sameAs: SITE_URL },
          url: `${SITE_URL}${courseHref(course)}`,
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: `PT${courseLessons.reduce((s, l) => s + l.estimatedMinutes, 0)}M`,
          },
          numberOfCredits: courseLessons.length,
        }
      : null,
  );

  if (!course) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-3">Course not found</h1>
        <Link to="/learn" className="btn-primary">
          Back to Academy
        </Link>
      </div>
    );
  }

  const lessons = courseLessons;
  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const percent = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <nav className="text-xs text-slate-500 mb-6">
        <Link to="/learn" className="hover:text-slate-300">
          Academy
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{course.title}</span>
      </nav>

      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{course.icon}</span>
        <div className="min-w-0">
          <span className="tag mb-2 inline-block capitalize">{course.track}</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {course.title}
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">{course.description}</p>
        </div>
      </div>

      <div className="card p-4 mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-300 font-medium">Your progress</span>
          <span className="font-mono text-slate-400">
            {completedCount} / {lessons.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-700 overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ol className="space-y-3">
        {lessons.map((lesson, i) => {
          const locked = isLessonLocked(lesson, course, completedSet);
          const done = isLessonCompleted(lesson.id);

          const inner = (
            <div className="flex items-center gap-4">
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-mono ${
                  done
                    ? 'bg-accent-green/15 text-accent-green'
                    : locked
                      ? 'bg-surface-700 text-slate-600'
                      : 'bg-brand-500/15 text-brand-300'
                }`}
              >
                {done ? '✓' : locked ? '🔒' : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold ${locked ? 'text-slate-500' : 'text-white'}`}
                >
                  {lesson.title}
                </p>
                <p className="text-xs text-slate-500">
                  ~{lesson.estimatedMinutes} min · +{lesson.xp} XP
                </p>
              </div>
            </div>
          );

          return (
            <li key={lesson.id}>
              {locked ? (
                <div className="card p-4 opacity-60 cursor-not-allowed">{inner}</div>
              ) : (
                <Link
                  to={lessonHref(course, lesson)}
                  className="card p-4 block hover:border-brand-500/40 transition-colors"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8">
        <Link to={courseHref(course)} className="sr-only">
          {course.title}
        </Link>
      </div>
    </div>
  );
}
