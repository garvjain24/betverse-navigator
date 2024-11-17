import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Users, DollarSign, TrendingUp } from "lucide-react";
import BetForm from "@/components/startups/BetForm";
import StartupStats from "@/components/startups/StartupStats";
import UserLeaderboard from "@/components/startups/UserLeaderboard";

const StartupDetails = () => {
  const { id } = useParams();
  const [betAmount, setBetAmount] = useState<string>("");

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">TechCorp AI</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Technology</Badge>
            <Badge variant="secondary">Series B</Badge>
            <Badge className="bg-green-500">Trending Up</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Odds</div>
            <div className="text-2xl font-bold text-green-500">2.5x</div>
          </div>
          <ArrowUp className="h-6 w-6 text-green-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About TechCorp AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                TechCorp AI is revolutionizing the artificial intelligence industry with their innovative approach to machine learning and neural networks.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">50+ Team Members</div>
                </div>
                <div className="text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">$10M Raised</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">85% Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <StartupStats />
        </div>

        <div className="space-y-6">
          <BetForm />
          <UserLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;