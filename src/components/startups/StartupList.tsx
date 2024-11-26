import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StartupListProps {
  sector?: string;
  searchQuery?: string;
}

const StartupList = ({ sector, searchQuery }: StartupListProps) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        let query = supabase
          .from('startups')
          .select('*')
          .order('created_at', { ascending: false });

        if (sector) {
          query = query.eq('sector', sector);
        }

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setStartups(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();

    const subscription = supabase
      .channel('startups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'startups'
        },
        fetchStartups
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sector, searchQuery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Odds</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {startups.map((startup) => (
          <TableRow key={startup.id}>
            <TableCell>{startup.name}</TableCell>
            <TableCell>{startup.sector}</TableCell>
            <TableCell>{startup.stage}</TableCell>
            <TableCell>{Number(startup.odds).toFixed(2)}x</TableCell>
            <TableCell>
              <Badge
                className={
                  startup.growth_percentage > 0
                    ? 'bg-green-500'
                    : startup.growth_percentage < 0
                    ? 'bg-red-500'
                    : ''
                }
              >
                {startup.growth_percentage > 0 ? '+' : ''}
                {Number(startup.growth_percentage).toFixed(2)}%
              </Badge>
            </TableCell>
            <TableCell>
              <Link to={`/startups/${startup.id}`}>
                <Button variant="link" size="sm">
                  <ArrowUpRight className="mr-2 h-4 w-4" /> View
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StartupList;