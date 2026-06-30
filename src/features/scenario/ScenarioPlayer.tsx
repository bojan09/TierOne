import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getScenarioBySlug,
  submitScenario,
  type ScenarioFull,
  type ScenarioResult,
} from './api';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';

const STAGE_LABEL: Record<string, string> = {
  triage: 'Triage',
  diagnose: 'Diagnose',
  resolve: 'Resolve',
  communicate: 'Communicate',
};

export default function ScenarioPlayer() {
  const { slug } = useParams();
  const { refresh } = useAcademyProgress();
  const [scenario, setScenario] = useState<ScenarioFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(1); // how many stages are visible
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setResult(null);
    setChoices({});
    setRevealed(1);
    void getScenarioBySlug(slug ?? '').then((s) => {
      if (!active) return;
      setScenario(s);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const resultByStage = useMemo(() => {
    const m = new Map<number, ScenarioResult['results'][number]>();
    result?.results.forEach((r) => m.set(r.stage_id, r));
    return m;
  }, [result]);

  if (loading) {
    return <Centered>Loading ticket…</Centered>;
  }
  if (!scenario) {
    return (
      <Centered>
        <p className="text-slate-400 mb-4">This scenario isn't available.</p>
        <Link to="/simulator" className="btn-primary">Back to the Simulator</Link>
      </Centered>
    );
  }

  const stages = scenario.stages;
  const allAnswered = stages.every((s) => choices[s.id] !== undefined);

  const pick = (stageId: number, optionId: number, stageIndex: number) => {
    if (result) return;
    setChoices((c) => ({ ...c, [stageId]: optionId }));
    if (stageIndex + 1 === revealed && revealed < stages.length) {
      setRevealed((r) => r + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await submitScenario(
      scenario.id,
      stages.map((s) => ({ stage_id: s.id, option_id: choices[s.id] })),
    );
    setSubmitting(false);
    if (res) {
      setResult(res);
      if (res.passed) void refresh();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/simulator" className="text-sm text-slate-400 hover:text-brand-300">
        ← All tickets
      </Link>
      <h1 className="text-2xl font-bold text-white mt-3 mb-1">{scenario.title}</h1>
      <p className="text-xs text-slate-500 mb-6">
        Work the ticket stage by stage. You'll be scored on your choices and earn XP if you pass.
      </p>

      {/* Ticket opening */}
      <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-5 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-semibold text-brand-300">{scenario.intro.actor}</span>
          <span>·</span>
          <span>{scenario.intro.channel}</span>
        </div>
        <p className="text-[15px] text-slate-200 leading-relaxed">{scenario.intro.message}</p>
      </div>

      {/* Stages */}
      <div className="space-y-5">
        {stages.slice(0, revealed).map((stage, i) => {
          const picked = choices[stage.id];
          const r = resultByStage.get(stage.id);
          return (
            <div key={stage.id} className="rounded-2xl border border-surface-700 bg-surface-800/30 p-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-full px-2.5 py-0.5 mb-3">
                Step {i + 1} · {STAGE_LABEL[stage.kind] ?? stage.kind}
              </span>
              <p className="text-[15px] font-semibold text-white mb-3">{stage.prompt}</p>
              <div className="grid gap-2">
                {stage.options.map((opt) => {
                  const selected = picked === opt.id;
                  let cls = 'text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ';
                  if (result) {
                    if (selected && r?.is_correct) cls += 'border-accent-green/60 bg-accent-green/10 text-white';
                    else if (selected) cls += 'border-amber-500/60 bg-amber-500/10 text-white';
                    else cls += 'border-surface-700 text-slate-400';
                  } else if (selected) {
                    cls += 'border-brand-500/70 bg-brand-500/10 text-white';
                  } else {
                    cls += 'border-surface-700 text-slate-300 hover:border-brand-500/40';
                  }
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() => pick(stage.id, opt.id, i)}
                      className={cls}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {result && r?.feedback && (
                <p
                  className={
                    'mt-3 text-sm rounded-lg px-3 py-2 ' +
                    (r.is_correct ? 'bg-accent-green/10 text-accent-green' : 'bg-amber-500/10 text-amber-300')
                  }
                >
                  {r.feedback}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / scorecard */}
      <div className="mt-6">
        {!result ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? 'Scoring…' : 'Resolve ticket'}
          </button>
        ) : (
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 text-center">
            <div className="text-4xl mb-2">{result.passed ? '🎉' : '📋'}</div>
            <p className="text-xl font-bold text-white mb-1">
              {result.score_pct}% — {result.passed ? 'Ticket resolved well!' : 'Room to improve'}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              {result.earned} of {result.max} points
              {result.passed ? ' · bonus XP awarded' : ` · ${result.pass_pct}% needed to pass`}
            </p>
            <div className="flex gap-3 justify-center">
              {!result.passed && (
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setChoices({});
                    setRevealed(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-secondary text-sm"
                >
                  Try again
                </button>
              )}
              <Link to="/simulator" className="btn-primary text-sm">
                Back to tickets
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">{children}</div>
  );
}
