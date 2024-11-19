import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartBar, TrendingUp, Trophy } from "lucide-react";
import BetHistory from "@/components/dashboard/BetHistory";
import ActiveBets from "@/components/dashboard/ActiveBets";
import CoinBalance from "@/components/dashboard/CoinBalance";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ... keep existing code (Dashboard component implementation)

const Dashboard = () => {
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
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CoinBalance />
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBets}</div>
            <Progress value={(totalBets / 10) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrades}</div>
            <Progress value={(activeTrades / 5) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Milestone Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milestonePoints}</div>
            <Progress value={(milestonePoints / 1000) * 100} className="mt-2" />
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
