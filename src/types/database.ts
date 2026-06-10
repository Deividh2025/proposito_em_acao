export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Placeholder until `npm.cmd run supabase:types:preview` is executed against an
// approved preview branch. Keep it loose so runtime code can compile without
// pretending these are generated schema-accurate types.
export type DatabaseTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: Array<{
    foreignKeyName: string;
    columns: string[];
    isOneToOne: boolean;
    referencedRelation: string;
    referencedColumns: string[];
  }>;
};

export interface Database {
  public: {
    Tables: Record<string, DatabaseTable>;
    Views: Record<string, DatabaseTable>;
    Functions: Record<string, never>;
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: Record<string, never>;
  };
}
