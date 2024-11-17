import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

const Milestones = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center p-4 border rounded-lg">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="font-medium">First Win</div>
              <div className="text-sm text-muted-foreground">Won your first bet</div>
            </div>
          </div>
          
          <div className="flex items-center p-4 border rounded-lg">
            <Trophy className="h-8 w-8 text-primary mr-3" />
            <div>
              <div className="font-medium">High Roller</div>
              <div className="text-sm text-muted-foreground">Placed 10+ bets</div>
            </div>
          </div>
          
          <div className="flex items-center p-4 border rounded-lg opacity-50">
            <Trophy className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <div className="font-medium">Master Trader</div>
              <div className="text-sm text-muted-foreground">Complete 50 trades</div>
            </div>
          </div>
          
          <div className="flex items-center p-4 border rounded-lg opacity-50">
            <Trophy className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <div className="font-medium">Millionaire</div>
              <div className="text-sm text-muted-foreground">Reach $1M in profits</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Milestones;