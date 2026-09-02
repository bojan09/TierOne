import { useEffect, useState } from 'react';
import { getLessonQuiz, submitQuiz, type QuizQuestion, type QuizResult } from './api';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useAuth } from '@/features/auth/useAuth';

interface QuizProps {
  lessonId: string;
  /** Called once when the user passes — used to mark the lesson complete. */
  onPass?: () => void;
}

/**
 * Server-graded lesson quiz. Questions are fetched without the answer key;
 * grading happens in the `submit_quiz` RPC, which also awards the one-time XP
 * bonus and returns per-question correctness. On a pass we refresh progress so
 * the navbar/dashboard reflect the new XP immediately.
 */
export function Quiz({ lessonId, onPass }: QuizProps) {
  const { session } = useAuth();
  const { refresh } = useAcademyProgress();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setResult(null);
    setAnswers({});
    void getLessonQuiz(lessonId).then((qs) => {
      if (!active) return;
      setQuestions(qs);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [lessonId]);

  if (loading) return null;

  if (questions.length === 0) {
    // Expected for signed-out visitors — get_lesson_quiz is authenticated-only,
    // so this is just RLS, not a data gap. Only surface a message when a
    // signed-in user hits a lesson that's flagged hasQuiz but has zero
    // questions seeded — otherwise this section silently vanishing looks
    // like nothing happened.
    if (!session) return null;
    return (
      <section className="mt-12 rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-xl">🧠</span>
          <h2 className="text-lg font-bold text-white">Check your understanding</h2>
        </div>
        <p className="text-sm text-slate-400">
          This lesson&rsquo;s quiz isn&rsquo;t available right now — you can still mark the lesson
          complete without it.
        </p>
      </section>
    );
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const resultFor = (qid: number) => result?.results.find((r) => r.question_id === qid);

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await submitQuiz(
      lessonId,
      questions.map((q) => (answers[q.id] ?? -1)),
    );
    setSubmitting(false);
    if (res) {
      setResult(res);
      if (res.passed) {
        onPass?.();
        void refresh();
      }
    }
  };

  const retry = () => {
    setResult(null);
    setAnswers({});
  };

  return (
    <section className="mt-12 rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-xl">🧠</span>
        <h2 className="text-lg font-bold text-white">Check your understanding</h2>
      </div>
      <p className="text-sm text-slate-400 mb-6" role="status" aria-live="polite">
        {result
          ? `You scored ${result.score_pct}% (${result.correct}/${result.total}). ${result.passed ? 'Passed. Bonus XP awarded.' : `${result.pass_pct}% needed to pass.`}`
          : `Answer all ${questions.length} questions, then submit. Pass to earn bonus XP.`}
      </p>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const picked = answers[q.id];
          const res = resultFor(q.id);
          return (
            <div key={q.id}>
              <p className="text-[15px] font-semibold text-white mb-3">
                <span className="text-brand-400 font-mono mr-2">{qi + 1}.</span>
                {q.prompt}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const selected = picked === oi;
                  let cls =
                    'text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ';
                  if (result) {
                    if (selected && res?.correct) cls += 'border-accent-green/60 bg-accent-green/10 text-white';
                    else if (selected && !res?.correct) cls += 'border-red-500/60 bg-red-500/10 text-white';
                    else cls += 'border-surface-700 text-slate-400';
                  } else if (selected) {
                    cls += 'border-brand-500/70 bg-brand-500/10 text-white';
                  } else {
                    cls += 'border-surface-700 text-slate-300 hover:border-brand-500/40';
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cls}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        {!result ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? 'Grading…' : 'Submit answers'}
          </button>
        ) : (
          <>
            <span
              className={
                result.passed
                  ? 'inline-flex items-center gap-2 rounded-full bg-accent-green/15 text-accent-green px-4 py-1.5 text-sm font-semibold'
                  : 'inline-flex items-center gap-2 rounded-full bg-red-500/15 text-red-400 px-4 py-1.5 text-sm font-semibold'
              }
            >
              {result.passed ? `✓ Passed · +XP awarded` : `Not yet — ${result.pass_pct}% to pass`}
            </span>
            {!result.passed && (
              <button type="button" onClick={retry} className="btn-secondary text-sm">
                Try again
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Quiz;
