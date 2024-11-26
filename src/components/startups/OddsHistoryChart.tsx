import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { useOddsHistory } from "@/hooks/useOddsHistory";
import { format } from "date-fns";

interface OddsHistoryChartProps {
  startupId: string;
}

export const OddsHistoryChart = ({ startupId }: OddsHistoryChartProps) => {
  const [timeframe, setTimeframe] = useState<'1h' | '1d' | '1w' | '1m'>('1h');
  const { history, loading } = useOddsHistory(startupId, timeframe);

  if (loading) return <div>Loading...</div>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (timeframe) {
      case '1h':
        return format(date, 'HH:mm');
      case '1d':
        return format(date, 'HH:mm');
      case '1w':
        return format(date, 'EEE');
      case '1m':
        return format(date, 'MMM d');
      default:
        return format(date, 'HH:mm');
    }
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
            <ComposedChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="created_at" 
                tickFormatter={formatDate}
              />
              <YAxis 
                yAxisId="left"
                domain={[1, 'auto']} 
                tickFormatter={(value) => `${Number(value).toFixed(2)}x`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value} vol`}
              />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number, name: string) => {
                  if (name === 'Odds') return [`${Number(value).toFixed(2)}x`, name];
                  return [value, name];
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="closing_price" 
                name="Odds"
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                name="Volume"
                fill="#8884d8"
                opacity={0.2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};