import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartBar, TrendingUp, Trophy } from "lucide-react";
import BetHistory from "@/components/dashboard/BetHistory";
import ActiveBets from "@/components/dashboard/ActiveBets";
import CoinBalance from "@/components/dashboard/CoinBalance";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const { 
    totalBets, 
    activeTrades, 
    milestonePoints, 
    loading 
  } = useDashboard();

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
        <div className="space-y-6">
          <BetHistory />
          <TransactionHistory />
        </div>
        <div className="space-y-6">
          <ActiveBets />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;