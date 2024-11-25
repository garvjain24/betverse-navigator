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
  
  const getMarketSentiment = (percentage: number) => {
    if (percentage > 70) return { label: 'Very Bullish', color: 'bg-green-600' };
    if (percentage > 60) return { label: 'Bullish', color: 'bg-green-500' };
    if (percentage > 40) return { label: 'Neutral', color: 'bg-yellow-500' };
    if (percentage > 30) return { label: 'Bearish', color: 'bg-red-500' };
    return { label: 'Very Bearish', color: 'bg-red-600' };
  };

  const sentiment = getMarketSentiment(winPercentage);
  const riskLevel = odds > 3 ? 'High Risk' : odds > 2 ? 'Medium Risk' : 'Low Risk';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Market Activity
          <Badge className={sentiment.color}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {sentiment.label}
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
            {odds.toFixed(2)}x
            <Badge variant="outline" className={`ml-2 ${
              odds > 3 ? 'border-red-500 text-red-500' :
              odds > 2 ? 'border-yellow-500 text-yellow-500' :
              'border-green-500 text-green-500'
            }`}>
              {riskLevel}
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
            className={`h-2 ${
              winPercentage > 60 ? 'bg-green-100' :
              winPercentage < 40 ? 'bg-red-100' :
              'bg-yellow-100'
            }`}
          />
          <div className="text-sm text-muted-foreground mt-1">
            {winPercentage > 70 ? 'Very strong buying pressure' :
             winPercentage > 60 ? 'Strong buying pressure' :
             winPercentage < 30 ? 'Very strong selling pressure' :
             winPercentage < 40 ? 'Strong selling pressure' :
             'Balanced market activity'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketActivity;