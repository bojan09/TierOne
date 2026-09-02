import { TRACK_TITLE, type Track } from './api';

interface Props {
  holderName: string;
  track: Track;
  issuedAt: string;
  code: string;
}

export default function CertificateView({ holderName, track, issuedAt, code }: Props) {
  const date = new Date(issuedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="cert-print rounded-2xl border-2 border-brand-500/40 bg-gradient-to-b from-surface-800 to-surface-900 px-8 py-10 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] text-[12rem] font-black flex items-center justify-center select-none">
        {'>_'}
      </div>
      <div className="relative">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-mono text-brand-300 text-lg">{'>_'}</span>
          <span className="font-black tracking-tight text-white text-lg">TierOne</span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">
          Certificate of Completion
        </p>

        <p className="text-sm text-slate-400 mb-2">This certifies that</p>
        <p className="text-3xl font-black text-white mb-3">{holderName}</p>
        <p className="text-sm text-slate-400 mb-1">has successfully completed the</p>
        <p className="text-xl font-bold text-brand-300 mb-8">{TRACK_TITLE[track]} track</p>

        <div className="flex items-center justify-center gap-8 text-xs text-slate-500 border-t border-surface-700 pt-5 mt-2">
          <div>
            <p className="uppercase tracking-widest text-[9px] mb-0.5">Issued</p>
            <p className="text-slate-300">{date}</p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-[9px] mb-0.5">Verification code</p>
            <p className="text-slate-300 font-mono">{code}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
