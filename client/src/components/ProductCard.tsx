import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { extractProductName } from "@/lib/extractProductName";

import cleanserImg from "@assets/Cleanser_1760341831448.png";
import tonerImg from "@assets/Toner_1760341831459.png";
import serumImg from "@assets/serum_1760341636653.png";
import hydratorImg from "@assets/hydrator_1760341831459.png";
import moisturizerImg from "@assets/Moisturizer_1760341636653.png";
import spfImg from "@assets/SPF_1760341636654.png";
import spotTreatmentImg from "@assets/BPO_1760341850620.png";

export interface Product {
  name: string;
  brand: string;
  category: string;
  price: number;
  priceTier: "budget" | "standard" | "premium";
  benefits: string[];
  affiliateLink: string;
  imageUrl?: string;
  isPremiumOnly?: boolean;
  premiumOptions?: string[]; // Alternative product links for premium users
}

interface ProductCardProps {
  product: Product;
  isPremiumUser?: boolean;
}

const categoryImages: Record<string, string> = {
  "Cleanser": cleanserImg,
  "Toner": tonerImg,
  "Serum": serumImg,
  "Hydrator": hydratorImg,
  "Moisturizer": moisturizerImg,
  "SPF": spfImg,
  "Spot Treatment": spotTreatmentImg,
};

export function ProductCard({ product, isPremiumUser = false }: ProductCardProps) {
  const isLocked = product.isPremiumOnly && !isPremiumUser;
  // Always use category-based images, ignore any imageUrl from backend
  const productImage = categoryImages[product.category] || categoryImages["Serum"];

  return (
    <Card className={`group relative border-card-border hover-elevate transition-all ${isLocked ? "opacity-60" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Premium Only</p>
          </div>
        </div>
      )}
      
      <CardContent className="p-0">
        <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center overflow-hidden p-8">
          <img 
            src={productImage} 
            alt={product.name} 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        <div className="p-6 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <Badge variant="outline" className="text-xs mb-2" data-testid={`badge-category-${product.category}`}>
                  {product.category}
                </Badge>
                <h3 className="font-serif text-xl font-semibold text-foreground leading-tight" data-testid={`text-product-name-${product.name.replace(/\s/g, '-')}`}>
                  {product.name}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs whitespace-nowrap" data-testid={`badge-tier-${product.priceTier}`}>
                {product.priceTier === 'budget' ? 'Budget' : product.priceTier === 'premium' ? 'Luxury' : 'Midrange'}
              </Badge>
            </div>
            {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.benefits[0]}
          </p>
          
          <div className="pt-2 space-y-3">
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
                
                {isPremiumUser && product.premiumOptions && product.premiumOptions.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Premium Alternatives:</p>
                    <div className="space-y-1">
                      {product.premiumOptions.map((link, index) => {
                        const productName = extractProductName(link);
                        return (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start p-0 h-auto text-muted-foreground hover:text-foreground no-default-hover-elevate"
                            asChild
                            data-testid={`button-alternative-${index}`}
                          >
                            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs">
                              {productName}
                              <ArrowRight className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </Button>
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
