import { Heart, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DonationBarometer = () => {
  const currentAmount = 125000;
  const goalAmount = 200000;
  const progress = (currentAmount / goalAmount) * 100;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm">Live Impact Tracker</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Community <span className="bg-gradient-secondary bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              Together we're making a real difference
            </p>
          </div>

          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-highlight animate-glow" />
                <span className="text-lg font-semibold">Total Donations</span>
              </div>
              <span className="text-2xl font-bold text-highlight">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: "This Month", value: "$12.5K" },
                  { label: "This Week", value: "$3.2K" },
                  { label: "Today", value: "$480" },
                  { label: "Recent", value: "$125" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-primary mb-1">{item.value}</div>
                    <div className="text-xs text-foreground/60">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {currentAmount >= 125000 && (
              <div className="glass p-4 border-l-4 border-accent animate-slide-in">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Milestone Reached! 🎉</div>
                    <p className="text-sm text-foreground/70">
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
