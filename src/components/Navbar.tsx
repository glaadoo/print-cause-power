import { ShoppingCart, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-highlight animate-glow" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Print Power Purpose
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-foreground/80 hover:text-foreground transition-colors">
              Products
            </Link>
            <Link to="/donations" className="text-foreground/80 hover:text-foreground transition-colors">
              Donations
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/onboarding" className="text-foreground/80 hover:text-foreground transition-colors">
              Onboarding
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-highlight text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
