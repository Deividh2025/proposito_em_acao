export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DatabaseTable = {
  Row: Record<string, Json | undefined>;
  Insert: Record<string, Json | undefined>;
  Update: Record<string, Json | undefined>;
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
