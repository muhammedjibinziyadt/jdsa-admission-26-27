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
      attendance_leaves: {
        Row: {
          created_at: string
          end_date: string
          id: string
          reason: string | null
          return_date: string | null
          start_date: string
          student_id: string
          total_days: number
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          reason?: string | null
          return_date?: string | null
          start_date: string
          student_id: string
          total_days?: number
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          reason?: string | null
          return_date?: string | null
          start_date?: string
          student_id?: string
          total_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_leaves_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "attendance_students"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          notes: string | null
          status: string
          student_id: string
          time_in: string | null
          time_out: string | null
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          status?: string
          student_id: string
          time_in?: string | null
          time_out?: string | null
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          status?: string
          student_id?: string
          time_in?: string | null
          time_out?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "attendance_students"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_students: {
        Row: {
          created_at: string
          id: string
          name: string
          photo_url: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          sort_order?: number
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
      central_fund_book: {
        Row: {
          amount: number
          created_at: string
          entry_date: string
          fund_type: string
          id: string
          person_name: string
          reason: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          entry_date?: string
          fund_type?: string
          id?: string
          person_name: string
          reason?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          entry_date?: string
          fund_type?: string
          id?: string
          person_name?: string
          reason?: string | null
        }
        Relationships: []
      }
      central_item_usage: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          item_name: string
          notes: string | null
          quantity: number | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          item_name: string
          notes?: string | null
          quantity?: number | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          item_name?: string
          notes?: string | null
          quantity?: number | null
          used_by?: string | null
        }
        Relationships: []
      }
      central_minutes: {
        Row: {
          created_at: string
          id: string
          meeting_date: string
          notes: string
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_date?: string
          notes: string
        }
        Update: {
          created_at?: string
          id?: string
          meeting_date?: string
          notes?: string
        }
        Relationships: []
      }
      central_reports: {
        Row: {
          created_at: string
          description: string | null
          entry_date: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      central_updates: {
        Row: {
          content: string | null
          created_at: string
          entry_date: string
          id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      committee_custom_entries: {
        Row: {
          body: string | null
          created_at: string
          entry_date: string
          file_url: string | null
          id: string
          image_url: string | null
          section_id: string
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entry_date?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          section_id: string
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entry_date?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          section_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "committee_custom_entries_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "committee_custom_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      committee_custom_sections: {
        Row: {
          committee_id: string
          created_at: string
          description: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          committee_id: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          committee_id?: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      committee_finances: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          entry_date: string
          id: string
          title: string
          type: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      committee_fines: {
        Row: {
          amount: number
          committee_id: string
          created_at: string
          day_name: string | null
          fine_date: string
          id: string
          payment_status: string
          person_name: string
          reason: string
        }
        Insert: {
          amount?: number
          committee_id: string
          created_at?: string
          day_name?: string | null
          fine_date?: string
          id?: string
          payment_status?: string
          person_name: string
          reason: string
        }
        Update: {
          amount?: number
          committee_id?: string
          created_at?: string
          day_name?: string | null
          fine_date?: string
          id?: string
          payment_status?: string
          person_name?: string
          reason?: string
        }
        Relationships: []
      }
      committee_items: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          photo_url: string | null
          quantity: number | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          photo_url?: string | null
          quantity?: number | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          quantity?: number | null
          sort_order?: number
        }
        Relationships: []
      }
      committee_settings: {
        Row: {
          constitution_url: string | null
          group_photo_url: string | null
          id: string
          updated_at: string
        }
        Insert: {
          constitution_url?: string | null
          group_photo_url?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          constitution_url?: string | null
          group_photo_url?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      committees: {
        Row: {
          id: string
          max_score: number | null
          name: string
          password: string
          remark: string | null
          score: number | null
          updated_at: string
        }
        Insert: {
          id: string
          max_score?: number | null
          name: string
          password?: string
          remark?: string | null
          score?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          max_score?: number | null
          name?: string
          password?: string
          remark?: string | null
          score?: number | null
          updated_at?: string
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
      jawahir_contributors: {
        Row: {
          created_at: string
          details: string | null
          id: string
          student_name: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          student_name: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          student_name?: string
        }
        Relationships: []
      }
      jawahir_initiatives: {
        Row: {
          created_at: string
          description: string | null
          entry_date: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      jawahir_magazines: {
        Row: {
          cover_url: string | null
          created_at: string
          id: string
          issue_date: string
          pdf_url: string
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          id?: string
          issue_date?: string
          pdf_url: string
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          id?: string
          issue_date?: string
          pdf_url?: string
          title?: string
        }
        Relationships: []
      }
      jawahir_students: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      jawahir_submissions: {
        Row: {
          id: string
          student_id: string
          submitted: boolean
          updated_at: string
          year_month: string
        }
        Insert: {
          id?: string
          student_id: string
          submitted?: boolean
          updated_at?: string
          year_month: string
        }
        Update: {
          id?: string
          student_id?: string
          submitted?: boolean
          updated_at?: string
          year_month?: string
        }
        Relationships: [
          {
            foreignKeyName: "jawahir_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "jawahir_students"
            referencedColumns: ["id"]
          },
        ]
      }
      library_activities: {
        Row: {
          activity_title: string
          created_at: string
          details: string | null
          id: string
          student_name: string
        }
        Insert: {
          activity_title: string
          created_at?: string
          details?: string | null
          id?: string
          student_name: string
        }
        Update: {
          activity_title?: string
          created_at?: string
          details?: string | null
          id?: string
          student_name?: string
        }
        Relationships: []
      }
      library_book_issues: {
        Row: {
          book_name: string
          created_at: string
          day_name: string | null
          id: string
          issue_date: string
          issue_time: string | null
          notes: string | null
          return_date: string | null
          return_time: string | null
          status: string
          student_name: string
        }
        Insert: {
          book_name: string
          created_at?: string
          day_name?: string | null
          id?: string
          issue_date?: string
          issue_time?: string | null
          notes?: string | null
          return_date?: string | null
          return_time?: string | null
          status?: string
          student_name: string
        }
        Update: {
          book_name?: string
          created_at?: string
          day_name?: string | null
          id?: string
          issue_date?: string
          issue_time?: string | null
          notes?: string | null
          return_date?: string | null
          return_time?: string | null
          status?: string
          student_name?: string
        }
        Relationships: []
      }
      library_books: {
        Row: {
          author: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          status: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          status?: string
        }
        Update: {
          author?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          status?: string
        }
        Relationships: []
      }
      library_programs: {
        Row: {
          created_at: string
          description: string | null
          entry_date: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      photoshop_classes: {
        Row: {
          class_number: number
          completed: boolean
          id: string
          locked: boolean
          student_id: string
          title: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          class_number: number
          completed?: boolean
          id?: string
          locked?: boolean
          student_id: string
          title?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          class_number?: number
          completed?: boolean
          id?: string
          locked?: boolean
          student_id?: string
          title?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photoshop_classes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "photoshop_students"
            referencedColumns: ["id"]
          },
        ]
      }
      photoshop_posters: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          student_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          student_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photoshop_posters_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "photoshop_students"
            referencedColumns: ["id"]
          },
        ]
      }
      photoshop_students: {
        Row: {
          created_at: string
          id: string
          name: string
          photo_url: string | null
          remarks: string | null
          score: number | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          remarks?: string | null
          score?: number | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          remarks?: string | null
          score?: number | null
          sort_order?: number
        }
        Relationships: []
      }
      portal_settings: {
        Row: {
          id: string
          password: string
          updated_at: string
        }
        Insert: {
          id?: string
          password?: string
          updated_at?: string
        }
        Update: {
          id?: string
          password?: string
          updated_at?: string
        }
        Relationships: []
      }
      samaja_awards: {
        Row: {
          award_month: string
          award_title: string
          created_at: string
          id: string
          notes: string | null
          winner_name: string
        }
        Insert: {
          award_month: string
          award_title: string
          created_at?: string
          id?: string
          notes?: string | null
          winner_name: string
        }
        Update: {
          award_month?: string
          award_title?: string
          created_at?: string
          id?: string
          notes?: string | null
          winner_name?: string
        }
        Relationships: []
      }
      samaja_bookings: {
        Row: {
          booked_by: string | null
          booking_date: string
          created_at: string
          details: string | null
          id: string
          title: string
        }
        Insert: {
          booked_by?: string | null
          booking_date?: string
          created_at?: string
          details?: string | null
          id?: string
          title: string
        }
        Update: {
          booked_by?: string | null
          booking_date?: string
          created_at?: string
          details?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      samaja_initiatives: {
        Row: {
          created_at: string
          description: string | null
          entry_date: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      samaja_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_url: string
          week_date: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url: string
          week_date?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url?: string
          week_date?: string
        }
        Relationships: []
      }
      samaja_reports: {
        Row: {
          absent: string | null
          attended: string | null
          created_at: string
          details: string | null
          entry_date: string
          id: string
          speakers: string | null
          title: string
        }
        Insert: {
          absent?: string | null
          attended?: string | null
          created_at?: string
          details?: string | null
          entry_date?: string
          id?: string
          speakers?: string | null
          title: string
        }
        Update: {
          absent?: string | null
          attended?: string | null
          created_at?: string
          details?: string | null
          entry_date?: string
          id?: string
          speakers?: string | null
          title?: string
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
          visitor_email: string | null
          visitor_name: string | null
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
          visitor_email?: string | null
          visitor_name?: string | null
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
          visitor_email?: string | null
          visitor_name?: string | null
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
