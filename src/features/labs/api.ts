import { getSupabaseClient } from '@/shared/lib/supabase';
import { hasSupabaseConfig } from '@/shared/lib/env';

export interface LabSummary {
  id: string;
  slug: string;
  title: string;
  intro: string;
  est_minutes: number;
  bonus_xp: number;
}

export interface LabStep {
  id: number;
  sort: number;
  instruction: string;
  accept_pattern: string;
  output: string | null;
  hint: string | null;
}

export interface LabFull {
  id: string;
  slug: string;
  title: string;
  intro: string;
  est_minutes: number;
  bonus_xp: number;
  steps: LabStep[];
}

export async function listLabs(): Promise<LabSummary[]> {
  if (!hasSupabaseConfig()) return [];
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('labs')
    .select('id, slug, title, intro, est_minutes, bonus_xp')
    .order('sort', { ascending: true });
  if (error) {
    console.error('listLabs failed:', error.message);
    return [];
  }
  return (data ?? []) as unknown as LabSummary[];
}

export async function getLabBySlug(slug: string): Promise<LabFull | null> {
  if (!hasSupabaseConfig()) return null;
  const client = getSupabaseClient();
  const { data: row, error: e1 } = await client
    .from('labs')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (e1 || !row) {
    if (e1) console.error('lab lookup failed:', e1.message);
    return null;
  }
  const id = (row as unknown as { id: string }).id;
  const { data, error } = await client.rpc('get_lab', { p_lab_id: id } as never);
  if (error) {
    console.error('get_lab failed:', error.message);
    return null;
  }
  return data as unknown as LabFull;
}

export async function completeLab(labId: string): Promise<boolean> {
  if (!hasSupabaseConfig()) return false;
  const client = getSupabaseClient();
  const { error } = await client.rpc('complete_lab', { p_lab_id: labId } as never);
  if (error) {
    console.error('complete_lab failed:', error.message);
    return false;
  }
  return true;
}
