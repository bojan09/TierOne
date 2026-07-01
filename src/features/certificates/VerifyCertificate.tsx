import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verifyCertificate, TRACK_TITLE, type VerifyResult } from './api';

export default function VerifyCertificate() {
  const { code } = useParams();
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    let active = true;
    void verifyCertificate(code ?? '').then((r) => {
      if (active) setResult(r);
    });
    return () => {
      active = false;
    };
  }, [code]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-black text-white mb-6">Certificate verification</h1>
      {!result ? (
        <p className="text-slate-400">Checking…</p>
      ) : result.valid ? (
        <div className="rounded-2xl border border-accent-green/40 bg-accent-green/10 p-6">
          <p className="text-accent-green text-sm font-bold uppercase tracking-widest mb-3">✓ Valid certificate</p>
          <p className="text-2xl font-black text-white">{result.holder_name}</p>
          <p className="text-brand-300 font-semibold mt-1">{TRACK_TITLE[result.track ?? 'helpdesk']} track</p>
          <p className="text-xs text-slate-500 mt-3">
            Issued {result.issued_at ? new Date(result.issued_at).toLocaleDateString() : ''} · code {code}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
          <p className="text-slate-300 font-semibold">No certificate matches code “{code}”.</p>
          <p className="text-xs text-slate-500 mt-2">Check the code and try again.</p>
        </div>
      )}
      <Link to="/certificates" className="text-sm text-slate-400 hover:text-brand-300 mt-6 inline-block">
        ← Your certificates
      </Link>
    </div>
  );
}
