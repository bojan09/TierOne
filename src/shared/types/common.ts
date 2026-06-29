/**
 * Shared primitive types and enums used across the domain.
 * These are the foundational contracts; everything else builds on them.
 */

/** The two learning tracks the platform offers. */
export type Track = 'helpdesk' | 'sysadmin';

/** Application roles. Stored on `profiles.role`. */
export type Role = 'student' | 'admin';

/** Difficulty label shown on courses and lessons. */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/** Per-user lesson completion status. */
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

/** ISO-8601 timestamp string (e.g. from Supabase `timestamptz`). */
export type IsoTimestamp = string;

/** A UUID string. */
export type Uuid = string;
