import BetHistory from "@/components/dashboard/BetHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BetHistoryPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in pt-20">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Complete Bet History</h1>
      </div>
      <BetHistory limit={1000} />
    </div>
  );
};

export default BetHistoryPage;