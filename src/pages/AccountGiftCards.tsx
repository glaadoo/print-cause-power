import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { AuthGuard } from "@/components/AuthGuard";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GiftCardRedemption {
  id: string;
  amount: number;
  created_at: string;
  gift_cards: {
    code: string;
    balance: number;
  };
}

export default function AccountGiftCards() {
  const [redemptions, setRedemptions] = useState<GiftCardRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [code, setCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("gift_card_redemptions")
      .select("*, gift_cards(code, balance)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setRedemptions(data as any);
    }
    setLoading(false);
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setRedeeming(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if gift card exists
    const { data: giftCard, error: fetchError } = await supabase
      .from("gift_cards")
      .select("*")
      .eq("code", code.trim())
      .eq("status", "active")
      .single();

    if (fetchError || !giftCard) {
      toast({
        title: "Invalid gift card code",
        description: "Please check the code and try again",
        variant: "destructive",
      });
      setRedeeming(false);
      return;
    }

    // Create redemption
    const { error: redeemError } = await supabase
      .from("gift_card_redemptions")
      .insert([{
        gift_card_id: giftCard.id,
        user_id: user.id,
        amount: parseFloat(giftCard.balance.toString()),
      }]);

    if (redeemError) {
      toast({
        title: "Error redeeming gift card",
        description: redeemError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Gift card redeemed successfully",
        description: `$${parseFloat(giftCard.balance.toString()).toFixed(2)} added to your balance`,
      });
      setCode("");
      fetchRedemptions();
    }
    setRedeeming(false);
  };

  const totalBalance = redemptions.reduce(
    (sum, r) => sum + parseFloat((r.gift_cards as any).balance),
    0
  );

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-64" />
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
          <h1 className="text-3xl font-bold mb-6">Gift Cards</h1>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Gift className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold">
                      ${totalBalance.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Available to spend
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redeem Gift Card</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRedeem} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Gift Card Code</Label>
                    <Input
                      id="code"
                      placeholder="Enter code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={redeeming} className="w-full">
                    {redeeming ? "Redeeming..." : "Redeem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Redemption History</CardTitle>
            </CardHeader>
            <CardContent>
              {redemptions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No gift cards redeemed yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptions.map((redemption) => (
                      <TableRow key={redemption.id}>
                        <TableCell className="font-mono">
                          {(redemption.gift_cards as any).code}
                        </TableCell>
                        <TableCell>
                          ${parseFloat(redemption.amount.toString()).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${parseFloat((redemption.gift_cards as any).balance).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(redemption.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
