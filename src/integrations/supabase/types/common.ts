import { BetTables } from './betting.ts';
import { ProjectTables } from './projects.ts';
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: BetTables & ProjectTables
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