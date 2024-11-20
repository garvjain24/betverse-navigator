import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Bet {
  id: string;
  amount: number;
  potential_return: number;
  status: string;
}

interface UserBetsProps {
  bets: Bet[];
  onBetSold: (betId: string) => void;
}

const UserBets = ({ bets, onBetSold }: UserBetsProps) => {
  const handleSellBet = async (betId: string) => {
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
      
      // Call onBetSold immediately after successful sale
      onBetSold(betId);
      toast.success(`Bet sold successfully for ${data} coins!`);
    } catch (error) {
      toast.error("Error selling bet");
    }
  };

  if (bets.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Active Bets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bets.map((bet) => (
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
  );
};

export default UserBets;