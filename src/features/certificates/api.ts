import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export type Track = 'helpdesk' | 'sysadmin';

export interface Certificate {
  track: Track;
  holder_name: string;
  code: string;
  issued_at: string;
}

export interface ClaimResult {
  eligible: boolean;
  code?: string;
  issued_at?: string;
  track?: Track;
  holder_name?: string;
  completed: number;
  total: number;
}

export const TRACK_TITLE: Record<Track, string> = {
  helpdesk: 'Help Desk Technician',
  sysadmin: 'System Administrator',
};

export async function listCertificates(): Promise<Certificate[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('certificates')
    .select('track, holder_name, code, issued_at')
    .order('issued_at', { ascending: false });
  if (error) {
    console.error('listCertificates failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as Certificate[];
}

export async function claimCertificate(track: Track): Promise<ClaimResult | null> {
  if (!hasSupabaseConfig()) return null;
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('claim_certificate', { p_track: track } as never);
  if (error) {
    console.error('claim_certificate failed:', error.message);
    return null;
  }
  return data as unknown as ClaimResult;
}

export interface VerifyResult {
  valid: boolean;
  holder_name?: string;
  track?: Track;
  issued_at?: string;
}

export async function verifyCertificate(code: string): Promise<VerifyResult> {
  if (!hasSupabaseConfig()) return { valid: false };
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('verify_certificate', { p_code: code } as never);
  if (error) {
    console.error('verify_certificate failed:', error.message);
    return { valid: false };
  }
  return data as unknown as VerifyResult;
}
