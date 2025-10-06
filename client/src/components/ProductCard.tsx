import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";

export interface Product {
  name: string;
  brand: string;
  price: number;
  priceTier: "budget" | "standard" | "premium";
  benefits: string[];
  affiliateLink: string;
  imageUrl?: string;
  isPremiumOnly?: boolean;
}

interface ProductCardProps {
  product: Product;
  isPremiumUser?: boolean;
}

export function ProductCard({ product, isPremiumUser = false }: ProductCardProps) {
  const isLocked = product.isPremiumOnly && !isPremiumUser;

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
        <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-20 h-20 bg-muted/50 rounded-lg" />
          )}
        </div>

        <div className="p-6 space-y-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-1" data-testid={`text-product-name-${product.name.replace(/\s/g, '-')}`}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.benefits[0]}
          </p>
          
          <div className="pt-2">
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
              <Button
                variant="ghost"
                size="sm"
                className="group-hover:translate-x-1 transition-transform p-0 h-auto text-foreground no-default-hover-elevate"
                asChild
                data-testid={`button-view-product-${product.name.replace(/\s/g, '-')}`}
              >
                <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium">
                  View Product
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
