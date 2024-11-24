import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ActiveBets = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Not authenticated");
          return;
        }
        
        setUserId(session.user.id);
        await fetchActiveBets(session.user.id);

        const subscription = supabase
          .channel('active_bets_changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'bets',
            filter: `user_id=eq.${session.user.id}`
          }, () => fetchActiveBets(session.user.id))
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        toast.error("Error setting up real-time updates");
      }
    };

    setupSubscription();
  }, []);

  const fetchActiveBets = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('bets')
        .select(`
          *,
          startup:startups(name, growth_percentage, odds)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveBets(data);
    } catch (error) {
      toast.error("Error fetching active bets");
    } finally {
      setLoading(false);
    }
  };

  const handleSellBet = async (betId) => {
    try {
      const { data, error } = await supabase.rpc('sell_bet', {
        p_bet_id: betId,
        p_user_id: userId
      });

      if (error) throw error;
      toast.success(`Bet sold successfully for ${data} coins!`);
    } catch (error) {
      toast.error("Error selling bet");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Bets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeBets.map((bet) => (
          <div key={bet.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{bet.startup?.name}</div>
                <div className="text-sm text-muted-foreground">
                  ${bet.amount} at {bet.startup?.odds}x
                </div>
                <Badge variant={bet.bet_type === 'win' ? 'default' : 'destructive'}>
                  {bet.bet_type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center ${
                  bet.startup?.growth_percentage >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {bet.startup?.growth_percentage >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(bet.startup?.growth_percentage)}%
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSellBet(bet.id)}
                >
                  Sell
                </Button>
              </div>
            </div>
            <Progress
              value={Math.min(Math.abs(bet.startup?.growth_percentage || 0), 100)}
              className={`h-2 ${bet.bet_type === 'win' ? 'bg-green-100' : 'bg-red-100'}`}
            />
          </div>
        ))}
        {activeBets.length === 0 && (
          <div className="text-center text-muted-foreground">
            No active bets
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveBets;