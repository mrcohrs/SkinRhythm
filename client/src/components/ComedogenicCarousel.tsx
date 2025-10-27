import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import algaeImg from "@assets/algae_1761481865848.png";
import coconutImg from "@assets/coconut_1761481865855.png";
import sheaImg from "@assets/shea_1761481865855.png";
import beakerImg from "@assets/beaker_1761482228536.png";

const comedogenicIngredients = [
  {
    image: coconutImg,
    alt: "Coconut oil",
    name: "coconut oil",
    description: "widely used in personal care products. the brand cocokind even has a line of acne products that almost all contain this pore-clogger."
  },
  {
    image: sheaImg,
    alt: "Shea butter",
    name: "shea butter",
    description: "ubiquitous in personal care. finding moisturizers without shea butter is harder than a needle in a haystack."
  },
  {
    image: algaeImg,
    alt: "Algae",
    name: "algae",
    description: "a trendy ingredient that has popped up in many personal care products, but that has high levels of iodine that can trigger breakouts."
  },
  {
    image: beakerImg,
    alt: "Laureth-4",
    name: "laureth-4",
    description: "a surfactant used in 90% of benzoyl peroxide cream formulations (intended to treat acne) that is extremely comedogenic."
  },
];

export function ComedogenicCarousel() {
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
    <div className="space-y-6">
      <h4 className="font-medium text-center">common comedogenic ingredients labeled non-comedogenic:</h4>
      
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {comedogenicIngredients.map((ingredient, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0"
                data-testid={`comedogenic-card-${index}`}
              >
                <div className="flex flex-col items-center gap-2 text-center px-2">
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.alt} 
                    className="w-48 h-48 md:w-60 md:h-60 object-contain" 
                  />
                  <p className="text-sm text-muted-foreground">
                    <b>{ingredient.name}:</b> {ingredient.description}
                  </p>
                </div>
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
    </div>
  );
}
