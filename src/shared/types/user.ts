import type { IsoTimestamp, Role, Track, Uuid } from './common';

/**
 * A user profile row. One per authenticated user, keyed to `auth.users.id`.
 * RLS: a user may read/write only their own row; admins may read all.
 */
export interface Profile {
  id: Uuid; // == auth.users.id
  displayName: string;
  role: Role;
  /** The track the student is currently focused on. Switchable. */
  track: Track;
  createdAt: IsoTimestamp;
}

/** The minimal authenticated identity the app holds in memory. */
export interface AuthUser {
  id: Uuid;
  email: string | null;
}
