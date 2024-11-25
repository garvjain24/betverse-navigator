import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import BetForm from "@/components/startups/BetForm";
import UserLeaderboard from "@/components/startups/UserLeaderboard";
import { OddsHistoryChart } from "@/components/startups/OddsHistoryChart";
import MarketActivity from "@/components/startups/MarketActivity";
import UserBets from "@/components/startups/UserBets";
import { useStartupDetails } from "@/hooks/useStartupDetails";

const StartupDetails = () => {
  const { id } = useParams();
  const { 
    startup, 
    userBets, 
    loading, 
    handleBetSold 
  } = useStartupDetails(id);

  if (loading) return <div>Loading...</div>;
  if (!startup) return <div>Startup not found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{startup.name}</h1>
              <p className="text-muted-foreground">{startup.description}</p>
            </div>
            <Badge variant={startup.growth_percentage >= 0 ? "default" : "destructive"}>
              {startup.growth_percentage >= 0 ? "+" : ""}{startup.growth_percentage}%
            </Badge>
          </div>
          
          <MarketActivity 
            activeWinBets={startup.active_win_bets}
            activeFallBets={startup.active_fall_bets}
            odds={startup.odds}
          />

          <OddsHistoryChart startupId={startup.id} />

          <UserBets 
            bets={userBets} 
            onBetSold={handleBetSold}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{startup.investors || 0} Investors</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{startup.growth_percentage || 0}% Growth</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Stage: {startup.stage || 'Early'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full md:w-96">
          <BetForm 
            startupId={startup.id} 
            odds={startup.odds}
            onBetPlaced={() => {}}
          />
          <UserLeaderboard startupId={id} />
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;