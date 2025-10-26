import { useState, useMemo } from 'react';
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
import { ExternalLink, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const { data, isLoading } = useQuery<MarketplaceData>({
    queryKey: ['/api/marketplace'],
  });

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

  // Category image mapping
  const getCategoryImage = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Cleanser': '🧴',
      'Toner': '💧',
      'Serum': '✨',
      'Hydrator': '💦',
      'Moisturizer': '🧴',
      'SPF': '☀️',
      'Treatment': '💊',
      'Tool': '🧊',
    };
    return categoryMap[category] || '🧴';
  };

  const getPriceTierBadge = (tier: string) => {
    const tierMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      'budget': { label: 'Budget', variant: 'secondary' },
      'standard': { label: 'Standard', variant: 'outline' },
      'premium': { label: 'Premium', variant: 'default' },
    };
    return tierMap[tier] || { label: tier, variant: 'outline' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                const tierBadge = getPriceTierBadge(product.priceTier);
                
                return (
                  <Card 
                    key={`${product.productId}-${index}`} 
                    className="border-border shadow-sm rounded-2xl hover-elevate"
                    data-testid={`card-product-${product.productId}-${index}`}
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Category Icon */}
                      <div className="flex justify-center">
                        <div className="text-6xl">
                          {getCategoryImage(product.category)}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="rounded-full text-xs">
                            {product.category}
                          </Badge>
                          <Badge variant={tierBadge.variant} className="rounded-full text-xs">
                            {tierBadge.label}
                          </Badge>
                        </div>

                        <h3 className="font-medium text-lg leading-tight">
                          {product.specificProductName}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {product.brand}
                        </p>

                        {product.priceRange && (
                          <p className="text-sm font-medium">
                            {product.priceRange}
                          </p>
                        )}

                        {product.isRecommended && (
                          <Badge variant="outline" className="rounded-full text-xs border-primary/50 bg-primary/5">
                            ⭐ Recommended
                          </Badge>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        asChild
                        className="w-full rounded-full"
                        data-testid={`button-shop-${product.productId}-${index}`}
                      >
                        <a 
                          href={product.affiliateLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Shop Now
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
