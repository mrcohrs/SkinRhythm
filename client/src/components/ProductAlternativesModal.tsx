import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Product } from "./ProductCard";

import cleanserImg from "@assets/Cleanser_1760341831448.png";
import tonerImg from "@assets/Toner_1760341831459.png";
import serumImg from "@assets/serum_1760341636653.png";
import hydratorImg from "@assets/hydrator_1760341831459.png";
import moisturizerImg from "@assets/Moisturizer_1760341636653.png";
import spfImg from "@assets/SPF_1760341636654.png";
import spotTreatmentImg from "@assets/BPO_1760341850620.png";

const categoryImages: Record<string, string> = {
  "Cleanser": cleanserImg,
  "Toner": tonerImg,
  "Serum": serumImg,
  "Hydrator": hydratorImg,
  "Moisturizer": moisturizerImg,
  "SPF": spfImg,
  "Spot Treatment": spotTreatmentImg,
};

interface ProductAlternativesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  currentProductName: string;
  onSetCurrent: (productName: string) => void;
  isPending?: boolean;
}

export function ProductAlternativesModal({
  open,
  onOpenChange,
  product,
  currentProductName,
  onSetCurrent,
  isPending = false,
}: ProductAlternativesModalProps) {
  const productImage = categoryImages[product.category] || categoryImages["Serum"];
  const isDefaultCurrent = currentProductName === product.name;

  // Build list of all products (current + alternatives)
  const allProducts = [
    {
      name: product.name,
      affiliateLink: product.affiliateLink,
      priceTier: product.priceTier,
      isCurrent: isDefaultCurrent,
    },
    ...(product.premiumOptions || []).map(opt => ({
      name: opt.productName,
      affiliateLink: opt.affiliateLink,
      priceTier: product.priceTier,
      isCurrent: currentProductName === opt.productName,
    })),
  ];

  // Sort so current product is first
  const sortedProducts = [...allProducts].sort((a, b) => {
    if (a.isCurrent) return -1;
    if (b.isCurrent) return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{product.category} Options</DialogTitle>
          <DialogDescription>
            Choose your preferred {product.category.toLowerCase()} product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {sortedProducts.map((option, index) => {
            const isCurrent = option.isCurrent;
            return (
              <div
                key={index}
                className={`flex flex-col gap-3 p-3 rounded-lg border ${
                  isCurrent ? "border-primary/50 bg-primary/5" : ""
                }`}
                data-testid={`alternative-option-${index}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
                    <img src={productImage} alt={product.category} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight mb-1" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    }}>{option.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {option.priceTier === 'budget' ? 'Budget' : option.priceTier === 'premium' ? 'Luxury' : 'Midrange'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    asChild
                    data-testid={`button-view-product-${index}`}
                  >
                    <a href={option.affiliateLink} target="_blank" rel="noopener noreferrer">
                      Buy
                    </a>
                  </Button>
                  
                  {isCurrent ? (
                    <Badge variant="secondary" className="flex-1 justify-center text-xs h-8 items-center">
                      Current
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs whitespace-nowrap"
                      onClick={() => onSetCurrent(option.name)}
                      disabled={isPending}
                      data-testid={`button-set-current-${index}`}
                    >
                      {isPending ? 'Setting...' : 'Use This'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
