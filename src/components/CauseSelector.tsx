import { GraduationCap, Heart, Leaf, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const causes = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "Support educational programs and scholarships",
    raised: "$45,200",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Provide medical care to those in need",
    raised: "$38,500",
    color: "text-highlight",
  },
  {
    icon: Leaf,
    title: "Environment",
    description: "Protect our planet for future generations",
    raised: "$28,300",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Community",
    description: "Build stronger, more connected communities",
    raised: "$13,000",
    color: "text-secondary",
  },
];

const CauseSelector = () => {
  const navigate = useNavigate();

  const handleCauseClick = (cause: typeof causes[0]) => {
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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your <span className="bg-gradient-secondary bg-clip-text text-transparent">Cause</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Select a cause that resonates with you. Your purchases will help make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {causes.map((cause, index) => {
            const Icon = cause.icon;
            return (
              <Card 
                key={index}
                className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 group animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCauseClick(cause)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-2xl glass mb-4 ${cause.color} group-hover:animate-glow`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{cause.title}</h3>
                  <p className="text-foreground/70 text-sm mb-4">{cause.description}</p>
                  <div className="glass p-3 rounded-lg">
                    <div className="text-xs text-foreground/60 mb-1">Total Raised</div>
                    <div className={`text-lg font-bold ${cause.color}`}>{cause.raised}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CauseSelector;
