import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, ShoppingBag, Users, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonated: 0,
    causesSupported: 0,
    happyCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total donations
      const { data: donations } = await supabase
        .from("donations")
        .select("amount");
      
      const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;

      // Fetch unique causes
      const { data: causes } = await supabase
        .from("causes")
        .select("id");
      
      const causesSupported = causes?.length || 0;

      // Fetch unique customers (from orders)
      const { data: orders } = await supabase
        .from("orders")
        .select("user_id");
      
      const uniqueCustomers = new Set(orders?.map(o => o.user_id)).size || 0;

      setStats({
        totalDonated,
        causesSupported,
        happyCustomers: uniqueCustomers,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Shop with purpose. Give with purpose. Impact with purpose.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  ${stats.totalDonated.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total Donated</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-secondary/20 hover:border-secondary/40 transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">
                  {stats.causesSupported}
                </div>
                <p className="text-sm text-muted-foreground">Causes Supported</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-2">
                  {stats.happyCustomers}+
                </div>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-16">
          
          {/* Who We Are */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Who We Are</h2>
            </div>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  At our core, we are more than just an online store — we are a purpose-driven platform built to create real impact in the community. Every product you purchase supports meaningful causes, and every donation helps bring resources, hope, and opportunity to people who need it most.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <Card className="glass-card">
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg font-semibold text-primary">
                  Our mission is simple:
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Shop with purpose. Give with purpose. Impact with purpose.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  We believe that every customer should feel connected to the causes they support. That's why we've built a system where you can select a cause during checkout, contribute through optional donations, and track your total impact over time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Shop Products</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Browse our curated collection of quality products. Each purchase directly supports causes that matter to you and your community.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Make Donations</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Choose to add optional donations at checkout or donate directly to causes. Every contribution makes a tangible difference.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Community Impact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Community Impact</h2>
            </div>
            <Card className="glass-card">
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Together, we're transforming everyday shopping into a powerful force for good. Whether you're buying for yourself or giving back, you are helping us build a brighter, stronger future for our community.
                </p>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xl font-semibold text-center text-primary">
                    Thank you for being part of the mission.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card border-primary/20">
            <CardContent className="pt-8 pb-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start shopping with purpose or support a cause directly. Every action you take creates positive change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/products")}
                  className="group"
                >
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/causes")}
                  className="group"
                >
                  Support a Cause
                  <Heart className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
