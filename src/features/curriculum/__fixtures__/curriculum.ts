import type { Curriculum } from '@/shared/types';

/**
 * Small, deterministic curriculum fixture for selector/locking tests —
 * intentionally shaped, not real content, so tests don't drift when the
 * actual curriculum spine changes.
 */
export const fixtureCurriculum: Curriculum = {
  courses: [
    {
      id: 'course-a',
      slug: 'course-a',
      title: 'Course A',
      description: 'Test course A',
      icon: '🅰️',
      track: 'helpdesk',
      difficulty: 'beginner',
      order: 1,
      moduleIds: ['course-a-m1'],
    },
    {
      id: 'course-b',
      slug: 'course-b',
      title: 'Course B',
      description: 'Test course B',
      icon: '🅱️',
      track: 'sysadmin',
      difficulty: 'intermediate',
      order: 2,
      moduleIds: ['course-b-m1'],
    },
  ],
  modules: [
    { id: 'course-a-m1', slug: 'course-a-m1', title: 'Course A', courseId: 'course-a', order: 1, lessonIds: ['a1', 'a2', 'a3'] },
    { id: 'course-b-m1', slug: 'course-b-m1', title: 'Course B', courseId: 'course-b', order: 1, lessonIds: ['b1'] },
  ],
  lessons: [
    { id: 'a1', slug: 'first', title: 'First', courseId: 'course-a', moduleId: 'course-a-m1', order: 1, xp: 10, track: 'helpdesk', difficulty: 'beginner', estimatedMinutes: 5, lockRule: { type: 'none' }, hasQuiz: false },
    { id: 'a2', slug: 'second', title: 'Second', courseId: 'course-a', moduleId: 'course-a-m1', order: 2, xp: 20, track: 'helpdesk', difficulty: 'beginner', estimatedMinutes: 10, lockRule: { type: 'sequential' }, hasQuiz: true },
    { id: 'a3', slug: 'third', title: 'Third', courseId: 'course-a', moduleId: 'course-a-m1', order: 3, xp: 30, track: 'helpdesk', difficulty: 'intermediate', estimatedMinutes: 15, lockRule: { type: 'prerequisites', lessonIds: ['a1', 'a2'] }, hasQuiz: false },
    { id: 'b1', slug: 'only', title: 'Only', courseId: 'course-b', moduleId: 'course-b-m1', order: 1, xp: 15, track: 'sysadmin', difficulty: 'intermediate', estimatedMinutes: 8, lockRule: { type: 'none' }, hasQuiz: false },
  ],
};
