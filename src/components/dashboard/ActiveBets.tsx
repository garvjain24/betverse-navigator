import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ActiveBets = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBets = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('bets')
        .select(`
          *,
          startup:startups(name, growth_percentage)
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error) {
        setActiveBets(data);
      }
      setLoading(false);
    };

    fetchActiveBets();
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
                  ${bet.amount} at {(bet.potential_return / bet.amount).toFixed(1)}x
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
      </CardContent>
    </Card>
  );
};

export default ActiveBets;