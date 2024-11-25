import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface OddsHistoryProps {
  oddsHistory: Array<{ time: string; odds: number }>;
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
          odds: item.closing_price
        }));

        setHistoryData(formattedData);
      } catch (error) {
        console.error('Error fetching odds history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOddsHistory();

    // Subscribe to real-time updates
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
            odds: payload.new.closing_price
          }]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [startupId]);

  if (loading) return <div>Loading...</div>;

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
              <XAxis 
                dataKey="time"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis domain={['dataMin', 'dataMax']} />
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