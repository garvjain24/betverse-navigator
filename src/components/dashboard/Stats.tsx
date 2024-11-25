import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Stats = () => {
  const [stats, setStats] = useState({
    totalBets: 0,
    activeBets: 0,
    closedBets: 0,
    totalProfitLoss: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [activeBets, closedBets] = await Promise.all([
          supabase
            .from('bets')
            .select('current_profit_loss')
            .eq('user_id', session.user.id),
          supabase
            .from('closed_bets')
            .select('final_profit_loss')
            .eq('user_id', session.user.id)
        ]);

        if (activeBets.error) throw activeBets.error;
        if (closedBets.error) throw closedBets.error;

        const totalProfitLoss = [
          ...activeBets.data.map(bet => bet.current_profit_loss || 0),
          ...closedBets.data.map(bet => bet.final_profit_loss || 0)
        ].reduce((acc, val) => acc + val, 0);

        setStats({
          totalBets: activeBets.data.length + closedBets.data.length,
          activeBets: activeBets.data.length,
          closedBets: closedBets.data.length,
          totalProfitLoss
        });
      } catch (error) {
        toast.error("Error fetching stats");
      }
    };

    fetchStats();

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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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