import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserLeaderboard = () => {
  const users = [
    { name: "John D.", amount: "$5,000", avatar: "/placeholder.svg" },
    { name: "Sarah M.", amount: "$3,500", avatar: "/placeholder.svg" },
    { name: "Mike R.", amount: "$2,800", avatar: "/placeholder.svg" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Investors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.amount}</div>
                </div>
              </div>
              <div className="text-sm font-medium">#{index + 1}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLeaderboard;