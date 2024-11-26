import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BetFormData } from "@/types/betting";

interface BetFormProps {
  startupId: string;
  odds: number;
  onBetPlaced: () => void;
}

const BetForm = ({ startupId, odds, onBetPlaced }: BetFormProps) => {
  const [amount, setAmount] = useState("");
  const [betType, setBetType] = useState<'win' | 'fall'>('win');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
      toast.error("Error placing bet");
    } finally {
      setLoading(false);
    }
  };

  const potentialReturn = parseFloat(amount) * odds;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place a Bet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs value={betType} onValueChange={(value) => setBetType(value as 'win' | 'fall')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="win">Win</TabsTrigger>
              <TabsTrigger value="fall">Fall</TabsTrigger>
            </TabsList>
          </Tabs>

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

          <div className="text-sm text-muted-foreground">
            Potential Return: {potentialReturn ? potentialReturn.toFixed(2) : '0'} coins
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !amount || parseFloat(amount) < 1}
            className="w-full"
          >
            Place {betType.toUpperCase()} Bet ({odds}x)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BetForm;