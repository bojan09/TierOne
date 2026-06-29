/**
 * Placeholder for the Supabase-generated `Database` type.
 *
 * In P3 this file is REPLACED by the output of:
 *   supabase gen types typescript --project-id <id> > src/shared/types/database.ts
 *
 * Until the schema exists, this minimal shape lets the typed client compile
 * without pretending tables exist.
 */
export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
