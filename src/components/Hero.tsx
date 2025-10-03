import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import kenzieMascot from "@/assets/kenzie-mascot.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <img 
              src={kenzieMascot} 
              alt="Kenzie Mascot" 
              className="h-32 w-32 animate-float"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-foreground/90">Welcome to Purpose-Driven Shopping</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Print <span className="bg-gradient-primary bg-clip-text text-transparent">Power</span>
            <br />
            Purpose
          </h1>

          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Shop premium products while making a difference. Every purchase supports causes that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity glow-primary group">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="glass border-white/20 hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "$125K+", label: "Total Donations" },
              { value: "2,500+", label: "Happy Customers" },
              { value: "15+", label: "Causes Supported" },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl font-bold text-highlight mb-2">{stat.value}</div>
                <div className="text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
