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
    <div className={`group ${isLocked ? "opacity-60" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Premium Only</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4 relative">
        <div className="aspect-square bg-muted/50 rounded-2xl flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-24 h-24 bg-muted rounded-xl" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-xl font-semibold" data-testid={`text-product-name-${product.name.replace(/\s/g, '-')}`}>
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.benefits[0]}
          </p>
          <Button
            variant="ghost"
            className="group-hover:translate-x-1 transition-transform p-0 h-auto text-primary hover:bg-transparent"
            asChild={!isLocked}
            disabled={isLocked}
            data-testid={`button-view-product-${product.name.replace(/\s/g, '-')}`}
          >
            {isLocked ? (
              <span className="flex items-center gap-1 text-sm">
                Unlock with Premium
                <ArrowRight className="h-4 w-4" />
              </span>
            ) : (
              <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm">
                View Product
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
