import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Startup {
  id: string;
  name: string;
  description: string | null;
  odds: number;
  growth_percentage: number;
  investors: number;
  stage: string | null;
  active_win_bets: number;
  active_fall_bets: number;
}

interface Bet {
  id: string;
  amount: number;
  potential_return: number;
  status: string;
  bet_type: string;
}

export const useStartupDetails = (startupId: string | undefined) => {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [oddsHistory, setOddsHistory] = useState<Array<{ time: string; odds: number }>>([]);

  const updateOddsHistory = (currentOdds: number) => {
    const now = new Date();
    setOddsHistory(prev => {
      const newHistory = [...prev, { 
        time: now.toLocaleTimeString(), 
        odds: currentOdds 
      }].slice(-5);
      return newHistory;
    });
  };

  const fetchUserBets = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', session.user.id)
      .eq('status', 'active');

    if (error) {
      toast.error("Error fetching user bets");
      return;
    }
    setUserBets(data || []);
  };

  const updateRandomOdds = async () => {
    if (!startup) return;

    const randomChange = Math.random() > 0.5 ? 0.01 : -0.01;
    const newOdds = Math.max(1, startup.odds * (1 + randomChange));

    try {
      const { error } = await supabase
        .from('startups')
        .update({ odds: newOdds })
        .eq('id', startup.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating odds:", error);
    }
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
        setStartup(data as Startup);
        if (data) {
          updateOddsHistory(data.odds);
        }
      } catch (error) {
        toast.error("Error fetching startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
    fetchUserBets();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('startup_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'startups',
          filter: `id=eq.${startupId}`
        },
        (payload) => {
          const newData = payload.new;
          if (newData && typeof newData === 'object' && 'odds' in newData) {
            setStartup(prev => ({ ...prev, ...newData } as Startup));
            updateOddsHistory(newData.odds);
          }
        }
      )
      .subscribe();

    // Set up 5-second interval for odds updates
    const intervalId = setInterval(updateRandomOdds, 5000);

    return () => {
      channel.unsubscribe();
      clearInterval(intervalId);
    };
  }, [startupId]);

  return {
    startup,
    userBets,
    loading,
    oddsHistory,
    handleBetSold,
    updateRandomOdds
  };
};