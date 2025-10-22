import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { extractProductName } from "@/lib/extractProductName";

import cleanserImg from "@assets/Cleanser_1760341831448.png";
import tonerImg from "@assets/Toner_1760341831459.png";
import serumImg from "@assets/acid_1760944347974.png";
import hydratorImg from "@assets/hydra_1760944347978.png";
import moisturizerImg from "@assets/Moisturizer_1760341636653.png";
import spfImg from "@assets/SPF_1760341636654.png";
import spotTreatmentImg from "@assets/bpooo_1760944347978.png";
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

const categoryImages: Record<string, string> = {
  "Cleanser": cleanserImg,
  "Toner": tonerImg,
  "Serum": serumImg,
  "Hydrator": hydratorImg,
  "Moisturizer": moisturizerImg,
  "SPF": spfImg,
  "Treatment": spotTreatmentImg,
};

export function ProductCard({ product, isPremiumUser = false, routineId, currentProductSelections, onProductSelect, onExploreAlternatives, showExploreButton = false }: ProductCardProps) {
  const isLocked = product.isPremiumOnly && !isPremiumUser;
  // Always use category-based images, ignore any imageUrl from backend
  const productImage = categoryImages[product.category] || categoryImages["Serum"];
  
  // Check if this is the current product for this category
  const isCurrentProduct = currentProductSelections?.[product.category] === product.name;
  
  // Show alternatives section if we have alternatives AND not using explore button
  const showAlternativesSection = isPremiumUser && product.premiumOptions && product.premiumOptions.length > 0 && !showExploreButton;

  return (
    <Card className={`flex flex-col h-full group relative border-card-border hover-elevate transition-all ${isLocked ? "opacity-60" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Premium Only</p>
          </div>
        </div>
      )}
      
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center overflow-hidden p-8">
          {/* Category badge positioned at top-left on image */}
          <Badge 
            variant="outline" 
            className="absolute top-3 left-3 text-xs z-20 bg-background/95 backdrop-blur-sm w-fit" 
            data-testid={`badge-category-${product.category}`}
          >
            {product.category}
          </Badge>
          
          {/* Best for Your Skin badge positioned at top-right on image */}
          {product.isRecommended && (
            <img 
              src={bestForYourSkinBadge} 
              alt="Best for Your Skin" 
              className="absolute top-3 right-3 h-4 z-20"
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

        <div className="p-6 flex flex-col flex-1">
          <h3 
            className="font-serif text-lg font-semibold text-foreground leading-tight mb-2 h-[3.5rem]" 
            style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            data-testid={`text-product-name-${product.name.replace(/\s/g, '-')}`}
          >
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
          )}
          
          <p className="text-sm font-medium text-foreground mb-4" data-testid="text-price-range">
            {product.priceRange || `$${product.price}`}
          </p>
          
          {product.benefits && product.benefits.length > 0 && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {product.benefits[0]}
            </p>
          )}
          
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
                  className="w-full gap-2"
                  asChild
                  data-testid={`button-buy-now-${product.name.replace(/\s/g, '-')}`}
                >
                  <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
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
                
                {showAlternativesSection && (
                  <div className="pt-2 border-t space-y-3">
                    <p className="text-xs text-muted-foreground">Premium Alternatives:</p>
                    <div className="space-y-2">
                      {product.premiumOptions!.map((option, index) => {
                        const isCurrentOption = currentProductSelections?.[product.category] === option.productName;
                        return (
                          <div key={index} className="space-y-1">
                            <a 
                              href={option.affiliateLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-start gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <span className="flex-1">{option.productName}</span>
                              <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            </a>
                            {routineId && onProductSelect && !isCurrentOption && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-7"
                                onClick={() => onProductSelect(product.category, option.productName)}
                                data-testid={`button-set-current-alt-${index}`}
                              >
                                Set as Current
                              </Button>
                            )}
                            {isCurrentOption && (
                              <Badge variant="secondary" className="w-full justify-center text-xs">Current</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
