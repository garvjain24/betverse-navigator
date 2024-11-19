import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

const BetForm = () => {
  const [amount, setAmount] = useState("");
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
        p_amount: Number(amount)
      });

      if (error) throw error;
      
      toast.success("Bet placed successfully!");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Bet Amount (Coins)
            </label>
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
            {loading ? "Placing Bet..." : "Place Bet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BetForm;