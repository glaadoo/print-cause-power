import { Heart, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DonationBarometerProps {
  selectedCause?: string;
}

const DonationBarometer = ({ selectedCause }: DonationBarometerProps) => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [todayAmount, setTodayAmount] = useState(0);
  const [weekAmount, setWeekAmount] = useState(0);
  const [recentAmount, setRecentAmount] = useState(0);
  const [causeAmount, setCauseAmount] = useState(0);
  const goalAmount = 200000;
  const progress = (currentAmount / goalAmount) * 100;

  useEffect(() => {
    // Fetch initial data
    const fetchDonations = async () => {
      const { data: allDonations } = await supabase
        .from('donations')
        .select('amount, created_at, cause');

      if (allDonations) {
        const total = allDonations.reduce((sum, d) => sum + Number(d.amount), 0);
        setCurrentAmount(total);

        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const weekStart = new Date(now.setDate(now.getDate() - 7));
        const recentStart = new Date(Date.now() - 60000); // Last minute

        const today = allDonations
          .filter(d => new Date(d.created_at) >= todayStart)
          .reduce((sum, d) => sum + Number(d.amount), 0);
        
        const week = allDonations
          .filter(d => new Date(d.created_at) >= weekStart)
          .reduce((sum, d) => sum + Number(d.amount), 0);
        
        const recent = allDonations
          .filter(d => new Date(d.created_at) >= recentStart)
          .reduce((sum, d) => sum + Number(d.amount), 0);

        setTodayAmount(today);
        setWeekAmount(week);
        setRecentAmount(recent);

        if (selectedCause) {
          const causeTotal = allDonations
            .filter(d => d.cause === selectedCause)
            .reduce((sum, d) => sum + Number(d.amount), 0);
          setCauseAmount(causeTotal);
        }
      }
    };

    fetchDonations();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          const newAmount = Number(payload.new.amount);
          const newCause = payload.new.cause;
          
          setCurrentAmount(prev => prev + newAmount);
          setTodayAmount(prev => prev + newAmount);
          setWeekAmount(prev => prev + newAmount);
          setRecentAmount(prev => prev + newAmount);
          
          if (selectedCause && newCause === selectedCause) {
            setCauseAmount(prev => prev + newAmount);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCause]);

  return (
    <section className="py-12 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs md:text-sm">Live Impact Tracker</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {selectedCause ? (
                <>
                  <span className="capitalize">{selectedCause}</span>{" "}
                  <span className="bg-gradient-secondary bg-clip-text text-transparent">Impact</span>
                </>
              ) : (
                <>
                  Community <span className="bg-gradient-secondary bg-clip-text text-transparent">Impact</span>
                </>
              )}
            </h2>
            <p className="text-foreground/70 text-sm md:text-base">
              Together we're making a real difference
            </p>
          </div>

          <div className="glass-card p-5 md:p-6 space-y-5">
            {selectedCause && (
              <div className="mb-5 p-3 glass border-l-4 border-accent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-4 w-4 text-accent" />
                    <span className="font-semibold capitalize text-sm">{selectedCause} Donations</span>
                  </div>
                  <span className="text-lg font-bold text-accent">
                    ${causeAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="h-5 w-5 text-highlight animate-glow" />
                <span className="text-base font-semibold">
                  {selectedCause ? "Global Total" : "Total Donations"}
                </span>
              </div>
              <span className="text-xl font-bold text-highlight">
                ${currentAmount.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-4" />
              <div className="flex justify-between text-sm text-foreground/60">
                <span>Current: ${currentAmount.toLocaleString()}</span>
                <span>Goal: ${goalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-primary mb-0.5">
                    ${(currentAmount / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-foreground/60">Total</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary mb-0.5">
                    ${weekAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground/60">This Week</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary mb-0.5">
                    ${todayAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground/60">Today</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary mb-0.5">
                    ${recentAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground/60">Recent</div>
                </div>
              </div>
            </div>

            {currentAmount >= 125000 && (
              <div className="glass p-3 border-l-4 border-accent animate-slide-in">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <div className="font-semibold mb-0.5 text-sm">Milestone Reached! 🎉</div>
                    <p className="text-xs text-foreground/70">
                      You've helped us reach the $125K milestone! Your support is changing lives.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
  </svg>
);

export default DonationBarometer;
