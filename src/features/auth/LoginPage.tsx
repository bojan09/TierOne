import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const {
    session,
    loading,
    configError,
    signInWithPassword,
    signUp,
    signInWithMagicLink,
    signInWithGoogle,
  } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/learn';

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setNotice(null);
  }, [mode]);

  // Already signed in → bounce to where they were headed. Declared after all
  // hooks so hook order stays stable across renders.
  if (!loading && session) return <Navigate to={from} replace />;

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const result =
      mode === 'signin'
        ? await signInWithPassword(email, password)
        : await signUp(email, password, displayName || undefined);
    setBusy(false);
    if (result.error) {
      setError(result.error);
    } else if (result.emailSent) {
      setNotice('Check your email to confirm your account, then sign in.');
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Enter your email first.');
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    const result = await signInWithMagicLink(email);
    setBusy(false);
    if (result.error) setError(result.error);
    else setNotice('Magic link sent — check your email.');
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    const result = await signInWithGoogle();
    setBusy(false);
    if (result.error) setError(result.error);
    // On success the browser redirects to Google, then back to /auth/callback.
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        {mode === 'signin'
          ? 'Sign in to track your progress across the Academy.'
          : 'Start learning and earning XP toward job-ready skills.'}
      </p>

      {configError && (
        <div className="callout callout-warning mb-6">
          <span className="callout-icon">⚠️</span>
          <p className="callout-body">{configError}</p>
        </div>
      )}

      <button
        onClick={handleGoogle}
        disabled={busy || Boolean(configError)}
        className="btn-secondary w-full justify-center gap-2.5 mb-4 disabled:opacity-50"
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-5 text-xs text-slate-600">
        <span className="h-px flex-1 bg-surface-700" />
        or
        <span className="h-px flex-1 bg-surface-700" />
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Display name (optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input w-full"
            autoComplete="name"
          />
        )}
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          autoComplete="email"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />

        {error && <p className="text-sm text-accent-red">{error}</p>}
        {notice && <p className="text-sm text-accent-green">{notice}</p>}

        <button
          type="submit"
          disabled={busy || Boolean(configError)}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={handleMagicLink}
        disabled={busy || Boolean(configError)}
        className="btn-ghost w-full justify-center mt-3 text-sm disabled:opacity-50"
      >
        Email me a magic link instead
      </button>

      <p className="text-center text-sm text-slate-500 mt-8">
        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-brand-300 hover:text-brand-200 font-medium"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
