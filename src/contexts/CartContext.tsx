import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  donationAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalDonation: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === item.id && i.size === item.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        toast({
          title: "Updated cart",
          description: `${item.name} quantity increased`,
        });
        return updated;
      }

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      });
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number, size?: string) => {
    setItems(prev => prev.filter(item => 
      !(item.id === id && item.size === size)
    ));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (id: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDonation = items.reduce((sum, item) => sum + (item.donationAmount * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalItems,
        totalPrice,
        totalDonation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
