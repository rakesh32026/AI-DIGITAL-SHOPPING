import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, ShoppingCart, Tag, AlertCircle } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import RuvaChatbot from '@/components/RuvaChatbot';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  size: string;
}

interface MeasurementData {
  height: string;
  chest: string;
  waist: string;
  hips: string;
  shoulders: string;
  inseam: string;
  size: string;
  photo?: string;
}

const MEASUREMENTS_KEY = 'fitai_measurements';
const WISHLIST_KEY = 'fitai_wishlist';
const CART_KEY = 'fitai_cart';

interface RecommendedProductWithGender extends RecommendedProduct {
  gender: 'men' | 'women' | 'unisex';
}

const USER_GENDER_KEY = 'fitai_user_gender';

const allRecommendations: RecommendedProductWithGender[] = [
  // Men's Recommendations
  {
    id: 'rec-m1',
    name: 'Classic Oxford Shirt',
    brand: 'Raymond',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    category: 'Shirts',
    size: 'M',
    gender: 'men',
  },
  {
    id: 'rec-m2',
    name: 'Premium Leather Jacket',
    brand: 'Urban Edge',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    category: 'Jackets',
    size: 'L',
    gender: 'men',
  },
  {
    id: 'rec-m3',
    name: 'Tailored Slim Chinos',
    brand: 'Levis',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop',
    category: 'Pants',
    size: '32',
    gender: 'men',
  },
  {
    id: 'rec-m4',
    name: 'Casual Linen Blazer',
    brand: 'Van Heusen',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
    category: 'Jackets',
    size: 'M',
    gender: 'men',
  },
  {
    id: 'rec-m5',
    name: 'Cotton Kurta',
    brand: 'FabIndia',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    category: 'Ethnic',
    size: 'M',
    gender: 'men',
  },
  // Women's Recommendations
  {
    id: 'rec-w1',
    name: 'Elegant Red Dress',
    brand: 'Zara',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    category: 'Dresses',
    size: 'M',
    gender: 'women',
  },
  {
    id: 'rec-w2',
    name: 'Floral Summer Dress',
    brand: 'H&M',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
    category: 'Dresses',
    size: 'S',
    gender: 'women',
  },
  {
    id: 'rec-w3',
    name: 'Silk Saree',
    brand: 'FabIndia',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
    category: 'Ethnic',
    size: 'Free Size',
    gender: 'women',
  },
  {
    id: 'rec-w4',
    name: 'Anarkali Kurta Set',
    brand: 'Biba',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop',
    category: 'Ethnic',
    size: 'M',
    gender: 'women',
  },
  {
    id: 'rec-w5',
    name: 'High Waist Jeans',
    brand: 'Levis',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
    category: 'Pants',
    size: '28',
    gender: 'women',
  },
];

const categoryColors: Record<string, string> = {
  Shirts: 'bg-primary',
  Dresses: 'bg-pink-500',
  Jackets: 'bg-orange-500',
  Pants: 'bg-accent-green',
};

const Recommendations: React.FC = () => {
  const { toast } = useToast();
  const [userMeasurements, setUserMeasurements] = useState<MeasurementData | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');

  useEffect(() => {
    // Load measurements
    const savedMeasurements = localStorage.getItem(MEASUREMENTS_KEY);
    if (savedMeasurements) {
      try {
        const measurements = JSON.parse(savedMeasurements);
        if (measurements.length > 0) {
          setUserMeasurements(measurements[0]);
        }
      } catch (e) {
        console.error('Failed to parse measurements:', e);
      }
    }

    // Load gender preference
    const savedGender = localStorage.getItem(USER_GENDER_KEY);
    if (savedGender) {
      setSelectedGender(savedGender as 'men' | 'women');
    }

    // Load wishlist IDs
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        setWishlistIds(wishlist.map((item: any) => item.id));
      } catch (e) {
        console.error('Failed to parse wishlist:', e);
      }
    }
  }, []);

  const handleGenderChange = (gender: 'men' | 'women') => {
    setSelectedGender(gender);
    localStorage.setItem(USER_GENDER_KEY, gender);
  };

  const addToWishlist = (product: RecommendedProduct) => {
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    const existingIndex = wishlist.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      setWishlistIds(prev => prev.filter(id => id !== product.id));
      toast({ title: 'Removed from wishlist' });
    } else {
      wishlist.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: userMeasurements?.size || product.size,
      });
      setWishlistIds(prev => [...prev, product.id]);
      toast({ title: `${product.name} added to wishlist` });
    }
    
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  };

  const addToCart = (product: RecommendedProduct) => {
    const savedCart = localStorage.getItem(CART_KEY);
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: userMeasurements?.size || product.size,
        quantity: 1,
      });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    toast({ title: `${product.name} added to cart` });
  };

  // Filter recommendations based on user's gender and size
  const filteredByGender = allRecommendations.filter(
    product => product.gender === selectedGender || product.gender === 'unisex'
  );
  
  const personalizedRecommendations = userMeasurements
    ? filteredByGender.map(product => ({
        ...product,
        size: userMeasurements.size,
      }))
    : filteredByGender;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Personalized Recommendations</h1>
          </div>
          <p className="text-muted-foreground">
            Products curated based on your body measurements
          </p>
        </div>

        {/* Measurements Card or Prompt */}
        {userMeasurements ? (
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-40 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {userMeasurements.photo ? (
                  <img 
                    src={userMeasurements.photo} 
                    alt="Your measurement" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Your Measurements
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'height', value: userMeasurements.height },
                    { key: 'chest', value: userMeasurements.chest },
                    { key: 'waist', value: userMeasurements.waist },
                    { key: 'hips', value: userMeasurements.hips },
                    { key: 'shoulders', value: userMeasurements.shoulders },
                    { key: 'inseam', value: userMeasurements.inseam },
                  ].map((item) => (
                    <div key={item.key} className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground capitalize">{item.key}</p>
                      <p className="font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                    Recommended Size: {userMeasurements.size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 mb-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Measurements Yet</h3>
            <p className="text-muted-foreground mb-4">
              Take a measurement to get personalized size recommendations
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Take Measurement
            </Link>
          </div>
        )}

        {/* Gender Selector */}
        <div className="flex gap-2 mb-6">
          {(['men', 'women'] as const).map(gender => (
            <button
              key={gender}
              onClick={() => handleGenderChange(gender)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                selectedGender === gender
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {gender === 'men' ? "Men's Collection" : "Women's Collection"}
            </button>
          ))}
        </div>

        {/* Recommendations Title */}
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Recommended for You ({selectedGender === 'men' ? "Men's" : "Women's"})
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalizedRecommendations.map((product) => (
            <div 
              key={product.id} 
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white ${categoryColors[product.category] || 'bg-primary'}`}>
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="px-2 py-1 rounded bg-muted text-xs font-medium text-foreground">
                    Size: {product.size}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToWishlist(product)}
                    className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <RuvaChatbot />
    </div>
  );
};

export default Recommendations;
