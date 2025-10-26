import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface NotifyMeItem {
  id: string;
  product_id: number;
  variant: any;
  created_at: string;
}

export default function AccountNotifyMe() {
  const [items, setItems] = useState<NotifyMeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notify_me")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setItems(data);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  const handleRemove = async (itemId: string) => {
    const { error } = await supabase
      .from("notify_me")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setItems(items.filter((item) => item.id !== itemId));
      toast({
        title: "Item removed from notify-me list",
      });
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
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
          <h1 className="text-3xl font-bold mb-6">Notify Me List</h1>

          {items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No items in your notify-me list
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add items to get notified when they're back in stock
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Product #{item.product_id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {item.variant && (
                        <div className="flex flex-wrap gap-2">
                          {item.variant.size && (
                            <Badge variant="secondary">Size: {item.variant.size}</Badge>
                          )}
                          {item.variant.color && (
                            <Badge variant="secondary">Color: {item.variant.color}</Badge>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
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
