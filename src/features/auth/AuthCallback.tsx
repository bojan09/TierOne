import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Landing page for Google OAuth and magic-link redirects. The Supabase client
 * (with detectSessionInUrl enabled) parses the URL and fires onAuthStateChange;
 * we just wait for the session to resolve, then forward into the app.
 */
export default function AuthCallback() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(session ? '/learn' : '/login', { replace: true });
    }
  }, [loading, session, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
      <div className="animate-pulse">Signing you in…</div>
    </div>
  );
}
