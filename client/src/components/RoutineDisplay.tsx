import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "./ProductCard";
import { CompactProductCard } from "./CompactProductCard";
import { PremiumUpsell } from "./PremiumUpsell";
import { WeeklyRoutine } from "./WeeklyRoutine";
import type { RoutineType } from "@shared/weeklyRoutines";
import { getProductById } from "@shared/productLibrary";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import { Home, RefreshCw, LogIn, Mail, Info, Snowflake } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Footer } from "./Footer";

interface RoutineDisplayProps {
  userName: string;
  skinType: string;
  acneTypes?: string[];
  acneSeverity?: string;
  routineType?: RoutineType;
  products: {
    morning: Product[];
    evening: Product[];
  };
  isPremiumUser?: boolean;
  isAuthenticated?: boolean;
  justCreatedAccount?: boolean;
  onRetakeQuiz?: () => void;
  onLoginClick?: () => void;
  onCreateAccountClick?: () => void;
  onHomeClick?: () => void;
}

export function RoutineDisplay({
  userName,
  skinType,
  acneTypes = [],
  acneSeverity,
  routineType,
  products,
  isPremiumUser = false,
  isAuthenticated = false,
  justCreatedAccount = false,
  onRetakeQuiz,
  onLoginClick,
  onCreateAccountClick,
  onHomeClick,
}: RoutineDisplayProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if routine type has ice steps (inflamed only)
  const hasIceStep = routineType === 'inflamed';
  const iceGlobesProduct = getProductById('ice-globes');

  const handleMailingListSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call - in real implementation, connect to mailing list service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success!",
      description: "You've been added to our mailing list for acne-safe tips and tricks.",
    });
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-20 flex items-center justify-between">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md transition-colors"
            data-testid="button-home"
          >
            <img src={logoPath} alt="AcneAgent" className="h-10" />
          </button>
          
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  className="rounded-full gap-2"
                  data-testid="button-login-nav"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Button>
                <Button
                  variant="default"
                  onClick={onCreateAccountClick}
                  className="rounded-full gap-2"
                  data-testid="button-create-account-nav"
                >
                  Create Account
                </Button>
              </>
            ) : justCreatedAccount && !isPremiumUser ? (
              <Button
                variant="default"
                className="rounded-full gap-2"
                data-testid="button-upgrade-premium"
              >
                Upgrade to Premium
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Affiliate Disclosure Notice */}
      <div className="pt-20">
        <div className="bg-muted/30 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 py-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground text-center">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>
                Some product links are affiliate links. The small commission we receive when you purchase using these links allows us to provide our personalized, evidence-based guidance at no extra cost to you.{" "}
                <Link 
                  href="/affiliate-disclosure"
                  className="text-foreground underline hover:no-underline"
                  data-testid="link-affiliate-disclosure"
                >
                  Learn more
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs uppercase tracking-wide">
              Your
            </Badge>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6" data-testid="text-greeting">
            {userName}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your personalized skincare routine for{" "}
            <span className="text-foreground font-medium" data-testid="badge-skin-type">{skinType} skin</span>
            {acneTypes && acneTypes.length > 0 && (
              <>
                {" "}with{" "}
                <span className="text-foreground font-medium">
                  {acneTypes.map(type => type.replace('-', ' ')).join(', ')}
                </span>
              </>
            )}
            {acneSeverity && (
              <>
                {" "}({" "}
                <span className="text-foreground font-medium">{acneSeverity}</span>
                {" "}severity)
              </>
            )}
          </p>

          <div className="mb-8">
            <Button
              variant="outline"
              onClick={onRetakeQuiz}
              className="gap-2"
              data-testid="button-retake-quiz"
            >
              <RefreshCw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
          {!isPremiumUser && (
            <div className="mt-8">
              <PremiumUpsell 
                title="Premium users see better results"
                description="Upgrade to AcneAgent Premium (/month) for step-by-step guidance on how to properly ramp up on actives to best treat your acne. Includes personalized, weekly routine instructions with timing for benzoyl peroxide application and serum usage, access to premium product alternatives, and tools like an acne-safe ingredient checker to make sure you get clear and stay clear."
              />
            </div>
          )}
          
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
            
            {hasIceStep && iceGlobesProduct && (
              <div className="mt-8 space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Snowflake className="w-4 h-4" />
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
            
            {!isPremiumUser && <PremiumUpsell />}
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
            {!isPremiumUser && (
              <div className="mt-8">
                <PremiumUpsell 
                  title="Unlock Your Progressive Treatment Schedule"
                  description="AcneAgent Premium users get detailed routines showing exactly when and how to apply each product during your first 6 weeks. Learn the right way to introduce actives and build tolerance safely."
                />
              </div>
            )}
          </div>
        </div>

        {/* Mailing List Signup - Only for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mt-16 p-8 rounded-lg bg-muted/50 border border-border">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-2xl font-semibold mb-2">
                Get Acne-Safe Tips & Tricks
              </h3>
              <p className="text-muted-foreground mb-6">
                Join our mailing list for expert skincare advice, ingredient insights, and exclusive offers.
              </p>
              <form onSubmit={handleMailingListSignup} className="flex gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  data-testid="input-email-signup"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-full"
                  data-testid="button-subscribe"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
