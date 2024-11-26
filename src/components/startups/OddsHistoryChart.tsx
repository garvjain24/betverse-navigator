import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOddsHistory } from "@/hooks/useOddsHistory";

interface OddsHistoryChartProps {
  startupId: string;
}

export const OddsHistoryChart = ({ startupId }: OddsHistoryChartProps) => {
  const [timeframe, setTimeframe] = useState<'1h' | '1d' | '1w' | '1m'>('1h');
  const { history, loading } = useOddsHistory(startupId, timeframe);

  if (loading) return <div>Loading...</div>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return timeframe === '1h' 
      ? date.toLocaleTimeString() 
      : date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Odds History</span>
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
            <TabsList>
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="created_at" 
                tickFormatter={formatDate}
              />
              <YAxis 
                domain={[1, 'auto']} 
                tickFormatter={(value) => `${Number(value).toFixed(2)}x`}
              />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number) => [`${Number(value).toFixed(2)}x`, 'Odds']}
              />
              <Line 
                type="monotone" 
                dataKey="closing_price" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};