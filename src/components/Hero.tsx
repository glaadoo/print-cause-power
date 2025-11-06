import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import kenzieMascot from "@/assets/kenzie-mascot.png";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-5">
            <img 
              src={kenzieMascot} 
              alt="Kenzie Mascot" 
              className="h-24 w-24 md:h-28 md:w-28 animate-float object-contain"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs md:text-sm text-foreground/90">Welcome to Purpose-Driven Shopping</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.15]">
            Print <span className="bg-gradient-primary bg-clip-text text-transparent">Power</span>
            <br />
            Purpose
          </h1>

          <p className="text-sm md:text-base text-foreground/80 mb-6 max-w-xl mx-auto leading-relaxed">
            Shop premium products while making a difference. Every purchase supports causes that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products">
              <Button size="default" className="bg-gradient-primary hover:opacity-90 transition-opacity glow-primary group h-11 text-sm">
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="default" variant="outline" className="glass border-white/20 hover:bg-white/10 h-11 text-sm">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "$125K+", label: "Total Donations" },
              { value: "2,500+", label: "Happy Customers" },
              { value: "15+", label: "Causes Supported" },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-4 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-2xl font-bold text-highlight mb-1">{stat.value}</div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
