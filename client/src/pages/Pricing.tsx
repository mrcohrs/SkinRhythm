import { useAuth } from "@/hooks/useAuth";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useFoundingRate } from "@/hooks/useFoundingRate";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STRIPE_PRICE_IDS, PRODUCT_PRICES } from "@/lib/stripe";
import { Check, Sparkles, FileText, Scan, Crown } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const { user } = useAuth();
  const { data: entitlements, isLoading: entitlementsLoading } = useEntitlements();
  const { data: foundingRate, isLoading: foundingRateLoading } = useFoundingRate();

  const isFoundingActive = foundingRate?.active ?? false;
  const premiumPrice = isFoundingActive ? PRODUCT_PRICES.PREMIUM_FOUNDING : PRODUCT_PRICES.PREMIUM_STANDARD;
  const premiumPriceId = isFoundingActive ? STRIPE_PRICE_IDS.PREMIUM_FOUNDING : STRIPE_PRICE_IDS.PREMIUM_STANDARD;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-pricing-title">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized acne treatment routines and unlock powerful tools to achieve clear skin
        </p>
        
        {isFoundingActive && foundingRate && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-md">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Founding Member Rate Active! Only {foundingRate.purchasesRemaining} spots left at $2.99/month
            </span>
          </div>
        )}
      </div>

      {/* Premium Subscription */}
      <div className="mb-12">
        <Card className="relative overflow-hidden">
          {isFoundingActive && (
            <div className="absolute top-4 right-4">
              <Badge variant="default" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Founding Rate
              </Badge>
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Premium Membership
            </CardTitle>
            <CardDescription>
              Full access to personalized routines, product alternatives, and coaching
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">${premiumPrice}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {isFoundingActive && (
                <p className="text-sm text-muted-foreground mt-1">
                  Lock in this rate forever • Regular price: ${PRODUCT_PRICES.PREMIUM_STANDARD}/month
                </p>
              )}
              {entitlements?.isPremium && entitlements.isFoundingMember && (
                <Badge variant="outline" className="mt-2">You're a Founding Member!</Badge>
              )}
            </div>

            <Separator />

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Access premium product alternatives for every step</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Personalized Routine Coach with ramping instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Generate detailed treatment PDFs</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Save and compare multiple routines</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Priority support and updates</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter>
            {!user ? (
              <Button asChild className="w-full" size="lg" data-testid="button-signup-premium">
                <Link href="/login">Sign Up to Get Premium</Link>
              </Button>
            ) : entitlements?.isPremium ? (
              <Button disabled className="w-full" size="lg" variant="outline">
                Current Plan
              </Button>
            ) : (
              <CheckoutButton
                priceId={premiumPriceId}
                label={isFoundingActive ? "Lock In Founding Rate" : "Upgrade to Premium"}
                size="lg"
                className="w-full"
              />
            )}
          </CardFooter>
        </Card>
      </div>

      {/* One-Time Purchases */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">One-Time Purchases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Premium Routine Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Premium Routine Access
              </CardTitle>
              <CardDescription>
                Unlock product alternatives for your current routine
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${PRODUCT_PRICES.PREMIUM_ROUTINE_ACCESS}</span>
                <span className="text-muted-foreground">one-time</span>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Access all product alternatives for one routine</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Perfect for trying premium features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>No subscription required</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              {!user ? (
                <Button asChild className="w-full" variant="outline" data-testid="button-signup-routine-access">
                  <Link href="/login">Sign Up to Purchase</Link>
                </Button>
              ) : entitlements?.hasPremiumRoutineAccess ? (
                <Button disabled className="w-full" variant="outline">
                  Already Purchased
                </Button>
              ) : (
                <CheckoutButton
                  priceId={STRIPE_PRICE_IDS.PREMIUM_ROUTINE_ACCESS}
                  label="Purchase Access"
                  variant="outline"
                  className="w-full"
                />
              )}
            </CardFooter>
          </Card>

          {/* Detailed PDF */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detailed Routine PDF
              </CardTitle>
              <CardDescription>
                Professional treatment plan you can print or save
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${PRODUCT_PRICES.DETAILED_PDF}</span>
                <span className="text-muted-foreground">one-time</span>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Beautifully designed PDF with AM/PM schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Complete ramping instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Share with your dermatologist</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              {!user ? (
                <Button asChild className="w-full" variant="outline" data-testid="button-signup-pdf">
                  <Link href="/login">Sign Up to Purchase</Link>
                </Button>
              ) : entitlements?.hasDetailedPdfAccess ? (
                <Button disabled className="w-full" variant="outline">
                  Already Purchased
                </Button>
              ) : (
                <CheckoutButton
                  priceId={STRIPE_PRICE_IDS.DETAILED_PDF}
                  label="Purchase PDF Access"
                  variant="outline"
                  className="w-full"
                />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Ingredient Scanner Options */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Ingredient Scanner</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Unlimited Scanner - Only show if NOT in founding period */}
          {!isFoundingActive && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Unlimited Scans
                </CardTitle>
                <CardDescription>
                  Check ingredients anytime
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${PRODUCT_PRICES.UNLIMITED_SCANNER}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <p className="text-sm">
                  Scan unlimited product ingredients to check for acne-causing compounds
                </p>
              </CardContent>

              <CardFooter>
                {!user ? (
                  <Button asChild className="w-full" variant="outline" data-testid="button-signup-unlimited-scans">
                    <Link href="/login">Sign Up to Subscribe</Link>
                  </Button>
                ) : entitlements?.hasUnlimitedScans ? (
                  <Button disabled className="w-full" variant="outline">
                    Active Subscription
                  </Button>
                ) : (
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS.UNLIMITED_SCANNER}
                    label="Subscribe"
                    variant="outline"
                    className="w-full"
                  />
                )}
              </CardFooter>
            </Card>
          )}

          {/* 20-Pack */}
          <Card>
            <CardHeader>
              <CardTitle>20 Scans</CardTitle>
              <CardDescription>Best value for regular use</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${PRODUCT_PRICES.SCAN_PACK_20}</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Just $0.20 per scan
              </p>
            </CardContent>

            <CardFooter>
              {!user ? (
                <Button asChild className="w-full" variant="outline" data-testid="button-signup-scan-20">
                  <Link href="/login">Sign Up to Purchase</Link>
                </Button>
              ) : (
                <CheckoutButton
                  priceId={STRIPE_PRICE_IDS.SCAN_PACK_20}
                  label="Purchase 20 Scans"
                  variant="outline"
                  className="w-full"
                />
              )}
            </CardFooter>
          </Card>

          {/* 5-Pack */}
          <Card>
            <CardHeader>
              <CardTitle>5 Scans</CardTitle>
              <CardDescription>Perfect to get started</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${PRODUCT_PRICES.SCAN_PACK_5}</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Just $0.40 per scan
              </p>
            </CardContent>

            <CardFooter>
              {!user ? (
                <Button asChild className="w-full" variant="outline" data-testid="button-signup-scan-5">
                  <Link href="/login">Sign Up to Purchase</Link>
                </Button>
              ) : (
                <CheckoutButton
                  priceId={STRIPE_PRICE_IDS.SCAN_PACK_5}
                  label="Purchase 5 Scans"
                  variant="outline"
                  className="w-full"
                />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Free Tier Info */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-muted/50">
          <CardHeader>
            <CardTitle>Free Tier</CardTitle>
            <CardDescription>Always available, no credit card required</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Personalized acne routine quiz</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic budget-friendly product recommendations</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>3 free ingredient scans</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
