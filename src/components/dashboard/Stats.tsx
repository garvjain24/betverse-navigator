import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Stats = () => {
  const [stats, setStats] = useState({
    totalBets: 0,
    activeBets: 0,
    closedBets: 0,
    totalProfitLoss: 0,
    currentProfitLoss: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [activeBets, closedBets] = await Promise.all([
          supabase
            .from('bets')
            .select('*, startup:startups(odds)')
            .eq('user_id', session.user.id)
            .eq('status', 'active'),
          supabase
            .from('closed_bets')
            .select('final_profit_loss')
            .eq('user_id', session.user.id)
        ]);

        if (activeBets.error) throw activeBets.error;
        if (closedBets.error) throw closedBets.error;

        // Calculate current P/L for active bets
        const currentPL = activeBets.data.reduce((acc, bet) => {
          const profitLoss = (bet.startup.odds - bet.odds_at_time) * bet.amount;
          return acc + profitLoss;
        }, 0);

        // Calculate total P/L including closed bets
        const closedPL = closedBets.data.reduce((acc, bet) => acc + (bet.final_profit_loss || 0), 0);
        const totalPL = currentPL + closedPL;

        setStats({
          totalBets: activeBets.data.length + closedBets.data.length,
          activeBets: activeBets.data.length,
          closedBets: closedBets.data.length,
          totalProfitLoss: totalPL,
          currentProfitLoss: currentPL
        });
      } catch (error) {
        toast.error("Error fetching stats");
      }
    };

    fetchStats();

    // Set up real-time updates
    const subscription = supabase
      .channel('stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets'
        },
        fetchStats
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'closed_bets'
        },
        fetchStats
      )
      .subscribe();

    // Update stats every 5 seconds to reflect odds changes
    const interval = setInterval(fetchStats, 5000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Bets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeBets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Closed Bets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.closedBets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Current P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            stats.currentProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {stats.currentProfitLoss.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            stats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {stats.totalProfitLoss.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;