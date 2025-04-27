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
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          adults: number
          amount: number
          amount_paid: number | null
          base_rate: number
          booking_number: string
          check_in: string
          check_out: string
          children: number
          commission: number | null
          created_at: string | null
          guest_document: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          net_to_owner: number | null
          notes: string | null
          payment_status: string
          property: string
          remaining_amount: number | null
          room_number: string
          security_deposit: number | null
          status: string
          tourism_fee: number | null
          updated_at: string | null
          vat: number | null
        }
        Insert: {
          adults?: number
          amount: number
          amount_paid?: number | null
          base_rate: number
          booking_number: string
          check_in: string
          check_out: string
          children?: number
          commission?: number | null
          created_at?: string | null
          guest_document?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          net_to_owner?: number | null
          notes?: string | null
          payment_status?: string
          property: string
          remaining_amount?: number | null
          room_number: string
          security_deposit?: number | null
          status?: string
          tourism_fee?: number | null
          updated_at?: string | null
          vat?: number | null
        }
        Update: {
          adults?: number
          amount?: number
          amount_paid?: number | null
          base_rate?: number
          booking_number?: string
          check_in?: string
          check_out?: string
          children?: number
          commission?: number | null
          created_at?: string | null
          guest_document?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          net_to_owner?: number | null
          notes?: string | null
          payment_status?: string
          property?: string
          remaining_amount?: number | null
          room_number?: string
          security_deposit?: number | null
          status?: string
          tourism_fee?: number | null
          updated_at?: string | null
          vat?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          notes: string | null
          payment_method: string | null
          property: string
          receipt_url: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          property: string
          receipt_url?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          property?: string
          receipt_url?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          created_at: string
          device_id: string
          id: string
          ip_address: string
          login_time: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          ip_address: string
          login_time?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          ip_address?: string
          login_time?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_accounting_info: {
        Row: {
          accountnumber: string | null
          bankname: string | null
          created_at: string | null
          iban: string | null
          owner_id: string
          paymentmethod: string | null
          swift: string | null
          updated_at: string | null
        }
        Insert: {
          accountnumber?: string | null
          bankname?: string | null
          created_at?: string | null
          iban?: string | null
          owner_id: string
          paymentmethod?: string | null
          swift?: string | null
          updated_at?: string | null
        }
        Update: {
          accountnumber?: string | null
          bankname?: string | null
          created_at?: string | null
          iban?: string | null
          owner_id?: string
          paymentmethod?: string | null
          swift?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_accounting_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_tax_documents: {
        Row: {
          created_at: string | null
          document_name: string | null
          document_url: string
          id: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_name?: string | null
          document_url: string
          id?: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string | null
          document_url?: string
          id?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_tax_documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_tax_info: {
        Row: {
          created_at: string | null
          owner_id: string
          taxid: string | null
          taxresidence: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          owner_id: string
          taxid?: string | null
          taxresidence?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          owner_id?: string
          taxid?: string | null
          taxresidence?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_tax_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          address: string | null
          birthdate: string | null
          city: string | null
          commission_rate: number | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          payment_details: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          city?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          payment_details?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          city?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          payment_details?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          image: string | null
          name: string
          owner_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      room_types: {
        Row: {
          base_rate: number | null
          created_at: string | null
          description: string | null
          id: string
          max_occupancy: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          base_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_occupancy?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          base_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_occupancy?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          base_rate: number
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          max_occupancy: number
          name: string | null
          number: string
          owner_id: string | null
          property_id: string | null
          property_name: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          base_rate: number
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          max_occupancy?: number
          name?: string | null
          number: string
          owner_id?: string | null
          property_id?: string | null
          property_name: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          base_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          max_occupancy?: number
          name?: string | null
          number?: string
          owner_id?: string | null
          property_id?: string | null
          property_name?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: number
          key: string
          type: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          key: string
          type: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          key?: string
          type?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
          name: string
          notification_preferences: Json | null
          password: string | null
          phone: string | null
          position: string | null
          role: string
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          notification_preferences?: Json | null
          password?: string | null
          phone?: string | null
          position?: string | null
          role: string
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notification_preferences?: Json | null
          password?: string | null
          phone?: string | null
          position?: string | null
          role?: string
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
