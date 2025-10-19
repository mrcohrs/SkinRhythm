import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FlaskConical, RefreshCw, Share2, ExternalLink, User, Calendar, Check, AlertCircle, CheckCircle, LogOut, Snowflake } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { checkIngredients } from "@shared/acneCausingIngredients";
import { useLocation } from "wouter";
import { WeeklyRoutine } from "@/components/WeeklyRoutine";
import { ProductCard } from "@/components/ProductCard";
import { CompactProductCard } from "@/components/CompactProductCard";
import { ConsentModal } from "@/components/ConsentModal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Routine } from "@shared/schema";
import { getProductById } from "@shared/productLibrary";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import { Footer } from "@/components/Footer";
import { Info } from "lucide-react";
import { Link } from "wouter";

import cleanserImg from "@assets/Cleanser_1760341831448.png";
import tonerImg from "@assets/Toner_1760341831459.png";
import serumImg from "@assets/serum_1760341636653.png";
import hydratorImg from "@assets/hydrator_1760341831459.png";
import moisturizerImg from "@assets/Moisturizer_1760341636653.png";
import spfImg from "@assets/SPF_1760341636654.png";
import spotTreatmentImg from "@assets/BPO_1760341850620.png";

const categoryImages: Record<string, string> = {
  "Cleanser": cleanserImg,
  "Toner": tonerImg,
  "Serum": serumImg,
  "Hydrator": hydratorImg,
  "Moisturizer": moisturizerImg,
  "SPF": spfImg,
  "Spot Treatment": spotTreatmentImg,
};

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("products");
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  
  // Consent modal state
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  
  // Ingredient checker state
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientResults, setIngredientResults] = useState<{
    foundIngredients: string[];
    safeIngredients: string[];
    totalChecked: number;
  } | null>(null);
  const [hasCheckedIngredients, setHasCheckedIngredients] = useState(false);

  const { data: currentRoutine, isLoading, isFetching } = useQuery<Routine>({
    queryKey: ['/api/routines/current'],
    enabled: !!user,
  });

  const { data: allRoutines } = useQuery<Routine[]>({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });

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
  const routineType = routineData?.routineType;

  const isPremium = (user as any)?.isPremium || false;
  const isRoutineLoading = isLoading || isFetching;

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

  const handleRetakeQuiz = () => {
    setLocation('/quiz');
  };

  const handleReferFriend = () => {
    const referralUrl = window.location.origin;
    navigator.clipboard.writeText(referralUrl);
    alert('Referral link copied to clipboard!');
  };

  const handleCheckIngredients = () => {
    const checkResults = checkIngredients(ingredientInput);
    setIngredientResults(checkResults);
    setHasCheckedIngredients(true);
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
              <div className="flex items-center gap-4">
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <img src={logoPath} alt="AcneAgent" className="h-10" />
            <div className="flex items-center gap-4">
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

      {/* Affiliate Disclosure Notice */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>
              The small commission AcneAgent makes when you purchase your routine products through the affiliate links on this page allows AcneAgent to provide personalized, evidence-based guidance for free.{" "}
              <Link 
                href="/affiliate-disclosure"
                className="text-foreground underline hover:no-underline"
                data-testid="link-affiliate-disclosure-dashboard"
              >
                Learn more
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                Your Routine{currentRoutine.name ? `, ${currentRoutine.name}` : ''}
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
                onClick={handleReferFriend}
                data-testid="button-refer-friend"
              >
                <Share2 className="h-4 w-4" />
                Refer a Friend
              </Button>
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-3xl grid-cols-4" data-testid="tabs-dashboard">
              <TabsTrigger value="products" data-testid="tab-products">My Products</TabsTrigger>
              <TabsTrigger 
                value="treatment" 
                disabled={!isPremium}
                data-testid="tab-treatment"
              >
                {isPremium ? 'Treatment Plan' : 'Treatment Plan (Premium)'}
              </TabsTrigger>
              <TabsTrigger value="ingredient-checker" data-testid="tab-ingredient-checker">Ingredient Checker</TabsTrigger>
              <TabsTrigger value="library" data-testid="tab-library">Routine Library</TabsTrigger>
            </TabsList>

            {/* My Products Tab */}
            <TabsContent value="products" className="space-y-8 mt-6">
              {/* Morning Routine */}
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-4" data-testid="heading-morning-routine">Morning Routine</h3>
                <p className="text-muted-foreground mb-6">Start your day with these products</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {morningProducts.map((product: any, index: number) => (
                    <ProductCard
                      key={index}
                      product={product}
                      isPremiumUser={isPremium}
                    />
                  ))}
                </div>
              </div>

              {/* Ice Globes Upsell - For inflamed routines */}
              {hasIceStep && iceGlobesProduct && (
                <div className="space-y-2">
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

              {/* Evening Routine */}
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-4" data-testid="heading-evening-routine">Evening Routine</h3>
                <p className="text-muted-foreground mb-6">Wind down with your PM skincare</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {eveningProducts.map((product: any, index: number) => (
                    <ProductCard
                      key={index}
                      product={product}
                      isPremiumUser={isPremium}
                    />
                  ))}
                </div>
              </div>

              {/* Premium Upsell if not premium */}
              {!isPremium && (
                <Card className="border-primary/20" data-testid="card-premium-upsell">
                  <CardHeader>
                    <CardTitle>Unlock Your Detailed Treatment Plan</CardTitle>
                    <CardDescription>
                      Get week-by-week guidance on how to use these products for maximum results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button data-testid="button-upgrade-premium">Upgrade to Premium</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Detailed Treatment Plan Tab */}
            <TabsContent value="treatment" className="space-y-6 mt-6">
              {isRoutineLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">Loading treatment plan...</div>
                </div>
              ) : isPremium && routineType && products ? (
                <WeeklyRoutine
                  routineType={routineType}
                  products={products}
                />
              ) : isPremium && !routineType ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <p className="text-muted-foreground">No treatment plan available for this routine.</p>
                  <p className="text-sm text-muted-foreground">This routine may have been created before treatment plans were available.</p>
                </div>
              ) : null}
            </TabsContent>

            {/* Ingredient Checker Tab */}
            <TabsContent value="ingredient-checker" className="space-y-6 mt-6">
              <div className="max-w-4xl mx-auto space-y-6">
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
                        disabled={!ingredientInput.trim()}
                        className="flex-1"
                        data-testid="button-check-ingredients"
                      >
                        Check Ingredients
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
            </TabsContent>

            {/* Routine Library Tab */}
            <TabsContent value="library" className="space-y-6 mt-6">
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
                          setSelectedRoutine(routine);
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
                    const productImage = categoryImages[product.category] || categoryImages["Serum"];
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
                    const productImage = categoryImages[product.category] || categoryImages["Serum"];
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
