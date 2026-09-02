import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLessonQuiz, type QuizQuestion } from '@/features/quiz/api';
import {
  getDueReviews,
  gradeReview,
  scheduleReview,
  type GradeResult,
  type ScheduleResult,
} from './api';
import { getLessonAndCourseById } from '@/features/curriculum/selectors';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';

const RATINGS = [
  { q: 0, key: '1', label: 'Again', sub: 'forgot', cls: 'border-accent-red/50 hover:bg-accent-red/10 text-accent-red' },
  { q: 1, key: '2', label: 'Hard', sub: 'struggled', cls: 'border-accent-amber/50 hover:bg-accent-amber/10 text-accent-amber' },
  { q: 2, key: '3', label: 'Good', sub: 'recalled', cls: 'border-brand-500/50 hover:bg-brand-500/10 text-brand-300' },
  { q: 3, key: '4', label: 'Easy', sub: 'instant', cls: 'border-accent-green/50 hover:bg-accent-green/10 text-accent-green' },
];

function relativeDue(iso: string): string {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
}

export default function Review() {
  const { refresh } = useAcademyProgress();
  const [due, setDue] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getDueReviews().then((rows) => {
      setDue(rows.map((r) => r.lesson_id));
      setLoading(false);
    });
  }, []);

  const lessonId = due?.[idx];
  useEffect(() => {
    if (!lessonId) return;
    setQuestions([]);
    setAnswers({});
    setGrade(null);
    setSchedule(null);
    void getLessonQuiz(lessonId).then(setQuestions);
  }, [lessonId]);

  const rate = useCallback(
    async (quality: number) => {
      if (!lessonId || busy) return;
      setBusy(true);
      const res = await scheduleReview(lessonId, quality);
      setSchedule(res);
      setBusy(false);
      void refresh();
    },
    [lessonId, busy, refresh],
  );

  useEffect(() => {
    if (!grade || schedule) return;
    const h = (e: KeyboardEvent) => {
      const r = RATINGS.find((x) => x.key === e.key);
      if (r) void rate(r.q);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [grade, schedule, rate]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-slate-500">Loading your reviews…</div>;
  }
  if (!due || due.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-2">Nothing to review</h1>
        <p className="text-slate-400 mb-6">You're all caught up. Pass more lesson quizzes and they'll show up here for spaced review.</p>
        <Link to="/learn" className="btn-primary">Back to Academy</Link>
      </div>
    );
  }
  if (idx >= due.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-white mb-2">Review complete</h1>
        <p className="text-slate-400 mb-6">You reviewed {due.length} lesson{due.length > 1 ? 's' : ''}. Nice work keeping it fresh.</p>
        <Link to="/learn" className="btn-primary">Back to Academy</Link>
      </div>
    );
  }

  const resolved = lessonId ? getLessonAndCourseById(lessonId) : undefined;
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  const submitGrade = async () => {
    if (!lessonId) return;
    setBusy(true);
    setGrade(await gradeReview(lessonId, questions.map((q) => answers[q.id] ?? -1)));
    setBusy(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link to="/learn" className="text-sm text-slate-400 hover:text-white">← Exit review</Link>
        <span className="text-xs font-mono text-slate-500">{idx + 1} / {due.length}</span>
      </div>

      <p className="text-[10px] font-semibold text-brand-300 uppercase tracking-widest mb-1">Spaced review</p>
      <h1 className="text-xl font-bold text-white mb-6">
        {resolved ? resolved.lesson.title : lessonId}
        {resolved && <span className="block text-sm font-normal text-slate-500 mt-0.5">{resolved.course.title}</span>}
      </h1>

      {questions.length === 0 ? (
        <p className="text-slate-500 text-sm">Loading questions…</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qi) => (
            <div key={q.id} className="card p-4">
              <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.prompt}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[q.id] === oi;
                  const correctItem = grade?.results.find((r) => r.question_id === q.id);
                  const showResult = grade && chosen;
                  return (
                    <button
                      key={oi}
                      disabled={!!grade}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                        showResult
                          ? correctItem?.correct
                            ? 'border-accent-green/50 bg-accent-green/10 text-white'
                            : 'border-accent-red/50 bg-accent-red/10 text-white'
                          : chosen
                            ? 'border-brand-500 bg-brand-500/10 text-white'
                            : 'border-surface-700 text-slate-300 hover:border-surface-500'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!grade ? (
            <button onClick={submitGrade} disabled={!allAnswered || busy} className="btn-primary w-full disabled:opacity-50">
              {busy ? 'Grading…' : 'Check answers'}
            </button>
          ) : !schedule ? (
            <div className="card p-4">
              <p className="text-sm text-white mb-1" role="status" aria-live="polite">
                You scored {grade.score_pct}% ({grade.correct}/{grade.total}).
              </p>
              <p className="text-xs text-slate-400 mb-3">How well did you recall this? <span className="text-slate-400">(press 1–4)</span></p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map((r) => (
                  <button
                    key={r.q}
                    disabled={busy}
                    onClick={() => rate(r.q)}
                    className={`rounded-lg border py-2 text-center transition-colors disabled:opacity-50 ${r.cls}`}
                  >
                    <span className="block text-sm font-semibold">{r.label}</span>
                    <span className="block text-[10px] text-slate-500">{r.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-4 text-center">
              <p className="text-sm text-white mb-3" role="status" aria-live="polite">
                Scheduled — next review {relativeDue(schedule.next_due)}.
              </p>
              <button onClick={() => setIdx((i) => i + 1)} className="btn-primary">
                {idx + 1 < due.length ? 'Next lesson' : 'Finish'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
