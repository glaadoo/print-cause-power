import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Kenzie from "./pages/Kenzie";
import Donations from "./pages/Donations";
import Account from "./pages/Account";
import AccountOrders from "./pages/AccountOrders";
import AccountInfo from "./pages/AccountInfo";
import AccountNotifications from "./pages/AccountNotifications";
import AccountNotifyMe from "./pages/AccountNotifyMe";
import AccountGiftCards from "./pages/AccountGiftCards";
import AccountDonations from "./pages/AccountDonations";
import AccountImpact from "./pages/AccountImpact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/kenzie" element={<Kenzie />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/orders" element={<AccountOrders />} />
              <Route path="/account/info" element={<AccountInfo />} />
              <Route path="/account/notifications" element={<AccountNotifications />} />
              <Route path="/account/notify-me" element={<AccountNotifyMe />} />
              <Route path="/account/gift-cards" element={<AccountGiftCards />} />
              <Route path="/account/donations" element={<AccountDonations />} />
              <Route path="/account/impact" element={<AccountImpact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
