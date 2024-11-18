import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ActiveBets = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBets = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Not authenticated");
          return;
        }

        const { data, error } = await supabase
          .from('bets')
          .select(`
            *,
            startup:startups(name, growth_percentage, odds)
          `)
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setActiveBets(data);
      } catch (error) {
        toast.error("Error fetching active bets");
        console.error("Active bets error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBets();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('active_bets_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bets',
        filter: `user_id=eq.${supabase.auth.getSession()?.data?.session?.user?.id}`
      }, fetchActiveBets)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
              </div>
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
            </div>
            <Progress
              value={Math.min(Math.abs(bet.startup?.growth_percentage || 0), 100)}
              className="h-2"
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