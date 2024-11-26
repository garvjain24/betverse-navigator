import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OddsHistoryProps {
  startupId: string;
}

const OddsHistory = ({ startupId }: OddsHistoryProps) => {
  const [historyData, setHistoryData] = useState<Array<{ time: string; odds: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOddsHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('market_data')
          .select('closing_price, created_at')
          .eq('startup_id', startupId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formattedData = data.map(item => ({
          time: format(new Date(item.created_at), 'HH:mm'),
          odds: Number(item.closing_price) || 0
        }));

        setHistoryData(formattedData);
      } catch (error) {
        console.error('Error fetching odds history:', error);
        toast.error("Failed to load odds history");
      } finally {
        setLoading(false);
      }
    };

    fetchOddsHistory();

    const subscription = supabase
      .channel(`market_data_${startupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'market_data',
          filter: `startup_id=eq.${startupId}`
        },
        (payload) => {
          setHistoryData(prev => [...prev, {
            time: format(new Date(payload.new.created_at), 'HH:mm'),
            odds: Number(payload.new.closing_price) || 0
          }]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [startupId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Odds History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (historyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Odds History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-gray-500">
            No historical data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Odds History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => `${value.toFixed(2)}x`}
              />
              <Tooltip 
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number) => [`${value.toFixed(2)}x`, 'Odds']}
              />
              <Line 
                type="monotone" 
                dataKey="odds" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OddsHistory;