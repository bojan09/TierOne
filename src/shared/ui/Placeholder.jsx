import React from 'react';

/**
 * Polished "coming soon" / not-found placeholder. Extracted from App.jsx during
 * the P2.2 routing migration. Kept eager (tiny) so it never needs a Suspense
 * fallback of its own.
 */
export default function Placeholder({ title }) {
  const isLesson = title && !title.includes('not found');
  const course = title?.replace(/\s*[—–-].*/, '').trim() || '';
  const lesson = title?.replace(/^.*[—–-]\s*/, '').trim() || '';

  if (!isLesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        <p className="text-slate-400 text-sm">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn-primary mt-2">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-4xl">
        📖
      </div>

      <div>
        <div className="tag mb-3">{course}</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {lesson || title}
        </h1>
        <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-md mx-auto">
          This lesson is actively being developed and will be available in the next
          platform update. The course structure and learning path are already set up —
          content is being written and reviewed.
        </p>
      </div>

      <div className="card p-5 w-full text-left">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
          <span className="text-xs font-semibold text-accent-amber uppercase tracking-widest">
            In Development
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          While you wait, explore other available lessons in this course or try a
          different learning path. All core courses have multiple complete lessons
          available right now.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href={`/${course.toLowerCase().replace(/\s+/g, '-')}`}
          className="btn-primary"
        >
          ← Back to {course || 'Course'}
        </a>
        <a href="/" className="btn-secondary">
          Browse All Courses
        </a>
        <a href="/dashboard" className="btn-ghost">
          My Dashboard
        </a>
      </div>
    </div>
  );
}
