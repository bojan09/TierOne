import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listScenarios, type ScenarioSummary } from './api';

export default function SimulatorHome() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void listScenarios().then((s) => {
      if (!active) return;
      setScenarios(s);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 rounded-full px-2.5 py-0.5 mb-4">
        Virtual Help Desk
      </span>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Work real tickets</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
        Practice the Tier-1 method on simulated tickets — triage, diagnose, resolve, and communicate.
        Each ticket is scored on your decisions, and passing earns bonus XP.
      </p>

      {loading ? (
        <p className="text-slate-500">Loading tickets…</p>
      ) : scenarios.length === 0 ? (
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 text-slate-400 text-sm">
          No tickets are available yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {scenarios.map((s) => (
            <Link
              key={s.id}
              to={`/simulator/${s.slug}`}
              className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5 block hover:border-brand-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                <span>🎫</span>
                <span>{s.intro_channel}</span>
              </div>
              <h2 className="text-[15px] font-bold text-white mb-1">{s.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{s.intro_message}</p>
              <span className="text-[11px] font-mono text-accent-amber">+{s.bonus_xp} XP on pass</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
