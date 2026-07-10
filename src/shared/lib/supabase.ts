import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database';
import { getSupabaseConfig } from './env';

/**
 * Typed Supabase client.
 *
 * `@supabase/supabase-js` (~53KB gzipped) is dynamically imported so it forms
 * a real async chunk boundary — the entry bundle no longer statically pulls
 * it in, which otherwise forced the browser to fetch/parse/execute it before
 * React could paint anything (was blocking LCP). Memoized via a shared
 * promise so concurrent callers await the same in-flight client creation.
 */

export type AppSupabaseClient = SupabaseClient<Database>;

let clientPromise: Promise<AppSupabaseClient> | null = null;

export function getSupabaseClient(): Promise<AppSupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      const { url, anonKey } = getSupabaseConfig();
      return createClient<Database>(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true, // needed for magic-link / OAuth callbacks (P3)
        },
      });
    });
  }
  return clientPromise;
}
