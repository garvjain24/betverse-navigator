import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Startup {
  id: string;
  name: string;
  description: string | null;
  odds: number;
  sector: string | null;
  stage: string | null;
  trending: boolean;
  active_buyers?: number;
  active_sellers?: number;
  active_win_bets?: number;
  active_fall_bets?: number;
  created_at?: string;
  growth_percentage?: number;
  image_url?: string;
  investors?: number;
  status?: string;
}

export const useStartups = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*');

        if (error) throw error;
        
        // Transform the data to include the trending property
        const transformedData: Startup[] = data.map(startup => ({
          ...startup,
          trending: startup.growth_percentage ? startup.growth_percentage > 10 : false
        }));
        
        setStartups(transformedData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('startups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'startups'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newStartup = {
              ...payload.new,
              trending: payload.new.growth_percentage ? payload.new.growth_percentage > 10 : false
            } as Startup;
            setStartups(prev => [...prev, newStartup]);
          } else if (payload.eventType === 'UPDATE') {
            setStartups(prev => 
              prev.map(startup => 
                startup.id === payload.new.id 
                  ? { 
                      ...startup, 
                      ...payload.new, 
                      trending: payload.new.growth_percentage ? payload.new.growth_percentage > 10 : false 
                    }
                  : startup
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setStartups(prev => 
              prev.filter(startup => startup.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { startups, loading, error };
};