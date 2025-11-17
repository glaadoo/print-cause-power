import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthGuard } from "@/components/AuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingBag, Target, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImpactSummary } from "@/components/impact/ImpactSummary";
import { CauseImpactList } from "@/components/impact/CauseImpactList";
import { OrderHistoryTable } from "@/components/impact/OrderHistoryTable";
import { DonationHistoryTable } from "@/components/impact/DonationHistoryTable";

interface ImpactData {
  totalDonated: number;
  causesSupported: number;
  ordersWithDonations: number;
  causes: Array<{
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    totalDonated: number;
    donationCount: number;
  }>;
  orders: Array<{
    id: string;
    order_number: string;
    created_at: string;
    total: number;
    total_donation: number;
    cause_name: string | null;
    status: string;
  }>;
  donations: Array<{
    id: string;
    amount: number;
    cause_name: string;
    created_at: string;
    order_number: string | null;
  }>;
}

export default function AccountImpact() {
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState<ImpactData | null>(null);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all donations
      const { data: donations, error: donationsError } = await supabase
        .from("donations")
        .select(`
          id,
          amount,
          created_at,
          cause,
          causes:cause_id (name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (donationsError) throw donationsError;

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          created_at,
          total,
          total_donation,
          status,
          causes:cause_id (name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Calculate summary stats
      const totalDonated = (donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0) +
                          (orders?.reduce((sum, o) => sum + Number(o.total_donation), 0) || 0);

      const uniqueCauses = new Set<string>();
      donations?.forEach(d => {
        if (d.causes?.name) uniqueCauses.add(d.causes.name);
        else if (d.cause) uniqueCauses.add(d.cause);
      });
      orders?.forEach(o => {
        if (o.causes?.name) uniqueCauses.add(o.causes.name);
      });

      const ordersWithDonations = orders?.filter(o => Number(o.total_donation) > 0).length || 0;

      // Group by cause
      const causeMap = new Map<string, { totalDonated: number; donationCount: number }>();
      
      donations?.forEach(d => {
        const causeName = d.causes?.name || d.cause;
        if (causeName) {
          const current = causeMap.get(causeName) || { totalDonated: 0, donationCount: 0 };
          causeMap.set(causeName, {
            totalDonated: current.totalDonated + Number(d.amount),
            donationCount: current.donationCount + 1
          });
        }
      });

      orders?.forEach(o => {
        if (o.causes?.name && Number(o.total_donation) > 0) {
          const current = causeMap.get(o.causes.name) || { totalDonated: 0, donationCount: 0 };
          causeMap.set(o.causes.name, {
            totalDonated: current.totalDonated + Number(o.total_donation),
            donationCount: current.donationCount + 1
          });
        }
      });

      // Fetch cause details
      const { data: causesData } = await supabase
        .from("causes")
        .select("*");

      const causesWithStats = Array.from(causeMap.entries()).map(([name, stats]) => {
        const causeDetail = causesData?.find(c => c.name === name);
        return {
          id: causeDetail?.id || name,
          name,
          description: causeDetail?.description || "",
          image_url: causeDetail?.image_url || null,
          totalDonated: stats.totalDonated,
          donationCount: stats.donationCount
        };
      }).sort((a, b) => b.totalDonated - a.totalDonated);

      setImpactData({
        totalDonated,
        causesSupported: uniqueCauses.size,
        ordersWithDonations,
        causes: causesWithStats,
        orders: orders?.map(o => ({
          id: o.id,
          order_number: o.order_number,
          created_at: o.created_at,
          total: Number(o.total),
          total_donation: Number(o.total_donation),
          cause_name: o.causes?.name || null,
          status: o.status
        })) || [],
        donations: donations?.map(d => ({
          id: d.id,
          amount: Number(d.amount),
          cause_name: d.causes?.name || d.cause,
          created_at: d.created_at,
          order_number: null
        })) || []
      });
    } catch (error) {
      console.error("Error fetching impact data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Impact</h1>
              <p className="text-muted-foreground">See how your support is making a difference</p>
            </div>

            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-12 w-12 mb-3" />
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-8 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : impactData ? (
              <>
                <ImpactSummary
                  totalDonated={impactData.totalDonated}
                  causesSupported={impactData.causesSupported}
                  ordersWithDonations={impactData.ordersWithDonations}
                />

                <CauseImpactList causes={impactData.causes} />

                <OrderHistoryTable orders={impactData.orders} />

                <DonationHistoryTable donations={impactData.donations} />
              </>
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
