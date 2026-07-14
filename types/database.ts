// ============================================================
// Types matching the Supabase schema
// ============================================================

export type UserRole = 'admin' | 'guest';

export type UserProfile = {
  id: string;
  full_name: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Rsvp = {
  id: string;
  guest_name: string;
  companions_count: number;
  message: string | null;
  created_at: string;
};

// ============================================================
// Form / Input types
// ============================================================

export interface RsvpFormValues {
  guest_name: string;
  companions_count: number;
  message?: string;
}

// ============================================================
// Supabase Database type (used with createClient generic)
// ============================================================

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Partial<UserProfile> & Pick<UserProfile, 'id'>;
        Update: Partial<UserProfile>;
        Relationships: [];
      };
      rsvps: {
        Row: Rsvp;
        Insert: Omit<Rsvp, 'id' | 'created_at'>;
        Update: Partial<Omit<Rsvp, 'id'>>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: UserRole;
    };
  };
};
