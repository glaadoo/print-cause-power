import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { z } from "zod";
import { requestPressmasterQuote } from "@/services/pressmaster.service";
import { PressmasterQuoteModal } from "@/components/PressmasterQuoteModal";

const shippingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  line1: z.string().trim().min(1, "Address is required").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(50),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(50),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalDonation, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPressmasterModal, setShowPressmasterModal] = useState(false);
  const [pressmasterQuote, setPressmasterQuote] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "debit_card" | "paypal" | "bank_transfer">("credit_card");
  
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    // Validate shipping info
    const validation = shippingSchema.safeParse(shippingInfo);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      toast({
        title: "Validation error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to complete your purchase",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: "pending",
          payment_method: paymentMethod,
          subtotal: totalPrice,
          total_donation: totalDonation,
          total: totalPrice + totalDonation,
          shipping_name: shippingInfo.name,
          shipping_line1: shippingInfo.line1,
          shipping_line2: shippingInfo.line2 || null,
          shipping_city: shippingInfo.city,
          shipping_state: shippingInfo.state,
          shipping_postal_code: shippingInfo.postalCode,
          shipping_country: shippingInfo.country,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        size: item.size || null,
        quantity: item.quantity,
        price: item.price,
        donation_amount: item.donationAmount,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Check for $777+ donation trigger
      const isCheckDrop = totalDonation >= 777;

      if (isCheckDrop) {
        try {
          // Trigger Pressmaster quote for check-drop
          const quote = await requestPressmasterQuote({
            project: 'Print Power Purpose',
            specs: 'Check-drop campaign assets',
            quantity: 1,
            donationId: order.id
          });

          setPressmasterQuote(quote);
          
          toast({
            title: "🎉 $777 Check Drop triggered!",
            description: `Pressmaster (${quote.mock ? 'Stub' : 'Live'}) quote ready.`,
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPressmasterModal(true)}
              >
                View Quote
              </Button>
            ),
          });
        } catch (error) {
          // Don't block the order flow
          console.warn('Pressmaster quote failed (non-blocking):', error);
          toast({
            title: "Note",
            description: "Order placed, but Pressmaster quote failed. We'll follow up.",
            variant: "default",
          });
        }
      }

      // Clear cart and show success
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: `Your order ${orderNumber} has been confirmed`,
      });

      // Navigate to a success page or home
      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>Add some items to your cart before checking out</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/products")} className="w-full">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>Enter your shipping address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      name="line1"
                      value={shippingInfo.line1}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      required
                    />
                    {errors.line1 && <p className="text-sm text-destructive mt-1">{errors.line1}</p>}
                  </div>

                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      name="line2"
                      value={shippingInfo.line2}
                      onChange={handleInputChange}
                      placeholder="Apt, Suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                      />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        required
                      />
                      {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                      />
                      {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode}</p>}
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        placeholder="US"
                        required
                      />
                      {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit_card" id="debit_card" />
                      <Label htmlFor="debit_card">Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order - $${(totalPrice + totalDonation).toFixed(2)}`
                )}
              </Button>
            </form>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} {item.size && `(${item.size})`} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Donation</span>
                    <span>${totalDonation.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${(totalPrice + totalDonation).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PressmasterQuoteModal
        open={showPressmasterModal}
        onOpenChange={setShowPressmasterModal}
        readOnly={true}
        existingQuote={pressmasterQuote}
      />
    </div>
  );
};

export default Checkout;
