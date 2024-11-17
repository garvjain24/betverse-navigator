import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BetForm = () => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bet placed successfully!");
    setAmount("");
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
              Bet Amount
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Potential Return: ${Number(amount) * 2.5}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Place Bet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BetForm;