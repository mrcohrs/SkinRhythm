import { Badge } from "@/components/ui/badge";
import { ProductCard, type Product } from "./ProductCard";
import { PremiumUpsell } from "./PremiumUpsell";
import { WeeklyRoutine } from "./WeeklyRoutine";
import type { RoutineType } from "@shared/weeklyRoutines";

interface RoutineDisplayProps {
  userName: string;
  skinType: string;
  routineType?: RoutineType;
  products: {
    morning: Product[];
    evening: Product[];
  };
  isPremiumUser?: boolean;
}

export function RoutineDisplay({
  userName,
  skinType,
  routineType,
  products,
  isPremiumUser = false,
}: RoutineDisplayProps) {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs uppercase tracking-wide">
              Your Routine
            </Badge>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6" data-testid="text-greeting">
            Welcome back, {userName}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your personalized skincare routine for{" "}
            <span className="text-foreground font-medium" data-testid="badge-skin-type">{skinType} skin</span>
          </p>

          {!isPremiumUser && <PremiumUpsell />}
        </div>

        {isPremiumUser && routineType && (
          <div className="mb-16">
            <WeeklyRoutine routineType={routineType} products={products} />
          </div>
        )}

        <div className="space-y-16">
          <div>
            <h3 className="font-serif text-3xl font-semibold mb-8" data-testid="tab-morning">Morning Routine</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.morning.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  isPremiumUser={isPremiumUser}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-semibold mb-8" data-testid="tab-evening">Evening Routine</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.evening.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  isPremiumUser={isPremiumUser}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
