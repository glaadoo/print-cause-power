import { ShoppingCart, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountMenu } from "@/components/AccountMenu";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { totalItems } = useCart();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeOrderCount, setActiveOrderCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch notification count
    const fetchNotificationCount = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("read_at", null);

      setNotificationCount(count || 0);
    };

    // Fetch active orders count
    const fetchActiveOrders = async () => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("status", ["processing", "shipped"]);

      setActiveOrderCount(count || 0);
    };

    fetchNotificationCount();
    fetchActiveOrders();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAccountClick = () => {
    if (!user) {
      setShowAuthModal(true);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-primary shadow-lg border-b-2 border-accent/20 transition-transform duration-200 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Home className="h-6 w-6 text-primary-foreground transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-primary-foreground">Print Power Purpose</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Products
            </Link>
            <Link
              to="/causes"
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Causes
            </Link>
            <Link
              to="/dashboard"
              className="relative text-base font-medium text-primary-foreground/90 hover:text-primary-foreground hover:underline hover:scale-105 transition-all duration-200 pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full"
            >
              Analytics
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
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
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
            {user ? (
              <AccountMenu user={user} notificationCount={notificationCount} activeOrderCount={activeOrderCount} />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/10"
                onClick={handleAccountClick}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>Please sign in or create an account to access your account features.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              onClick={() => {
                setShowAuthModal(false);
                navigate("/auth");
              }}
            >
              Sign In / Create Account
            </Button>
            <Button variant="outline" onClick={() => setShowAuthModal(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
