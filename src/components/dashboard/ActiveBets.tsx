import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";

const ActiveBets = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Bets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">TechCorp AI</div>
              <div className="text-sm text-muted-foreground">$500 at 2.5x</div>
            </div>
            <div className="flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              +15%
            </div>
          </div>
          <Progress value={75} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">FinTech Pro</div>
              <div className="text-sm text-muted-foreground">$300 at 1.8x</div>
            </div>
            <div className="flex items-center text-red-500">
              <ArrowDown className="h-4 w-4 mr-1" />
              -5%
            </div>
          </div>
          <Progress value={45} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveBets;