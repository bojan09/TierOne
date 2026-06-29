import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database';
import { getSupabaseConfig } from './env';

/**
 * Typed Supabase client.
 *
 * Created lazily so that importing this module never throws on a missing
 * `.env` (important for build/CI). The first caller to `getSupabaseClient()`
 * triggers config validation. Auth wiring happens in P3.
 */

export type AppSupabaseClient = SupabaseClient<Database>;

let client: AppSupabaseClient | null = null;

export function getSupabaseClient(): AppSupabaseClient {
  if (client) return client;

  const { url, anonKey } = getSupabaseConfig();
  client = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // needed for magic-link / OAuth callbacks (P3)
    },
  });
  return client;
}
