import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import BetForm from "@/components/startups/BetForm";
import UserLeaderboard from "@/components/startups/UserLeaderboard";
import OddsHistory from "@/components/startups/OddsHistory";
import MarketActivity from "@/components/startups/MarketActivity";
import UserBets from "@/components/startups/UserBets";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Startup {
  id: string;
  name: string;
  description: string | null;
  odds: number;
  growth_percentage: number;
  investors: number;
  stage: string | null;
  active_buyers: number;
  active_sellers: number;
}

interface Bet {
  id: string;
  amount: number;
  potential_return: number;
  status: string;
}

const StartupDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [oddsHistory, setOddsHistory] = useState<Array<{ time: string; odds: number }>>([]);

  const fetchUserBets = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('startup_id', id)
      .eq('user_id', session.user.id)
      .eq('status', 'active');

    if (error) {
      toast.error("Error fetching user bets");
      return;
    }
    setUserBets(data || []);
  };

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setStartup(data as Startup);
        updateOddsHistory(data.odds);
      } catch (error) {
        toast.error("Error fetching startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
    fetchUserBets();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('startup_changes')
      .on<RealtimePostgresChangesPayload<Startup>>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'startups',
          filter: `id=eq.${id}`
        },
        (payload) => {
          setStartup(payload.new);
          updateOddsHistory(payload.new.odds);
        }
      )
      .subscribe();

    // Set up 5-second interval for odds updates
    const intervalId = setInterval(updateRandomOdds, 5000);

    return () => {
      channel.unsubscribe();
      clearInterval(intervalId);
    };
  }, [id]);

  const updateOddsHistory = (currentOdds: number) => {
    const now = new Date();
    setOddsHistory(prev => {
      const newHistory = [...prev, { 
        time: now.toLocaleTimeString(), 
        odds: currentOdds 
      }].slice(-5);
      return newHistory;
    });
  };

  const updateRandomOdds = async () => {
    if (!startup) return;

    const randomChange = Math.random() > 0.5 ? 0.01 : -0.01;
    const newOdds = Math.max(1, startup.odds * (1 + randomChange));

    try {
      const { error } = await supabase
        .from('startups')
        .update({ odds: newOdds })
        .eq('id', startup.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating odds:", error);
    }
  };

  const handleBetSold = async (betId: string) => {
    // Remove the bet from the local state immediately
    setUserBets(prevBets => prevBets.filter(bet => bet.id !== betId));
    await fetchUserBets(); // Refresh the bets list from the server
  };

  if (loading) return <div>Loading...</div>;
  if (!startup) return <div>Startup not found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{startup.name}</h1>
              <p className="text-muted-foreground">{startup.description}</p>
            </div>
            <Badge variant={startup.growth_percentage >= 0 ? "default" : "destructive"}>
              {startup.growth_percentage >= 0 ? "+" : ""}{startup.growth_percentage}%
            </Badge>
          </div>
          
          <MarketActivity 
            activeBuyers={startup.active_buyers}
            activeSellers={startup.active_sellers}
            odds={startup.odds}
          />

          <OddsHistory oddsHistory={oddsHistory} />

          <UserBets 
            bets={userBets} 
            onBetSold={handleBetSold}
          />

          <div className="grid grid-cols-3 gap-4">
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