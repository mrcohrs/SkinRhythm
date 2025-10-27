import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const activeIngredients = [
  {
    name: "mandelic acid",
    description: "skinrhythm's lead singer: gentle but thorough exfoliant that kills bacteria and fungus, reduces inflammation, and fades hyperpigmentation."
  },
  {
    name: "benzoyl peroxide",
    description: "powerful antimicrobial that kills acne-causing bacteria"
  },
  {
    name: "salicylic acid",
    description: "oil-soluble exfoliant that unclogs pores and kills bacteria"
  },
  {
    name: "niacinamide",
    description: "calms and balances skin barrier function, improves uneven tone, regulates sebum, and improves hydration."
  },
  {
    name: "retinol",
    description: "refines texture, accelerates cell turnover, and improves uneven tone."
  },
  {
    name: "bisabolol",
    description: "calms redness and reduces inflammation, aids in healing, and improves absorption of other actives."
  },
];

export function ActiveIngredientsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {activeIngredients.map((ingredient, index) => (
            <div 
              key={index} 
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
              data-testid={`ingredient-card-${index}`}
            >
              <Card className="border-border shadow-sm rounded-2xl h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TestTube className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-normal text-lg">{ingredient.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ingredient.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollPrev && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-background shadow-lg"
          onClick={scrollPrev}
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {canScrollNext && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full bg-background shadow-lg"
          onClick={scrollNext}
          data-testid="button-carousel-next"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
