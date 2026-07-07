import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/shared/types';

export interface AuthContextValue {
  /** Current Supabase session, or null if signed out. */
  session: Session | null;
  /** The signed-in user's profile row (mapped to the domain type), or null. */
  profile: Profile | null;
  /** True while the initial session/profile resolve is in flight. */
  loading: boolean;
  /** Set when the Supabase backend isn't configured (missing env). */
  configError: string | null;

  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthResult>;
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  /** Update the signed-in user's own profile prefs (track, daily goal, onboarding). */
  updateProfile: (patch: {
    track?: Profile['track'];
    dailyGoal?: number;
    onboardedAt?: string;
  }) => Promise<AuthResult>;
}

/** Normalised result so the UI never has to know about Supabase error shapes. */
export interface AuthResult {
  error: string | null;
  /** True for flows that send an email rather than signing in immediately. */
  emailSent?: boolean;
}
