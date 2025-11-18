import { useEffect, useState } from "react";
import { GraduationCap, Heart, Leaf, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const causeConfig = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "Support educational programs and scholarships",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Provide medical care to those in need",
    color: "text-highlight",
  },
  {
    icon: Leaf,
    title: "Environment",
    description: "Protect our planet for future generations",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Community",
    description: "Build stronger, more connected communities",
    color: "text-secondary",
  },
];

const CauseSelector = () => {
  const navigate = useNavigate();
  const [causeTotals, setCauseTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCauseTotals = async () => {
      const { data } = await supabase
        .from('donations')
        .select('cause, amount');

      if (data) {
        const totals: Record<string, number> = {};
        data.forEach(d => {
          const cause = d.cause;
          totals[cause] = (totals[cause] || 0) + Number(d.amount);
        });
        setCauseTotals(totals);
      }
    };

    fetchCauseTotals();

    const channel = supabase
      .channel('cause-selector-updates')
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
          setCauseTotals(prev => ({
            ...prev,
            [newCause]: (prev[newCause] || 0) + newAmount
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCauseClick = (cause: typeof causeConfig[0]) => {
    navigate('/donations', { 
      state: { 
        selectedCause: cause.title.toLowerCase(),
        causeDetails: {
          title: cause.title,
          description: cause.description
        }
      } 
    });
  };

  return (
    <section className="py-12 md:py-14">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Choose Your <span className="bg-gradient-secondary bg-clip-text text-transparent">Cause</span>
          </h2>
          <p className="text-foreground/70 text-sm md:text-base max-w-2xl mx-auto">
            Select a cause that resonates with you. Your purchases will help make a difference.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="flex-shrink-0">All Causes</TabsTrigger>
            {causeConfig.map((cause) => (
              <TabsTrigger key={cause.title} value={cause.title.toLowerCase()} className="flex-shrink-0">
                {cause.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {causeConfig.map((cause, index) => {
                const Icon = cause.icon;
                const causeName = cause.title.toLowerCase();
                const total = causeTotals[causeName] || 0;
                
                return (
                  <Card 
                    key={index}
                    className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 group animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleCauseClick(cause)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex p-3 rounded-2xl glass mb-3 ${cause.color} group-hover:animate-glow`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1.5">{cause.title}</h3>
                      <p className="text-foreground/70 text-xs mb-3 line-clamp-2">{cause.description}</p>
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-xs text-foreground/60 mb-0.5">Total Raised</p>
                        <p className="text-xl font-bold text-primary">${total.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {causeConfig.map((cause, index) => {
            const Icon = cause.icon;
            const causeName = cause.title.toLowerCase();
            const total = causeTotals[causeName] || 0;
            
            return (
              <TabsContent key={cause.title} value={causeName} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card 
                    className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 group animate-slide-in"
                    onClick={() => handleCauseClick(cause)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex p-3 rounded-2xl glass mb-3 ${cause.color} group-hover:animate-glow`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1.5">{cause.title}</h3>
                      <p className="text-foreground/70 text-xs mb-3 line-clamp-2">{cause.description}</p>
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-xs text-foreground/60 mb-0.5">Total Raised</p>
                        <p className="text-xl font-bold text-primary">${total.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default CauseSelector;
