import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartBar, Coins, TrendingUp, Trophy } from "lucide-react";
import BetHistory from "@/components/dashboard/BetHistory";
import ActiveBets from "@/components/dashboard/ActiveBets";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [totalBets, setTotalBets] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [activeTrades, setActiveTrades] = useState(0);
  const [milestonePoints, setMilestonePoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const { data: betsData, error: betsError } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', session.user.id);
        if (betsError) throw betsError;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', session.user.id)
          .single();
        if (profileError) throw profileError;

        setTotalBets(betsData.length);
        setCurrentBalance(profileData.wallet_balance);
        setActiveTrades(betsData.filter(bet => bet.status === 'active').length);
        setMilestonePoints(betsData.length * 100); // Simple milestone calculation
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBets}</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentBalance}</div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrades}</div>
            <Progress value={40} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Milestone Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milestonePoints}</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BetHistory />
        <ActiveBets />
      </div>
    </div>
  );
};

export default Dashboard;