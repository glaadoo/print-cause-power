import { ShoppingCart, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-primary shadow-lg border-b-2 border-accent/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Home className="h-6 w-6 text-primary-foreground transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-primary-foreground">
              Print Power Purpose
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/products" 
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Products
            </Link>
            <Link 
              to="/donations" 
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Donations
            </Link>
            <Link 
              to="/about" 
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              About
            </Link>
            <Link 
              to="/kenzie" 
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Kenzie
            </Link>
            <Link 
              to="/onboarding" 
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Onboarding
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10" asChild>
              <Link to="/auth">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
