import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ExternalLink, Check } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { getCategoryImage } from "@/lib/categoryImages";
import bestForYourSkinBadge from "@assets/bestforyourskin_1761112317047.png";

interface ProductCarouselProps {
  category: string;
  currentProduct: {
    name: string;
    category: string;
    brand: string;
    affiliateLink: string;
    priceTier: "budget" | "standard" | "premium";
    priceRange?: string;
    isRecommended?: boolean;
    premiumOptions?: Array<{
      originalLink: string;
      affiliateLink: string;
      productName: string;
      priceRange?: string;
      isRecommended?: boolean;
      isCurrent?: boolean;
    }>;
  };
  onProductSelect: (category: string, productName: string) => void;
  isUpdating?: boolean;
  currentProductSelection?: string;
}

export function ProductCarousel({
  category,
  currentProduct,
  onProductSelect,
  isUpdating,
  currentProductSelection,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    skipSnaps: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const categoryImage = getCategoryImage(category);

  // Build all product cards from premiumOptions (which now contains ALL products with isCurrent flags)
  const allProductCards: Array<{
    name: string;
    affiliateLink: string;
    priceTier: string;
    priceRange?: string;
    isCurrentSelection: boolean;
    isRecommended?: boolean;
  }> = [];

  // If premiumOptions exist, use them (they contain ALL product variants with isCurrent flags)
  if (currentProduct.premiumOptions && currentProduct.premiumOptions.length > 0) {
    currentProduct.premiumOptions.forEach((option) => {
      allProductCards.push({
        name: option.productName,
        affiliateLink: option.affiliateLink,
        priceTier: currentProduct.priceTier === 'budget' ? 'Budget' : currentProduct.priceTier === 'premium' ? 'Luxury' : 'Midrange',
        priceRange: option.priceRange,
        isCurrentSelection: option.isCurrent ?? false,
        isRecommended: option.isRecommended,
      });
    });
  } else {
    // Fallback for products without variants (like ice-globes)
    allProductCards.push({
      name: currentProduct.name,
      affiliateLink: currentProduct.affiliateLink,
      priceTier: currentProduct.priceTier === 'budget' ? 'Budget' : currentProduct.priceTier === 'premium' ? 'Luxury' : 'Midrange',
      priceRange: currentProduct.priceRange,
      isCurrentSelection: true,
      isRecommended: currentProduct.isRecommended,
    });
  }

  // Sort to show current selection first, then the rest
  const sortedCards = [...allProductCards].sort((a, b) => {
    if (a.isCurrentSelection && !b.isCurrentSelection) return -1;
    if (!a.isCurrentSelection && b.isCurrentSelection) return 1;
    return 0;
  });

  // Only show navigation if we have multiple cards
  const showNavigation = sortedCards.length > 1;

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-semibold text-muted-foreground flex-shrink-0">
          Product Options
        </h4>
        {showNavigation && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous products"
              className="h-8 w-8 flex-shrink-0"
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next products"
              className="h-8 w-8 flex-shrink-0"
              data-testid="button-carousel-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden touch-pan-y w-full" ref={emblaRef}>
        <div className="flex gap-4 w-full" style={{ touchAction: 'pan-y' }}>
          {sortedCards.map((card, index) => (
            <div
              key={`${card.name}-${index}`}
              className="flex-[0_0_min(100%,320px)]"
              data-testid={`carousel-item-${index}`}
            >
              <Card className={cn(
                "h-full border-card-border hover-elevate transition-all",
                card.isCurrentSelection && "ring-2 ring-primary"
              )}>
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex gap-4 items-start flex-1">
                    <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
                      <img
                        src={categoryImage}
                        alt={category}
                        className="max-w-full max-h-full object-contain drop-shadow-md"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {card.isCurrentSelection && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Check className="h-3 w-3" />
                              Current
                            </Badge>
                          )}
                        </div>
                        <h5 className="font-serif text-base font-semibold text-foreground line-clamp-2" data-testid="text-product-name">
                          {card.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {card.priceRange && (
                            <p className="text-sm font-medium text-muted-foreground">
                              {card.priceRange}
                            </p>
                          )}
                          {card.isRecommended && (
                            <img 
                              src={bestForYourSkinBadge} 
                              alt="Best for Your Skin" 
                              className="h-3.5"
                              data-testid="img-best-for-your-skin"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 gap-1"
                      onClick={() => window.open(card.affiliateLink, '_blank', 'noopener,noreferrer')}
                      data-testid="button-buy-now"
                    >
                      Buy Now
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    {!card.isCurrentSelection && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onProductSelect(category, card.name)}
                        disabled={isUpdating}
                        data-testid="button-add-to-routine"
                      >
                        Add to Routine
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
