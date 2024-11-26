import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, Filter } from "lucide-react";
import StartupCard from "@/components/startups/StartupCard";
import StartupList from "@/components/startups/StartupList";

const Startups = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sector, setSector] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Startups</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary text-white" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary text-white" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search startups..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sectors</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="health">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {viewMode === "grid" ? (
        <StartupCard />
      ) : (
        <StartupList sector={sector} searchQuery={searchQuery} />
      )}
    </div>
  );
};

export default Startups;