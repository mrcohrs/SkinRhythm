import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductCard, type Product } from "./ProductCard";
import { CompactProductCard } from "./CompactProductCard";
import { PremiumUpsell } from "./PremiumUpsell";
import { WeeklyRoutine } from "./WeeklyRoutine";
import { InfoCard } from "./InfoCard";
import type { RoutineType } from "@shared/weeklyRoutines";
import { getProductById } from "@shared/productLibrary";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import iceGlobesIcon from "@assets/ciice_1760874110365.png";
import { Home, RefreshCw, LogIn, Mail, Info, ExternalLink, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Footer } from "./Footer";
import useEmblaCarousel from "embla-carousel-react";
import { getCategoryImage } from "@/lib/categoryImages";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RoutineDisplayProps {
  userName: string;
  skinType: string;
  acneTypes?: string[];
  acneSeverity?: string;
  isPregnantOrNursing?: boolean;
  beautyProducts?: string[];
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
  isPregnantOrNursing = false,
  beautyProducts = [],
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
  const [showCoreRoutineModal, setShowCoreRoutineModal] = useState(false);

  // Fetch cards for quiz results page
  const { data: cards = [] } = useQuery<any[]>({
    queryKey: ['/api/cards/quiz-results'],
    enabled: isAuthenticated,
  });

  // Card interaction mutation
  const cardInteractMutation = useMutation({
    mutationFn: async ({ cardId, action }: { cardId: string; action: string }) => {
      return apiRequest('POST', '/api/cards/interact', { cardId, action });
    },
  });

  // Check if routine type has ice steps (inflamed only)
  const hasIceStep = routineType === 'inflamed';
  const iceGlobesProduct = getProductById('ice-globes');

  // Combine all products for carousel - deduplicate by category
  const allProducts = [...products.morning, ...products.evening].reduce((acc: Product[], current) => {
    const exists = acc.find(p => p.category === current.category);
    if (!exists) {
      return acc.concat([current]);
    }
    return acc;
  }, []);

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Determine beauty product CTA
  const getBeautyCTA = () => {
    if (!beautyProducts || beautyProducts.length === 0) return null;
    
    const hasMakeup = beautyProducts.includes('makeup');
    const hasTintedProducts = beautyProducts.includes('tinted-moisturizer') || beautyProducts.includes('tinted-spf');
    
    if (hasMakeup) {
      return { text: 'Explore Acne-Safe Makeup', link: '/beauty-products?type=makeup' };
    } else if (hasTintedProducts) {
      return { text: 'Explore Acne-Safe Skin Tints', link: '/beauty-products?type=skin-tints' };
    }
    return null;
  };
  
  const beautyCTA = getBeautyCTA();

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
                 The small commission AcneAgent makes when you purchase your routine products through the affiliate links on this page allows AcneAgent to provide personalized, evidence-based guidance for free.{" "}
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
              Your Personalized Routine
            </Badge>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6" data-testid="text-greeting">
            {userName}
          </h1>
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-3">Optimized for:</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                data-testid="badge-skin-type"
              >
                {skinType.charAt(0).toUpperCase() + skinType.slice(1)} Skin
              </Badge>
              {acneTypes && acneTypes.length > 0 && acneTypes.map((type, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                  data-testid={`badge-acne-type-${index}`}
                >
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              ))}
              {acneSeverity && (
                <Badge 
                  variant="outline" 
                  className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                  data-testid="badge-severity"
                >
                  {acneSeverity.charAt(0).toUpperCase() + acneSeverity.slice(1)} Severity
                </Badge>
              )}
              {isPregnantOrNursing && (
                <Badge 
                  variant="outline" 
                  className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                  data-testid="badge-pregnancy"
                >
                  Pregnancy/Nursing Safe
                </Badge>
              )}
            </div>
          </div>

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

          {/* Info Cards */}
          {isAuthenticated && cards.length > 0 && (
            <div className="mt-8 space-y-4">
              {cards.map((card: any) => (
                <InfoCard
                  key={card.cardId}
                  title={card.title}
                  body={card.body}
                  primaryCTA={card.primaryCTA}
                  secondaryCTA={card.secondaryCTA}
                  onPrimaryClick={() => {
                    cardInteractMutation.mutate({ cardId: card.cardId, action: 'clicked' });
                    if (card.cardId === 'how-it-works' || card.cardId === 'budgeting') {
                      // Navigate to dashboard
                      if (onHomeClick) onHomeClick();
                    }
                  }}
                  onSecondaryClick={card.secondaryCTA ? () => {
                    if (card.cardId === 'budgeting') {
                      setShowCoreRoutineModal(true);
                    }
                  } : undefined}
                  onDismiss={() => {
                    cardInteractMutation.mutate({ cardId: card.cardId, action: 'dismissed' });
                  }}
                />
              ))}
            </div>
          )}

          {!isPremiumUser && (
            <div className="mt-8">
              <PremiumUpsell 
                title="Premium users see better results"
                description="Lock in the Founder's rate ($2.99/month) for AcneAgent Premium. Get access to the AcneAgent Routine Coach for detailed instructions specific to your routine, premium product alternatives so you can further customize your routine, and tools like an acne-safe ingredient scanner to help you get clear and stay clear."
              />
            </div>
          )}
          
        </div>

        {isPremiumUser && routineType && (
          <div className="mb-16">
            <WeeklyRoutine routineType={routineType} products={products} />
          </div>
        )}

        <div className="space-y-8">
          {/* Shoppable Product List - Horizontal Carousel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl font-semibold" data-testid="heading-shoppable-products">Your Routine Products</h3>
              {beautyCTA && (
                <Button
                  variant="outline"
                  onClick={() => window.open(beautyCTA.link, '_blank')}
                  className="gap-2"
                  data-testid="button-beauty-cta"
                >
                  {beautyCTA.text}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-muted-foreground mb-6">Shop your personalized skincare routine</p>
            
            <div className="relative">
              {/* Scroll Buttons */}
              {canScrollPrev && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg"
                  onClick={scrollPrev}
                  aria-label="Scroll to previous products"
                  data-testid="button-carousel-prev"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              
              {canScrollNext && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg"
                  onClick={scrollNext}
                  aria-label="Scroll to next products"
                  data-testid="button-carousel-next"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}

              {/* Carousel */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                  {allProducts.map((product, index) => (
                    <div key={index} className="flex-[0_0_280px] md:flex-[0_0_320px] flex">
                      <ProductCard
                        product={product}
                        isPremiumUser={isPremiumUser}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ice Globes Upsell - For inflamed routines */}
          {hasIceStep && iceGlobesProduct && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Recommended tool for people with inflamed acne
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

          {/* Visual AM/PM Routine Display */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-semibold" data-testid="heading-routine-schedule">Your Routine Schedule</h3>
            
            {/* Morning Routine Visual */}
            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2" data-testid="tab-morning">
                <Sun className="h-5 w-5 text-yellow-500" /> Morning Routine
              </h4>
              <div className="space-y-2">
                {products.morning.map((product, index) => {
                  const productImage = getCategoryImage(product.category);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                        {index + 1}
                      </span>
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-1.5">
                        <img src={productImage} alt={product.category} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-muted-foreground text-xs">{product.category}</p>
                        {product.brand && <p className="text-muted-foreground text-xs">{product.brand}</p>}
                        {(product.priceRange || product.price) && (
                          <p className="text-xs font-medium text-foreground mt-0.5">
                            {product.priceRange || `$${product.price}`}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-shrink-0 gap-1"
                        asChild
                        data-testid={`button-buy-now-morning-${index}`}
                      >
                        <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                          Buy Now
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            {!isPremiumUser && (
              <PremiumUpsell 
                title="Unlock Your Progressive Treatment Schedule"
                description="AcneAgent Premium users get detailed routines showing exactly when and how to apply each product during your first 6 weeks. Learn the right way to introduce actives and build tolerance safely."
              />
            )}
            {/* Evening Routine Visual */}
            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2" data-testid="tab-evening">
                <Moon className="h-5 w-5 text-blue-400" /> Evening Routine
              </h4>
              <div className="space-y-2">
                {products.evening.map((product, index) => {
                  const productImage = getCategoryImage(product.category);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                        {index + 1}
                      </span>
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-1.5">
                        <img src={productImage} alt={product.category} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-muted-foreground text-xs">{product.category}</p>
                        {product.brand && <p className="text-muted-foreground text-xs">{product.brand}</p>}
                        {(product.priceRange || product.price) && (
                          <p className="text-xs font-medium text-foreground mt-0.5">
                            {product.priceRange || `$${product.price}`}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-shrink-0 gap-1"
                        asChild
                        data-testid={`button-buy-now-evening-${index}`}
                      >
                        <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                          Buy Now
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
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
      
      {/* Core Routine Modal */}
      <Dialog open={showCoreRoutineModal} onOpenChange={setShowCoreRoutineModal}>
        <DialogContent className="max-w-2xl" data-testid="dialog-core-routine">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Core Routine Essentials</DialogTitle>
            <DialogDescription>
              If you can't get your entire routine right now, start with these three essentials to keep your skin balanced and healthy (approx. $60 total).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Find Cleanser, Moisturizer, and SPF from products */}
            {(() => {
              const coreCategories = ['Cleanser', 'Moisturizer', 'SPF'];
              const coreProducts = [...products.morning, ...products.evening].filter(p => 
                coreCategories.includes(p.category)
              );
              // Remove duplicates based on category
              const uniqueCoreProducts = coreProducts.reduce((acc: Product[], current) => {
                const exists = acc.find(p => p.category === current.category);
                if (!exists) {
                  return acc.concat([current]);
                }
                return acc;
              }, []);
              
              return uniqueCoreProducts.map((product, index) => {
                const productImage = getCategoryImage(product.category);
                return (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
                      <img src={productImage} alt={product.category} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.open(product.affiliateLink, '_blank')}
                      data-testid={`button-shop-core-${index}`}
                    >
                      Shop
                    </Button>
                  </div>
                );
              });
            })()}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
