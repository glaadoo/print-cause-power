import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Package, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  shipping_name: string;
}

export default function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setOrders(data);
        setFilteredOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-10 w-full max-w-md mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground text-center">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "You haven't placed any orders yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.order_number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">
                          Ship to: <span className="font-medium">{order.shipping_name}</span>
                        </p>
                        <p className="text-lg font-bold mt-1">
                          ${parseFloat(order.total.toString()).toFixed(2)}
                        </p>
                      </div>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Order #{order.order_number}</SheetTitle>
                            <SheetDescription>
                              Order placed on {new Date(order.created_at).toLocaleDateString()}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">Status</h4>
                              {getStatusBadge(order.status)}
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Shipping Address</h4>
                              <p className="text-sm">{order.shipping_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.shipping_name} - Details would be shown here
                              </p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Order Total</h4>
                              <p className="text-2xl font-bold">
                                ${parseFloat(order.total.toString()).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
