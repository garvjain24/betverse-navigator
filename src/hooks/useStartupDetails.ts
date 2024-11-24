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

    // Subscribe to real-time updates for startup data
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

    // Subscribe to real-time updates for bets
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