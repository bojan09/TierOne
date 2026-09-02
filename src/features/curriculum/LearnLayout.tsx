import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CourseTree from './CourseTree';
import { Link } from 'react-router-dom';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useAuth } from '@/features/auth/useAuth';
import StreakTracker from '@/components/StreakTracker.jsx';
import DailyGoal from '@/features/progress/DailyGoal';

function ReviewPill() {
  const { dueReviewCount } = useAcademyProgress();
  if (!dueReviewCount) return null;
  return (
    <Link
      to="/review"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-500/30 bg-brand-500/10
                 text-sm text-brand-300 hover:bg-brand-500/20 transition-colors"
    >
      <span>🔁</span>
      <span className="flex-1">{dueReviewCount} due for review</span>
      <span aria-hidden>→</span>
    </Link>
  );
}

/**
 * Signed-in users get the real progress widgets (streak, daily goal, review
 * due). A signed-out visitor has no progress to show — rendering "🔥 0 day
 * streak" at them before they've done anything is confusing chrome, not
 * useful state, so swap it for a plain sign-in nudge instead.
 */
function SidebarProgress({ onNavigate }: { onNavigate?: () => void }) {
  const { session } = useAuth();
  if (!session) {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        className="block px-3 py-2.5 rounded-lg border border-surface-700 bg-surface-800/60
                   text-sm text-slate-300 hover:border-brand-500/40 hover:text-white transition-colors"
      >
        <span className="font-medium text-white">Sign in to track progress</span>
        <span className="block text-xs text-slate-500 mt-0.5">Free — saves XP, streaks &amp; where you left off</span>
      </Link>
    );
  }
  return (
    <>
      <ReviewPill />
      <DailyGoal />
      <StreakTracker compact />
    </>
  );
}

export default function LearnLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setDrawerOpen(false), [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [drawerOpen]);

  return (
    <div className="flex">
      {/* ── Persistent sidebar (xl+) ── */}
      <aside
        className="hidden xl:block w-72 flex-shrink-0 border-r border-surface-800 bg-surface-900/40"
        aria-label="Course navigation"
      >
        <div className="sticky top-[64px] max-h-[calc(100vh-64px)] overflow-y-auto p-4">
          <div className="mb-4 px-2 space-y-4">
            <SidebarProgress />
          </div>
          <CourseTree />
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Mobile / <xl toggle bar */}
        <div className="xl:hidden sticky top-[64px] z-20 flex items-center gap-2 px-4 py-2 border-b border-surface-800 bg-surface-900/80 backdrop-blur">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            aria-label="Open course navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Courses
          </button>
        </div>

        <Outlet />
      </div>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 xl:hidden" role="dialog" aria-modal="true" aria-label="Course navigation">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-surface-900 border-r border-surface-800 shadow-2xl overflow-y-auto animate-[slideIn_.2s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-surface-800 sticky top-0 bg-surface-900">
              <span className="text-sm font-semibold text-white">Courses</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close course navigation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 space-y-4">
                <SidebarProgress onNavigate={() => setDrawerOpen(false)} />
              </div>
              <CourseTree onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
