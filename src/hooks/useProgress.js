// Compatibility shim: the legacy useProgress API is now backed by the
// server-authoritative progress store (useAcademyProgress). No localStorage,
// no per-device state. XP/level/streak/badges are computed server-side; writes
// route through the server RPCs (or are no-ops where the server owns them).
import { useMemo, useCallback } from 'react'
import { useAcademyProgress } from '@/features/progress/useAcademyProgress'
import { curriculum } from '@/content/curriculum'

// ─── XP thresholds per level ──────────────────────────────────────────────────
export const LEVELS = [
  { level: 1,  title: 'Tier-0 Initiate',          minXP: 0,     color: 'text-slate-400' },
  { level: 2,  title: 'Help Desk Trainee',        minXP: 100,   color: 'text-accent-green' },
  { level: 3,  title: 'Help Desk Technician',     minXP: 250,   color: 'text-accent-cyan' },
  { level: 4,  title: 'Support Specialist',       minXP: 500,   color: 'text-brand-400' },
  { level: 5,  title: 'Senior Support',           minXP: 1000,  color: 'text-accent-amber' },
  { level: 6,  title: 'Junior SysAdmin',          minXP: 2000,  color: 'text-accent-purple' },
  { level: 7,  title: 'SysAdmin',                 minXP: 3500,  color: 'text-brand-300' },
  { level: 8,  title: 'Senior SysAdmin',          minXP: 5500,  color: 'text-accent-cyan' },
  { level: 9,  title: 'Infrastructure Engineer',  minXP: 8000,  color: 'text-accent-amber' },
  { level: 10, title: 'Infrastructure Architect', minXP: 11000, color: 'text-accent-purple' },
]

export function getLevelForXP(xp) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.minXP) current = l
    else break
  }
  const nextIndex = LEVELS.indexOf(current) + 1
  const next = LEVELS[nextIndex] || null
  const progress = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100
  return { current, next, progress }
}

// ─── Badge definitions (metadata + conditions over the shim's state shape) ─────
export const BADGES = [
  { id: 'first-lesson',   label: 'First Step',       icon: '🎯', desc: 'Complete your first lesson',  condition: (s) => s.completedLessons.length >= 1 },
  { id: 'five-lessons',   label: 'On a Roll',         icon: '🔥', desc: 'Complete 5 lessons',          condition: (s) => s.completedLessons.length >= 5 },
  { id: 'first-quiz',     label: 'Quiz Taker',        icon: '📝', desc: 'Pass your first quiz',        condition: (s) => Object.keys(s.quizScores).length >= 1 },
  { id: 'perfect-quiz',   label: 'Perfect Score',     icon: '💯', desc: 'Score 100% on any quiz',      condition: (s) => Object.values(s.quizScores).some(q => q.score === 100) },
  { id: 'streak-3',       label: 'Consistent',        icon: '📅', desc: '3-day learning streak',       condition: (s) => s.streak >= 3 },
  { id: 'streak-7',       label: 'Week Warrior',      icon: '🗓️', desc: '7-day learning streak',       condition: (s) => s.streak >= 7 },
  { id: 'xp-500',         label: 'XP Hunter',         icon: '⚡', desc: 'Earn 500 XP',                 condition: (s) => s.totalXP >= 500 },
  { id: 'xp-1000',        label: 'XP Master',         icon: '🏆', desc: 'Earn 1,000 XP',               condition: (s) => s.totalXP >= 1000 },
  { id: 'course-complete',label: 'Course Complete',   icon: '🎓', desc: 'Complete an entire course',   condition: (s) => s.completedCourses.length >= 1 },
]

export function useProgress() {
  const { completedSet, stats, quizStats, completeLesson: serverComplete, setLastLesson } =
    useAcademyProgress()

  const state = useMemo(() => {
    const quizScores = Object.fromEntries(
      Object.entries(quizStats.bestByLesson || {}).map(([id, score]) => [
        id,
        { score, passed: quizStats.passedIds.includes(id) },
      ]),
    )
    const completedCourses = curriculum.courses
      .filter((c) => {
        const ls = curriculum.lessons.filter((l) => l.courseId === c.id)
        return ls.length > 0 && ls.every((l) => completedSet.has(l.id))
      })
      .map((c) => c.id)

    return {
      totalXP: stats?.totalXp ?? 0,
      completedLessons: [...completedSet],
      completedCourses,
      quizScores,
      earnedBadges: stats?.earnedBadges ?? [],
      streak: stats?.streak ?? 0,
      lastStudyDate: stats?.lastStudyDate ?? null,
      lastVisited: null, // resume is now server-driven (ResumeBanner)
    }
  }, [completedSet, stats, quizStats])

  const addXP = useCallback(() => {}, []) // server owns XP
  const completeLesson = useCallback((lessonId) => serverComplete(lessonId), [serverComplete])
  const saveQuizScore = useCallback(() => {}, []) // server grades quizzes
  const setLastVisited = useCallback(
    (data) => { if (data?.lessonId) setLastLesson(data.lessonId) },
    [setLastLesson],
  )
  const reset = useCallback(() => {}, [])

  return { state, addXP, completeLesson, saveQuizScore, setLastVisited, reset }
}

export default useProgress
