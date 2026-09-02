import { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LessonChrome from './LessonChrome';
import { getLessonBody } from './registry';
import { Quiz } from '@/features/quiz/Quiz';
import {
  courseHref,
  getAdjacentLessons,
  getCourseBySlug,
  getLessonBreadcrumbs,
  getLessonBySlug,
  getOrderedLessons,
  lessonHref,
} from '@/features/curriculum/selectors';
import { isLessonLocked } from '@/features/curriculum/locking';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useAuth } from '@/features/auth/useAuth';
import { useSeo } from '@/shared/lib/seo';

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
  const { session } = useAuth();
  const { completedSet, completeLesson, setLastLesson } = useAcademyProgress();

  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;
  const lesson = course && lessonSlug ? getLessonBySlug(course, lessonSlug) : undefined;
  const Body = lesson ? getLessonBody(lesson.id) : undefined;
  const lessonId = lesson?.id;
  const locked = course && lesson ? isLessonLocked(lesson, course, completedSet) : false;

  // Server-authoritative "continue where you left off".
  useEffect(() => {
    if (lessonId) setLastLesson(lessonId);
  }, [lessonId, setLastLesson]);

  useSeo({
    title: lesson ? lesson.title : 'Lesson not found',
    description:
      lesson && course
        ? `${lesson.title} — part of ${course.title} on TierOne. ~${lesson.estimatedMinutes} min, +${lesson.xp} XP.`
        : 'This lesson could not be found.',
    path: course && lesson ? lessonHref(course, lesson) : '/learn',
    type: 'article',
    noindex: !course || !lesson || locked,
  });

  if (!course || !lesson || !Body) return <NotFound />;

  if (locked) {
    return (
      <Centered>
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-3">{lesson.title}</h1>
        <p className="text-slate-400 mb-6">
          {session
            ? 'Complete the previous lesson to unlock this one.'
            : "Sign in to track completion and unlock this lesson — you'll pick up right where you left off."}
        </p>
        {session ? (
          <Link to={courseHref(course)} className="btn-primary">
            Back to {course.title}
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Link to="/login" className="btn-primary">
              Sign in — it's free
            </Link>
            <Link to={courseHref(course)} className="btn-secondary">
              Back to {course.title}
            </Link>
          </div>
        )}
      </Centered>
    );
  }

  const { prev, next } = getAdjacentLessons(course, lesson);
  const ordered = getOrderedLessons(course);
  const position = ordered.findIndex((l) => l.id === lesson.id) + 1;

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
      difficulty={lesson.difficulty}
      position={position}
      total={ordered.length}
      isCompletedOverride={completedSet.has(lesson.id)}
      onComplete={() => void completeLesson(lesson.id)}
      requiresQuiz={lesson.hasQuiz}
      signedOut={!session}
    >
      <Suspense fallback={<LessonLoading />}>
        <Body />
      </Suspense>
      {lesson.hasQuiz ? (
        <Quiz lessonId={lesson.id} onPass={() => void completeLesson(lesson.id)} />
      ) : null}
    </LessonChrome>
  );
}
