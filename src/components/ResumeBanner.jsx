import { Link } from 'react-router-dom'
import { useAcademyProgress } from '@/features/progress/useAcademyProgress'
import { getLessonAndCourseById, lessonHref } from '@/features/curriculum/selectors'

// Server-authoritative "continue where you left off". Reads the last opened
// lesson id from the user's stats and resolves the title/href from the spine
// (so links never go stale), cross-device.
export default function ResumeBanner() {
  const { stats } = useAcademyProgress()
  const lastId = stats?.lastLessonId
  if (!lastId) return null

  const resolved = getLessonAndCourseById(lastId)
  if (!resolved) return null
  const { course, lesson } = resolved

  return (
    <div className="w-full bg-brand-600/10 border-b border-brand-500/20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-2.5 flex items-center gap-3">
        <span className="text-base">👋</span>
        <p className="text-sm text-slate-300 flex-1 min-w-0 truncate">
          Welcome back! Continue:{' '}
          <span className="text-white font-medium">{course.title}</span>
          {' → '}
          <span className="text-brand-300">{lesson.title}</span>
        </p>
        <Link
          to={lessonHref(course, lesson)}
          className="flex-shrink-0 text-xs font-semibold text-brand-300 hover:text-white
                     flex items-center gap-1 transition-colors"
        >
          Resume
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
