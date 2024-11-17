import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BetHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bet History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Startup</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Odds</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>TechCorp AI</TableCell>
              <TableCell>$500</TableCell>
              <TableCell>2.5x</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Won</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>HealthTech Solutions</TableCell>
              <TableCell>$300</TableCell>
              <TableCell>1.8x</TableCell>
              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BetHistory;