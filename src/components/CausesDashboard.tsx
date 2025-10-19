import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Heart, Leaf, Users, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PressmasterQuoteModal } from "./PressmasterQuoteModal";

interface CauseTotal {
  cause: string;
  total: number;
  updated: boolean;
}

const causeIcons: Record<string, any> = {
  education: GraduationCap,
  healthcare: Heart,
  environment: Leaf,
  community: Users,
};

const causeColors: Record<string, string> = {
  education: "text-primary",
  healthcare: "text-highlight",
  environment: "text-accent",
  community: "text-secondary",
};

const CausesDashboard = () => {
  const [causeTotals, setCauseTotals] = useState<CauseTotal[]>([
    { cause: "education", total: 0, updated: false },
    { cause: "healthcare", total: 0, updated: false },
    { cause: "environment", total: 0, updated: false },
    { cause: "community", total: 0, updated: false },
  ]);
  const [showPressmasterModal, setShowPressmasterModal] = useState(false);

  useEffect(() => {
    const fetchCauseTotals = async () => {
      const { data } = await supabase
        .from('donations')
        .select('cause, amount');

      if (data) {
        const totals = causeTotals.map(ct => {
          const causeData = data.filter(d => d.cause === ct.cause);
          const total = causeData.reduce((sum, d) => sum + Number(d.amount), 0);
          return { ...ct, total };
        });
        setCauseTotals(totals);
      }
    };

    fetchCauseTotals();

    const channel = supabase
      .channel('causes-dashboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          const newCause = payload.new.cause;
          const newAmount = Number(payload.new.amount);
          
          setCauseTotals(prev => prev.map(ct => {
            if (ct.cause === newCause) {
              return { 
                cause: ct.cause, 
                total: ct.total + newAmount, 
                updated: true 
              };
            }
            return { ...ct, updated: false };
          }));

          // Remove highlight after animation
          setTimeout(() => {
            setCauseTotals(prev => prev.map(ct => ({ ...ct, updated: false })));
          }, 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Live Causes <span className="bg-gradient-secondary bg-clip-text text-transparent">Dashboard</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              Real-time donation tracking across all causes
            </p>
          </div>

          <Card className="max-w-4xl mx-auto glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donation Totals by Cause</CardTitle>
                <Button
                  onClick={() => setShowPressmasterModal(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Pressmaster Quote
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Cause</TableHead>
                    <TableHead className="text-right">Total Raised</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {causeTotals.map((causeTotal) => {
                    const Icon = causeIcons[causeTotal.cause];
                    const colorClass = causeColors[causeTotal.cause];
                    
                    return (
                      <TableRow 
                        key={causeTotal.cause}
                        className={`transition-all duration-500 ${
                          causeTotal.updated 
                            ? 'bg-accent/20 animate-pulse' 
                            : ''
                        }`}
                      >
                        <TableCell>
                          <div className={`inline-flex p-2 rounded-lg glass ${colorClass} ${
                            causeTotal.updated ? 'animate-glow' : ''
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium capitalize">
                          {causeTotal.cause}
                        </TableCell>
                        <TableCell className="text-right">
                          <span 
                            className={`text-lg font-bold ${colorClass} ${
                              causeTotal.updated 
                                ? 'animate-scale-in' 
                                : ''
                            }`}
                          >
                            ${causeTotal.total.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      <PressmasterQuoteModal
        open={showPressmasterModal}
        onOpenChange={setShowPressmasterModal}
      />
    </>
  );
};

export default CausesDashboard;
