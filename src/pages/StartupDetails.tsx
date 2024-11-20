import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Users, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BetForm from "@/components/startups/BetForm";
import UserLeaderboard from "@/components/startups/UserLeaderboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StartupDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [oddsHistory, setOddsHistory] = useState([]);

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
        
        // Add current odds to history
        setOddsHistory(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          odds: data.odds
        }].slice(-5)); // Keep last 5 records
      } catch (error) {
        toast.error("Error fetching startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();

    // Set up real-time updates
    const channel = supabase
      .channel('startup_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'startups',
        filter: `id=eq.${id}`
      }, (payload) => {
        setStartup(payload.new);
        setOddsHistory(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          odds: payload.new.odds
        }].slice(-5));
      })
      .subscribe();

    // Update odds every 5 seconds if no transactions
    const oddsInterval = setInterval(async () => {
      const randomChange = Math.random() > 0.5 ? 0.01 : -0.01;
      const { data: currentStartup } = await supabase
        .from('startups')
        .select('odds')
        .eq('id', id)
        .single();

      if (currentStartup) {
        const newOdds = Math.max(1, Math.min(5, currentStartup.odds * (1 + randomChange)));
        await supabase
          .from('startups')
          .update({ odds: newOdds })
          .eq('id', id);
      }
    }, 5000);

    return () => {
      channel.unsubscribe();
      clearInterval(oddsInterval);
    };
  }, [id]);

  if (loading) return <div>Loading...</div>;

Let me fix the build error in StartupDetails.tsx and implement the requested features. The error occurs because the Badge component doesn't have a "success" variant. Let's fix this and implement the new features.

<lov-code>
First, let's update StartupDetails.tsx to fix the Badge variant error and add the new real-time features:

<lov-write file_path="src/pages/StartupDetails.tsx">
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Users, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BetForm from "@/components/startups/BetForm";
import UserLeaderboard from "@/components/startups/UserLeaderboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StartupDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oddsHistory, setOddsHistory] = useState([]);

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
        updateOddsHistory(data.odds);
      } catch (error) {
        toast.error("Error fetching startup details");
      } finally {
        setLoading(false);
      }
    };

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

    fetchStartup();
    fetchUserBets();

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
        updateOddsHistory(payload.new.odds);
      })
      .subscribe();

    // Set up 5-second interval for odds updates
    const intervalId = setInterval(updateRandomOdds, 5000);

    return () => {
      channel.unsubscribe();
      clearInterval(intervalId);
    };
  }, [id]);

  const updateOddsHistory = (currentOdds) => {
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

  const handleSellBet = async (betId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to sell bets");
        return;
      }

      const { data, error } = await supabase.rpc('sell_bet', {
        p_bet_id: betId,
        p_user_id: session.user.id
      });

      if (error) throw error;
      toast.success(`Bet sold successfully for ${data} coins!`);
      
      // Refresh user bets
      const { data: updatedBets, error: betsError } = await supabase
        .from('bets')
        .select('*')
        .eq('startup_id', id)
        .eq('user_id', session.user.id)
        .eq('status', 'active');

      if (betsError) throw betsError;
      setUserBets(updatedBets || []);
    } catch (error) {
      toast.error("Error selling bet");
    }
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
              <Progress 
                value={((startup.active_buyers || 0) / 
                ((startup.active_buyers || 0) + (startup.active_sellers || 1))) * 100} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Odds History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oddsHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="odds" 
                      stroke="#8B5CF6" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {userBets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Active Bets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBets.map((bet) => (
                    <div key={bet.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Bet Amount: ${bet.amount}</div>
                        <div className="text-sm text-muted-foreground">
                          Potential Return: ${bet.potential_return}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSellBet(bet.id)}
                        variant="outline"
                      >
                        Sell Bet
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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