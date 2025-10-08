import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Kenzie = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-highlight mx-auto mb-6 animate-glow" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Meet Kenzie
            </h1>
            <p className="text-lg text-muted-foreground">
              Our mascot and inspiration for making a difference
            </p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <img 
              src="/src/assets/kenzie-mascot.png" 
              alt="Kenzie mascot" 
              className="w-64 h-64 mx-auto mb-8 object-contain"
            />
            <div className="space-y-6 text-foreground/90">
              <p className="text-lg leading-relaxed">
                Kenzie represents the heart of our mission - bringing joy, purpose, and positive change to communities around the world.
              </p>
              <p className="leading-relaxed">
                Every product you purchase helps support causes that Kenzie champions, from education to environmental conservation, making each purchase a step toward a better world.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Kenzie;
