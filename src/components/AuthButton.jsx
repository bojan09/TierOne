import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

/** Compact navbar control reflecting auth state. */
export default function AuthButton() {
  const { session, profile, loading, signOut } = useAuth();

  if (loading) {
    return <span className="text-[12px] text-slate-600 px-2">…</span>;
  }

  if (!session) {
    return (
      <Link
        to="/login"
        className="text-[13px] font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-surface-700/60 transition-colors whitespace-nowrap"
      >
        Sign in
      </Link>
    );
  }

  const label =
    profile?.displayName || session.user.email?.split('@')[0] || 'Account';

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-slate-400 max-w-[120px] truncate hidden xl:inline">
        {label}
      </span>
      <button
        onClick={() => void signOut()}
        className="text-[13px] font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-surface-700/60 transition-colors whitespace-nowrap"
      >
        Sign out
      </button>
    </div>
  );
}
