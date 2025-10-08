import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Custom Print T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Apparel",
    donationAmount: 5,
  },
  {
    id: 2,
    name: "Branded Mug Set",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    category: "Drinkware",
    donationAmount: 3,
  },
  {
    id: 3,
    name: "Eco Tote Bag",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
    category: "Accessories",
    donationAmount: 4,
  },
  {
    id: 4,
    name: "Custom Notebook",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop",
    category: "Stationery",
    donationAmount: 2,
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Every purchase includes a donation to causes you care about
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card 
              key={product.id} 
              className="glass-card overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative overflow-hidden aspect-square cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 glass-card px-2 py-1 text-xs font-semibold">
                    ${product.donationAmount} donated
                  </div>
                </div>
              </Link>
              
              <CardContent className="p-4">
                <div className="text-xs text-accent font-semibold mb-2">{product.category}</div>
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 gap-2">
                <Button className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="ghost" size="icon" className="glass hover:bg-white/10">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products">
            <Button size="lg" variant="outline" className="glass border-white/20 hover:bg-white/10">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
