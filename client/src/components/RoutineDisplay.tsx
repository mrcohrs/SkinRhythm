import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard, type Product } from "./ProductCard";
import { PremiumUpsell } from "./PremiumUpsell";
import { Sun, Moon } from "lucide-react";

interface RoutineDisplayProps {
  userName: string;
  skinType: string;
  products: {
    morning: Product[];
    evening: Product[];
  };
  isPremiumUser?: boolean;
  selectedPriceTier?: "budget" | "standard" | "premium";
  onPriceTierChange?: (tier: "budget" | "standard" | "premium") => void;
}

export function RoutineDisplay({
  userName,
  skinType,
  products,
  isPremiumUser = false,
  selectedPriceTier = "standard",
  onPriceTierChange,
}: RoutineDisplayProps) {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-greeting">
            Welcome, {userName}! 👋
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-lg text-muted-foreground">Your personalized routine for</p>
            <Badge variant="secondary" data-testid="badge-skin-type">
              {skinType} skin
            </Badge>
          </div>

          {!isPremiumUser && <PremiumUpsell />}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Budget</h2>
          <Tabs
            value={selectedPriceTier}
            onValueChange={(value) => onPriceTierChange?.(value as any)}
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="budget" data-testid="tab-budget">Budget</TabsTrigger>
              <TabsTrigger value="standard" data-testid="tab-standard">Standard</TabsTrigger>
              <TabsTrigger value="premium" data-testid="tab-premium">Premium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs defaultValue="morning" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="morning" data-testid="tab-morning">
              <Sun className="h-4 w-4 mr-2" />
              Morning Routine
            </TabsTrigger>
            <TabsTrigger value="evening" data-testid="tab-evening">
              <Moon className="h-4 w-4 mr-2" />
              Evening Routine
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.morning
                .filter((p) => p.priceTier === selectedPriceTier)
                .map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    isPremiumUser={isPremiumUser}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="evening" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.evening
                .filter((p) => p.priceTier === selectedPriceTier)
                .map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    isPremiumUser={isPremiumUser}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
