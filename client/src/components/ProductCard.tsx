import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lock } from "lucide-react";

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
  const tierColors = {
    budget: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    standard: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    premium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  };

  const isLocked = product.isPremiumOnly && !isPremiumUser;

  return (
    <Card className={`p-6 relative ${isLocked ? "opacity-60" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-md z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Premium Only</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1" data-testid={`text-product-name-${product.name.replace(/\s/g, '-')}`}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <Badge className={tierColors[product.priceTier]} data-testid={`badge-tier-${product.priceTier}`}>
            {product.priceTier}
          </Badge>
        </div>

        <div className="text-2xl font-bold" data-testid={`text-price-${product.price}`}>
          ${product.price.toFixed(2)}
        </div>

        <ul className="space-y-2">
          {product.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          asChild={!isLocked}
          disabled={isLocked}
          data-testid={`button-view-product-${product.name.replace(/\s/g, '-')}`}
        >
          {isLocked ? (
            <span>Upgrade to View</span>
          ) : (
            <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
              View Product
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
        </Button>
      </div>
    </Card>
  );
}
