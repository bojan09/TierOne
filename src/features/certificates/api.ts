import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';
import { SITE_URL } from '@/shared/lib/seo';
import type { Track } from '@/shared/types';

export type { Track };

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
  comptia: 'CompTIA A+',
  scripting: 'Scripting & Automation',
};

export async function listCertificates(): Promise<Certificate[]> {
  if (!hasSupabaseConfig()) return [];
  const client = await getSupabaseClient();
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
  const client = await getSupabaseClient();
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

/**
 * LinkedIn's documented (if unofficial) "Add to Profile" deep link — pre-fills
 * a Licenses & Certifications entry rather than just sharing a post, which is
 * what actually makes a certificate useful to show an employer. No API key
 * or LinkedIn app registration required, just query params.
 */
export function linkedInAddToProfileUrl(cert: Certificate): string {
  const issued = new Date(cert.issued_at);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${TRACK_TITLE[cert.track]} Certificate`,
    organizationName: 'TierOne',
    issueYear: String(issued.getUTCFullYear()),
    issueMonth: String(issued.getUTCMonth() + 1),
    certUrl: `${SITE_URL}/verify/${cert.code}`,
    certId: cert.code,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export async function verifyCertificate(code: string): Promise<VerifyResult> {
  if (!hasSupabaseConfig()) return { valid: false };
  const client = await getSupabaseClient();
  const { data, error } = await client.rpc('verify_certificate', { p_code: code } as never);
  if (error) {
    console.error('verify_certificate failed:', error.message);
    return { valid: false };
  }
  return data as unknown as VerifyResult;
}
