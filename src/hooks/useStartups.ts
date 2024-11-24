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
        setStartups(data);
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
            setStartups(prev => [...prev, payload.new as Startup]);
          } else if (payload.eventType === 'UPDATE') {
            setStartups(prev => 
              prev.map(startup => 
                startup.id === payload.new.id 
                  ? { ...startup, ...payload.new }
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