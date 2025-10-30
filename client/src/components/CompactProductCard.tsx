import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { getProductImage } from "@/lib/productImages";
import bestForYourSkinBadge from "@assets/bestforyourskin_1761112317047.png";

export interface CompactProduct {
  name: string;
  brand: string;
  category: string;
  priceTier: "budget" | "standard" | "premium";
  priceRange?: string;
  affiliateLink: string;
  isRecommended?: boolean;
  sku?: string; // Product SKU for image mapping
}

interface CompactProductCardProps {
  product: CompactProduct;
  description?: string;
}

export function CompactProductCard({ product, description }: CompactProductCardProps) {
  // Use SKU-based image if available, otherwise fallback to category image
  const productImage = getProductImage(product.sku, product.category);

  return (
    <Card className="relative border-card-border hover-elevate transition-all" data-testid="card-compact-product">
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
            {/* Category badge positioned at top-left on image */}
            <Badge 
              variant="outline" 
              className="absolute top-1 left-1 text-xs z-20 bg-background/95 backdrop-blur-sm w-fit" 
              data-testid="badge-category"
            >
              {product.category}
            </Badge>
            
            {/* Best for Your Skin badge positioned at top-right on image */}
            {product.isRecommended && (
              <img 
                src={bestForYourSkinBadge} 
                alt="Best for Your Skin" 
                className="absolute top-1 right-1 h-3 z-20"
                data-testid="img-best-for-your-skin"
              />
            )}
            
            <img 
              src={productImage} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain drop-shadow-md"
            />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs" data-testid="badge-tier">
                  {product.priceTier === 'budget' ? 'Budget' : product.priceTier === 'premium' ? 'Luxury' : 'Midrange'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1" data-testid="text-brand">
                {product.brand}
              </p>
              <h4 className="font-serif text-base font-semibold text-foreground truncate" data-testid="text-product-name">
                {product.name}
              </h4>
              {product.priceRange && (
                <p className="text-sm font-medium text-foreground" data-testid="text-price">
                  {product.priceRange}
                </p>
              )}
            </div>
            
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
            
            <Button
              size="sm"
              variant="default"
              className="gap-1 mt-2"
              onClick={() => window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')}
              data-testid="button-shop"
            >
              Shop Now
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
