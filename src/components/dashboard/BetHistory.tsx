import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const calculatePotentialReturn = (amount: number, odds: number) => {
  return Number((amount * odds).toFixed(2));
};

const BetHistory = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Not authenticated");
          return;
        }

        // Fetch both active and closed bets
        const [activeBetsResponse, closedBetsResponse] = await Promise.all([
          supabase
            .from('bets')
            .select(`
              *,
              startup:startups(name, odds)
            `)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('closed_bets')
            .select(`
              *,
              startup:startups(name, odds)
            `)
            .eq('user_id', session.user.id)
            .order('closed_at', { ascending: false })
        ]);

        if (activeBetsResponse.error) throw activeBetsResponse.error;
        if (closedBetsResponse.error) throw closedBetsResponse.error;
        
        // Combine and sort bets by date
        const allBets = [
          ...activeBetsResponse.data.map(bet => ({
            ...bet,
            isClosed: false,
            date: bet.created_at
          })),
          ...closedBetsResponse.data.map(bet => ({
            ...bet,
            isClosed: true,
            date: bet.closed_at
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setBets(allBets);
      } catch (error) {
        toast.error("Error fetching bet history");
        console.error("Bet history error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bet History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Startup</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Potential Return</TableHead>
              <TableHead>Status</TableHead>
              {/* Add Sell Price column */}
              <TableHead>Sell Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{bet.startup?.name}</TableCell>
                <TableCell>${bet.amount}</TableCell>
                <TableCell>${bet.potential_return}</TableCell>
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
                <TableCell>
                  {bet.isClosed ? `$${bet.sell_price}` : '-'}
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