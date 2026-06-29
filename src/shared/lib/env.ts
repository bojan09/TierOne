/**
 * Typed access to client-side environment variables.
 *
 * Validation is lazy (on first use) rather than at import time, so that the
 * production build and CI — which run without a populated `.env` — do not fail
 * merely because the variables are absent. Any code path that actually needs a
 * configured backend will get a clear, actionable error instead.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cached: SupabaseConfig | null = null;

/**
 * Returns the Supabase client configuration, throwing a descriptive error if
 * the required variables are missing or empty.
 */
export function getSupabaseConfig(): SupabaseConfig {
  if (cached) return cached;

  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )?.trim();

  const missing: string[] = [];
  if (!url) missing.push('VITE_SUPABASE_URL');
  if (!anonKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(
        ', ',
      )}. Copy .env.example to .env and fill in your Supabase project values.`,
    );
  }

  cached = { url: url as string, anonKey: anonKey as string };
  return cached;
}

/** Whether Supabase config is present, without throwing. Useful for UI guards. */
export function hasSupabaseConfig(): boolean {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL?.trim()) &&
    Boolean(
      (
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )?.trim(),
    )
  );
}
