import type { IsoTimestamp, Uuid } from './common';

/**
 * Quizzes are structured data (not code). A quiz is attached to a lesson and
 * graded server-side when submitted.
 */

export type QuizQuestion =
  | {
      id: string;
      type: 'single'; // one correct option
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }
  | {
      id: string;
      type: 'multiple'; // one or more correct options
      prompt: string;
      options: string[];
      correctIndices: number[];
      explanation?: string;
    }
  | {
      id: string;
      type: 'truefalse';
      prompt: string;
      correct: boolean;
      explanation?: string;
    };

export interface Quiz {
  id: Uuid;
  lessonId: Uuid;
  /** Percentage (0–100) required to pass. */
  passingScore: number;
  /** Bonus XP awarded on first pass. Awarded server-side. */
  bonusXp: number;
  questions: QuizQuestion[];
}

/** A recorded attempt. `answers` is opaque jsonb keyed by question id. */
export interface QuizResult {
  userId: Uuid;
  quizId: Uuid;
  score: number; // 0–100
  passed: boolean;
  answers: Record<string, unknown>;
  takenAt: IsoTimestamp;
}
