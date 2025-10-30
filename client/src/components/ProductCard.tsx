import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { extractProductName } from "@/lib/extractProductName";
import { trackAffiliateClick } from "@/lib/analytics";
import { getProductImage } from "@/lib/productImages";
import bestForYourSkinBadge from "@assets/bestforyourskin_1761112317047.png";

export interface Product {
  name: string;
  brand: string;
  category: string;
  price: number;
  priceTier: "budget" | "standard" | "premium";
  priceRange?: string; // Optional price range to display (e.g., "$10-$15")
  benefits: string[];
  affiliateLink: string; // Affiliate link for shop/buy CTA (falls back to original if no affiliate)
  originalLink?: string; // Original product link (for reference)
  imageUrl?: string;
  isPremiumOnly?: boolean;
  isRecommended?: boolean; // True if this is the recommended product for premium users
  sku?: string; // Product SKU for image mapping
  premiumOptions?: Array<{
    originalLink: string;
    affiliateLink: string;
    productName: string;
    priceRange?: string;
    isRecommended?: boolean;
    isCurrent?: boolean;
  }>; // ALL product variants (not just alternatives) with isCurrent flag for user selection
}

interface ProductCardProps {
  product: Product;
  isPremiumUser?: boolean;
  routineId?: string;
  currentProductSelections?: Record<string, string>;
  onProductSelect?: (category: string, productName: string) => void;
  onExploreAlternatives?: () => void;
  showExploreButton?: boolean;
}

export function ProductCard({ product, isPremiumUser = false, routineId, currentProductSelections, onProductSelect, onExploreAlternatives, showExploreButton = false }: ProductCardProps) {
  const isLocked = product.isPremiumOnly && !isPremiumUser;
  // Use SKU-based image if available, otherwise fallback to category image
  const productImage = getProductImage(product.sku, product.category);
  
  // Check if this is the current product for this category
  const isCurrentProduct = currentProductSelections?.[product.category] === product.name;
  
  // Show alternatives section if we have alternatives AND not using explore button
  const showAlternativesSection = isPremiumUser && product.premiumOptions && product.premiumOptions.length > 0 && !showExploreButton;

  // Track affiliate link clicks
  const handleAffiliateClick = () => {
    trackAffiliateClick({
      category: product.category,
      productName: product.name,
      brand: product.brand,
      link: product.affiliateLink,
      isRecommended: product.isRecommended
    });
  };

  return (
    <Card className={`flex flex-col h-full w-full group relative border-card-border hover-elevate transition-all ${isLocked ? "opacity-60" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-normal">Premium Only</p>
          </div>
        </div>
      )}
      
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative w-full aspect-square bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center overflow-hidden p-4 flex-shrink-0">
          {/* Best for Your Skin badge positioned at top center on image */}
          {product.isRecommended && (
            <img 
              src={bestForYourSkinBadge} 
              alt="Best for Your Skin" 
              className="absolute top-3 left-1/2 -translate-x-1/2 h-4 z-20"
              data-testid="img-best-for-your-skin"
            />
          )}
          
          <div className="w-32 h-32 flex items-center justify-center">
            <img 
              src={productImage} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col flex-1">
          <Badge 
            variant="outline" 
            className="w-fit mb-3" 
            data-testid={`badge-category-${product.category}`}
          >
            {product.category}
          </Badge>
          
          <p className="text-xs text-muted-foreground mb-2" data-testid={`text-brand-${product.brand.replace(/\s/g, '-')}`}>
            {product.brand}
          </p>
          
          <h3 
            className="font-serif text-base md:text-lg font-normal text-foreground leading-tight mb-3 min-h-[3.5rem]" 
            style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word'
            }}
            data-testid={`text-product-name-${product.name.replace(/\s/g, '-')}`}
          >
            {product.name}
          </h3>
          
          <p className="text-sm font-normal text-foreground mb-4" data-testid="text-price-range">
            {product.priceRange || `$${product.price}`}
          </p>
          
          <div className="flex-1"></div>
          
          <div className="space-y-3">
            {isLocked ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-muted-foreground no-default-hover-elevate"
                disabled
                data-testid={`button-view-product-${product.name.replace(/\s/g, '-')}`}
              >
                <span className="flex items-center gap-1 text-sm">
                  Unlock with Premium
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  className="w-full gap-1"
                  asChild
                  data-testid={`button-buy-now-${product.name.replace(/\s/g, '-')}`}
                >
                  <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" onClick={handleAffiliateClick}>
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>

                {showExploreButton && onExploreAlternatives && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1"
                    onClick={onExploreAlternatives}
                    data-testid={`button-explore-alternatives-${product.name.replace(/\s/g, '-')}`}
                  >
                    Explore Alternatives
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
