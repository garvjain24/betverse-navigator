export interface BetTables {
  bets: {
    Row: {
      amount: number
      created_at: string
      id: string
      potential_return: number
      startup_id: string | null
      status: string | null
      user_id: string | null
    }
    Insert: {
      amount: number
      created_at?: string
      id?: string
      potential_return: number
      startup_id?: string | null
      status?: string | null
      user_id?: string | null
    }
    Update: {
      amount?: number
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
      }
    ]
  }
  startups: {
    Row: {
      created_at: string
      description: string | null
      growth_percentage: number | null
      id: string
      image_url: string | null
      investors: number | null
      name: string
      odds: number
      status: string | null
    }
    Insert: {
      created_at?: string
      description?: string | null
      growth_percentage?: number | null
      id?: string
      image_url?: string | null
      investors?: number | null
      name: string
      odds: number
      status?: string | null
    }
    Update: {
      created_at?: string
      description?: string | null
      growth_percentage?: number | null
      id?: string
      image_url?: string | null
      investors?: number | null
      name?: string
      odds?: number
      status?: string | null
    }
    Relationships: []
  }
}