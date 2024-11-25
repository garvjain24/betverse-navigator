import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MarketActivityProps {
  activeWinBets: number;
  activeFallBets: number;
  odds: number;
}

const MarketActivity = ({ activeWinBets, activeFallBets, odds }: MarketActivityProps) => {
  const totalBets = activeWinBets + activeFallBets;
  const winPercentage = totalBets > 0 ? (activeWinBets / totalBets) * 100 : 50;
  const marketSentiment = winPercentage > 60 ? 'Bullish' : winPercentage < 40 ? 'Bearish' : 'Neutral';
  const sentimentColor = 
    marketSentiment === 'Bullish' ? 'bg-green-500' :
    marketSentiment === 'Bearish' ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Market Activity
          <Badge className={sentimentColor}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {marketSentiment}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Win Bets</div>
            </div>
            <div className="text-2xl text-green-600">{activeWinBets || 0}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-red-500" />
              <div className="text-sm font-medium">Fall Bets</div>
            </div>
            <div className="text-2xl text-red-600">{activeFallBets || 0}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Current Odds</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {odds}x
            <Badge variant="outline" className="ml-2">
              {odds > 2 ? 'High Risk' : odds > 1.5 ? 'Medium Risk' : 'Low Risk'}
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Market Sentiment</span>
            <span>{Math.round(winPercentage)}% Win / {Math.round(100 - winPercentage)}% Fall</span>
          </div>
          <Progress 
            value={winPercentage}
            className="h-2"
          />
          <div className="text-sm text-muted-foreground mt-1">
            {winPercentage > 60 ? 'Strong buying pressure' : 
             winPercentage < 40 ? 'Strong selling pressure' : 
             'Balanced market activity'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketActivity;