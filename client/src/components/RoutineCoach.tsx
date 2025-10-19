import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { weeklyRoutines, type RoutineType, categoryMapping } from "@shared/weeklyRoutines";
import { Product } from "./ProductCard";
import { ArrowRight, Info, ExternalLink, Sun, Moon, BookOpen, Lightbulb, Megaphone, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';

interface RoutineCoachProps {
  routineType: RoutineType;
  userName: string;
  products: {
    morning: Product[];
    evening: Product[];
  };
}

interface StepInfo {
  number: number;
  name: string;
  instructions: string;
  timeOfDay: 'morning' | 'evening';
  product?: Product;
}

interface ProductOption {
  name: string;
  category: string;
  priceTier?: string;
  affiliateLink: string;
  originalLink: string;
  isDefault: boolean;
}

interface ProductCarouselProps {
  options: ProductOption[];
  title: string;
}

function ProductCarousel({ options, title }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const updateScrollState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', updateScrollState);
    emblaApi.on('reInit', updateScrollState);
    updateScrollState();

    return () => {
      emblaApi.off('select', updateScrollState);
      emblaApi.off('reInit', updateScrollState);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (options.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">{title}</h4>
        {options.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIndex + 1} / {options.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                data-testid="button-carousel-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={scrollNext}
                disabled={!canScrollNext}
                data-testid="button-carousel-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {options.map((option, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%]">
              <Card className="overflow-hidden hover-elevate h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-foreground">{option.name}</h5>
                        {option.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Your Pick
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{option.category}</p>
                    </div>
                    {option.priceTier && !option.isDefault && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {option.priceTier}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    asChild
                    data-testid={`button-buy-product-${idx}`}
                  >
                    <a 
                      href={option.affiliateLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Buy Now
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {options.length > 1 && (
        <div className="flex justify-center gap-2">
          {options.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={cn(
                "h-2 rounded-full transition-all",
                selectedIndex === idx 
                  ? "w-8 bg-secondary" 
                  : "w-2 bg-muted-foreground/30"
              )}
              data-testid={`button-carousel-dot-${idx}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RoutineCoach({ routineType, userName, products }: RoutineCoachProps) {
  const schedule = weeklyRoutines[routineType];
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [showEvening, setShowEvening] = useState(false); // AM/PM toggle

  const currentWeek = schedule[selectedWeekIndex];

  // Generate steps for current week based on AM/PM selection
  const morningSteps: StepInfo[] = currentWeek.amRoutine.map((step, idx) => ({
    number: idx + 1,
    name: step,
    instructions: getStepInstructions(step, 'morning', currentWeek.notes),
    timeOfDay: 'morning' as const,
    product: getProductForStep(step, 'morning')
  }));

  const eveningSteps: StepInfo[] = currentWeek.pmRoutine.map((step, idx) => ({
    number: idx + 1,
    name: step,
    instructions: getStepInstructions(step, 'evening', currentWeek.notes),
    timeOfDay: 'evening' as const,
    product: getProductForStep(step, 'evening')
  }));

  // Show only AM or PM steps based on toggle
  const displayedSteps = showEvening ? eveningSteps : morningSteps;

  // Reset step index when week or AM/PM changes
  useEffect(() => {
    setSelectedStepIndex(0);
  }, [selectedWeekIndex, showEvening]);

  // Safety guard: ensure currentStep is always valid
  const safeStepIndex = Math.min(selectedStepIndex, displayedSteps.length - 1);
  const currentStep = displayedSteps[safeStepIndex] || displayedSteps[0];

  function getProductForStep(stepName: string, timeOfDay: 'morning' | 'evening'): Product | undefined {
    const mappedCategory = categoryMapping[stepName];
    if (!mappedCategory || mappedCategory === 'Ice') return undefined;
    
    const productList = timeOfDay === 'morning' ? products.morning : products.evening;
    return productList.find(p => p.category === mappedCategory);
  }

  function getStepInstructions(stepName: string, timeOfDay: 'morning' | 'evening', weekNotes?: string): string {
    // Custom instructions based on step name
    const baseInstructions: Record<string, string> = {
      'Cleanser': 'Wet hands and face. Pump a quarter-sized amount of cleanser onto your fingers and lather. Massage all over face in gentle, circular motions. Can repeat if wearing makeup.',
      'Ice': 'Take an ice cube and rub it gently on your face for 30-60 seconds, focusing on inflamed areas. This helps reduce inflammation and redness.',
      'Ice (see notes)': 'Take an ice cube and rub it gently on your face for 30-60 seconds, focusing on inflamed areas. This helps reduce inflammation and redness.',
      'Toner': 'Apply toner to a cotton pad or directly to clean hands. Gently pat or swipe across your entire face and neck.',
      'Serum': 'Apply 2-3 drops of serum to your face and neck. Gently pat until absorbed.',
      'Serum (every other day)': 'Apply 2-3 drops of serum to your face and neck. Gently pat until absorbed. Use every other day during this phase.',
      'Hydrator': 'Apply a thin layer of hydrator to your face and neck. This step is optional but recommended for dry skin.',
      'Hydrator (optional)': 'Apply a thin layer of hydrator to your face and neck. This step is optional but recommended for dry skin.',
      'Moisturizer': 'Apply a dime-sized amount of moisturizer to your face and neck. Gently massage in upward motions.',
      'Sunscreen': 'Apply sunscreen as the final step in your morning routine. Use at least a nickel-sized amount for your face and neck.',
      'Benzoyl Peroxide': 'Apply a thin layer of benzoyl peroxide to your entire face. Leave on overnight.',
      'BPO Mask (see notes)': weekNotes || 'Apply a thin layer to your face for the specified time, then rinse and continue with your routine.',
      'Benzoyl Peroxide Mask': weekNotes || 'Apply a thin layer to your face for the specified time, then rinse and continue with your routine.'
    };

    return baseInstructions[stepName] || `Apply ${stepName.toLowerCase()} as directed.`;
  }

  // Get all product options including default and premium alternatives
  const getProductOptions = (product?: Product): ProductOption[] => {
    if (!product) return [];
    
    const options: ProductOption[] = [];
    
    // Add the default product first
    options.push({
      name: product.name,
      category: product.category,
      priceTier: product.priceTier,
      affiliateLink: product.affiliateLink,
      originalLink: product.originalLink || product.affiliateLink,
      isDefault: true
    });
    
    // Add premium alternatives if available
    if (product.premiumOptions && product.premiumOptions.length > 0) {
      product.premiumOptions.forEach(option => {
        options.push({
          name: option.productName,
          category: product.category,
          priceTier: 'premium',
          affiliateLink: option.affiliateLink,
          originalLink: option.originalLink,
          isDefault: false
        });
      });
    }
    
    return options;
  };

  // Check if current step is a BPO Mask to show the BPO product
  const isBPOMask = currentStep.name.includes('BPO Mask') || currentStep.name.includes('Benzoyl Peroxide Mask');
  const bpoProduct = isBPOMask ? products.evening.find(p => p.category === 'Spot Treatment') : undefined;
  
  const productOptions = getProductOptions(currentStep.product);
  const bpoProductOptions = isBPOMask ? getProductOptions(bpoProduct) : [];

  return (
    <div className="space-y-8" data-testid="routine-coach-container">
      {/* Header with Week Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            {userName}'s Routine Coach
          </h2>
        </div>
        
        {/* Week Selector Dropdown */}
        <Select value={selectedWeekIndex.toString()} onValueChange={(v) => setSelectedWeekIndex(parseInt(v))}>
          <SelectTrigger className="w-[180px]" data-testid="select-week">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {schedule.map((week, idx) => (
              <SelectItem key={idx} value={idx.toString()} data-testid={`week-option-${idx}`}>
                {week.weekRange}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Card */}
      <Card className="overflow-hidden border-2 border-secondary/20">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Left: Step Navigation with AM/PM Toggle */}
            <div className="bg-muted/30 p-4 md:p-6 space-y-4 border-r">
              {/* AM/PM Toggle */}
              <div className="flex items-center justify-between gap-3 p-3 bg-background rounded-lg">
                <div className="flex items-center gap-2">
                  <Sun className={cn("h-4 w-4", !showEvening ? "text-yellow-500" : "text-muted-foreground")} />
                  <Label htmlFor="time-toggle" className="text-sm font-medium cursor-pointer">
                    {showEvening ? 'PM' : 'AM'}
                  </Label>
                </div>
                <Switch
                  id="time-toggle"
                  checked={showEvening}
                  onCheckedChange={setShowEvening}
                  data-testid="switch-am-pm"
                />
                <div className="flex items-center gap-2">
                  <Moon className={cn("h-4 w-4", showEvening ? "text-blue-500" : "text-muted-foreground")} />
                </div>
              </div>

              {/* Step Navigation */}
              <div className="space-y-2">
                {displayedSteps.map((step, idx) => {
                  const isActive = idx === selectedStepIndex;
                  const categoryName = categoryMapping[step.name];
                  const isIce = categoryName === 'Ice';
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedStepIndex(idx)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-md transition-colors flex items-center gap-3",
                        isActive 
                          ? "bg-background shadow-sm" 
                          : "hover-elevate active-elevate-2"
                      )}
                      data-testid={`step-nav-${idx}`}
                    >
                      <span className={cn(
                        "flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded",
                        isActive ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        Step {step.number}
                      </span>
                      <span className={cn(
                        "text-sm font-medium flex-1",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.name.replace(' (see notes)', '').replace(' (every other day)', '').replace(' (optional)', '')}
                      </span>
                      {isActive && <ArrowRight className="h-4 w-4 text-secondary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Step Display */}
            <div className="p-6 md:p-8 lg:p-12 space-y-8">
              {/* Step Header */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-4xl font-bold text-white">
                    {currentStep.number}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-3xl font-bold uppercase tracking-wide text-foreground">
                      {currentStep.name.replace(' (see notes)', '').replace(' (every other day)', '').replace(' (optional)', '')}
                    </h3>
                    <Badge variant="outline" className="mt-2 gap-1.5">
                      {currentStep.timeOfDay === 'morning' ? (
                        <><Sun className="h-3.5 w-3.5 text-yellow-500" /> Morning</>
                      ) : (
                        <><Moon className="h-3.5 w-3.5 text-blue-500" /> Evening</>
                      )} Step
                    </Badge>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-foreground leading-relaxed">
                    {currentStep.instructions}
                  </p>
                  {currentStep.name.includes('(optional)') && (
                    <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      This step is optional but recommended for best results.
                    </p>
                  )}
                  {currentStep.name.includes('every other day') && (
                    <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      Use every other day during this phase to let your skin adjust.
                    </p>
                  )}
                </div>
              </div>

              {/* Product Recommendations */}
              {(productOptions.length > 0 || bpoProductOptions.length > 0) && (
                <ProductCarousel 
                  options={isBPOMask ? bpoProductOptions : productOptions}
                  title="Recommended for your skin type"
                />
              )}

              {/* Week Notes */}
              {currentWeek.notes && (
                <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-foreground">Important Notes for {currentWeek.weekRange}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentWeek.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-2">Additional Resources</h3>
          <p className="text-muted-foreground">Tips, tricks, and expert guidance for your skincare journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for future content */}
          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Getting Started Guide</h4>
              <p className="text-sm text-muted-foreground">
                Learn the fundamentals of your personalized acne treatment routine.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold">Tips & Tricks</h4>
              <p className="text-sm text-muted-foreground">
                Expert advice for maximizing your results and managing side effects.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="font-semibold">Latest Updates</h4>
              <p className="text-sm text-muted-foreground">
                Stay informed about new products, research, and skincare insights.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
