import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLabBySlug, completeLab, type LabFull } from './api';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';

interface Line {
  kind: 'cmd' | 'out' | 'sys' | 'err';
  text: string;
}

export default function LabPlayer() {
  const { slug } = useParams();
  const { refresh } = useAcademyProgress();
  const [lab, setLab] = useState<LabFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [misses, setMisses] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [savingRetry, setSavingRetry] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setStep(0);
    setLines([]);
    setDone(false);
    setMisses(0);
    void getLabBySlug(slug ?? '').then((l) => {
      if (!active) return;
      setLab(l);
      setLines(l ? [{ kind: 'sys', text: l.intro }] : []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  if (loading) return <Wrap><p className="text-slate-400">Booting lab…</p></Wrap>;
  if (!lab) {
    return (
      <Wrap>
        <p className="text-slate-400 mb-4">This lab isn't available.</p>
        <Link to="/labs" className="btn-primary">Back to Labs</Link>
      </Wrap>
    );
  }

  const steps = lab.steps;
  const current = steps[step];

  const run = async () => {
    const cmd = input.trim();
    if (!cmd || done) return;
    setInput('');
    const next: Line[] = [...lines, { kind: 'cmd', text: cmd }];

    let ok = false;
    try {
      ok = new RegExp(current.accept_pattern, 'i').test(cmd);
    } catch {
      ok = false;
    }

    if (ok) {
      if (current.output) next.push({ kind: 'out', text: current.output });
      setMisses(0);
      const last = step + 1 >= steps.length;
      if (last) {
        next.push({ kind: 'sys', text: '✓ All tasks complete — nice work!' });
        setLines(next);
        setDone(true);
        // Terminal tasks are genuinely done at this point (that's local,
        // real). Whether the server actually recorded it and awarded XP is
        // a separate thing — don't claim "XP awarded" until we know.
        const okDone = await completeLab(lab.id);
        if (okDone) {
          setSaveError(false);
          void refresh();
        } else {
          setSaveError(true);
        }
      } else {
        setLines(next);
        setStep((s) => s + 1);
      }
    } else {
      next.push({ kind: 'err', text: "That isn't quite the command this step needs. Try again." });
      const m = misses + 1;
      setMisses(m);
      if (m >= 2 && current.hint) next.push({ kind: 'sys', text: `Hint: ${current.hint}` });
      setLines(next);
    }
  };

  const retrySave = async () => {
    if (!lab) return;
    setSavingRetry(true);
    const okDone = await completeLab(lab.id);
    setSavingRetry(false);
    if (okDone) {
      setSaveError(false);
      void refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/labs" className="text-sm text-slate-400 hover:text-brand-300">← All labs</Link>
      <h1 className="text-2xl font-bold text-white mt-3 mb-1">{lab.title}</h1>
      <p className="text-xs text-slate-500 mb-5">
        Step {Math.min(step + 1, steps.length)} of {steps.length} · ~{lab.est_minutes} min · +{lab.bonus_xp} XP
      </p>

      {/* Current task */}
      {!done ? (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 px-4 py-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300">Task</span>
          <p className="text-[15px] text-white mt-0.5">{current.instruction}</p>
        </div>
      ) : saveError ? (
        <div className="rounded-xl border border-accent-amber/40 bg-accent-amber/10 px-4 py-3 mb-3 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[15px] text-white font-semibold">
            Nice work on the tasks — but we couldn&rsquo;t save your completion. Your XP hasn&rsquo;t been awarded yet.
          </p>
          <button onClick={() => void retrySave()} disabled={savingRetry} className="btn-primary text-sm disabled:opacity-60">
            {savingRetry ? 'Retrying…' : 'Retry save'}
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-accent-green/40 bg-accent-green/10 px-4 py-3 mb-3 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[15px] text-white font-semibold">🎉 Lab complete — +{lab.bonus_xp} XP awarded.</p>
          <Link to="/labs" className="btn-primary text-sm">Back to Labs</Link>
        </div>
      )}

      {/* Terminal */}
      <div
        className="rounded-2xl border border-surface-700 bg-[#0b0f17] overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-surface-700/60 bg-surface-800/40">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-amber-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[11px] text-slate-500 font-mono">student@server01</span>
        </div>
        <div ref={scrollRef} className="p-4 font-mono text-[13px] leading-relaxed h-80 overflow-y-auto">
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.kind === 'cmd' ? 'text-white'
                : l.kind === 'err' ? 'text-amber-400'
                : l.kind === 'sys' ? 'text-accent-cyan'
                : 'text-slate-300'
              }
            >
              {l.kind === 'cmd' && <span className="text-accent-green">student@server01:~$ </span>}
              <span className="whitespace-pre-wrap">{l.text}</span>
            </div>
          ))}
          {!done && (
            <div className="flex items-center text-white">
              <span className="text-accent-green">student@server01:~$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void run();
                }}
                autoFocus
                spellCheck={false}
                className="flex-1 bg-transparent outline-none border-none text-white font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {!done && current.hint && (
        <button
          type="button"
          onClick={() => setLines((ls) => [...ls, { kind: 'sys', text: `Hint: ${current.hint}` }])}
          className="text-xs text-slate-500 hover:text-brand-300 mt-3"
        >
          Show hint
        </button>
      )}
    </div>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl mx-auto px-4 py-20 text-center">{children}</div>;
}
