import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDashboard = () => {
  const [totalBets, setTotalBets] = useState(0);
  const [activeTrades, setActiveTrades] = useState(0);
  const [milestonePoints, setMilestonePoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Not authenticated");
          return;
        }

        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('total_bets')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch active bets count
        const { data: activeBetsData, error: betsError } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active');

        if (betsError) throw betsError;

        setTotalBets(profileData.total_bets || 0);
        setActiveTrades(activeBetsData?.length || 0);
        setMilestonePoints((profileData.total_bets || 0) * 100);
      } catch (error) {
        toast.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Subscribe to real-time updates
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            setTotalBets(payload.new.total_bets || 0);
            setMilestonePoints((payload.new.total_bets || 0) * 100);
          }
        }
      )
      .subscribe();

    const betsChannel = supabase
      .channel('bets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets'
        },
        async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const { data } = await supabase
            .from('bets')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active');

          setActiveTrades(data?.length || 0);
        }
      )
      .subscribe();

    return () => {
      profilesChannel.unsubscribe();
      betsChannel.unsubscribe();
    };
  }, []);

  return {
    totalBets,
    activeTrades,
    milestonePoints,
    loading
  };
};