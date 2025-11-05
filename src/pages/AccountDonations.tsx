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
          <div className="mb-4">
            <BackButton />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-highlight" />
            <h1 className="text-2xl font-bold">My Donations</h1>
          </div>

          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-xl font-bold text-highlight">${totalDonated.toFixed(2)}</p>
                </div>
                <div className="text-center border-l border-r">
                  <p className="text-xs text-muted-foreground mb-1">Count</p>
                  <p className="text-xl font-bold">{donations.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Impact</p>
                  <p className="text-xl font-bold">⭐ {Math.floor(totalDonated / 10)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">History</CardTitle>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by cause or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredDonations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "No matching donations" : "No donations yet"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="font-semibold capitalize text-sm truncate flex-1">
                          {donation.cause}
                        </p>
                        <p className="text-base font-bold text-highlight flex-shrink-0">
                          ${Number(donation.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs h-5">
                          {donation.payment_method}
                        </Badge>
                        <p className="text-xs text-muted-foreground truncate">
                          {donation.donor_name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(donation.created_at), {
                          addSuffix: true,
                        })}
                      </p>
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
