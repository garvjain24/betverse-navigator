import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const StartupCard = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <Card key={startup.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{startup.name}</span>
              {startup.trending && (
                <Badge className="bg-green-500">Trending</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{startup.description}</p>
            <div className="flex gap-2">
              <Badge variant="secondary">{startup.sector}</Badge>
              <Badge variant="secondary">{startup.stage}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Current Odds</div>
                <div className="text-lg font-bold">{startup.odds}</div>
              </div>
              <Link to={`/startups/${startup.id}`}>
                <Button size="sm">
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StartupCard;