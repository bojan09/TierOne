import { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import LessonChrome from './LessonChrome';
import { getLessonBody } from './registry';
import {
  courseHref,
  getAdjacentLessons,
  getCourseBySlug,
  getLessonBreadcrumbs,
  getLessonBySlug,
} from '@/features/curriculum/selectors';
import { isLessonLocked } from '@/features/curriculum/locking';
import { useProgressView } from '@/features/progress/useProgressView';

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="max-w-screen-md mx-auto px-4 py-20 text-center">{children}</div>;
}

function NotFound() {
  return (
    <Centered>
      <h1 className="text-2xl font-bold text-white mb-3">Lesson not found</h1>
      <p className="text-slate-400 mb-6">
        That lesson doesn’t exist or hasn’t been published yet.
      </p>
      <Link to="/learn" className="btn-primary">
        Back to Academy
      </Link>
    </Centered>
  );
}

function LessonLoading() {
  return (
    <Centered>
      <div className="animate-pulse text-slate-500">Loading lesson…</div>
    </Centered>
  );
}

export default function LessonView() {
  const { courseSlug, lessonSlug } = useParams();
  const { completedSet } = useProgressView();

  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;
  const lesson = course && lessonSlug ? getLessonBySlug(course, lessonSlug) : undefined;
  const Body = lessonSlug ? getLessonBody(lessonSlug) : undefined;

  if (!course || !lesson || !Body) return <NotFound />;

  if (isLessonLocked(lesson, course, completedSet)) {
    return (
      <Centered>
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-3">{lesson.title}</h1>
        <p className="text-slate-400 mb-6">
          Complete the previous lesson to unlock this one.
        </p>
        <Link to={courseHref(course)} className="btn-primary">
          Back to {course.title}
        </Link>
      </Centered>
    );
  }

  const { prev, next } = getAdjacentLessons(course, lesson);

  return (
    <LessonChrome
      lessonId={lesson.id}
      courseId={course.id}
      title={lesson.title}
      courseTitle={course.title}
      courseHref={courseHref(course)}
      xp={lesson.xp}
      readTime={`~${lesson.estimatedMinutes} min`}
      icon={course.icon}
      breadcrumbs={getLessonBreadcrumbs(course, lesson)}
      prev={prev}
      next={next}
    >
      <Suspense fallback={<LessonLoading />}>
        <Body />
      </Suspense>
    </LessonChrome>
  );
}
