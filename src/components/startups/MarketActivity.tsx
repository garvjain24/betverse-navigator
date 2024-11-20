import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MarketActivityProps {
  activeBuyers: number;
  activeSellers: number;
  odds: number;
}

const MarketActivity = ({ activeBuyers, activeSellers, odds }: MarketActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Active Buyers</div>
            <div className="text-2xl">{activeBuyers || 0}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Active Sellers</div>
            <div className="text-2xl">{activeSellers || 0}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Current Odds</div>
          <div className="text-3xl font-bold">{odds}x</div>
        </div>
        <Progress 
          value={((activeBuyers || 0) / ((activeBuyers || 0) + (activeSellers || 1))) * 100} 
        />
      </CardContent>
    </Card>
  );
};

export default MarketActivity;