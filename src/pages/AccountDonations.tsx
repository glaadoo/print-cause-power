import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Search, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

interface Donation {
  id: string;
  amount: number;
  cause: string;
  payment_method: string;
  created_at: string;
  donor_name: string;
}

const AccountDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(
    (donation) =>
      donation.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <BackButton />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-highlight" />
            <h1 className="text-3xl font-bold">My Donations</h1>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-foreground/60">Total Donated</p>
                  <p className="text-2xl font-bold text-highlight">${totalDonated.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Total Donations</p>
                  <p className="text-2xl font-bold">{donations.length}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Impact Score</p>
                  <p className="text-2xl font-bold">⭐ {Math.floor(totalDonated / 10)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input
                  placeholder="Search by cause or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredDonations.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/60">
                    {searchTerm ? "No donations found matching your search" : "No donations yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex justify-between items-start p-4 glass-card hover:bg-muted/5 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold capitalize">{donation.cause}</p>
                          <Badge variant="outline" className="text-xs">
                            {donation.payment_method}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/60">
                          Donated as {donation.donor_name}
                        </p>
                        <p className="text-xs text-foreground/40 mt-1">
                          {formatDistanceToNow(new Date(donation.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-highlight">
                          ${Number(donation.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountDonations;
