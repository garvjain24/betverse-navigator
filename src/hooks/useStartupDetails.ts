import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Startup, Bet } from "@/types/betting";

export const useStartupDetails = (startupId: string | undefined) => {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBets = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('bets')
      .select(`
        *,
        startup:startups(name, odds)
      `)
      .eq('startup_id', startupId)
      .eq('user_id', session.user.id)
      .eq('status', 'active');

    if (error) {
      toast.error("Error fetching user bets");
      return;
    }

    const betsWithProfitLoss = data.map(bet => ({
      ...bet,
      odds_at_time: bet.startup.odds,
      current_profit_loss: (bet.startup.odds - bet.odds_at_time) * bet.amount
    }));

    setUserBets(betsWithProfitLoss);
  };

  const handleBetSold = (betId: string) => {
    setUserBets(prevBets => prevBets.filter(bet => bet.id !== betId));
  };

  useEffect(() => {
    if (!startupId) return;

    const fetchStartup = async () => {
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', startupId)
          .single();

        if (error) throw error;
        setStartup(data);
      } catch (error) {
        toast.error("Error fetching startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
    fetchUserBets();

    const startupChannel = supabase
      .channel(`startup_${startupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'startups',
          filter: `id=eq.${startupId}`
        },
        (payload) => {
          if (payload.new) {
            setStartup(prev => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    const betsChannel = supabase
      .channel(`bets_${startupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets',
          filter: `startup_id=eq.${startupId}`
        },
        () => {
          fetchUserBets();
        }
      )
      .subscribe();

    return () => {
      startupChannel.unsubscribe();
      betsChannel.unsubscribe();
    };
  }, [startupId]);

  return {
    startup,
    userBets,
    loading,
    handleBetSold
  };
};