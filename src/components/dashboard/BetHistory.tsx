import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExtendedBet, ActiveBet, ClosedBet } from "@/types/betting";

const BetHistory = ({ limit = 20 }: { limit?: number }) => {
  const [bets, setBets] = useState<ExtendedBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

  const calculateProfitLoss = (bet: ExtendedBet) => {
    if ('current_profit_loss' in bet) {
      return ((bet.startup?.odds || 0) - bet.odds_at_time) * bet.amount;
    } else {
      return bet.final_profit_loss;
    }
  };

  const fetchAllBets = async (userId: string) => {
    try {
      const [activeBetsResponse, closedBetsResponse] = await Promise.all([
        supabase
          .from('bets')
          .select(`
            *,
            startup:startups(name, odds)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit),
        supabase
          .from('closed_bets')
          .select(`
            *,
            startup:startups(name, odds)
          `)
          .eq('user_id', userId)
          .order('closed_at', { ascending: false })
          .limit(limit)
      ]);

      if (activeBetsResponse.error) throw activeBetsResponse.error;
      if (closedBetsResponse.error) throw closedBetsResponse.error;
      
      const activeBets: ActiveBet[] = activeBetsResponse.data.map(bet => ({
        ...bet,
        isClosed: false,
        date: bet.created_at,
        odds_at_time: bet.startup?.odds || 0,
        current_profit_loss: ((bet.startup?.odds || 0) - (bet.startup?.odds || 0)) * bet.amount
      }));

      const closedBets: ClosedBet[] = closedBetsResponse.data.map(bet => ({
        ...bet,
        isClosed: true,
        date: bet.closed_at || bet.created_at,
        final_profit_loss: bet.sell_price ? bet.sell_price - bet.amount : 0
      }));

      const allBets: ExtendedBet[] = [...activeBets, ...closedBets]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

      setBets(allBets);

      const total = allBets.reduce((acc, bet) => acc + calculateProfitLoss(bet), 0);
      setTotalProfitLoss(total);
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Error fetching bets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setupSubscriptions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Not authenticated");
          return;
        }

        await fetchAllBets(session.user.id);

        const betsChannel = supabase.channel('bets_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'bets',
              filter: `user_id=eq.${session.user.id}`
            },
            () => fetchAllBets(session.user.id)
          )
          .subscribe();

        const startupsChannel = supabase.channel('startups_changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'startups'
            },
            () => fetchAllBets(session.user.id)
          )
          .subscribe();

        return () => {
          betsChannel.unsubscribe();
          startupsChannel.unsubscribe();
        };
      } catch (error) {
        toast.error("Error setting up real-time updates");
      }
    };

    setupSubscriptions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Recent Bet History</span>
          <div className="flex items-center gap-4">
            <Badge className={totalProfitLoss >= 0 ? "bg-green-500" : "bg-red-500"}>
              Total P/L: {totalProfitLoss.toFixed(2)} coins
            </Badge>
            <Link to="/bet-history">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Startup</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>P/L</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{bet.startup?.name}</TableCell>
                <TableCell>${bet.amount}</TableCell>
                <TableCell>
                  <Badge variant={bet.bet_type === 'win' ? 'default' : 'destructive'}>
                    {bet.bet_type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={calculateProfitLoss(bet) >= 0 ? "text-green-500" : "text-red-500"}>
                    {calculateProfitLoss(bet).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      bet.isClosed
                        ? 'bg-gray-500'
                        : bet.status === 'won'
                        ? 'bg-green-500'
                        : bet.status === 'lost'
                        ? 'bg-red-500'
                        : ''
                    }
                  >
                    {bet.isClosed ? 'Closed' : bet.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BetHistory;