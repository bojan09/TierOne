import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLabs, type LabSummary } from './api';

export default function LabsHome() {
  const [labs, setLabs] = useState<LabSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void listLabs().then((l) => {
      if (!active) return;
      setLabs(l);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent-green bg-accent-green/10 border border-accent-green/30 rounded-full px-2.5 py-0.5 mb-4">
        Simulated Labs
      </span>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Hands-on practice</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
        Practice real commands in a safe, simulated terminal — no setup, nothing to break.
        Complete each lab's tasks to earn XP.
      </p>

      {loading ? (
        <p className="text-slate-500">Loading labs…</p>
      ) : labs.length === 0 ? (
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 text-slate-400 text-sm">
          No labs are available yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {labs.map((l) => (
            <Link
              key={l.id}
              to={`/labs/${l.slug}`}
              className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5 block hover:border-brand-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                <span>💻</span>
                <span>~{l.est_minutes} min</span>
              </div>
              <h2 className="text-[15px] font-bold text-white mb-1">{l.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{l.intro}</p>
              <span className="text-[11px] font-mono text-accent-amber">+{l.bonus_xp} XP</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
