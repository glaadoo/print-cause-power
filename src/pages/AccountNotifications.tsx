import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export default function AccountNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promos: true,
    priceDrop: true,
    backInStock: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (!error) {
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null);

    if (!error) {
      setNotifications(
        notifications.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
      toast({
        title: "All notifications marked as read",
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="order-updates" className="flex flex-col gap-1">
                  <span>Order Updates</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Receive updates about your orders
                  </span>
                </Label>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, orderUpdates: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="promos" className="flex flex-col gap-1">
                  <span>Promotions</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Get notified about sales and promotions
                  </span>
                </Label>
                <Switch
                  id="promos"
                  checked={preferences.promos}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, promos: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="price-drop" className="flex flex-col gap-1">
                  <span>Price Drops</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Alerts when items go on sale
                  </span>
                </Label>
                <Switch
                  id="price-drop"
                  checked={preferences.priceDrop}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, priceDrop: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="back-in-stock" className="flex flex-col gap-1">
                  <span>Back in Stock</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Notify when items are restocked
                  </span>
                </Label>
                <Switch
                  id="back-in-stock"
                  checked={preferences.backInStock}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, backInStock: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Center</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No notifications yet
                  </h3>
                  <p className="text-muted-foreground text-center">
                    We'll notify you when there's something new
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div
                        className={`flex items-start gap-4 ${
                          !notification.read_at ? "bg-muted/50 -mx-4 p-4 rounded-lg" : ""
                        }`}
                      >
                        <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {!notification.read_at && (
                              <Badge variant="default" className="h-5">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.body}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleDateString()}{" "}
                            at {new Date(notification.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read_at && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
