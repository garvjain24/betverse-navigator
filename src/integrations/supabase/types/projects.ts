export interface ProjectTables {
  profiles: {
    Row: {
      created_at: string
      id: string
      role: string
      total_bets: number | null
      username: string | null
      wallet_balance: number | null
    }
    Insert: {
      created_at?: string
      id: string
      role?: string
      total_bets?: number | null
      username?: string | null
      wallet_balance?: number | null
    }
    Update: {
      created_at?: string
      id?: string
      role?: string
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
      }
    ]
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
  media: {
    Row: {
      created_at: string
      file_path: string
      id: string
      project_id: string | null
      user_id: string
    }
    Insert: {
      created_at?: string
      file_path: string
      id?: string
      project_id?: string | null
      user_id: string
    }
    Update: {
      created_at?: string
      file_path?: string
      id?: string
      project_id?: string | null
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
      }
    ]
  }
  collaborators: {
    Row: {
      created_at: string
      id: string
      project_id: string
      role: string
      user_id: string
    }
    Insert: {
      created_at?: string
      id?: string
      project_id: string
      role?: string
      user_id: string
    }
    Update: {
      created_at?: string
      id?: string
      project_id?: string
      role?: string
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
      }
    ]
  }
}