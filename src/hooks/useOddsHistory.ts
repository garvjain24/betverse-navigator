import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OddsHistoryEntry {
  odds: number;
  win_volume: number;
  fall_volume: number;
  created_at: string;
}

export const useOddsHistory = (startupId: string, timeframe: '1h' | '1d' | '1w' | '1m' = '1h') => {
  const [history, setHistory] = useState<OddsHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOddsHistory = async () => {
      const timeFrameMap = {
        '1h': '1 hour',
        '1d': '1 day',
        '1w': '1 week',
        '1m': '1 month'
      };

      try {
        const { data, error } = await supabase
          .from('odds_history')
          .select('odds, win_volume, fall_volume, created_at')
          .eq('startup_id', startupId)
          .gte('created_at', `now() - interval '${timeFrameMap[timeframe]}'`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error fetching odds history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOddsHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`odds_history:${startupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'odds_history',
          filter: `startup_id=eq.${startupId}`
        },
        (payload) => {
          setHistory(prev => [...prev, payload.new as OddsHistoryEntry]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [startupId, timeframe]);

  return { history, loading };
};