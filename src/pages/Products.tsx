import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, Check } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import RuvaChatbot from '@/components/RuvaChatbot';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  gender: 'men' | 'women' | 'unisex';
}

interface MeasurementData {
  size: string;
  gender?: string;
}

const WISHLIST_KEY = 'fitai_wishlist';
const CART_KEY = 'fitai_cart';
const MEASUREMENTS_KEY = 'fitai_measurements';
const USER_GENDER_KEY = 'fitai_user_gender';

const mockProducts: Product[] = [
  // Men's Products
  { id: 'm1', name: 'Classic Fit T-Shirt', brand: 'Nike', price: 2499, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', category: 'Tops', sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviews: 128, inStock: true, gender: 'men' },
  { id: 'm2', name: 'Slim Fit Jeans', brand: 'Levis', price: 4999, originalPrice: 6999, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop', category: 'Bottoms', sizes: ['28', '30', '32', '34'], rating: 4.8, reviews: 256, inStock: true, gender: 'men' },
  { id: 'm3', name: 'Casual Hoodie', brand: 'Adidas', price: 3999, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', category: 'Tops', sizes: ['S', 'M', 'L'], rating: 4.3, reviews: 89, inStock: true, gender: 'men' },
  { id: 'm4', name: 'Chino Pants', brand: 'Gap', price: 3499, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop', category: 'Bottoms', sizes: ['30', '32', '34'], rating: 4.6, reviews: 167, inStock: false, gender: 'men' },
  { id: 'm5', name: 'Polo Shirt', brand: 'Ralph Lauren', price: 5999, image: 'https://images.unsplash.com/photo-1625910513413-5fc5f3ef0a5e?w=400&h=500&fit=crop', category: 'Tops', sizes: ['M', 'L', 'XL'], rating: 4.7, reviews: 203, inStock: true, gender: 'men' },
  { id: 'm6', name: 'Sports Jacket', brand: 'Under Armour', price: 8999, originalPrice: 11999, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop', category: 'Outerwear', sizes: ['S', 'M', 'L'], rating: 4.4, reviews: 74, inStock: true, gender: 'men' },
  { id: 'm7', name: 'Denim Jacket', brand: 'Levis', price: 7999, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop', category: 'Outerwear', sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviews: 142, inStock: true, gender: 'men' },
  { id: 'm8', name: 'Running Shorts', brand: 'Nike', price: 2299, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop', category: 'Bottoms', sizes: ['S', 'M', 'L'], rating: 4.2, reviews: 98, inStock: true, gender: 'men' },
  { id: 'm9', name: 'Formal Blazer', brand: 'Raymond', price: 12999, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop', category: 'Outerwear', sizes: ['38', '40', '42'], rating: 4.8, reviews: 312, inStock: true, gender: 'men' },
  { id: 'm10', name: 'Cotton Kurta', brand: 'FabIndia', price: 1999, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', category: 'Ethnic', sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviews: 178, inStock: true, gender: 'men' },
  
  // Women's Products
  { id: 'w1', name: 'Floral Summer Dress', brand: 'Zara', price: 4999, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop', category: 'Dresses', sizes: ['XS', 'S', 'M', 'L'], rating: 4.7, reviews: 234, inStock: true, gender: 'women' },
  { id: 'w2', name: 'Elegant Red Dress', brand: 'H&M', price: 5999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', category: 'Dresses', sizes: ['S', 'M', 'L'], rating: 4.8, reviews: 189, inStock: true, gender: 'women' },
  { id: 'w3', name: 'Casual Blouse', brand: 'Mango', price: 2499, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop', category: 'Tops', sizes: ['XS', 'S', 'M', 'L'], rating: 4.4, reviews: 156, inStock: true, gender: 'women' },
  { id: 'w4', name: 'High Waist Jeans', brand: 'Levis', price: 4499, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop', category: 'Bottoms', sizes: ['26', '28', '30', '32'], rating: 4.6, reviews: 298, inStock: true, gender: 'women' },
  { id: 'w5', name: 'Silk Saree', brand: 'FabIndia', price: 8999, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop', category: 'Ethnic', sizes: ['Free Size'], rating: 4.9, reviews: 423, inStock: true, gender: 'women' },
  { id: 'w6', name: 'Anarkali Kurta Set', brand: 'Biba', price: 3999, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop', category: 'Ethnic', sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviews: 267, inStock: true, gender: 'women' },
  { id: 'w7', name: 'Pencil Skirt', brand: 'Van Heusen', price: 2999, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aeae?w=400&h=500&fit=crop', category: 'Bottoms', sizes: ['S', 'M', 'L'], rating: 4.3, reviews: 87, inStock: true, gender: 'women' },
  { id: 'w8', name: 'Crop Top', brand: 'Forever 21', price: 1499, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=500&fit=crop', category: 'Tops', sizes: ['XS', 'S', 'M'], rating: 4.2, reviews: 134, inStock: true, gender: 'women' },
  { id: 'w9', name: 'Lehenga Choli', brand: 'Meena Bazaar', price: 15999, image: 'https://images.unsplash.com/photo-1583391733975-e7837b6c8c0c?w=400&h=500&fit=crop', category: 'Ethnic', sizes: ['S', 'M', 'L'], rating: 4.8, reviews: 198, inStock: true, gender: 'women' },
  { id: 'w10', name: 'Casual Jumpsuit', brand: 'Only', price: 3499, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=500&fit=crop', category: 'Dresses', sizes: ['S', 'M', 'L'], rating: 4.5, reviews: 112, inStock: false, gender: 'women' },
];

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Ethnic', 'Accessories'];
const priceRanges = ['All', 'Under ₹2000', '₹2000 - ₹5000', '₹5000 - ₹10000', 'Over ₹10000'];
const brands = ['All', 'Nike', 'Levis', 'Adidas', 'Zara', 'H&M', 'FabIndia', 'Raymond'];

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [userSize, setUserSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // Load user's recommended size and gender from measurements
  useEffect(() => {
    const savedMeasurements = localStorage.getItem(MEASUREMENTS_KEY);
    if (savedMeasurements) {
      try {
        const measurements = JSON.parse(savedMeasurements);
        if (measurements.length > 0 && measurements[0].size) {
          setUserSize(measurements[0].size);
        }
      } catch (e) {
        console.error('Failed to parse measurements:', e);
      }
    }

    // Load user gender preference
    const savedGender = localStorage.getItem(USER_GENDER_KEY);
    if (savedGender) {
      setSelectedGender(savedGender as 'men' | 'women');
    }

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

  // Save gender preference when changed
  const handleGenderChange = (gender: 'all' | 'men' | 'women') => {
    setSelectedGender(gender);
    if (gender !== 'all') {
      localStorage.setItem(USER_GENDER_KEY, gender);
    }
  };

  const filteredProducts = mockProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesGender = selectedGender === 'all' || product.gender === selectedGender || product.gender === 'unisex';
      
      let matchesPrice = true;
      if (selectedPriceRange === 'Under ₹2000') matchesPrice = product.price < 2000;
      else if (selectedPriceRange === '₹2000 - ₹5000') matchesPrice = product.price >= 2000 && product.price <= 5000;
      else if (selectedPriceRange === '₹5000 - ₹10000') matchesPrice = product.price > 5000 && product.price <= 10000;
      else if (selectedPriceRange === 'Over ₹10000') matchesPrice = product.price > 10000;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesGender;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return b.reviews - a.reviews;
      }
    });

  const toggleWishlist = (product: Product) => {
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    const existingIndex = wishlist.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      setWishlistIds(prev => prev.filter(id => id !== product.id));
      toast({ title: 'Removed from wishlist' });
    } else {
      const wishlistItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: userSize || product.sizes[0],
      };
      wishlist.push(wishlistItem);
      setWishlistIds(prev => [...prev, product.id]);
      toast({ title: 'Added to wishlist!' });
    }
    
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  };

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      toast({ title: 'Out of stock', variant: 'destructive' });
      return;
    }
    
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
        size: userSize || product.sizes[0],
        quantity: 1,
      });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    toast({ title: `${product.name} added to cart` });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            {userSize && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Check className="w-4 h-4 text-accent-green" />
                Your size: <span className="font-medium text-foreground">{userSize}</span>
              </p>
            )}
          </div>
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* View Toggle & Filter Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              <Filter className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Filters</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gender Selector */}
        <div className="flex gap-2 mb-4">
          {(['all', 'men', 'women'] as const).map(gender => (
            <button
              key={gender}
              onClick={() => handleGenderChange(gender)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                selectedGender === gender
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {gender === 'all' ? 'All' : gender === 'men' ? "Men's" : "Women's"}
            </button>
          ))}
        </div>

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="bg-card rounded-xl border border-border p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Brand Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Quick Category Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredProducts.length} products {selectedGender !== 'all' && `for ${selectedGender}`}
        </p>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative aspect-square bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-destructive text-primary-foreground text-xs font-medium rounded">
                      SALE
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                  {renderStars(product.rating)}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {userSize && product.sizes.includes(userSize) && (
                      <span className="text-xs text-accent-green flex items-center gap-1">
                        <Check className="w-3 h-3" /> Your size available
                      </span>
                    )}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 ml-auto"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div key={product.id} className={`flex gap-4 bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow ${!product.inStock ? 'opacity-60' : ''}`}>
                <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                  {product.originalPrice && (
                    <span className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-destructive text-primary-foreground text-xs font-medium rounded">
                      SALE
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                    </div>
                    {!product.inStock && (
                      <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  {renderStars(product.rating)}
                  <p className="text-sm text-muted-foreground mt-1">
                    Sizes: {product.sizes.join(', ')}
                    {userSize && product.sizes.includes(userSize) && (
                      <span className="ml-2 text-accent-green">• Your size available</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="block text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      <RuvaChatbot />
    </div>
  );
};

export default Products;
