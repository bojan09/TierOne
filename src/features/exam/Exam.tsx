import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Track } from '@/shared/types';
import { useAuth } from '@/features/auth/useAuth';
import { getExam, submitExam, getExamHistory, type ExamQuestion, type ExamResult, type ExamHistoryRow } from './api';

const TRACKS: { id: Track; label: string }[] = [
  { id: 'helpdesk', label: 'Help Desk' },
  { id: 'sysadmin', label: 'SysAdmin' },
  { id: 'comptia', label: 'CompTIA A+' },
  { id: 'scripting', label: 'Scripting' },
];
const COUNT = 20;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function Exam() {
  const { profile } = useAuth();
  const [phase, setPhase] = useState<'setup' | 'active' | 'done'>('setup');
  const [track, setTrack] = useState<Track>((profile?.track ?? 'comptia') as Track);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [left, setLeft] = useState(COUNT * 60);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<ExamHistoryRow[]>([]);

  useEffect(() => {
    if (phase === 'setup') void getExamHistory(5).then(setHistory);
  }, [phase]);

  const finish = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    const ids = questions.map((q) => q.id);
    const res = await submitExam(ids, questions.map((q) => answers[q.id] ?? -1), track);
    setResult(res);
    setPhase('done');
    setBusy(false);
  }, [busy, questions, answers, track]);

  // Countdown during the exam.
  useEffect(() => {
    if (phase !== 'active') return;
    if (left <= 0) { void finish(); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left, finish]);

  const start = async () => {
    setBusy(true);
    const qs = await getExam(track, COUNT);
    setQuestions(qs);
    setAnswers({});
    setResult(null);
    setLeft(COUNT * 60);
    setPhase('active');
    setBusy(false);
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-white mb-1">Practice exam</h1>
        <p className="text-sm text-slate-400 mb-6">{COUNT} mixed questions, {COUNT} minutes, 70% to pass. Simulates a real cert-style test.</p>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Track</label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TRACKS.map((t) => (
            <button key={t.id} onClick={() => setTrack(t.id)}
              className={`card p-3 text-sm text-center transition-colors ${track === t.id ? 'border-brand-500 text-white' : 'text-slate-300 hover:border-surface-500'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={start} disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Loading…' : 'Start exam'}
        </button>
        {history.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Recent attempts</p>
            <ul className="space-y-1.5">
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between text-sm card px-3 py-2">
                  <span className="capitalize text-slate-300">{h.track}</span>
                  <span className={h.passed ? 'text-accent-green' : 'text-accent-amber'}>
                    {h.score_pct}% {h.passed ? '· pass' : '· fail'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link to="/learn" className="block text-center text-xs text-slate-500 hover:text-slate-300 mt-4">Back to Academy</Link>
      </div>
    );
  }

  if (phase === 'done' && result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card p-6 text-center mb-6">
          <div className="text-5xl mb-2">{result.passed ? '🏆' : '📚'}</div>
          <h1 className="text-2xl font-bold text-white">{result.score_pct}%</h1>
          <p className={`text-sm font-semibold ${result.passed ? 'text-accent-green' : 'text-accent-amber'}`}>
            {result.passed ? 'Passed' : 'Keep studying'} · {result.correct}/{result.total} correct
          </p>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const r = result.results.find((x) => x.id === q.id);
            const mine = answers[q.id];
            return (
              <div key={q.id} className="card p-4">
                <p className="text-sm font-medium text-white mb-2">{i + 1}. {q.prompt}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isCorrect = r?.correct_index === oi;
                    const isMine = mine === oi;
                    return (
                      <div key={oi} className={`text-sm px-3 py-1.5 rounded-lg border ${
                        isCorrect ? 'border-accent-green/50 bg-accent-green/10 text-white'
                        : isMine ? 'border-accent-red/50 bg-accent-red/10 text-white'
                        : 'border-surface-700 text-slate-400'}`}>
                        {opt}{isCorrect ? ' ✓' : isMine ? ' ✗' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setPhase('setup')} className="btn-secondary flex-1">New exam</button>
          <Link to="/learn" className="btn-primary flex-1 text-center">Done</Link>
        </div>
      </div>
    );
  }

  // active
  const answered = Object.keys(answers).length;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="sticky top-16 z-10 -mx-4 px-4 py-3 bg-surface-900/90 backdrop-blur border-b border-surface-700 flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-slate-400">{answered}/{questions.length} answered</span>
        <span className={`text-sm font-mono font-bold ${left < 120 ? 'text-accent-red' : 'text-white'}`}>⏱ {fmt(left)}</span>
      </div>
      <div className="space-y-5">
        {questions.map((q, i) => (
          <div key={q.id} className="card p-4">
            <p className="text-sm font-medium text-white mb-3">{i + 1}. {q.prompt}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                    answers[q.id] === oi ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-surface-700 text-slate-300 hover:border-surface-500'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={finish} disabled={busy} className="btn-primary w-full mt-6 disabled:opacity-60">
        {busy ? 'Grading…' : `Submit exam (${answered}/${questions.length})`}
      </button>
    </div>
  );
}
