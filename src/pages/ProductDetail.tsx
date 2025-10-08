import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const allProducts = [
  {
    id: 1,
    name: "Custom Print T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    category: "Apparel",
    donationAmount: 5,
    description: "Premium quality cotton t-shirt with custom print options. Perfect for events, teams, or personal expression.",
    features: [
      "100% premium cotton",
      "Custom design printing",
      "Available in multiple sizes",
      "Machine washable",
      "Eco-friendly inks"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "Branded Mug Set",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop",
    category: "Drinkware",
    donationAmount: 3,
    description: "Set of 2 ceramic mugs with your custom design. Perfect for home or office use.",
    features: [
      "Set of 2 ceramic mugs",
      "Dishwasher safe",
      "Microwave safe",
      "Custom design on both sides",
      "11oz capacity"
    ],
    sizes: ["Standard"],
  },
  {
    id: 3,
    name: "Eco Tote Bag",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop",
    category: "Accessories",
    donationAmount: 4,
    description: "Sustainable canvas tote bag perfect for daily use. Reduce plastic and look stylish.",
    features: [
      "100% organic cotton canvas",
      "Reinforced handles",
      "Large capacity",
      "Custom print options",
      "Machine washable"
    ],
    sizes: ["One Size"],
  },
  {
    id: 4,
    name: "Custom Notebook",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=800&fit=crop",
    category: "Stationery",
    donationAmount: 2,
    description: "A5 hardcover notebook with personalized cover design. Perfect for journaling or note-taking.",
    features: [
      "A5 hardcover format",
      "120 lined pages",
      "Premium paper quality",
      "Custom cover design",
      "Ribbon bookmark"
    ],
    sizes: ["A5"],
  },
  {
    id: 5,
    name: "Water Bottle",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop",
    category: "Drinkware",
    donationAmount: 3,
    description: "Insulated stainless steel water bottle. Keeps drinks cold for 24h or hot for 12h.",
    features: [
      "Double-wall insulation",
      "BPA-free materials",
      "Leak-proof lid",
      "Custom engraving options",
      "750ml capacity"
    ],
    sizes: ["750ml"],
  },
  {
    id: 6,
    name: "Phone Case",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop",
    category: "Accessories",
    donationAmount: 2,
    description: "Protective phone case with custom print design. Compatible with wireless charging.",
    features: [
      "Impact-resistant materials",
      "Custom design printing",
      "Wireless charging compatible",
      "Raised edges for screen protection",
      "Available for multiple phone models"
    ],
    sizes: ["iPhone", "Samsung", "Google Pixel"],
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const product = allProducts.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/products')}
            className="mb-8 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
            {/* Product Image */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <Badge className="w-fit mb-4 bg-accent/20 text-accent border-accent/30">
                {product.category}
              </Badge>
              
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                <div className="glass-card px-3 py-1 text-sm font-semibold">
                  ${product.donationAmount} donated per purchase
                </div>
              </div>

              <p className="text-foreground/80 text-lg mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Select Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? "bg-gradient-primary" : "glass border-border"}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <Card className="glass-card mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
                  disabled={!selectedSize}
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    donationAmount: product.donationAmount
                  })}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant={isWishlisted ? "default" : "outline"}
                  size="icon" 
                  className={isWishlisted ? "bg-gradient-primary" : "glass hover:bg-primary/10"}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              {!selectedSize && (
                <p className="text-sm text-muted-foreground mt-3">Please select a size</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
