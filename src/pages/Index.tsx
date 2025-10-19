import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CauseSelector from "@/components/CauseSelector";
import CausesDashboard from "@/components/CausesDashboard";
import DonationBarometer from "@/components/DonationBarometer";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CauseSelector />
      <CausesDashboard />
      <ProductShowcase />
      <DonationBarometer />
      <Footer />
    </div>
  );
};

export default Index;
