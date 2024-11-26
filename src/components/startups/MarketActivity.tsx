import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketActivityProps {
  startupId: string;
}

const MarketActivity = ({ startupId }: MarketActivityProps) => {
  const [marketData, setMarketData] = useState({
    currentOdds: 0,
    volume: 0,
    sentiment: 'neutral',
    growthPercentage: 0
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('odds, growth_percentage, active_win_bets, active_fall_bets')
          .eq('id', startupId)
          .single();

        if (error) throw error;

        const totalBets = (data.active_win_bets || 0) + (data.active_fall_bets || 0);
        const winRatio = totalBets > 0 ? (data.active_win_bets || 0) / totalBets : 0.5;

        let sentiment = 'neutral';
        if (winRatio > 0.7) sentiment = 'bullish';
        else if (winRatio < 0.3) sentiment = 'bearish';

        setMarketData({
          currentOdds: Number(data.odds).toFixed(2),
          volume: totalBets,
          sentiment,
          growthPercentage: Number(data.growth_percentage || 0).toFixed(2)
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
        toast.error("Failed to load market data");
      }
    };

    fetchMarketData();

    const subscription = supabase
      .channel(`startup_${startupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'startups',
          filter: `id=eq.${startupId}`
        },
        fetchMarketData
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [startupId]);

  const getSentimentIcon = () => {
    switch (marketData.sentiment) {
      case 'bullish':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Minus className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Current Odds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{marketData.currentOdds}x</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">24h Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold flex items-center gap-2 ${
            Number(marketData.growthPercentage) > 0 ? 'text-green-500' : 
            Number(marketData.growthPercentage) < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {Number(marketData.growthPercentage) > 0 ? '+' : ''}{marketData.growthPercentage}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Volume (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{marketData.volume}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {getSentimentIcon()}
            <span className="text-2xl font-bold capitalize">{marketData.sentiment}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketActivity;