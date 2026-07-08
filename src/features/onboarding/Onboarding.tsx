import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import type { Track } from '@/shared/types';
import { curriculum } from '@/content/curriculum';
import { getOrderedLessons, lessonHref } from '@/features/curriculum/selectors';

const TRACKS: { id: Track; title: string; desc: string; icon: string }[] = [
  { id: 'helpdesk', title: 'Help Desk / Tier-1 Support', desc: 'Start here for IT support fundamentals, ticketing, and the Tier-2 track.', icon: '🎧' },
  { id: 'sysadmin', title: 'SysAdmin (Advanced)', desc: 'Windows Server, Active Directory, networking, and automation.', icon: '🖥️' },
  { id: 'comptia', title: 'CompTIA A+ (Certification)', desc: 'Entry-level IT cert: hardware, operating systems, networking, and security.', icon: '📜' },
  { id: 'scripting', title: 'Scripting & Automation', desc: 'Automate IT work with PowerShell and Python.', icon: '⚡' },
];
const GOALS = [
  { n: 1, label: 'Casual', sub: '1 lesson / day' },
  { n: 2, label: 'Steady', sub: '2 lessons / day' },
  { n: 3, label: 'Serious', sub: '3 lessons / day' },
];

export default function Onboarding() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState<Track>(profile?.track ?? 'helpdesk');
  const [goal, setGoal] = useState<number>(profile?.dailyGoal ?? 1);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    await updateProfile({ track, dailyGoal: goal, onboardedAt: new Date().toISOString() });
    const first = curriculum.courses
      .filter((c) => c.track === track)
      .sort((a, b) => a.order - b.order)[0];
    const lesson = first ? getOrderedLessons(first)[0] : null;
    navigate(lesson && first ? lessonHref(first, lesson) : '/learn', { replace: true });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="flex items-center gap-1.5 mb-8" aria-hidden>
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-brand-500' : 'bg-surface-700'}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome{profile?.displayName ? `, ${profile.displayName}` : ''} 👋</h1>
          <p className="text-slate-400 mb-6">Which track do you want to start with? You can switch anytime.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                aria-pressed={track === t.id}
                className={`relative w-full h-full text-left card p-4 flex items-start gap-3 transition-all ${
                  track === t.id ? 'border-brand-500 ring-2 ring-brand-500/40' : 'hover:border-surface-500'
                }`}
              >
                {track === t.id && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">✓</span>
                )}
                <span className="text-2xl flex-shrink-0">{t.icon}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-white">{t.title}</span>
                  <span className="block text-sm text-slate-400 mt-0.5">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="btn-primary w-full mt-6">Continue</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Set a daily goal</h1>
          <p className="text-slate-400 mb-6">A small daily habit builds your streak. Pick a pace.</p>
          <div className="grid grid-cols-3 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.n}
                onClick={() => setGoal(g.n)}
                className={`card p-4 text-center transition-colors ${
                  goal === g.n ? 'border-brand-500 ring-1 ring-brand-500/40' : 'hover:border-surface-600'
                }`}
              >
                <div className="text-2xl font-bold text-white">{g.n}</div>
                <div className="text-xs font-medium text-slate-300 mt-1">{g.label}</div>
                <div className="text-[10px] text-slate-500">{g.sub}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-white mb-2">You're all set</h1>
          <p className="text-slate-400 mb-6">
            {TRACKS.find((t) => t.id === track)?.title} · {goal} lesson{goal > 1 ? 's' : ''} a day.
            Hit your goal to keep your streak alive.
          </p>
          <button onClick={finish} disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? 'Setting up…' : 'Start learning'}
          </button>
          <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-slate-300 mt-4">
            Back
          </button>
        </div>
      )}
    </div>
  );
}
