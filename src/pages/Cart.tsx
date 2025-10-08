import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalDonation } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
              <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Add some products to get started with making a difference!
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-gradient-primary">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">
              Shopping <span className="bg-gradient-primary bg-clip-text text-transparent">Cart</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={`${item.id}-${item.size}`} className="glass-card overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              {item.size && (
                                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 glass-card px-3 py-2 rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-semibold w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-xs text-accent">
                                +${(item.donationAmount * item.quantity).toFixed(2)} donated
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="glass-card sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Order Summary</h2>
                    
                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-accent font-semibold">Total Donation</span>
                        <span className="text-accent font-semibold">
                          ${totalDonation.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Button className="w-full bg-gradient-primary text-lg h-12">
                        Proceed to Checkout
                      </Button>
                      <Link to="/products">
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>

                    <div className="glass-card p-4 rounded-lg mt-4">
                      <p className="text-sm text-center">
                        Your purchase includes{" "}
                        <span className="text-accent font-semibold">
                          ${totalDonation.toFixed(2)}
                        </span>{" "}
                        in donations to causes you care about! 💚
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
