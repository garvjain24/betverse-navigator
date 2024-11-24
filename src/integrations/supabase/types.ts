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
      bets: {
        Row: {
          amount: number
          bet_type: string
          created_at: string
          id: string
          potential_return: number
          startup_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bet_type?: string
          created_at?: string
          id?: string
          potential_return: number
          startup_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bet_type?: string
          created_at?: string
          id?: string
          potential_return?: number
          startup_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bets_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      closed_bets: {
        Row: {
          amount: number
          bet_type: string
          closed_at: string
          created_at: string
          id: string
          potential_return: number
          sell_price: number | null
          startup_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bet_type?: string
          closed_at?: string
          created_at?: string
          id?: string
          potential_return: number
          sell_price?: number | null
          startup_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bet_type?: string
          closed_at?: string
          created_at?: string
          id?: string
          potential_return?: number
          sell_price?: number | null
          startup_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "closed_bets_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "closed_bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborators: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          closing_price: number | null
          created_at: string
          date: string
          high_price: number | null
          id: string
          low_price: number | null
          opening_price: number | null
          startup_id: string | null
          volume: number | null
        }
        Insert: {
          closing_price?: number | null
          created_at?: string
          date?: string
          high_price?: number | null
          id?: string
          low_price?: number | null
          opening_price?: number | null
          startup_id?: string | null
          volume?: number | null
        }
        Update: {
          closing_price?: number | null
          created_at?: string
          date?: string
          high_price?: number | null
          id?: string
          low_price?: number | null
          opening_price?: number | null
          startup_id?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_data_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          file_path: string
          id: string
          project_id: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          file_path: string
          id?: string
          project_id?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          file_path?: string
          id?: string
          project_id?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          required_coins: number
          reward_coins: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          required_coins: number
          reward_coins: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          required_coins?: number
          reward_coins?: number
        }
        Relationships: []
      }
      order_book: {
        Row: {
          created_at: string
          filled_at: string | null
          filled_price: number | null
          id: string
          order_type: string
          price: number
          quantity: number
          startup_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filled_at?: string | null
          filled_price?: number | null
          id?: string
          order_type: string
          price: number
          quantity: number
          startup_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filled_at?: string | null
          filled_price?: number | null
          id?: string
          order_type?: string
          price?: number
          quantity?: number
          startup_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_book_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_book_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          total_bets: number | null
          username: string | null
          wallet_balance: number | null
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          total_bets?: number | null
          username?: string | null
          wallet_balance?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          total_bets?: number | null
          username?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          active_buyers: number | null
          active_fall_bets: number | null
          active_sellers: number | null
          active_win_bets: number | null
          created_at: string
          description: string | null
          growth_percentage: number | null
          id: string
          image_url: string | null
          investors: number | null
          name: string
          odds: number
          sector: string | null
          stage: string | null
          status: string | null
        }
        Insert: {
          active_buyers?: number | null
          active_fall_bets?: number | null
          active_sellers?: number | null
          active_win_bets?: number | null
          created_at?: string
          description?: string | null
          growth_percentage?: number | null
          id?: string
          image_url?: string | null
          investors?: number | null
          name: string
          odds: number
          sector?: string | null
          stage?: string | null
          status?: string | null
        }
        Update: {
          active_buyers?: number | null
          active_fall_bets?: number | null
          active_sellers?: number | null
          active_win_bets?: number | null
          created_at?: string
          description?: string | null
          growth_percentage?: number | null
          id?: string
          image_url?: string | null
          investors?: number | null
          name?: string
          odds?: number
          sector?: string | null
          stage?: string | null
          status?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string
          css_content: string | null
          description: string | null
          html_content: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_milestones: {
        Row: {
          claimed_at: string
          id: string
          milestone_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          milestone_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          milestone_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_potential_return: {
        Args: {
          bet_amount: number
          startup_odds: number
        }
        Returns: number
      }
      decrement_balance: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: number
      }
      increment_bets: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      match_orders: {
        Args: {
          p_startup_id: string
        }
        Returns: undefined
      }
      place_bet:
        | {
            Args: {
              p_user_id: string
              p_startup_id: string
              p_amount: number
            }
            Returns: string
          }
        | {
            Args: {
              p_user_id: string
              p_startup_id: string
              p_amount: number
              p_bet_type: string
            }
            Returns: string
          }
      sell_bet: {
        Args: {
          p_bet_id: string
          p_user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      user_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
