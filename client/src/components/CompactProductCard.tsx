import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

import cleanserImg from "@assets/Cleanser_1760341831448.png";
import tonerImg from "@assets/Toner_1760341831459.png";
import serumImg from "@assets/acid_1760944347974.png";
import hydratorImg from "@assets/hydra_1760944347978.png";
import moisturizerImg from "@assets/Moisturizer_1760341636653.png";
import spfImg from "@assets/SPF_1760341636654.png";
import spotTreatmentImg from "@assets/bpooo_1760944347978.png";
import iceGlobesImg from "@assets/ciice_1760874110365.png";
import bestForYourSkinBadge from "@assets/bestforyourskin_1761112317047.png";

export interface CompactProduct {
  name: string;
  category: string;
  priceTier: "budget" | "standard" | "premium";
  priceRange?: string;
  affiliateLink: string;
  isRecommended?: boolean;
}

interface CompactProductCardProps {
  product: CompactProduct;
  description?: string;
}

const categoryImages: Record<string, string> = {
  "Cleanser": cleanserImg,
  "Toner": tonerImg,
  "Serum": serumImg,
  "Hydrator": hydratorImg,
  "Moisturizer": moisturizerImg,
  "SPF": spfImg,
  "Treatment": spotTreatmentImg,
  "Tool": iceGlobesImg,
};

export function CompactProductCard({ product, description }: CompactProductCardProps) {
  const productImage = categoryImages[product.category] || categoryImages["Serum"];

  return (
    <Card className="border-card-border hover-elevate transition-all" data-testid="card-compact-product">
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
            <img 
              src={productImage} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain drop-shadow-md"
            />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              {product.isRecommended && (
                <img 
                  src={bestForYourSkinBadge} 
                  alt="Best for Your Skin" 
                  className="h-5 mb-1"
                  data-testid="img-best-for-your-skin"
                />
              )}
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs" data-testid="badge-category">
                  {product.category}
                </Badge>
                <Badge variant="secondary" className="text-xs" data-testid="badge-tier">
                  {product.priceTier === 'budget' ? 'Budget' : product.priceTier === 'premium' ? 'Luxury' : 'Midrange'}
                </Badge>
              </div>
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
