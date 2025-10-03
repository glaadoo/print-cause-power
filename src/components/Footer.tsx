import { Heart, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-highlight" />
              <span className="font-bold text-lg">Print Power Purpose</span>
            </div>
            <p className="text-foreground/70 text-sm">
              Shopping with purpose. Every purchase makes a difference.
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="icon" className="glass hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass hover:bg-white/10">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass hover:bg-white/10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=apparel" className="hover:text-foreground transition-colors">Apparel</Link></li>
              <li><Link to="/products?category=promo" className="hover:text-foreground transition-colors">Promo Items</Link></li>
              <li><Link to="/products?category=print" className="hover:text-foreground transition-colors">Print on Demand</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link to="/donations" className="hover:text-foreground transition-colors">Make a Donation</Link></li>
              <li><Link to="/causes" className="hover:text-foreground transition-colors">Our Causes</Link></li>
              <li><Link to="/impact" className="hover:text-foreground transition-colors">Impact Stories</Link></li>
              <li><Link to="/partners" className="hover:text-foreground transition-colors">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} Print Power Purpose. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
