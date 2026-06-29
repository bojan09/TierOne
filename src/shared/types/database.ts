/**
 * Supabase `Database` type.
 *
 * Hand-authored to match supabase/migrations/0001_profiles.sql and
 * 0002_progress.sql (this environment can't reach the project to run codegen).
 * Once the CLI is linked, regenerate the source of truth with:
 *
 *   supabase gen types typescript --project-id esfmeeclqctegnitbkpg > src/shared/types/database.ts
 */
export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type AppRole = 'student' | 'admin';
type TrackEnum = 'helpdesk' | 'sysadmin';
type LessonStatusEnum = 'not_started' | 'in_progress' | 'completed';

interface UserStatsRow {
  user_id: string;
  total_xp: number;
  level: number;
  streak: number;
  last_study_date: string | null;
  earned_badges: Json;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: AppRole;
          track: TrackEnum;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: AppRole;
          track?: TrackEnum;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          role?: AppRole;
          track?: TrackEnum;
          created_at?: string;
        };
        Relationships: [];
      };
      curriculum_lessons: {
        Row: {
          id: string;
          slug: string;
          title: string;
          track: TrackEnum;
          xp: number;
          sort_order: number;
        };
        Insert: {
          id: string;
          slug: string;
          title: string;
          track: TrackEnum;
          xp: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          track?: TrackEnum;
          xp?: number;
          sort_order?: number;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          user_id: string;
          lesson_id: string;
          status: LessonStatusEnum;
          completed_at: string | null;
          xp_awarded: number;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          status?: LessonStatusEnum;
          completed_at?: string | null;
          xp_awarded?: number;
        };
        Update: {
          user_id?: string;
          lesson_id?: string;
          status?: LessonStatusEnum;
          completed_at?: string | null;
          xp_awarded?: number;
        };
        Relationships: [];
      };
      user_stats: {
        Row: UserStatsRow;
        Insert: {
          user_id: string;
          total_xp?: number;
          level?: number;
          streak?: number;
          last_study_date?: string | null;
          earned_badges?: Json;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          total_xp?: number;
          level?: number;
          streak?: number;
          last_study_date?: string | null;
          earned_badges?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      level_for_xp: {
        Args: { p_xp: number };
        Returns: number;
      };
      complete_lesson: {
        Args: { p_lesson_id: string };
        Returns: UserStatsRow;
      };
    };
    Enums: {
      app_role: AppRole;
      track: TrackEnum;
      lesson_status: LessonStatusEnum;
    };
    CompositeTypes: Record<string, never>;
  };
}
