import { useAuth } from "@/hooks/useAuth";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useFoundingRate } from "@/hooks/useFoundingRate";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STRIPE_PRICE_IDS, PRODUCT_PRICES } from "@/lib/stripe";
import { Check, Sparkles, FileText, Scan, Crown, ArrowLeft, Star } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const { user } = useAuth();
  const { data: entitlements, isLoading: entitlementsLoading } = useEntitlements();
  const { data: foundingRate, isLoading: foundingRateLoading } = useFoundingRate();

  const isFoundingActive = foundingRate?.active ?? false;
  const premiumPrice = isFoundingActive ? PRODUCT_PRICES.PREMIUM_FOUNDING : PRODUCT_PRICES.PREMIUM_STANDARD;
  const premiumPriceId = isFoundingActive ? STRIPE_PRICE_IDS.PREMIUM_FOUNDING : STRIPE_PRICE_IDS.PREMIUM_STANDARD;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" data-testid="text-pricing-title">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized acne treatment routines and unlock powerful tools to achieve clear skin
          </p>
        </div>

        {/* Founding Rate Banner */}
        {isFoundingActive && foundingRate && (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-primary/10 border-2 border-primary/30 rounded-lg">
              <Crown className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-center">
                <p className="font-semibold text-foreground">Founding Member Rate Active!</p>
                <p className="text-sm text-muted-foreground">
                  Only {foundingRate.purchasesRemaining} spots left at $2.99/month • Lock in this rate forever
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Premium Subscription - Featured */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-primary/50 shadow-lg relative">
              {isFoundingActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 px-4 py-1 text-sm">
                    <Sparkles className="h-3 w-3" />
                    Limited Time: Founding Rate
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className="flex justify-center mb-3">
                  <Crown className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-2">Premium Membership</CardTitle>
                <CardDescription className="text-lg">
                  Complete access to personalized routines, product alternatives, and coaching
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold">${premiumPrice}</span>
                    <span className="text-xl text-muted-foreground">/month</span>
                  </div>
                  {isFoundingActive && (
                    <p className="text-sm text-muted-foreground">
                      Regular price: ${PRODUCT_PRICES.PREMIUM_STANDARD}/month after founding period
                    </p>
                  )}
                  {entitlements?.isPremium && entitlements.isFoundingMember && (
                    <Badge variant="outline" className="mt-3">You're a Founding Member!</Badge>
                  )}
                </div>

                <Separator />

                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Premium Product Alternatives</p>
                      <p className="text-sm text-muted-foreground">Access higher-tier options for every routine step</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Personalized Routine Coach</p>
                      <p className="text-sm text-muted-foreground">Get ramping instructions and treatment guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Detailed Treatment PDFs</p>
                      <p className="text-sm text-muted-foreground">Generate professional AM/PM schedules</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Unlimited Ingredient Scans</p>
                      <p className="text-sm text-muted-foreground">Check products for acne-causing ingredients anytime</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-6 pb-8">
                {!user ? (
                  <Button asChild className="w-full" size="lg" data-testid="button-signup-premium">
                    <a href="/api/login">Get Premium Access</a>
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
        </div>

        {/* One-Time Purchases Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">One-Time Purchases</h2>
            <p className="text-muted-foreground">Unlock specific features without a subscription</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Premium Routine Access */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Premium Routine Access</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Get access to AcneAgent's highest-scoring routine matched to your unique skin profile
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${PRODUCT_PRICES.PREMIUM_ROUTINE_ACCESS}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">Unlock all product alternatives for your personalized routine</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">Perfect for trying premium features before committing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">No subscription required</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                {!user ? (
                  <Button asChild className="w-full" data-testid="button-signup-routine-access">
                    <a href="/api/login">Sign Up to Purchase</a>
                  </Button>
                ) : entitlements?.hasPremiumRoutineAccess ? (
                  <Button disabled className="w-full" variant="outline">
                    Already Purchased
                  </Button>
                ) : (
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS.PREMIUM_ROUTINE_ACCESS}
                    label="Purchase Access"
                    className="w-full"
                  />
                )}
              </CardFooter>
            </Card>

            {/* Detailed PDF */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Detailed Routine PDF</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Professional treatment plan you can print or save
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${PRODUCT_PRICES.DETAILED_PDF}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">Beautifully designed PDF with AM/PM schedules</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">Complete ramping instructions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">Share with your dermatologist</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                {!user ? (
                  <Button asChild className="w-full" data-testid="button-signup-pdf">
                    <a href="/api/login">Sign Up to Purchase</a>
                  </Button>
                ) : entitlements?.hasDetailedPdfAccess ? (
                  <Button disabled className="w-full" variant="outline">
                    Already Purchased
                  </Button>
                ) : (
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS.DETAILED_PDF}
                    label="Purchase PDF Access"
                    className="w-full"
                  />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Ingredient Scanner Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Ingredient Scanner</h2>
            <p className="text-muted-foreground">Check products for acne-causing ingredients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Unlimited Scanner - Only show if NOT founding period */}
            {!isFoundingActive && (
              <Card className="border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Scan className="h-5 w-5 text-primary" />
                    <CardTitle>Unlimited Scans</CardTitle>
                  </div>
                  <CardDescription>Check ingredients anytime</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${PRODUCT_PRICES.UNLIMITED_SCANNER}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan unlimited product ingredients
                  </p>
                </CardContent>

                <CardFooter>
                  {!user ? (
                    <Button asChild className="w-full" variant="outline" data-testid="button-signup-unlimited-scans">
                      <a href="/api/login">Subscribe</a>
                    </Button>
                  ) : entitlements?.hasUnlimitedScans ? (
                    <Button disabled className="w-full" variant="outline">
                      Active
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

            {/* 5-Pack */}
            <Card>
              <CardHeader>
                <CardTitle>5 Scans</CardTitle>
                <CardDescription>Great to get started</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${PRODUCT_PRICES.SCAN_PACK_5}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <p className="text-sm text-muted-foreground">Just $0.40 per scan</p>
              </CardContent>

              <CardFooter>
                {!user ? (
                  <Button asChild className="w-full" variant="outline" data-testid="button-signup-scan-5">
                    <a href="/api/login">Purchase</a>
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

            {/* 20-Pack */}
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Best Value</Badge>
                <CardTitle>20 Scans</CardTitle>
                <CardDescription>Perfect for regular use</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${PRODUCT_PRICES.SCAN_PACK_20}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <p className="text-sm text-muted-foreground">Just $0.20 per scan</p>
              </CardContent>

              <CardFooter>
                {!user ? (
                  <Button asChild className="w-full" variant="outline" data-testid="button-signup-scan-20">
                    <a href="/api/login">Purchase</a>
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
          </div>
        </div>

        {/* Free Tier Info */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-muted/30 border-muted">
            <CardHeader className="text-center">
              <CardTitle>Free Tier</CardTitle>
              <CardDescription>Always available, no credit card required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                  <p className="text-sm font-medium">Personalized Quiz</p>
                </div>
                <div className="space-y-2">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                  <p className="text-sm font-medium">Budget-Friendly Products</p>
                </div>
                <div className="space-y-2">
                  <Check className="h-5 w-5 text-primary mx-auto" />
                  <p className="text-sm font-medium">3 Free Ingredient Scans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
