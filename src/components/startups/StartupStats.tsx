import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StartupStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Growth Rate</span>
            <span>85%</span>
          </div>
          <Progress value={85} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Market Share</span>
            <span>45%</span>
          </div>
          <Progress value={45} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Customer Satisfaction</span>
            <span>92%</span>
          </div>
          <Progress value={92} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StartupStats;