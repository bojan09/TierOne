import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/shared/types';
import { hasSupabaseConfig } from '@/shared/lib/env';
import { getSupabaseClient, type AppSupabaseClient } from '@/shared/lib/supabase';
import { AuthContext } from './context';
import type { AuthContextValue, AuthResult } from './types';

function mapProfile(row: {
  id: string;
  display_name: string | null;
  role: 'student' | 'admin';
  track: 'helpdesk' | 'sysadmin';
  created_at: string;
}): Profile {
  return {
    id: row.id,
    displayName: row.display_name ?? '',
    role: row.role,
    track: row.track,
    createdAt: row.created_at,
  };
}

function toMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Something went wrong. Please try again.';
}

/** Where OAuth / magic-link redirects land. */
function redirectTo(): string {
  return `${window.location.origin}/auth/callback`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // Resolve the client once; if env is missing, degrade gracefully.
  const clientRef = useRef<AppSupabaseClient | null>(null);
  if (clientRef.current === null && hasSupabaseConfig()) {
    clientRef.current = getSupabaseClient();
  }
  const client = clientRef.current;

  const loadProfile = useCallback(
    async (userId: string) => {
      if (!client) return;
      const { data, error } = await client
        .from('profiles')
        .select('id, display_name, role, track, created_at')
        .eq('id', userId)
        .single();
      if (error) {
        // Profile may not exist yet immediately after signup; not fatal.
        setProfile(null);
        return;
      }
      setProfile(mapProfile(data));
    },
    [client],
  );

  useEffect(() => {
    if (!client) {
      setConfigError(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.',
      );
      setLoading(false);
      return;
    }

    let active = true;

    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        void loadProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        void loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client, loadProfile]);

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!client) return { error: configError };
      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error: error ? toMessage(error) : null };
    },
    [client, configError],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName?: string,
    ): Promise<AuthResult> => {
      if (!client) return { error: configError };
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo(),
          data: displayName ? { full_name: displayName } : undefined,
        },
      });
      if (error) return { error: toMessage(error) };
      // When email confirmation is on, there is no active session yet.
      return { error: null, emailSent: !data.session };
    },
    [client, configError],
  );

  const signInWithMagicLink = useCallback(
    async (email: string): Promise<AuthResult> => {
      if (!client) return { error: configError };
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo() },
      });
      return { error: error ? toMessage(error) : null, emailSent: !error };
    },
    [client, configError],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!client) return { error: configError };
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    });
    return { error: error ? toMessage(error) : null };
  }, [client, configError]);

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
    setProfile(null);
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      configError,
      signInWithPassword,
      signUp,
      signInWithMagicLink,
      signInWithGoogle,
      signOut,
    }),
    [
      session,
      profile,
      loading,
      configError,
      signInWithPassword,
      signUp,
      signInWithMagicLink,
      signInWithGoogle,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
