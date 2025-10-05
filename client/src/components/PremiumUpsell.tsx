import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Camera, TrendingUp, Package } from "lucide-react";

export function PremiumUpsell() {
  return (
    <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Unlock Premium Features</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <span>Track your progress with photo uploads</span>
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Get updated routine recommendations</span>
            </li>
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span>Access alternative product options</span>
            </li>
          </ul>
        </div>
        <Button size="lg" data-testid="button-upgrade-to-premium">
          Upgrade to Premium
        </Button>
      </div>
    </Card>
  );
}
