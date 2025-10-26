import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Heart, Gift, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";

interface DashboardStats {
  orderCount: number;
  lastOrderDate: string | null;
  savedItemsCount: number;
  giftCardBalance: number;
  totalDonations: number;
}

export default function Account() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch orders count and last order
      const { data: orders } = await supabase
        .from("orders")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch notify-me items count
      const { count: notifyMeCount } = await supabase
        .from("notify_me")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch gift card balance
      const { data: redemptions } = await supabase
        .from("gift_card_redemptions")
        .select("amount, gift_cards(balance)")
        .eq("user_id", user.id);

      const totalGiftCardBalance = redemptions?.reduce((sum, r: any) => {
        return sum + (parseFloat(r.gift_cards?.balance) || 0);
      }, 0) || 0;

      // Fetch total donations
      const { data: donations } = await supabase
        .from("donations")
        .select("amount")
        .eq("user_id", user.id);

      const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      setStats({
        orderCount: orders?.length || 0,
        lastOrderDate: orders?.[0]?.created_at || null,
        savedItemsCount: notifyMeCount || 0,
        giftCardBalance: totalGiftCardBalance,
        totalDonations,
      });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-3xl font-bold mb-6">Account Dashboard</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.orderCount}</div>
                {stats?.lastOrderDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last order: {new Date(stats.lastOrderDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.savedItemsCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Items you're watching
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gift Card Balance</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.giftCardBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Available to spend
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalDonations.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Making a difference
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link to="/products">
                  <Button className="w-full">Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/account/orders" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      View All Orders
                    </Button>
                  </Link>
                  <Link to="/account/notify-me" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      Manage Notify Me List
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/account/info" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Update Profile & Addresses
                    </Button>
                  </Link>
                  <Link to="/account/gift-cards" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Gift className="mr-2 h-4 w-4" />
                      Manage Gift Cards
                    </Button>
                  </Link>
                  <Link to="/account/donations" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      View My Donations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
