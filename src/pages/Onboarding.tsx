import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Onboarding = () => {
  const steps = [
    {
      title: "Choose Your Cause",
      description: "Select from education, healthcare, environment, or community initiatives that resonate with your values."
    },
    {
      title: "Browse Products",
      description: "Explore our curated collection of premium products, each designed to support meaningful causes."
    },
    {
      title: "Make a Difference",
      description: "With every purchase, a portion goes directly to your chosen cause, creating real impact."
    },
    {
      title: "Track Your Impact",
      description: "See how your contributions are making a difference through our donation barometer and impact reports."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <BackButton className="mb-8" />
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Print Power Purpose
            </h1>
            <p className="text-xl text-foreground/70">
              Shop with purpose and make a lasting impact in just a few simple steps
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <Card key={index} className="glass-card border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-highlight/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-highlight" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;
