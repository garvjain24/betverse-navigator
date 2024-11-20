import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [userMilestones, setUserMilestones] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch milestones
        const { data: milestonesData } = await supabase
          .from('milestones')
          .select('*')
          .order('required_coins', { ascending: true });

        // Fetch user's claimed milestones
        const { data: userMilestonesData } = await supabase
          .from('user_milestones')
          .select('milestone_id')
          .eq('user_id', session.user.id);

        // Fetch user's wallet balance
        const { data: profileData } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', session.user.id)
          .single();

        setMilestones(milestonesData || []);
        setUserMilestones(userMilestonesData || []);
        setWalletBalance(profileData?.wallet_balance || 0);
      } catch (error) {
        toast.error("Error fetching milestones");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('milestones_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_milestones'
      }, fetchData)
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const claimMilestone = async (milestone) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (walletBalance < milestone.required_coins) {
        toast.error("You haven't reached this milestone yet!");
        return;
      }

      const { error } = await supabase
        .from('user_milestones')
        .insert({
          user_id: session.user.id,
          milestone_id: milestone.id
        });

      if (error) throw error;
      toast.success("Milestone claimed successfully!");
    } catch (error) {
      toast.error("Error claiming milestone");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <h1 className="text-3xl font-bold">Milestones & Rewards</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {milestones.map((milestone) => {
          const isClaimed = userMilestones.some(um => um.milestone_id === milestone.id);
          const progress = Math.min((walletBalance / milestone.required_coins) * 100, 100);
          
          return (
            <Card key={milestone.id} className={isClaimed ? 'bg-green-50' : ''}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">
                  <div className="flex items-center gap-2">
                    <Trophy className={`h-6 w-6 ${isClaimed ? 'text-green-500' : 'text-gray-400'}`} />
                    {milestone.name}
                  </div>
                </CardTitle>
                {isClaimed && (
                  <div className="text-green-500 text-sm font-medium">Claimed!</div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{milestone.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{walletBalance} / {milestone.required_coins} coins</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gift className="h-4 w-4" />
                    <span>{milestone.reward_coins} coins</span>
                  </div>
                  <Button
                    onClick={() => claimMilestone(milestone)}
                    disabled={isClaimed || walletBalance < milestone.required_coins}
                  >
                    {isClaimed ? 'Claimed' : 'Claim Reward'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Milestones;