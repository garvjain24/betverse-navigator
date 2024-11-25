export interface Bet {
  id: string;
  amount: number;
  bet_type: string;
  created_at: string;
  potential_return: number;
  startup_id: string;
  status: string;
  user_id: string;
  odds_at_time: number;
  startup?: {
    name: string;
    odds: number;
  };
}

export interface OddsHistoryEntry {
  closing_price: number;
  volume: number;
  created_at: string;
}

export interface Startup {
  id: string;
  name: string;
  description: string | null;
  odds: number;
  sector: string | null;
  stage: string | null;
  trending?: boolean;
  active_buyers?: number;
  active_sellers?: number;
  active_win_bets?: number;
  active_fall_bets?: number;
  created_at?: string;
  growth_percentage?: number;
  image_url?: string;
  investors?: number;
  status?: string;
}

export interface ExtendedBet extends Bet {
  isClosed: boolean;
  date: string;
  sell_price?: number;
  closed_at?: string;
  final_profit_loss?: number;
  current_profit_loss?: number;
}