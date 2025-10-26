import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { STRIPE_PRICE_IDS, PRODUCT_PRICES } from "@/lib/stripe";
import { useFoundingRate } from "@/hooks/useFoundingRate";
import { Check, Crown, Sparkles, Scan } from "lucide-react";
import { Link } from "wouter";

interface ScanPaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScanPaywallModal({ open, onClose }: ScanPaywallModalProps) {
  const { data: foundingRate } = useFoundingRate();
  const isFoundingActive = foundingRate?.active ?? false;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Unlock Ingredient Scanning
          </DialogTitle>
          <DialogDescription>
            Choose a plan to continue checking ingredients for acne-causing compounds
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="premium" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="premium" data-testid="tab-premium">
              Premium Membership
            </TabsTrigger>
            <TabsTrigger value="scans" data-testid="tab-scans">
              Scan Packs
            </TabsTrigger>
          </TabsList>

          {/* Premium Tab */}
          <TabsContent value="premium" className="space-y-4 mt-4">
            <Card>
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
                  Unlimited scans + complete skincare system
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${isFoundingActive ? PRODUCT_PRICES.PREMIUM_FOUNDING : PRODUCT_PRICES.PREMIUM_STANDARD}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {isFoundingActive && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Lock in this rate forever • Regular price: ${PRODUCT_PRICES.PREMIUM_STANDARD}/month
                    </p>
                  )}
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Unlimited ingredient scans</span>
                  </li>
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
                    <span>Priority support and updates</span>
                  </li>
                </ul>
              </CardContent>

              <CardFooter>
                <CheckoutButton
                  priceId={isFoundingActive ? STRIPE_PRICE_IDS.PREMIUM_FOUNDING : STRIPE_PRICE_IDS.PREMIUM_STANDARD}
                  label={isFoundingActive ? "Lock In Founding Rate" : "Upgrade to Premium"}
                  size="lg"
                  className="w-full"
                  productType="premium_subscription"
                  amount={isFoundingActive ? PRODUCT_PRICES.PREMIUM_FOUNDING : PRODUCT_PRICES.PREMIUM_STANDARD}
                />
              </CardFooter>
            </Card>

            <div className="text-center">
              <Button variant="ghost" asChild data-testid="link-see-all-plans">
                <Link href="/pricing">See all plans</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Scan Packs Tab */}
          <TabsContent value="scans" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* 20-Pack */}
              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Best Value</Badge>
                  <CardTitle className="mt-2">20 Scans</CardTitle>
                  <CardDescription>Perfect for regular use</CardDescription>
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
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS.SCAN_PACK_20}
                    label="Purchase 20 Scans"
                    variant="default"
                    className="w-full"
                    productType="scan_pack_20"
                    amount={PRODUCT_PRICES.SCAN_PACK_20}
                  />
                </CardFooter>
              </Card>

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
                  <p className="text-sm text-muted-foreground">
                    Just $0.40 per scan
                  </p>
                </CardContent>

                <CardFooter>
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS.SCAN_PACK_5}
                    label="Purchase 5 Scans"
                    variant="outline"
                    className="w-full"
                    productType="scan_pack_5"
                    amount={PRODUCT_PRICES.SCAN_PACK_5}
                  />
                </CardFooter>
              </Card>
            </div>

            {/* Unlimited Scanner - Only show if NOT founding period */}
            {!isFoundingActive && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Unlimited Scans Subscription
                  </CardTitle>
                  <CardDescription>
                    Monthly subscription for unlimited ingredient checking
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${PRODUCT_PRICES.UNLIMITED_SCANNER}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm">
                    Scan unlimited product ingredients anytime
                  </p>
                </CardContent>

                <CardFooter>
                  <CheckoutButton
                    priceId={STRIPE_PRICE_IDS.UNLIMITED_SCANNER}
                    label="Subscribe for Unlimited"
                    variant="default"
                    className="w-full"
                    productType="unlimited_scanner"
                    amount={PRODUCT_PRICES.UNLIMITED_SCANNER}
                  />
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
