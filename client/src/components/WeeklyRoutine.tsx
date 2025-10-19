import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { weeklyRoutines, type RoutineType, categoryMapping } from "@shared/weeklyRoutines";
import { Product } from "./ProductCard";
import { CompactProductCard } from "./CompactProductCard";
import { getProductById } from "@shared/productLibrary";
import { Clock, Sun, Moon, Info } from "lucide-react";
import iceGlobesIcon from "@assets/ciice_1760874110365.png";

interface WeeklyRoutineProps {
  routineType: RoutineType;
  products: {
    morning: Product[];
    evening: Product[];
  };
}

export function WeeklyRoutine({ routineType, products }: WeeklyRoutineProps) {
  const schedule = weeklyRoutines[routineType];

  const getProductForCategory = (categoryName: string, timeOfDay: 'morning' | 'evening'): Product | null => {
    const mappedCategory = categoryMapping[categoryName];
    if (!mappedCategory) return null;
    if (mappedCategory === 'Ice') return null;

    const productList = timeOfDay === 'morning' ? products.morning : products.evening;
    return productList.find(p => p.category === mappedCategory) || null;
  };

  // Check if routine has ice step in morning routine
  const hasIceStep = schedule.some(week => 
    week.amRoutine.some(step => categoryMapping[step] === 'Ice')
  );

  const iceGlobesProduct = getProductById('ice-globes');

  return (
    <div className="space-y-6" data-testid="weekly-routine-container">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Your 6-Week Treatment Plan
        </h3>
        <p className="text-muted-foreground">
          Follow this progressive routine for optimal results. Start slowly and build up as your skin adjusts.
        </p>
      </div>

      {hasIceStep && iceGlobesProduct && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <img src={iceGlobesIcon} alt="" className="w-4 h-4" />
            Recommended Tool for Ice Steps
          </h4>
          <CompactProductCard 
            product={{
              name: iceGlobesProduct.generalName,
              category: iceGlobesProduct.category,
              priceTier: iceGlobesProduct.priceTier,
              priceRange: iceGlobesProduct.priceRange,
              affiliateLink: iceGlobesProduct.affiliateLink!,
            }}
            description="Icing after cleansing can help reduce inflammation. Ice cubes work, but if you like convenience, these are well worth the money."
          />
        </div>
      )}

      <div className="space-y-6">
        {schedule.map((week, index) => (
          <Card key={index} className="overflow-hidden" data-testid={`week-card-${index + 1}`}>
            <CardHeader className="gap-1 space-y-0 pb-4">
              <CardTitle className="text-xl">{week.weekRange}</CardTitle>
              {week.notes && (
                <CardDescription className="flex items-start gap-2 mt-2 p-3 bg-muted/50 rounded-md">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{week.notes}</span>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3" data-testid={`morning-routine-week-${index + 1}`}>
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold">Morning Routine</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {week.amRoutine.map((step, stepIndex) => {
                    const product = getProductForCategory(step, 'morning');
                    const isIce = categoryMapping[step] === 'Ice';
                    
                    return (
                      <Badge
                        key={stepIndex}
                        variant={product ? "default" : "secondary"}
                        className="text-sm py-1 px-3 flex items-center gap-1"
                        data-testid={`morning-step-${stepIndex}`}
                      >
                        {stepIndex + 1}. {step}
                        {isIce && <img src={iceGlobesIcon} alt="" className="w-3 h-3" />}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {week.amRoutine.map((step, stepIndex) => {
                    const product = getProductForCategory(step, 'morning');
                    if (!product) return null;
                    
                    return (
                      <div key={stepIndex} className="text-xs text-muted-foreground">
                        <span className="font-medium">{stepIndex + 1}.</span> {product.brand} {product.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3" data-testid={`evening-routine-week-${index + 1}`}>
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold">Evening Routine</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {week.pmRoutine.map((step, stepIndex) => {
                    const product = getProductForCategory(step, 'evening');
                    const isIce = categoryMapping[step] === 'Ice';
                    
                    return (
                      <Badge
                        key={stepIndex}
                        variant={product ? "default" : "secondary"}
                        className="text-sm py-1 px-3 flex items-center gap-1"
                        data-testid={`evening-step-${stepIndex}`}
                      >
                        {stepIndex + 1}. {step}
                        {isIce && <img src={iceGlobesIcon} alt="" className="w-3 h-3" />}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {week.pmRoutine.map((step, stepIndex) => {
                    const product = getProductForCategory(step, 'evening');
                    if (!product) return null;
                    
                    return (
                      <div key={stepIndex} className="text-xs text-muted-foreground">
                        <span className="font-medium">{stepIndex + 1}.</span> {product.brand} {product.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
