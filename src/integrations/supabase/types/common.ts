export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bets: BetTables['bets']
      startups: BetTables['startups']
      profiles: ProjectTables['profiles']
      projects: ProjectTables['projects']
      templates: ProjectTables['templates']
      media: ProjectTables['media']
      collaborators: ProjectTables['collaborators']
    }
    Views: {
      [_ in never]: never
    }
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type DatabaseEnums = {
  user_role: 'admin' | 'editor' | 'viewer'
}

export type DatabaseFunctions = {
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
}

import type { BetTables } from './betting'
import type { ProjectTables } from './projects'