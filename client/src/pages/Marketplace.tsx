import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Crown, Lock, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import { ProductCard } from '@/components/ProductCard';
import type { Product as ProductCardType } from '@/components/ProductCard';
import { LoginModal } from '@/components/LoginModal';
import { trackMarketplaceVisit } from '@/lib/analytics';

interface SpecificProduct {
  specificProductName: string;
  brand: string;
  priceRange: string;
  productLink: string;
  affiliateLink: string;
  isDefault: boolean;
  isRecommended: boolean;
}

interface Product {
  id: string;
  generalName: string;
  category: 'Cleanser' | 'Toner' | 'Serum' | 'Hydrator' | 'Moisturizer' | 'SPF' | 'Treatment' | 'Tool';
  priceTier: 'budget' | 'standard' | 'premium';
  products?: SpecificProduct[];
}

interface MarketplaceData {
  products: Product[];
}

export default function Marketplace() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Track marketplace visit when page loads
  useEffect(() => {
    if (isAuthenticated) {
      trackMarketplaceVisit();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    window.location.reload(); // Reload to refresh auth state and marketplace data
  };

  const { data, isLoading, error } = useQuery<MarketplaceData>({
    queryKey: ['/api/marketplace'],
    enabled: isAuthenticated,
  });

  // Check if error is 403 (not premium)
  const isPremiumRequired = error && (error as any).message?.includes('403');
  const isNotAuthenticated = !authLoading && !isAuthenticated;

  // Extract all specific products with their parent product info
  const allProducts = useMemo(() => {
    if (!data?.products) return [];
    
    const items: Array<SpecificProduct & { 
      generalName: string; 
      category: string; 
      priceTier: string;
      productId: string;
    }> = [];
    
    data.products.forEach(product => {
      if (product.products && product.products.length > 0) {
        product.products.forEach(specific => {
          items.push({
            ...specific,
            generalName: product.generalName,
            category: product.category,
            priceTier: product.priceTier,
            productId: product.id,
          });
        });
      }
    });
    
    return items;
  }, [data]);

  // Extract unique values for filters
  const { categories, priceTiers, brands } = useMemo(() => {
    const categoriesSet = new Set<string>();
    const priceTiersSet = new Set<string>();
    const brandsSet = new Set<string>();

    allProducts.forEach(product => {
      categoriesSet.add(product.category);
      priceTiersSet.add(product.priceTier);
      brandsSet.add(product.brand);
    });

    return {
      categories: Array.from(categoriesSet).sort(),
      priceTiers: Array.from(priceTiersSet).sort(),
      brands: Array.from(brandsSet).sort(),
    };
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        product.specificProductName.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.generalName.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Price tier filter
      const matchesPriceTier = selectedPriceTier === 'all' || product.priceTier === selectedPriceTier;

      // Brand filter
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;

      return matchesSearch && matchesCategory && matchesPriceTier && matchesBrand;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedPriceTier, selectedBrand]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceTier('all');
    setSelectedBrand('all');
  };

  // Show login prompt for non-authenticated users
  if (isNotAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-12 md:py-16 bg-muted/30 border-b">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold">
                Acne-Safe Marketplace
              </h1>
              <p className="text-lg text-muted-foreground">
                Every product screened for 400+ acne-causing ingredients. Shop with confidence.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-3xl">
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-semibold">Sign In Required</h2>
                  <p className="text-muted-foreground">
                    Please sign in to access the acne-safe marketplace.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowLoginModal(true)}
                  className="rounded-full"
                  data-testid="button-login"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Show premium upgrade prompt for non-premium users
  if (isPremiumRequired) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-12 md:py-16 bg-muted/30 border-b">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold">
                Acne-Safe Marketplace
              </h1>
              <p className="text-lg text-muted-foreground">
                Every product screened for 400+ acne-causing ingredients. Shop with confidence.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-3xl">
            <Card className="border-primary/20 shadow-sm rounded-2xl">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-semibold">Premium Feature</h2>
                  <p className="text-muted-foreground">
                    The acne-safe marketplace is available exclusively to Premium members. Browse our curated collection of verified products, all screened for 400+ acne-causing ingredients.
                  </p>
                </div>
                <div className="space-y-4">
                  <Button
                    size="lg"
                    asChild
                    className="rounded-full"
                    data-testid="button-upgrade-premium"
                  >
                    <Link href="/pricing">
                      Upgrade to Premium
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Starting at $2.99/month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard">
              <img src={logoPath} alt="AcneAgent" className="h-8 cursor-pointer" data-testid="logo-link" />
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                data-testid="link-dashboard"
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => window.location.href = '/api/auth/logout'}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-primary" />
              <Badge variant="secondary" className="rounded-full">Premium</Badge>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold">
              Acne-Safe Marketplace
            </h1>
            <p className="text-lg text-muted-foreground">
              Every product screened for 400+ acne-causing ingredients. Shop with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, brands, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px]" data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriceTier} onValueChange={setSelectedPriceTier}>
                <SelectTrigger className="w-[160px]" data-testid="select-price">
                  <SelectValue placeholder="Price Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  {priceTiers.map(tier => (
                    <SelectItem key={tier} value={tier}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-[200px]" data-testid="select-brand">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                data-testid="button-reset"
              >
                Reset
              </Button>

              <div className="ml-auto text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="border-border shadow-sm rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No products found matching your filters.
              </p>
              <Button variant="outline" onClick={handleReset} data-testid="button-reset-empty">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                // Transform marketplace product data to ProductCard format
                const productCardData: ProductCardType = {
                  name: product.specificProductName,
                  brand: product.brand,
                  category: product.category,
                  price: 0, // Not used when priceRange is provided
                  priceTier: product.priceTier as "budget" | "standard" | "premium",
                  priceRange: product.priceRange,
                  benefits: [],
                  affiliateLink: product.affiliateLink,
                  originalLink: product.productLink,
                  isRecommended: product.isRecommended,
                };
                
                return (
                  <ProductCard
                    key={`${product.productId}-${index}`}
                    product={productCardData}
                    isPremiumUser={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <LoginModal 
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
