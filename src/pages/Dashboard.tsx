import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartBar, TrendingUp, Trophy } from "lucide-react";
import BetHistory from "@/components/dashboard/BetHistory";
import ActiveBets from "@/components/dashboard/ActiveBets";
import CoinBalance from "@/components/dashboard/CoinBalance";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import Stats from "@/components/dashboard/Stats";
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
      
      <Stats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <BetHistory />
          <TransactionHistory />
        </div>
        <div className="space-y-6">
          <CoinBalance />
          <ActiveBets />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;