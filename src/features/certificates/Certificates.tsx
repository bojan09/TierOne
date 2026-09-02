import { useEffect, useMemo, useState } from 'react';
import { curriculum } from '@/content/curriculum';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import {
  listCertificates,
  claimCertificate,
  linkedInAddToProfileUrl,
  TRACK_TITLE,
  type Certificate,
  type Track,
} from './api';
import CertificateView from './CertificateView';

const TRACKS: Track[] = ['helpdesk', 'sysadmin', 'comptia', 'scripting'];

export default function Certificates() {
  const { completedSet } = useAcademyProgress();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<Track | null>(null);
  const [open, setOpen] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = () =>
    listCertificates().then((c) => {
      setCerts(c);
      setLoading(false);
    });

  useEffect(() => {
    let active = true;
    void listCertificates().then((c) => {
      if (!active) return;
      setCerts(c);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const trackProgress = useMemo(() => {
    const out: Record<Track, { done: number; total: number }> = {
      helpdesk: { done: 0, total: 0 },
      sysadmin: { done: 0, total: 0 },
      comptia: { done: 0, total: 0 },
      scripting: { done: 0, total: 0 },
    };
    for (const t of TRACKS) {
      const ls = curriculum.lessons.filter((l) => l.track === t);
      out[t] = { done: ls.filter((l) => completedSet.has(l.id)).length, total: ls.length };
    }
    return out;
  }, [completedSet]);

  const earned = (t: Track) => certs.find((c) => c.track === t);

  const handleClaim = async (t: Track) => {
    setError(null);
    setClaiming(t);
    const res = await claimCertificate(t);
    setClaiming(null);
    if (!res) {
      setError('Something went wrong claiming your certificate. Please try again.');
      return;
    }
    if (!res.eligible) {
      setError(`Finish all ${res.total} lessons in this track first (${res.completed}/${res.total} done).`);
      return;
    }
    await reload();
    if (res.code && res.issued_at && res.holder_name && res.track) {
      setOpen({ track: res.track, code: res.code, issued_at: res.issued_at, holder_name: res.holder_name });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent-amber bg-accent-amber/10 border border-accent-amber/30 rounded-full px-2.5 py-0.5 mb-4">
        Certificates
      </span>
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">Earn proof of your skills</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
        Complete every lesson in a track to claim a verifiable certificate you can share with employers.
      </p>

      {error && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {TRACKS.map((t) => {
            const e = earned(t);
            const p = trackProgress[t];
            const ready = p.total > 0 && p.done >= p.total;
            const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
            return (
              <div key={t} className="rounded-2xl border border-surface-700 bg-surface-800/40 p-5">
                <h2 className="text-[15px] font-bold text-white mb-1">{TRACK_TITLE[t]}</h2>
                <p className="text-xs text-slate-500 mb-4">{p.done}/{p.total} lessons complete</p>

                {e ? (
                  <button type="button" onClick={() => setOpen(e)} className="btn-primary w-full text-sm">
                    View certificate
                  </button>
                ) : ready ? (
                  <button
                    type="button"
                    onClick={() => void handleClaim(t)}
                    disabled={claiming === t}
                    className="btn-primary w-full text-sm disabled:opacity-50"
                  >
                    {claiming === t ? 'Claiming…' : 'Claim certificate 🎉'}
                  </button>
                ) : (
                  <div>
                    <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden mb-2">
                      <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-500">Complete the track to unlock</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(null)}
        >
          <div className="max-w-lg w-full" onClick={(ev) => ev.stopPropagation()}>
            <CertificateView
              holderName={open.holder_name}
              track={open.track}
              issuedAt={open.issued_at}
              code={open.code}
            />
            <div className="flex items-center justify-center gap-3 mt-4 cert-actions flex-wrap">
              <a
                href={linkedInAddToProfileUrl(open)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Add to LinkedIn profile
              </a>
              <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">
                Print / Save PDF
              </button>
              <button type="button" onClick={() => setOpen(null)} className="btn-primary text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
