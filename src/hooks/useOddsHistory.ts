import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OddsHistoryEntry } from "@/types/betting";

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
          .from('market_data')
          .select('closing_price, volume, created_at')
          .eq('startup_id', startupId)
          .gte('created_at', `now() - interval '${timeFrameMap[timeframe]}'`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        setHistory(data?.map(entry => ({
          ...entry,
          closing_price: Number(entry.closing_price)
        })) || []);
      } catch (error) {
        console.error('Error fetching odds history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOddsHistory();

    const channel = supabase
      .channel(`market_data:${startupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'market_data',
          filter: `startup_id=eq.${startupId}`
        },
        (payload) => {
          setHistory(prev => [...prev, {
            ...payload.new as OddsHistoryEntry,
            closing_price: Number(payload.new.closing_price)
          }]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [startupId, timeframe]);

  return { history, loading };
};