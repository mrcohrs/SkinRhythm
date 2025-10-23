import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface PremiumUpsellProps {
  title?: string;
  description?: string;
}

export function PremiumUpsell({ 
  title = "Upgrade to Premium",
  description = "Track your progress with photos, get updated recommendations, and access alternative product options."
}: PremiumUpsellProps = {}) {
  return (
    <div className="border border-primary/30 rounded-2xl p-8 md:p-10 bg-primary/5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-serif text-2xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 rounded-full whitespace-nowrap" 
          data-testid="button-upgrade-to-premium"
          asChild
        >
          <Link href="/pricing">
            Get Premium
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
