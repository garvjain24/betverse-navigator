import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MarketDataType {
  opening_price: number;
  closing_price: number;
  high_price: number;
  low_price: number;
  volume: number;
}

const MarketData = ({ startupId }: { startupId: string }) => {
  const [marketData, setMarketData] = useState<MarketDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const { data, error } = await supabase
          .from('market_data')
          .select('*')
          .eq('startup_id', startupId)
          .eq('date', new Date().toISOString().split('T')[0])
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setMarketData(data);
      } catch (error) {
        toast.error("Error fetching market data");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('market_data_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'market_data',
        filter: `startup_id=eq.${startupId}`
      }, () => {
        fetchMarketData();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [startupId]);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Opening</div>
            <div className="text-2xl font-bold">
              ${marketData?.opening_price?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Current</div>
            <div className="text-2xl font-bold">
              ${marketData?.closing_price?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">High</div>
            <div className="text-2xl font-bold text-green-500">
              ${marketData?.high_price?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Low</div>
            <div className="text-2xl font-bold text-red-500">
              ${marketData?.low_price?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="text-2xl font-bold">
              {marketData?.volume?.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketData;