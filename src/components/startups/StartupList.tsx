import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const StartupList = () => {
  const startups = [
    {
      id: 1,
      name: "TechCorp AI",
      description: "Revolutionary AI solutions for enterprise",
      sector: "Technology",
      stage: "Series B",
      odds: "2.5x",
      trending: true,
    },
    {
      id: 2,
      name: "HealthTech Pro",
      description: "Digital health monitoring platform",
      sector: "Healthcare",
      stage: "Series A",
      odds: "1.8x",
      trending: false,
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Odds</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {startups.map((startup) => (
          <TableRow key={startup.id}>
            <TableCell className="font-medium">{startup.name}</TableCell>
            <TableCell>{startup.sector}</TableCell>
            <TableCell>{startup.stage}</TableCell>
            <TableCell>{startup.odds}</TableCell>
            <TableCell>
              {startup.trending ? (
                <Badge className="bg-green-500">Trending</Badge>
              ) : (
                <Badge variant="secondary">Stable</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Link to={`/startups/${startup.id}`}>
                <Button size="sm" variant="outline">
                  View
                  <ArrowUpRight className="ml-2 h-4 w-4" />
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