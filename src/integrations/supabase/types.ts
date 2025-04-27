export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_dates: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_date: string
          id: string
          reason: string | null
          room_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_date: string
          id?: string
          reason?: string | null
          room_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          room_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_dates_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_availability"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "blocked_dates_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          adults: number
          amount: number
          booking_number: string
          check_in: string
          check_out: string
          children: number
          created_at: string | null
          created_by: string | null
          guest_id: string | null
          guest_name: string
          id: string
          payment_status:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          property_id: string | null
          room_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status_type"]
          updated_at: string | null
        }
        Insert: {
          adults?: number
          amount: number
          booking_number: string
          check_in: string
          check_out: string
          children?: number
          created_at?: string | null
          created_by?: string | null
          guest_id?: string | null
          guest_name: string
          id?: string
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          property_id?: string | null
          room_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status_type"]
          updated_at?: string | null
        }
        Update: {
          adults?: number
          amount?: number
          booking_number?: string
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string | null
          created_by?: string | null
          guest_id?: string | null
          guest_name?: string
          id?: string
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          property_id?: string | null
          room_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_availability"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaning_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          property_id: string | null
          room_id: string
          status: Database["public"]["Enums"]["cleaning_status_type"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          property_id?: string | null
          room_id: string
          status?: Database["public"]["Enums"]["cleaning_status_type"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          property_id?: string | null
          room_id?: string
          status?: Database["public"]["Enums"]["cleaning_status_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaning_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaning_tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_availability"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "cleaning_tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          booking_id: string | null
          content: string | null
          created_at: string | null
          direction: string
          guest_id: string | null
          id: string
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          content?: string | null
          created_at?: string | null
          direction: string
          guest_id?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          content?: string | null
          created_at?: string | null
          direction?: string
          guest_id?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          property_id: string | null
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          property_id?: string | null
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          property_id?: string | null
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          payment_method: string
          property_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          id?: string
          payment_method: string
          property_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          payment_method?: string
          property_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          id_number: string | null
          id_type: string | null
          last_name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          last_name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          cost: number | null
          created_at: string | null
          id: string
          issue_description: string
          reported_by: string | null
          reported_date: string | null
          resolution_notes: string | null
          room_id: string | null
          scheduled_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string | null
          id?: string
          issue_description: string
          reported_by?: string | null
          reported_date?: string | null
          resolution_notes?: string | null
          room_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string | null
          id?: string
          issue_description?: string
          reported_by?: string | null
          reported_date?: string | null
          resolution_notes?: string | null
          room_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_availability"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "maintenance_records_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          payment_info: Json | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          payment_info?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          payment_info?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string
          status: Database["public"]["Enums"]["payment_status_type"]
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          status?: Database["public"]["Enums"]["payment_status_type"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          status?: Database["public"]["Enums"]["payment_status_type"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          check_in_time: string | null
          check_out_time: string | null
          city: string
          country: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          tax_rate: number | null
          timezone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          check_in_time?: string | null
          check_out_time?: string | null
          city: string
          country: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_rate?: number | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          check_in_time?: string | null
          check_out_time?: string | null
          city?: string
          country?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_rate?: number | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      property_ownership: {
        Row: {
          commission_rate: number
          contract_end_date: string | null
          contract_start_date: string
          created_at: string | null
          id: string
          owner_id: string | null
          room_id: string | null
          updated_at: string | null
        }
        Insert: {
          commission_rate: number
          contract_end_date?: string | null
          contract_start_date: string
          created_at?: string | null
          id?: string
          owner_id?: string | null
          room_id?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number
          contract_end_date?: string | null
          contract_start_date?: string
          created_at?: string | null
          id?: string
          owner_id?: string | null
          room_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_ownership_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_ownership_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_availability"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "property_ownership_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rates: {
        Row: {
          created_at: string | null
          date: string
          id: string
          rate: number
          room_type_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          rate: number
          room_type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          rate?: number
          room_type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rates_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          room_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          room_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          room_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_images_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_availability"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "room_images_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          base_rate: number
          created_at: string | null
          description: string | null
          id: string
          max_occupancy: number
          name: string
          property_id: string | null
          updated_at: string | null
        }
        Insert: {
          base_rate: number
          created_at?: string | null
          description?: string | null
          id?: string
          max_occupancy?: number
          name: string
          property_id?: string | null
          updated_at?: string | null
        }
        Update: {
          base_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          max_occupancy?: number
          name?: string
          property_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string | null
          description: string | null
          features: Json | null
          floor: string
          id: string
          number: string
          property_id: string | null
          rate: number
          room_type_id: string | null
          status: Database["public"]["Enums"]["room_status_type"]
          type: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          features?: Json | null
          floor: string
          id?: string
          number: string
          property_id?: string | null
          rate: number
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["room_status_type"]
          type: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          features?: Json | null
          floor?: string
          id?: string
          number?: string
          property_id?: string | null
          rate?: number
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["room_status_type"]
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          category: string
          created_at: string | null
          id: string
          property_id: string | null
          settings_key: string
          settings_value: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          property_id?: string | null
          settings_key: string
          settings_value?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          property_id?: string | null
          settings_key?: string
          settings_value?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          last_active: string | null
          name: string
          role: Database["public"]["Enums"]["user_role_type"]
          status: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_active?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role_type"]
          status?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_active?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      room_availability: {
        Row: {
          capacity: number | null
          is_available: boolean | null
          number: string | null
          property_id: string | null
          property_name: string | null
          rate: number | null
          room_id: string | null
          room_type_name: string | null
          status: Database["public"]["Enums"]["room_status_type"] | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      today_activities: {
        Row: {
          activity_date: string | null
          activity_type: string | null
          booking_id: string | null
          booking_number: string | null
          guest_name: string | null
          property_name: string | null
          room_number: string | null
          status: Database["public"]["Enums"]["booking_status_type"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status_type:
        | "pending"
        | "confirmed"
        | "checked-in"
        | "checked-out"
        | "cancelled"
        | "no-show"
      cleaning_status_type:
        | "pending"
        | "in-progress"
        | "completed"
        | "verified"
        | "issues"
      payment_status_type:
        | "pending"
        | "paid"
        | "partial"
        | "refunded"
        | "failed"
      room_status_type:
        | "available"
        | "occupied"
        | "cleaning"
        | "maintenance"
        | "out-of-order"
      user_role_type:
        | "admin"
        | "manager"
        | "staff"
        | "cleaner"
        | "owner"
        | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status_type: [
        "pending",
        "confirmed",
        "checked-in",
        "checked-out",
        "cancelled",
        "no-show",
      ],
      cleaning_status_type: [
        "pending",
        "in-progress",
        "completed",
        "verified",
        "issues",
      ],
      payment_status_type: ["pending", "paid", "partial", "refunded", "failed"],
      room_status_type: [
        "available",
        "occupied",
        "cleaning",
        "maintenance",
        "out-of-order",
      ],
      user_role_type: [
        "admin",
        "manager",
        "staff",
        "cleaner",
        "owner",
        "guest",
      ],
    },
  },
} as const
