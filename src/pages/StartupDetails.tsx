import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Users, DollarSign, TrendingUp } from "lucide-react";
import BetForm from "@/components/startups/BetForm";
import StartupStats from "@/components/startups/StartupStats";
import UserLeaderboard from "@/components/startups/UserLeaderboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StartupDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        toast.error("Error fetching startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('startup_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'startups',
        filter: `id=eq.${id}`
      }, (payload) => {
        setStartup(payload.new);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!startup) return <div>Startup not found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4 flex-1">
          <h1 className="text-3xl font-bold">{startup.name}</h1>
          <p className="text-muted-foreground">{startup.description}</p>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Active Buyers</div>
                  <div className="text-2xl">{startup.active_buyers || 0}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Active Sellers</div>
                  <div className="text-2xl">{startup.active_sellers || 0}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Current Odds</div>
                <div className="text-3xl font-bold">{startup.odds}x</div>
              </div>
              <Progress value={((startup.active_buyers || 0) / ((startup.active_buyers || 0) + (startup.active_sellers || 1))) * 100} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{startup.investors || 0} Investors</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{startup.growth_percentage || 0}% Growth</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Stage: {startup.stage || 'Early'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full md:w-96">
          <BetForm />
          <UserLeaderboard startupId={id} />
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;