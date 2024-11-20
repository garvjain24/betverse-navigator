import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Order {
  id: string;
  order_type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: string;
  created_at: string;
}

const OrderBook = ({ startupId }: { startupId: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('order_book')
          .select('*')
          .eq('startup_id', startupId)
          .eq('status', 'pending')
          .order('price', { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (error) {
        toast.error("Error fetching order book");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order_book_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_book',
        filter: `startup_id=eq.${startupId}`
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [startupId]);

  const groupOrders = (orders: Order[]) => {
    const buyOrders = orders.filter(order => order.order_type === 'buy');
    const sellOrders = orders.filter(order => order.order_type === 'sell');
    return { buyOrders, sellOrders };
  };

  if (loading) return <div>Loading...</div>;

  const { buyOrders, sellOrders } = groupOrders(orders);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Buy Orders</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buyOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="font-medium mb-2">Sell Orders</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;