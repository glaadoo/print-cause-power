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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string
          line1: string
          line2: string | null
          postal_code: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          line1: string
          line2?: string | null
          postal_code: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          line1?: string
          line2?: string | null
          postal_code?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          cause: string
          created_at: string
          donor_name: string
          id: string
          payment_method: string
          user_id: string | null
        }
        Insert: {
          amount: number
          cause: string
          created_at?: string
          donor_name: string
          id?: string
          payment_method: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          cause?: string
          created_at?: string
          donor_name?: string
          id?: string
          payment_method?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gift_card_redemptions: {
        Row: {
          amount: number
          created_at: string
          gift_card_id: string
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          gift_card_id: string
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          gift_card_id?: string
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_redemptions_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_card_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_cards: {
        Row: {
          balance: number
          code: string
          created_at: string
          currency: string
          id: string
          status: string
        }
        Insert: {
          balance?: number
          code: string
          created_at?: string
          currency?: string
          id?: string
          status?: string
        }
        Update: {
          balance?: number
          code?: string
          created_at?: string
          currency?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      notify_me: {
        Row: {
          created_at: string
          id: string
          product_id: number
          user_id: string
          variant: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: number
          user_id: string
          variant?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number
          user_id?: string
          variant?: Json | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          donation_amount: number
          id: string
          order_id: string
          price: number
          product_id: number
          product_image: string | null
          product_name: string
          quantity: number
          size: string | null
        }
        Insert: {
          created_at?: string
          donation_amount?: number
          id?: string
          order_id: string
          price: number
          product_id: number
          product_image?: string | null
          product_name: string
          quantity: number
          size?: string | null
        }
        Update: {
          created_at?: string
          donation_amount?: number
          id?: string
          order_id?: string
          price?: number
          product_id?: number
          product_image?: string | null
          product_name?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          shipping_address_id: string | null
          shipping_city: string
          shipping_country: string
          shipping_line1: string
          shipping_line2: string | null
          shipping_name: string
          shipping_postal_code: string
          shipping_state: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          total_donation: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          shipping_address_id?: string | null
          shipping_city: string
          shipping_country?: string
          shipping_line1: string
          shipping_line2?: string | null
          shipping_name: string
          shipping_postal_code: string
          shipping_state: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          total_donation?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          shipping_address_id?: string | null
          shipping_city?: string
          shipping_country?: string
          shipping_line1?: string
          shipping_line2?: string | null
          shipping_name?: string
          shipping_postal_code?: string
          shipping_state?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          total_donation?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      pressmaster_requests: {
        Row: {
          created_at: string
          donation_id: string | null
          error_message: string | null
          id: string
          mode: Database["public"]["Enums"]["pressmaster_mode"]
          request_body: Json
          response_body: Json | null
          status: Database["public"]["Enums"]["pressmaster_status"]
          type: Database["public"]["Enums"]["pressmaster_request_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          error_message?: string | null
          id?: string
          mode: Database["public"]["Enums"]["pressmaster_mode"]
          request_body: Json
          response_body?: Json | null
          status?: Database["public"]["Enums"]["pressmaster_status"]
          type?: Database["public"]["Enums"]["pressmaster_request_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          error_message?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["pressmaster_mode"]
          request_body?: Json
          response_body?: Json | null
          status?: Database["public"]["Enums"]["pressmaster_status"]
          type?: Database["public"]["Enums"]["pressmaster_request_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pressmaster_requests_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_provider: Database["public"]["Enums"]["auth_provider"] | null
          avatar_url: string | null
          created_at: string | null
          currency: string | null
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_login_at: string | null
          last_name: string | null
          last_order_at: string | null
          locale: string | null
          marketing_opt_in: boolean | null
          metadata: Json | null
          mfa_enabled: boolean | null
          order_count: number | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          theme: Database["public"]["Enums"]["theme_preference"] | null
          updated_at: string | null
          user_id: string
          username: string | null
          wishlist_count: number | null
        }
        Insert: {
          auth_provider?: Database["public"]["Enums"]["auth_provider"] | null
          avatar_url?: string | null
          created_at?: string | null
          currency?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          last_order_at?: string | null
          locale?: string | null
          marketing_opt_in?: boolean | null
          metadata?: Json | null
          mfa_enabled?: boolean | null
          order_count?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          theme?: Database["public"]["Enums"]["theme_preference"] | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          wishlist_count?: number | null
        }
        Update: {
          auth_provider?: Database["public"]["Enums"]["auth_provider"] | null
          avatar_url?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          last_order_at?: string | null
          locale?: string | null
          marketing_opt_in?: boolean | null
          metadata?: Json | null
          mfa_enabled?: boolean | null
          order_count?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          theme?: Database["public"]["Enums"]["theme_preference"] | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          wishlist_count?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          permissions: string[] | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: string[] | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "customer" | "admin" | "manager"
      auth_provider: "password" | "google" | "apple" | "facebook" | "github"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "credit_card" | "debit_card" | "paypal" | "bank_transfer"
      pressmaster_mode: "stub" | "live"
      pressmaster_request_type: "quote" | "story"
      pressmaster_status: "pending" | "success" | "error"
      theme_preference: "light" | "dark" | "system"
      user_status: "active" | "suspended" | "deleted"
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
      app_role: ["customer", "admin", "manager"],
      auth_provider: ["password", "google", "apple", "facebook", "github"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["credit_card", "debit_card", "paypal", "bank_transfer"],
      pressmaster_mode: ["stub", "live"],
      pressmaster_request_type: ["quote", "story"],
      pressmaster_status: ["pending", "success", "error"],
      theme_preference: ["light", "dark", "system"],
      user_status: ["active", "suspended", "deleted"],
    },
  },
} as const
