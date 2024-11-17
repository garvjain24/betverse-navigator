import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const StartupList = () => {
  const [startups, setStartups] = useState([]);
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

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
          <TableHead>Trending</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {startups.map((startup) => (
          <TableRow key={startup.id}>
            <TableCell>{startup.name}</TableCell>
            <TableCell>{startup.sector}</TableCell>
            <TableCell>{startup.stage}</TableCell>
            <TableCell>{startup.odds}</TableCell>
            <TableCell>
              {startup.trending ? <Badge className="bg-green-500">Trending</Badge> : <Badge>Stable</Badge>}
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