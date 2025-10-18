import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationBarometer from "@/components/DonationBarometer";
import DonationForm from "@/components/DonationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  cause: string;
  created_at: string;
}

const Donations = () => {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      const { data } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setRecentDonations(data);
    };

    fetchRecentDonations();

    const channel = supabase
      .channel('recent-donations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          setRecentDonations(prev => [payload.new as Donation, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Donation <span className="bg-gradient-secondary bg-clip-text text-transparent">Dashboard</span>
        </h1>

        <DonationBarometer />

        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto">
          <DonationForm />

          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.length === 0 ? (
                  <p className="text-foreground/60 text-center py-8">No donations yet</p>
                ) : (
                  recentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex justify-between items-start p-4 glass-card animate-fade-in"
                    >
                      <div>
                        <p className="font-semibold">{donation.donor_name}</p>
                        <p className="text-sm text-foreground/60 capitalize">{donation.cause}</p>
                        <p className="text-xs text-foreground/40">
                          {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-highlight font-bold text-lg">
                        ${Number(donation.amount).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donations;
