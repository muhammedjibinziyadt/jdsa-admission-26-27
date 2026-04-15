export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_username: string
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_username: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_username?: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      admin_credentials: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          animations_enabled: boolean
          id: string
          layout: Json
          maintenance_mode: boolean
          seo: Json
          theme: Json
          typography: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          animations_enabled?: boolean
          id?: string
          layout?: Json
          maintenance_mode?: boolean
          seo?: Json
          theme?: Json
          typography?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          animations_enabled?: boolean
          id?: string
          layout?: Json
          maintenance_mode?: boolean
          seo?: Json
          theme?: Json
          typography?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      admissions: {
        Row: {
          aadhaar_number: string | null
          additional_info: string | null
          address: string | null
          age: number | null
          approved: boolean | null
          birth_certificate_number: string | null
          confirmation_document_url: string | null
          created_at: string
          date_of_birth: string | null
          gender: string | null
          guardian_email: string | null
          guardian_name: string
          guardian_phone: string
          guardian_relation: string | null
          id: string
          image_url: string | null
          notified: boolean | null
          previous_school: string | null
          selected_course: string | null
          status: string | null
          student_name: string
          tc_number: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          additional_info?: string | null
          address?: string | null
          age?: number | null
          approved?: boolean | null
          birth_certificate_number?: string | null
          confirmation_document_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string | null
          guardian_email?: string | null
          guardian_name: string
          guardian_phone: string
          guardian_relation?: string | null
          id?: string
          image_url?: string | null
          notified?: boolean | null
          previous_school?: string | null
          selected_course?: string | null
          status?: string | null
          student_name: string
          tc_number?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          additional_info?: string | null
          address?: string | null
          age?: number | null
          approved?: boolean | null
          birth_certificate_number?: string | null
          confirmation_document_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string | null
          guardian_email?: string | null
          guardian_name?: string
          guardian_phone?: string
          guardian_relation?: string | null
          id?: string
          image_url?: string | null
          notified?: boolean | null
          previous_school?: string | null
          selected_course?: string | null
          status?: string | null
          student_name?: string
          tc_number?: string | null
        }
        Relationships: []
      }
      book_orders: {
        Row: {
          address: string
          book_id: string | null
          book_name: string
          created_at: string
          customer_name: string
          id: string
          payment_screenshot_url: string | null
          phone: string
          status: string
        }
        Insert: {
          address: string
          book_id?: string | null
          book_name: string
          created_at?: string
          customer_name: string
          id?: string
          payment_screenshot_url?: string | null
          phone: string
          status?: string
        }
        Update: {
          address?: string
          book_id?: string | null
          book_name?: string
          created_at?: string
          customer_name?: string
          id?: string
          payment_screenshot_url?: string | null
          phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_orders_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          price?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      gallery_likes: {
        Row: {
          created_at: string
          device_id: string
          id: string
          image_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          image_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          image_id?: string
        }
        Relationships: []
      }
      students_portal: {
        Row: {
          aadhaar_url: string | null
          address: string
          birth_certificate_url: string | null
          created_at: string
          current_education: string | null
          father_name: string
          id: string
          phone1: string
          phone2: string | null
          photo_url: string | null
          previous_madrasa: string | null
          student_name: string
          year_of_admission: string
        }
        Insert: {
          aadhaar_url?: string | null
          address: string
          birth_certificate_url?: string | null
          created_at?: string
          current_education?: string | null
          father_name: string
          id?: string
          phone1: string
          phone2?: string | null
          photo_url?: string | null
          previous_madrasa?: string | null
          student_name: string
          year_of_admission: string
        }
        Update: {
          aadhaar_url?: string | null
          address?: string
          birth_certificate_url?: string | null
          created_at?: string
          current_education?: string | null
          father_name?: string
          id?: string
          phone1?: string
          phone2?: string | null
          photo_url?: string | null
          previous_madrasa?: string | null
          student_name?: string
          year_of_admission?: string
        }
        Relationships: []
      }
      timetables: {
        Row: {
          activity: string
          category: string
          created_at: string
          day: string
          id: string
          sort_order: number
          time_slot: string
        }
        Insert: {
          activity: string
          category: string
          created_at?: string
          day: string
          id?: string
          sort_order?: number
          time_slot: string
        }
        Update: {
          activity?: string
          category?: string
          created_at?: string
          day?: string
          id?: string
          sort_order?: number
          time_slot?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_logs: {
        Row: {
          browser_name: string | null
          city: string | null
          country: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          page_visited: string
          visited_at: string
        }
        Insert: {
          browser_name?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_visited?: string
          visited_at?: string
        }
        Update: {
          browser_name?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_visited?: string
          visited_at?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content: Json
          id: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "moderator"],
    },
  },
} as const
