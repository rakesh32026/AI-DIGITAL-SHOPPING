import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import RuvaChatbot from '@/components/RuvaChatbot';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: string;
}

const WISHLIST_KEY = 'fitai_wishlist';
const CART_KEY = 'fitai_cart';

const Wishlist: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Removed from wishlist' });
  };

  const addToCart = (item: WishlistItem) => {
    const savedCart = localStorage.getItem(CART_KEY);
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = cart.findIndex((c: any) => c.id === item.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    toast({ title: `${item.name} added to cart` });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Wishlist</h1>
            <p className="text-muted-foreground">{items.length} items saved</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding items you love!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden group">
                <div className="relative aspect-square bg-muted">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-destructive hover:text-primary-foreground transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Size: {item.size}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">${item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <RuvaChatbot />
    </div>
  );
};

export default Wishlist;
