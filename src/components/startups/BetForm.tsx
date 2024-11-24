import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

const BetForm = () => {
  const [amount, setAmount] = useState("");
  const [betType, setBetType] = useState("win");
  const [loading, setLoading] = useState(false);
  const { id: startupId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to place bets");
        return;
      }

      const { data, error } = await supabase.rpc('place_bet', {
        p_user_id: session.user.id,
        p_startup_id: startupId,
        p_amount: Number(amount),
        p_bet_type: betType
      });

      if (error) throw error;
      
      toast.success(`${betType.toUpperCase()} bet placed successfully!`);
      setAmount("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Your Bet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            defaultValue="win"
            value={betType}
            onValueChange={setBetType}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="win"
                id="win"
                className="peer sr-only"
              />
              <Label
                htmlFor="win"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Win Bet</span>
                <span className="text-sm text-muted-foreground">Bet on success</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="fall"
                id="fall"
                className="peer sr-only"
              />
              <Label
                htmlFor="fall"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Fall Bet</span>
                <span className="text-sm text-muted-foreground">Bet on decline</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="amount">Bet Amount (Coins)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              disabled={loading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Placing Bet..." : `Place ${betType.toUpperCase()} Bet`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BetForm;