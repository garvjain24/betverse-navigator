import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const calculatePotentialReturn = (amount: number, odds: number) => {
  // Simple calculation: amount * odds
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

        const { data, error } = await supabase
          .from('bets')
          .select(`
            *,
            startup:startups(name, odds)
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Calculate potential returns for each bet
        const betsWithReturns = data.map(bet => ({
          ...bet,
          potential_return: calculatePotentialReturn(bet.amount, bet.startup?.odds || 1)
        }));

        setBets(betsWithReturns);
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
                      bet.status === 'won'
                        ? 'bg-green-500'
                        : bet.status === 'lost'
                        ? 'bg-red-500'
                        : ''
                    }
                  >
                    {bet.status}
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