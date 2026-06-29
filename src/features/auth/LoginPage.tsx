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
        className="btn-secondary w-full justify-center mb-4 disabled:opacity-50"
      >
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
