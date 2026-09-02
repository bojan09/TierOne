import { useEffect, useState } from 'react';
import { listDocExercises, gradeDoc, type DocExercise, type GradeResult } from './api';

export default function DocPractice() {
  const [exercises, setExercises] = useState<DocExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DocExercise | null>(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);

  useEffect(() => {
    let active = true;
    void listDocExercises().then((ex) => {
      if (!active) return;
      setExercises(ex);
      setSelected(ex[0] ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const pick = (ex: DocExercise) => {
    setSelected(ex);
    setContent('');
    setResult(null);
  };

  const submit = async () => {
    if (!selected || content.trim().length < 20) return;
    setSubmitting(true);
    const r = await gradeDoc(selected.id, content.trim());
    setResult(r);
    setSubmitting(false);
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/10 border border-accent-purple/30 rounded-full px-2.5 py-0.5 mb-4">
        Documentation Practice
      </span>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Practice writing the docs the job needs</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xl">
        Real IT work means clear resolution notes and KB articles. Write your answer, then get
        scored against a rubric — with AI feedback when it's enabled, or a self-check against the model answer.
      </p>

      {/* Exercise picker */}
      <div className="flex flex-wrap gap-2 mb-6">
        {exercises.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => pick(ex)}
            className={
              'text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ' +
              (selected?.id === ex.id
                ? 'border-brand-500/70 bg-brand-500/10 text-white'
                : 'border-surface-700 text-slate-400 hover:border-brand-500/40')
            }
          >
            {ex.title}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Scenario</p>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{selected.context}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-1">Your task</p>
            <p className="text-[15px] text-white">{selected.prompt}</p>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your documentation here…"
            rows={8}
            maxLength={4000}
            className="w-full rounded-2xl border border-surface-700 bg-[#0b0f17] text-slate-100 text-sm p-4 outline-none focus:border-brand-500/60 resize-y mb-2"
          />
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-slate-400">{content.length}/4000</span>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={submitting || content.trim().length < 20}
              className="btn-primary text-sm disabled:opacity-40"
            >
              {submitting ? 'Grading…' : 'Submit for grading'}
            </button>
          </div>

          {result && <ResultView result={result} exercise={selected} />}
        </>
      )}
    </div>
  );
}

function ResultView({ result, exercise }: { result: GradeResult; exercise: DocExercise }) {
  if (result.mode === 'rate_limited') {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-amber-300">
        You've reached today's grading limit ({result.cap}). Come back tomorrow, or self-check against the model answer below.
        <ModelAnswer exercise={exercise} />
      </div>
    );
  }

  if (result.mode === 'regular') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Self-assessment — grade your own answer
          </p>
          <p className="text-xs text-slate-400 mb-3">
            Professional technicians review their own documentation before it ships. Check your answer
            against each point below, then compare it with the model answer.
          </p>
          <ul className="space-y-2">
            {exercise.criteria.map((c, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-slate-400 flex-shrink-0">☐</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <ModelAnswer exercise={exercise} />
      </div>
    );
  }

  // AI
  const tone =
    result.score >= 80 ? 'text-accent-green' : result.score >= 55 ? 'text-accent-amber' : 'text-red-400';
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-3xl font-black font-mono ${tone}`}>{result.score}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed mb-4">{result.feedback}</p>
        <ul className="space-y-2">
          {result.criteria.map((c, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span className={c.met ? 'text-accent-green' : 'text-red-400'}>{c.met ? '✓' : '✗'}</span>
              <span className="text-slate-300">
                {c.label}
                {c.note ? <span className="text-slate-500"> — {c.note}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ModelAnswer exercise={exercise} />
    </div>
  );
}

function ModelAnswer({ exercise }: { exercise: DocExercise }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-semibold text-brand-300 hover:text-brand-200"
      >
        {open ? 'Hide model answer' : 'Show a model answer'}
      </button>
      {open && <p className="text-sm text-slate-300 leading-relaxed mt-3 whitespace-pre-wrap">{exercise.model_answer}</p>}
    </div>
  );
}
