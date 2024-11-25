import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BetFormProps {
  startupId: string;
  odds: number;
  onBetPlaced: () => void;
}

const BetForm = ({ startupId, odds, onBetPlaced }: BetFormProps) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (betType: 'win' | 'fall') => {
    try {
      setLoading(true);
      
      const betAmount = parseFloat(amount);
      
      if (!betAmount || betAmount <= 0) {
        toast.error("Please enter a valid amount greater than 0 coins");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to place bets");
        return;
      }

      const { error } = await supabase.rpc('place_bet', {
        p_user_id: session.user.id,
        p_startup_id: startupId,
        p_amount: betAmount,
        p_bet_type: betType
      });

      if (error) throw error;

      toast.success("Bet placed successfully!");
      setAmount("");
      onBetPlaced();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place a Bet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (coins)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (minimum 1 coin)"
            />
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => handleSubmit('win')}
              disabled={loading || !amount || parseFloat(amount) < 1}
              className="flex-1"
            >
              Bet Win ({odds}x)
            </Button>
            <Button
              onClick={() => handleSubmit('fall')}
              disabled={loading || !amount || parseFloat(amount) < 1}
              variant="destructive"
              className="flex-1"
            >
              Bet Fall ({odds}x)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BetForm;