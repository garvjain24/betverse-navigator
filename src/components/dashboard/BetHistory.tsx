import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const BetHistory = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('bets')
        .select(`
          *,
          startup:startups(name)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setBets(data);
      }
      setLoading(false);
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