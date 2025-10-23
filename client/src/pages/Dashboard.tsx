import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FlaskConical, RefreshCw, Share2, ExternalLink, User, Calendar, Check, AlertCircle, CheckCircle, LogOut, Crown, Sun, Moon, DollarSign, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { checkIngredients } from "@shared/acneCausingIngredients";
import { useLocation } from "wouter";
import { RoutineCoach } from "@/components/RoutineCoach";
import { ProductCard } from "@/components/ProductCard";
import { CompactProductCard } from "@/components/CompactProductCard";
import { ConsentModal } from "@/components/ConsentModal";
import { InfoCard } from "@/components/InfoCard";
import { PromoBanner } from "@/components/PromoBanner";
import { RoutinePurchaseOptions } from "@/components/RoutinePurchaseOptions";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Routine } from "@shared/schema";
import { getProductById } from "@shared/productLibrary";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import { Footer } from "@/components/Footer";
import { RoutineNotes } from "@/components/RoutineNotes";
import { ProductAlternativesModal } from "@/components/ProductAlternativesModal";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { getCategoryImage } from "@/lib/categoryImages";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("products");
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  
  // Consent modal state
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  
  // Product alternatives modal state
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Ingredient checker state
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientResults, setIngredientResults] = useState<{
    foundIngredients: string[];
    safeIngredients: string[];
    totalChecked: number;
  } | null>(null);
  const [hasCheckedIngredients, setHasCheckedIngredients] = useState(false);

  // Fetch cards for My Products tab
  const { data: myProductsCards = [] } = useQuery<any[]>({
    queryKey: ['/api/cards/my-products'],
    enabled: !!user,
  });

  // Fetch current banner (premium users only)
  const { data: currentBanner = null } = useQuery<any>({
    queryKey: ['/api/banners/current'],
    enabled: !!user,
  });

  // Card interaction mutation
  const cardInteractMutation = useMutation({
    mutationFn: async ({ cardId, action }: { cardId: string; action: string }) => {
      return apiRequest('POST', '/api/cards/interact', { cardId, action });
    },
  });

  // Banner interaction mutation
  const bannerInteractMutation = useMutation({
    mutationFn: async ({ bannerId, action }: { bannerId: string; action: string }) => {
      const response = await apiRequest('POST', '/api/banners/interact', { bannerId, action });
      queryClient.invalidateQueries({ queryKey: ['/api/banners/current'] });
      return response;
    },
  });

  // Carousel state - MUST be declared before any conditional returns
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

  const { data: currentRoutine, isLoading, isFetching } = useQuery<Routine>({
    queryKey: ['/api/routines/current'],
    enabled: !!user,
  });

  const { data: allRoutines } = useQuery<Routine[]>({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });

  // Fetch selected routine with products resolved based on current routineMode
  const { data: resolvedRoutine } = useQuery<Routine>({
    queryKey: ['/api/routines', selectedRoutineId],
    queryFn: async () => {
      if (!selectedRoutineId) return null;
      const response = await fetch(`/api/routines/${selectedRoutineId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch routine');
      }
      return response.json();
    },
    enabled: !!user && !!selectedRoutineId,
  });

  // Sync resolved routine data to selectedRoutine when it loads
  useEffect(() => {
    if (resolvedRoutine) {
      setSelectedRoutine(resolvedRoutine);
    }
  }, [resolvedRoutine]);

  // Check consent status
  const { data: consentData } = useQuery<{
    dataCollectionConsent: boolean;
    aiTrainingConsent: boolean;
    consentDate: string | null;
    consentVersion: string | null;
  }>({
    queryKey: ['/api/user/consent'],
    enabled: !!user,
  });

  // Show consent modal if user has a routine but hasn't been asked about consent yet
  useEffect(() => {
    if (user && currentRoutine && consentData && !hasCheckedConsent) {
      // If user has never been asked (no consentDate), show modal
      // If they HAVE been asked (consentDate exists), respect their choice regardless of values
      const hasBeenAsked = !!consentData.consentDate;
      if (!hasBeenAsked) {
        setShowConsentModal(true);
      }
      setHasCheckedConsent(true);
    }
  }, [user, currentRoutine, consentData, hasCheckedConsent]);

  const consentMutation = useMutation({
    mutationFn: async ({ dataCollectionConsent, aiTrainingConsent }: { dataCollectionConsent: boolean; aiTrainingConsent: boolean }) => {
      const response = await apiRequest('POST', '/api/user/consent', { dataCollectionConsent, aiTrainingConsent });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/consent'] });
      setShowConsentModal(false);
      toast({
        title: "Preferences saved",
        description: "Your privacy preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    },
  });

  const routineData = currentRoutine?.routineData as any;
  const products = routineData?.products;
  const productIds = Array.isArray(routineData?.productIds) ? routineData.productIds : [];
  const routineType = routineData?.routineType;

  const isPremium = (user as any)?.isPremium || false;
  const isRoutineLoading = isLoading || isFetching;

  // Routine mode state (basic vs premium)
  const [routineMode, setRoutineMode] = useState<'basic' | 'premium'>((user as any)?.routineMode || 'premium');

  // Sync local state with user data
  useEffect(() => {
    if (user && (user as any).routineMode) {
      setRoutineMode((user as any).routineMode);
    }
  }, [user]);

  // Routine mode toggle mutation
  const routineModeMutation = useMutation({
    mutationFn: async (newMode: 'basic' | 'premium') => {
      const response = await apiRequest('POST', '/api/user/routine-mode', { routineMode: newMode });
      return await response.json();
    },
    onSuccess: (data, newMode) => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/routines/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] });
      setRoutineMode(newMode);
      toast({
        title: "Routine updated",
        description: newMode === 'premium' ? "Now showing the products that AcneAgent scores highest for your skin profile" : "Now showing the best budget-friendly products for your skin profile",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update routine mode",
        variant: "destructive",
      });
    },
  });

  // Check if routine type has ice steps (inflamed only)
  const hasIceStep = routineType === 'inflamed';
  const iceGlobesProduct = getProductById('ice-globes');

  const makeCurrentMutation = useMutation({
    mutationFn: async (routineId: string) => {
      const response = await apiRequest('POST', `/api/routines/${routineId}/set-current`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] });
      setShowRoutineModal(false);
      toast({
        title: "Success",
        description: "Routine updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update routine",
        variant: "destructive",
      });
    },
  });

  const setProductMutation = useMutation({
    mutationFn: async ({ category, productName }: { category: string; productName: string }) => {
      if (!currentRoutine) throw new Error('No current routine');
      const res = await apiRequest('POST', `/api/routines/${currentRoutine.id}/set-product`, {
        category,
        productName
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines/current'] });
      toast({
        title: "Product updated",
        description: "Your routine has been updated with the new product",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product selection",
        variant: "destructive",
      });
    }
  });

  const handleProductSelect = (category: string, productName: string) => {
    setProductMutation.mutate({ category, productName });
  };

  const handleRetakeQuiz = () => {
    setLocation('/quiz');
  };

  const handleReferFriend = () => {
    const referralUrl = window.location.origin;
    navigator.clipboard.writeText(referralUrl);
    alert('Referral link copied to clipboard!');
  };

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/user/scan', {});
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to track scan');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      // Refetch user data to update scan count display
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Perform the ingredient check
      const checkResults = checkIngredients(ingredientInput);
      setIngredientResults(checkResults);
      setHasCheckedIngredients(true);
      
      // Show remaining scans for free users
      if (typeof data.scansRemaining === 'number') {
        toast({
          title: "Scan complete",
          description: `${data.scansRemaining} scan${data.scansRemaining === 1 ? '' : 's'} remaining`,
        });
      }
    },
    onError: (error: Error) => {
      // Clear any stale results when scan limit is reached
      setIngredientResults(null);
      setHasCheckedIngredients(false);
      
      // Refetch user data to show updated scan count
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Scan limit reached",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCheckIngredients = () => {
    if (!user) {
      // Not authenticated - just check ingredients without tracking
      const checkResults = checkIngredients(ingredientInput);
      setIngredientResults(checkResults);
      setHasCheckedIngredients(true);
      return;
    }
    
    // Authenticated user - track the scan
    scanMutation.mutate();
  };

  const handleClearIngredients = () => {
    setIngredientInput("");
    setIngredientResults(null);
    setHasCheckedIngredients(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your routine...</p>
      </div>
    );
  }

  if (!currentRoutine || !products) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex h-16 items-center justify-between">
              <img src={logoPath} alt="AcneAgent" className="h-10" />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleReferFriend}
                  data-testid="button-refer-friend"
                >
                  <Share2 className="h-4 w-4" />
                  Refer a Friend
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-serif text-3xl text-foreground">No routine found</h1>
            <p className="text-muted-foreground">Take the quiz to get your personalized skincare routine</p>
            <Button onClick={handleRetakeQuiz} data-testid="button-take-quiz">
              Take Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const morningProducts = products.morning || [];
  const eveningProducts = products.evening || [];
  
  // Get unique products for shoppable list
  // Combine morning and evening products and deduplicate by product name
  const allProducts = [...morningProducts, ...eveningProducts];
  const uniqueProducts = Array.from(
    new Map(allProducts.map((p: any) => [p.name, p])).values()
  );

  // Filter products to show current selections (or default) - used for carousel
  const currentProductSelections = (currentRoutine?.currentProductSelections as Record<string, string>) || {};
  const displayProducts = uniqueProducts.map((product: any) => {
    const currentSelection = currentProductSelections[product.category];
    
    // If user has selected a different product, find it in premiumOptions
    if (currentSelection && currentSelection !== product.name && product.premiumOptions) {
      const selectedOption = product.premiumOptions.find((opt: any) => opt.productName === currentSelection);
      if (selectedOption) {
        // Extract brand from product name
        const extractBrand = (name: string) => {
          // Product type keywords and adjectives that signal the end of brand name
          const productKeywords = [
            // Product types
            'cleanser', 'moisturizer', 'serum', 'cream', 'lotion', 'gel', 'oil',
            'toner', 'treatment', 'sunscreen', 'spf', 'wash', 'balm', 'essence',
            'mask', 'scrub', 'peel', 'foam', 'milk', 'water', 'mist', 'spray',
            'solution', 'liquid', 'exfoliant', 'retinol', 'vitamin', 'acid',
            // Common product adjectives
            'gentle', 'hydrating', 'soothing', 'calming', 'clearing', 'renewing',
            'perfecting', 'skin', 'face', 'facial', 'daily', 'night', 'day',
            'anti', 'anti-aging', 'brightening', 'nourishing', 'repairing',
            'advanced', 'intensive', 'ultra', 'super', 'extra', 'deep'
          ];
          
          const words = name.split(' ');
          let brandWords = [];
          
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const lowerWord = word.toLowerCase();
            
            // Stop if we hit a product keyword
            if (productKeywords.includes(lowerWord)) break;
            
            // Stop if we hit a number (like 2% or 10oz)
            if (/\d/.test(word)) break;
            
            // Add word to brand (handling apostrophes and hyphens in brand names)
            brandWords.push(word);
            
            // Stop after 4 words max (handles "La Roche Posay" or similar)
            if (brandWords.length >= 4) break;
          }
          
          return brandWords.length > 0 ? brandWords.join(' ') : name.split(' ').slice(0, 2).join(' ');
        };

        // Return the selected alternative with extracted brand
        return {
          ...product,
          name: selectedOption.productName,
          brand: extractBrand(selectedOption.productName),
          affiliateLink: selectedOption.affiliateLink,
          originalLink: selectedOption.originalLink,
        };
      }
    }
    
    // Otherwise return the default product
    return product;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <img src={logoPath} alt="AcneAgent" className="h-10" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleReferFriend}
                data-testid="button-refer-friend"
              >
                <Share2 className="h-4 w-4" />
                Refer a Friend
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                {currentRoutine.name ? `${currentRoutine.name}` : ''}'s Routine
              </h1>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                <span>
                  {currentRoutine.skinType} skin • {currentRoutine.acneTypes && currentRoutine.acneTypes.length > 0 
                    ? currentRoutine.acneTypes.map(type => type.replace('-', ' ')).join(', ') 
                    : 'acne'} ({currentRoutine.acneSeverity})
                </span>
                {isPremium && <Badge variant="secondary">Premium</Badge>}
              </div>
              
              
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRetakeQuiz}
                data-testid="button-retake-quiz"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          </div>

          {/* Premium Banner (Weekly Rotation) */}
          {currentBanner && (
            <div className="mb-6">
              <PromoBanner
                message={currentBanner.message}
                primaryCTA={currentBanner.primaryCTA}
                onPrimaryClick={() => {
                  bannerInteractMutation.mutate({ bannerId: currentBanner.bannerId, action: 'clicked' });
                  // Navigate based on banner type
                  if (currentBanner.bannerId === 'banner-a') {
                    setActiveTab('ingredient-checker');
                  } else if (currentBanner.bannerId === 'banner-b') {
                    setActiveTab('treatment');
                  } else if (currentBanner.bannerId === 'banner-c') {
                    setActiveTab('products');
                  }
                }}
                onDismiss={() => {
                  bannerInteractMutation.mutate({ bannerId: currentBanner.bannerId, action: 'dismissed' });
                }}
              />
            </div>
          )}

          {/* Routine Mode Toggle for Premium Users */}
          {isPremium && (
            <Card className="border-border/50" data-testid="card-routine-mode-toggle">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Choose Your Routine</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Budget Option */}
                    <Button
                      variant={routineMode === 'basic' ? 'default' : 'outline'}
                      className={`h-auto py-3 px-3 md:px-4 flex flex-col items-start gap-2 transition-all ${
                        routineMode === 'basic' ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => {
                        if (routineMode !== 'basic') {
                          routineModeMutation.mutate('basic');
                        }
                      }}
                      disabled={routineModeMutation.isPending}
                      data-testid="button-routine-basic"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <DollarSign className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm md:text-base">Budget</span>
                      </div>
                      
                    </Button>

                    {/* Premium Option */}
                    <Button
                      variant={routineMode === 'premium' ? 'default' : 'outline'}
                      className={`h-auto py-3 px-3 md:px-4 flex flex-col items-start gap-2 transition-all ${
                        routineMode === 'premium' ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => {
                        if (routineMode !== 'premium') {
                          routineModeMutation.mutate('premium');
                        }
                      }}
                      disabled={routineModeMutation.isPending}
                      data-testid="button-routine-premium"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Sparkles className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm md:text-base">Premium</span>
                      </div>
                      
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs - Horizontal Scrolling Carousel */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="relative">
              {/* Gradient fade on left edge */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
              {/* Gradient fade on right edge */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />
              
              <TabsList 
                className="w-full md:max-w-3xl inline-flex md:grid md:grid-cols-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-1" 
                data-testid="tabs-dashboard"
              >
                <TabsTrigger 
                  value="products" 
                  data-testid="tab-products"
                  className="flex-shrink-0 snap-center min-w-[140px] md:min-w-0 relative overflow-hidden before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100"
                >
                  My Products
                </TabsTrigger>
                <TabsTrigger 
                  value="treatment" 
                  data-testid="tab-treatment"
                  className="flex-shrink-0 snap-center min-w-[180px] md:min-w-0 gap-1.5 relative overflow-hidden before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100"
                >
                  <span>Routine Coach</span>
                  {!isPremium && <Crown className="h-3.5 w-3.5 text-secondary" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="ingredient-checker" 
                  data-testid="tab-ingredient-checker"
                  className="flex-shrink-0 snap-center min-w-[200px] md:min-w-0 gap-1.5 relative overflow-hidden before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100"
                >
                  <span>Ingredient Scanner</span>
                  {!isPremium && <Crown className="h-3.5 w-3.5 text-secondary" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="library" 
                  data-testid="tab-library"
                  className="flex-shrink-0 snap-center min-w-[170px] md:min-w-0 gap-1.5 relative overflow-hidden before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100"
                >
                  <span>Routine Library</span>
                  {!isPremium && <Crown className="h-3.5 w-3.5 text-secondary" />}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* My Products Tab */}
            <TabsContent value="products" className="space-y-8 mt-6">
              {/* Premium Upsell for Free Users */}
              {!isPremium && (
                <Card className="border-primary/20" data-testid="card-products-upgrade">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                        <Crown className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-lg">Unlock Premium Features</h3>
                          <p className="text-sm text-muted-foreground">6-week routine coach, ingredient scanner, multiple product options to choose from for each routine step, and your routine library with notes to track what works.</p>
                        </div>
                      </div>
                      <Button data-testid="button-upgrade-products" className="flex-shrink-0" asChild>
                        <Link href="/pricing">Upgrade to Premium</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shoppable Product List - Horizontal Carousel */}
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-4" data-testid="heading-shoppable-products">Your Routine Products</h3>
                
                {/* Affiliate Disclosure */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span>
                    The commissions earned through affiliate links on this page allow AcneAgent to offer expert-level services for free.{" "}
                    <Link 
                      href="/affiliate-disclosure"
                      className="text-foreground underline hover:no-underline"
                      data-testid="link-affiliate-disclosure-dashboard"
                    >
                      Learn more
                    </Link>
                  </span>
                </div>

                
                <div>
                  {/* Scroll Buttons - Right aligned above carousel */}
                  <div className="flex justify-end gap-2 mb-4">
                    {canScrollPrev && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-lg"
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
                        className="h-10 w-10 rounded-full shadow-lg"
                        onClick={scrollNext}
                        aria-label="Scroll to next products"
                        data-testid="button-carousel-next"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="relative">
                    {/* Carousel */}
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex gap-2.5">
                        {displayProducts.map((product: any, index: number) => (
                          <div key={index} className={`flex-[0_0_280px] md:flex-[0_0_320px] ${isPremium ? 'h-[600px]' : 'h-[540px]'}`}>
                            <ProductCard
                              product={product}
                              isPremiumUser={isPremium}
                              showExploreButton={isPremium && product.premiumOptions && product.premiumOptions.length > 0}
                              onExploreAlternatives={() => {
                                setSelectedProduct(uniqueProducts[index]); // Use original product with all options
                                setShowAlternativesModal(true);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

             

              {/* Visual AM/PM Routine Display */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-semibold" data-testid="heading-routine-schedule">Your Routine Schedule</h3>
                
                {/* Morning Routine Visual */}
                <div>
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-500" /> Morning Routine
                  </h4>
                  <div className="space-y-2">
                    {morningProducts.map((product: any, index: number) => {
                      const productImage = getCategoryImage(product.category);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                            {index + 1}
                          </span>
                          <div className="flex-shrink-0 w-20 flex flex-col items-center justify-start gap-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-1.5">
                              <img src={productImage} alt={product.category} className="max-w-full max-h-full object-contain" />
                            </div>
                            <Badge variant="outline" className="text-xs whitespace-nowrap leading-tight">{product.category}</Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            {product.brand && <p className="text-muted-foreground text-xs">{product.brand}</p>}
                            {(product.priceRange || product.price) && (
                              <p className="text-xs font-medium text-foreground mt-0.5">
                                {product.priceRange || `$${product.price}`}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
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
                
                {/* Ice Globes Upsell - For inflamed routines */}
                {hasIceStep && iceGlobesProduct && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      Recommended Tool for Inflamed Acne
                    </h4>
                    <CompactProductCard 
                      product={{
                        name: iceGlobesProduct.generalName,
                        category: iceGlobesProduct.category,
                        priceTier: iceGlobesProduct.priceTier,
                        priceRange: iceGlobesProduct.priceRange,
                        affiliateLink: iceGlobesProduct.affiliateLink!,
                      }}
                      description="Icing after cleansing can help reduce inflammation. Ice cubes work but can be messy and a hassle to make. These cold globes are well worth the money."
                    />
                  </div>
                )}
                {/* Evening Routine Visual */}
                <div>
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Moon className="h-5 w-5 text-blue-400" /> Evening Routine
                  </h4>
                  <div className="space-y-2">
                    {eveningProducts.map((product: any, index: number) => {
                      const productImage = getCategoryImage(product.category);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                            {index + 1}
                          </span>
                          <div className="flex-shrink-0 w-20 flex flex-col items-center justify-start gap-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-1.5">
                              <img src={productImage} alt={product.category} className="max-w-full max-h-full object-contain" />
                            </div>
                            <Badge variant="outline" className="text-xs whitespace-nowrap leading-tight">{product.category}</Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            {product.brand && <p className="text-muted-foreground text-xs">{product.brand}</p>}
                            {(product.priceRange || product.price) && (
                              <p className="text-xs font-medium text-foreground mt-0.5">
                                {product.priceRange || `$${product.price}`}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
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

              {/* Info Cards */}
              {myProductsCards.length > 0 && (
                <div className="mt-8 space-y-4">
                  {myProductsCards.map((card: any) => (
                    <InfoCard
                      key={card.cardId}
                      title={card.title}
                      body={card.body}
                      primaryCTA={card.primaryCTA}
                      onPrimaryClick={() => {
                        cardInteractMutation.mutate({ cardId: card.cardId, action: 'clicked' });
                        if (card.cardId === 'scanner-access') {
                          setActiveTab('ingredient-checker');
                        } else if (card.cardId === 'makeup-reminder') {
                          window.open('/beauty-products', '_blank');
                        } else if (card.cardId === 'contact-us') {
                          // TODO: Open contact modal or navigate to contact page
                          toast({
                            title: "Contact Us",
                            description: "Contact functionality coming soon!",
                          });
                        }
                      }}
                      onDismiss={() => {
                        cardInteractMutation.mutate({ cardId: card.cardId, action: 'dismissed' });
                      }}
                      variant={card.cardId === 'contact-us' && isPremium ? 'compact' : 'default'}
                    />
                  ))}
                </div>
              )}

              {/* Purchase Options for free users */}
              {!isPremium && (
                <RoutinePurchaseOptions isAuthenticated={!!user} className="mt-8" />
              )}
            </TabsContent>

            {/* Routine Coach Tab */}
            <TabsContent value="treatment" className="space-y-6 mt-6">
              {!isPremium ? (
                <Card className="border-primary/20" data-testid="card-treatment-upgrade">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-10 w-10 text-primary flex-shrink-0" />
                      <div>
                        <CardTitle>Premium Feature: Routine Coach</CardTitle>
                        <CardDescription>
                          Get detailed, week-by-week guidance for maximum results
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">6-Week Progressive Routine</h4>
                          <p className="text-sm text-muted-foreground">Step-by-step instructions for each week of your treatment</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Product Usage Schedule</h4>
                          <p className="text-sm text-muted-foreground">Know exactly when and how to use each product</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Clinical Treatment Notes</h4>
                          <p className="text-sm text-muted-foreground">Expert guidance for managing side effects and optimizing results</p>
                        </div>
                      </div>
                    </div>
                    <Button data-testid="button-upgrade-treatment" className="w-full" asChild>
                      <Link href="/pricing">Upgrade to Premium</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : isRoutineLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">Loading routine coach...</div>
                </div>
              ) : routineType && products ? (
                <RoutineCoach
                  routineType={routineType}
                  userName={currentRoutine.name || "User"}
                  products={products}
                  routineId={currentRoutine.id}
                  currentProductSelections={currentRoutine.currentProductSelections as Record<string, string> || {}}
                  notes={currentRoutine.notes as Array<{id: string, date: string, text: string}> || []}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <p className="text-muted-foreground">No treatment plan available for this routine.</p>
                  <p className="text-sm text-muted-foreground">This routine may have been created before treatment plans were available.</p>
                </div>
              )}
            </TabsContent>

            {/* Ingredient Checker Tab */}
            <TabsContent value="ingredient-checker" className="space-y-6 mt-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Free User Scan Counter */}
                {!isPremium && (
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <FlaskConical className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">
                              {Math.max(0, 3 - ((user as any)?.scanCredits || 0))} free scan{Math.max(0, 3 - ((user as any)?.scanCredits || 0)) === 1 ? '' : 's'} remaining
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Upgrade to Premium for unlimited scans
                            </div>
                          </div>
                        </div>
                        <Button size="sm" data-testid="button-upgrade-scans" asChild>
                          <Link href="/pricing">
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Out of Scans - Upgrade Prompt */}
                {!isPremium && (user as any)?.scanCredits && (user as any).scanCredits >= 3 ? (
                  <Card className="border-primary/20" data-testid="card-scans-exhausted">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="h-10 w-10 text-primary flex-shrink-0" />
                        <div>
                          <CardTitle>Out of Free Scans</CardTitle>
                          <CardDescription>
                            Upgrade to Premium for unlimited ingredient scans
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Unlimited Ingredient Scans</h4>
                            <p className="text-sm text-muted-foreground">Check as many products as you want</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Product Alternatives</h4>
                            <p className="text-sm text-muted-foreground">Explore budget and premium product options</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">6-Week Routine Coach</h4>
                            <p className="text-sm text-muted-foreground">Detailed week-by-week treatment guidance</p>
                          </div>
                        </div>
                      </div>
                      <Button data-testid="button-upgrade-no-scans" className="w-full" asChild>
                        <Link href="/pricing">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                  {/* Input Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ingredient List</CardTitle>
                      <CardDescription>
                        Copy and paste the ingredients from your product label to check for acne-causing ingredients
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Example:
Water
Glycerin
Niacinamide
Coconut Oil
Hyaluronic Acid"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                        data-testid="textarea-ingredients"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleCheckIngredients}
                          disabled={!ingredientInput.trim() || scanMutation.isPending || (!isPremium && !!user && ((user as any).scanCredits || 0) >= 3)}
                          className="flex-1"
                          data-testid="button-check-ingredients"
                        >
                          {scanMutation.isPending ? 'Checking...' : 'Check Ingredients'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleClearIngredients}
                          disabled={!ingredientInput && !hasCheckedIngredients}
                          data-testid="button-clear"
                        >
                          Clear
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Empty State Card */}
                  {!hasCheckedIngredients && myProductsCards.length > 0 && (
                    <div className="mt-6">
                      {myProductsCards
                        .filter((card: any) => card.cardId === 'scanner-access')
                        .map((card: any) => (
                          <InfoCard
                            key={card.cardId}
                            title={card.title}
                            body={card.body}
                            primaryCTA={card.primaryCTA}
                            onPrimaryClick={() => {
                              cardInteractMutation.mutate({ cardId: card.cardId, action: 'clicked' });
                              // Scroll to ingredient input
                              const textarea = document.querySelector('[data-testid="textarea-ingredients"]');
                              if (textarea) {
                                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                (textarea as HTMLTextAreaElement).focus();
                              }
                            }}
                            onDismiss={() => {
                              cardInteractMutation.mutate({ cardId: card.cardId, action: 'dismissed' });
                            }}
                          />
                        ))}
                    </div>
                  )}

                  {/* Results Section */}
                  {hasCheckedIngredients && ingredientResults && (
                    <div className="space-y-6">
                      {/* Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Results Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                              <div className="text-3xl font-bold text-foreground">
                                {ingredientResults.totalChecked}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Total Checked
                              </div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-destructive/10">
                              <div className="text-3xl font-bold text-destructive">
                                {ingredientResults.foundIngredients.length}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Acne-Causing
                              </div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-primary/10">
                              <div className="text-3xl font-bold text-primary">
                                {ingredientResults.safeIngredients.length}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Safe
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Acne-Causing Ingredients */}
                      {ingredientResults.foundIngredients.length > 0 && (
                        <Card className="border-destructive/50">
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-6 w-6 text-destructive mt-1" />
                              <div>
                                <CardTitle className="text-destructive">
                                  Acne-Causing Ingredients Found
                                </CardTitle>
                                <CardDescription>
                                  These ingredients may clog pores and cause breakouts
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {ingredientResults.foundIngredients.map((ingredient, index) => (
                                <Badge
                                  key={index}
                                  variant="destructive"
                                  className="text-sm"
                                  data-testid={`badge-acne-causing-${index}`}
                                >
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Safe Ingredients */}
                      {ingredientResults.safeIngredients.length > 0 && (
                        <Card className="border-primary/50">
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-6 w-6 text-primary mt-1" />
                              <div>
                                <CardTitle className="text-primary">
                                  Safe Ingredients
                                </CardTitle>
                                <CardDescription>
                                  These ingredients are not known to cause acne
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {ingredientResults.safeIngredients.map((ingredient, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-sm"
                                  data-testid={`badge-safe-${index}`}
                                >
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* All Clear Message */}
                      {ingredientResults.foundIngredients.length === 0 && ingredientResults.totalChecked > 0 && (
                        <Card className="border-primary/50 bg-primary/5">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-8 w-8 text-primary flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-lg text-primary">
                                  All Clear!
                                </h3>
                                <p className="text-muted-foreground">
                                  No acne-causing ingredients detected in this product.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              )}
              </div>
            </TabsContent>

            {/* Routine Library Tab */}
            <TabsContent value="library" className="space-y-6 mt-6">
              {!isPremium ? (
                <Card className="border-primary/20" data-testid="card-library-upgrade">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-10 w-10 text-primary flex-shrink-0" />
                      <div>
                        <CardTitle>Premium Feature: Routine Library</CardTitle>
                        <CardDescription>
                          Save and switch between multiple personalized routines
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Unlimited Saved Routines</h4>
                          <p className="text-sm text-muted-foreground">Create routines for different seasons, skin conditions, or goals</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Easy Routine Switching</h4>
                          <p className="text-sm text-muted-foreground">Switch between routines with one click</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Routine History</h4>
                          <p className="text-sm text-muted-foreground">Track which routines worked best for your skin</p>
                        </div>
                      </div>
                    </div>
                    <Button data-testid="button-upgrade-library" className="w-full" asChild>
                      <Link href="/pricing">Upgrade to Premium</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allRoutines && allRoutines.length > 0 ? (
                    allRoutines.map((routine) => {
                      const isCurrent = routine.isCurrent;
                      const routineProducts = (routine.routineData as any)?.products;
                      const totalProducts = (routineProducts?.morning?.length || 0) + (routineProducts?.evening?.length || 0);
                      
                      return (
                        <Card
                          key={routine.id}
                          className={`cursor-pointer hover-elevate ${isCurrent ? 'border-primary' : ''}`}
                          onClick={() => {
                            setSelectedRoutineId(routine.id);
                            setShowRoutineModal(true);
                          }}
                          data-testid={`routine-card-${routine.id}`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">
                                  {routine.name ? `${routine.name}'s Routine` : 'My Routine'}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(routine.createdAt!).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              {isCurrent && (
                                <Badge className="gap-1">
                                  <Check className="h-3 w-3" />
                                  Current
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge 
                                  variant="outline" 
                                  className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                                >
                                  {routine.skinType} skin
                                </Badge>
                                {routine.acneTypes && routine.acneTypes.length > 0 && routine.acneTypes.map((type, index) => (
                                  <Badge 
                                    key={index}
                                    variant="outline" 
                                    className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                                  >
                                    {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </Badge>
                                ))}
                                <Badge 
                                  variant="outline" 
                                  className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                                >
                                  {routine.acneSeverity} severity
                                </Badge>
                                {routine.isPregnantOrNursing && (
                                  <Badge 
                                    variant="outline" 
                                    className="border-2 border-foreground bg-transparent text-foreground hover:bg-transparent"
                                  >
                                    Pregnancy/Nursing Safe
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{totalProducts} products total</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No routines in your library yet</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Routine Details Modal */}
      <Dialog open={showRoutineModal} onOpenChange={setShowRoutineModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRoutine?.name ? `${selectedRoutine.name}'s Routine` : 'Routine Details'}
            </DialogTitle>
            <DialogDescription>
              Created {selectedRoutine?.createdAt && new Date(selectedRoutine.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedRoutine && (
            <div className="space-y-6">
              {/* Routine Info */}
              <div className="flex gap-2">
                <Badge variant="secondary">{selectedRoutine.skinType} skin</Badge>
                <Badge variant="secondary">{selectedRoutine.acneSeverity} acne</Badge>
                {selectedRoutine.isCurrent && (
                  <Badge>Current Routine</Badge>
                )}
              </div>

              {/* Morning Products */}
              <div className="space-y-3">
                <h3 className="font-medium">Morning Routine</h3>
                <div className="space-y-2">
                  {((selectedRoutine.routineData as any)?.products?.morning || []).map((product: any, index: number) => {
                    const productImage = getCategoryImage(product.category);
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                          {index + 1}
                        </span>
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
                          <img src={productImage} alt={product.category} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-muted-foreground text-xs">{product.category}</p>
                        </div>
                        {product.tier && (
                          <Badge variant="outline" className="text-xs">{product.tier}</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evening Products */}
              <div className="space-y-3">
                <h3 className="font-medium">Evening Routine</h3>
                <div className="space-y-2">
                  {((selectedRoutine.routineData as any)?.products?.evening || []).map((product: any, index: number) => {
                    const productImage = getCategoryImage(product.category);
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                          {index + 1}
                        </span>
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center p-2">
                          <img src={productImage} alt={product.category} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-muted-foreground text-xs">{product.category}</p>
                        </div>
                        {product.tier && (
                          <Badge variant="outline" className="text-xs">{product.tier}</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Routine Notes */}
              <div className="border-t pt-6">
                <RoutineNotes 
                  routineId={selectedRoutine.id} 
                  notes={selectedRoutine.notes as Array<{id: string, date: string, text: string}> || []} 
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoutineModal(false)}
              data-testid="button-cancel-routine"
            >
              Cancel
            </Button>
            {selectedRoutine && !selectedRoutine.isCurrent && (
              <Button
                onClick={() => makeCurrentMutation.mutate(selectedRoutine.id)}
                disabled={makeCurrentMutation.isPending}
                data-testid="button-make-current"
              >
                {makeCurrentMutation.isPending ? 'Updating...' : 'Make Current'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Alternatives Modal */}
      {selectedProduct && (
        <ProductAlternativesModal
          open={showAlternativesModal}
          onOpenChange={setShowAlternativesModal}
          product={selectedProduct}
          currentProductName={currentProductSelections[selectedProduct.category] || selectedProduct.name}
          onSetCurrent={(productName) => {
            handleProductSelect(selectedProduct.category, productName);
            setShowAlternativesModal(false);
          }}
          isPending={setProductMutation.isPending}
        />
      )}

      {/* Consent Modal */}
      <ConsentModal
        open={showConsentModal}
        onConsent={(dataCollection, aiTraining) => {
          consentMutation.mutate({
            dataCollectionConsent: dataCollection,
            aiTrainingConsent: aiTraining,
          });
        }}
        onSkip={() => setShowConsentModal(false)}
        allowSkip={true}
      />
      
      <Footer />
    </div>
  );
}
