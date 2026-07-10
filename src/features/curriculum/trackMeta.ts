import type { Track } from '@/shared/types';

/**
 * Per-track signature colour + label — single source of truth so every
 * surface (Home cards, Academy hub, mega menu) reads the same track as the
 * same colour. Mirrors the `track.*` palette in tailwind.config.js.
 */
export interface TrackMeta {
  label: string;
  color: string;
}

export const TRACK_META: Record<Track, TrackMeta> = {
  helpdesk: { label: 'Help Desk', color: '#22d3ee' },
  sysadmin: { label: 'SysAdmin', color: '#8b5cf6' },
  comptia: { label: 'CompTIA A+', color: '#34d399' },
  scripting: { label: 'Scripting', color: '#fbbf24' },
};

export const DEFAULT_TRACK_META: TrackMeta = { label: 'Course', color: '#6d5cf5' };

export function trackMeta(track: string): TrackMeta {
  return TRACK_META[track as Track] ?? DEFAULT_TRACK_META;
}

/** Long-form section headings (Academy hub, Dashboard, course tree). */
export const TRACK_LABELS: Record<Track, string> = {
  helpdesk: 'Help Desk / Tier-1 Support',
  sysadmin: 'SysAdmin (Advanced)',
  comptia: 'CompTIA A+ (Certification)',
  scripting: 'Scripting & Automation',
};

export const TRACK_ORDER: Track[] = ['helpdesk', 'sysadmin', 'comptia', 'scripting'];
