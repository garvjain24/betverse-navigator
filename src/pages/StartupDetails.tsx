// src/pages/StartupDetails.tsx
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const StartupDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setStartup(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{startup.name}</h1>
          <p className="text-muted-foreground">{startup.description}</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{startup.team_size} Team Members</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">${startup.funding} Raised</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{startup.growth_percentage}% Growth</div>
            </div>
          </div>
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