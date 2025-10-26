import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "./checkout/CheckoutButton";
import { STRIPE_PRICE_IDS, PRODUCT_PRICES } from "@/lib/stripe";
import { FileText, Star, Crown } from "lucide-react";

interface RoutinePurchaseOptionsProps {
  isAuthenticated: boolean;
  className?: string;
}

export function RoutinePurchaseOptions({ isAuthenticated, className }: RoutinePurchaseOptionsProps) {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="font-serif text-2xl font-semibold mb-6">Unlock More Features</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Detailed PDF */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-secondary" />
              <CardTitle className="text-lg">Detailed Routine PDF</CardTitle>
            </div>
            <CardDescription>
              One-time purchase • $9.99
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get a downloadable PDF with full instructions, actives ramping plan, and insider tips for your routine.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Complete AM/PM routine with order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>6-week actives introduction plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Application tips & tricks</span>
              </li>
            </ul>
            <CheckoutButton
              priceId={STRIPE_PRICE_IDS.DETAILED_PDF}
              label="Purchase PDF ($9.99)"
              className="w-full"
              variant="secondary"
              productType="detailed_pdf"
              amount={PRODUCT_PRICES.DETAILED_PDF}
            />
          </CardContent>
        </Card>

        {/* Premium Routine Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-secondary" />
              <CardTitle className="text-lg">Premium Routine Access</CardTitle>
            </div>
            <CardDescription>
              One-time purchase • $9.99
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Unlock premium product alternatives to customize your routine with higher-end options.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Access to premium product alternatives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Switch between budget & premium tiers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Customize with recommended products</span>
              </li>
            </ul>
            <CheckoutButton
              priceId={STRIPE_PRICE_IDS.PREMIUM_ROUTINE_ACCESS}
              label="Purchase Access ($9.99)"
              className="w-full"
              variant="secondary"
              productType="premium_routine_access"
              amount={PRODUCT_PRICES.PREMIUM_ROUTINE_ACCESS}
            />
          </CardContent>
        </Card>
      </div>

      {/* Premium Subscription Upsell */}
      <Card className="mt-6 border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Or Get Everything with Premium</CardTitle>
          </div>
          <CardDescription>
            Starting at $2.99/month for founding members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get both the detailed PDF and premium alternatives, plus ongoing Routine Coach guidance, ingredient scanner, and more.
          </p>
          <CheckoutButton
            priceId={STRIPE_PRICE_IDS.PREMIUM_FOUNDING}
            label="Unlock Premium Membership"
            className="w-full"
            productType="premium_subscription"
            amount={PRODUCT_PRICES.PREMIUM_FOUNDING}
          />
        </CardContent>
      </Card>
    </div>
  );
}
