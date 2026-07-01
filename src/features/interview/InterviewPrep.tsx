import { useEffect, useMemo, useState } from 'react';
import { listInterviewQuestions, type InterviewQuestion } from './api';

type Filter = 'all' | 'behavioral' | 'technical';

export default function InterviewPrep() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;
    void listInterviewQuestions().then((q) => {
      if (!active) return;
      setQuestions(q);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const deck = useMemo(
    () => (filter === 'all' ? questions : questions.filter((q) => q.category === filter)),
    [questions, filter],
  );

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [filter]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-slate-400">Loading questions…</div>;
  }

  const card = deck[index];
  const go = (d: number) => {
    setRevealed(false);
    setIndex((i) => Math.min(Math.max(i + d, 0), deck.length - 1));
  };
  const markReviewed = () => {
    if (card) setReviewed((r) => new Set(r).add(card.id));
    if (index < deck.length - 1) go(1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-full px-2.5 py-0.5 mb-4">
        Interview Prep
      </span>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Practice the questions you'll be asked</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xl">
        Flip through common IT interview questions. Think through your answer first, then reveal a strong
        sample answer and the key points a good answer should hit.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5">
        {(['all', 'behavioral', 'technical'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              'text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-colors ' +
              (filter === f
                ? 'border-brand-500/70 bg-brand-500/10 text-white'
                : 'border-surface-700 text-slate-400 hover:border-brand-500/40')
            }
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 font-mono">
          {reviewed.size}/{questions.length} reviewed
        </span>
      </div>

      {!card ? (
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 text-slate-400 text-sm">
          No questions in this category yet.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 min-h-[20rem] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-cyan capitalize">
                {card.category}
              </span>
              {card.track && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  · {card.track}
                </span>
              )}
              {reviewed.has(card.id) && <span className="text-accent-green text-xs ml-auto">✓ reviewed</span>}
            </div>

            <p className="text-lg font-bold text-white leading-snug mb-4">{card.prompt}</p>

            {!revealed ? (
              <div className="mt-auto">
                <button type="button" onClick={() => setRevealed(true)} className="btn-primary">
                  Reveal sample answer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[15px] text-slate-200 leading-relaxed">{card.sample_answer}</p>
                {card.key_points.length > 0 && (
                  <div className="rounded-xl border border-surface-700 bg-surface-900/40 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      A good answer hits
                    </p>
                    <ul className="space-y-1.5">
                      {card.key_points.map((p, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                          <span className="text-accent-green flex-shrink-0">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="btn-secondary text-sm disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-xs text-slate-500 font-mono">
              {index + 1} / {deck.length}
            </span>
            {index < deck.length - 1 ? (
              <button type="button" onClick={markReviewed} className="btn-primary text-sm">
                {revealed ? 'Got it · Next →' : 'Next →'}
              </button>
            ) : (
              <button type="button" onClick={markReviewed} className="btn-primary text-sm">
                Got it ✓
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
