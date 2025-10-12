import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FlaskConical, RefreshCw, Share2, ExternalLink, User, Calendar, Check } from "lucide-react";
import { useLocation } from "wouter";
import { WeeklyRoutine } from "@/components/WeeklyRoutine";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Routine } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("products");
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);

  const { data: currentRoutine, isLoading, isFetching } = useQuery<Routine>({
    queryKey: ['/api/routines/current'],
    enabled: !!user,
  });

  const { data: allRoutines } = useQuery<Routine[]>({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });

  const routineData = currentRoutine?.routineData as any;
  const products = routineData?.products;
  const routineType = routineData?.routineType;

  const isPremium = (user as any)?.isPremium || false;
  const isRoutineLoading = isLoading || isFetching;

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
              <div className="font-serif text-3xl font-normal text-foreground">free skin</div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  <User className="h-5 w-5" />
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
            <div className="font-serif text-3xl font-normal text-foreground">free skin</div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setLocation('/ingredient-checker')}
                data-testid="button-ingredient-checker"
              >
                <FlaskConical className="h-4 w-4" />
                ingredient checker
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="button-logout"
              >
                <User className="h-5 w-5" />
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
                Your Routine{currentRoutine.name ? `, ${currentRoutine.name}` : ''}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentRoutine.skinType} skin • {currentRoutine.acneSeverity} acne
                {isPremium && <Badge className="ml-2" variant="secondary">Premium</Badge>}
              </p>
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
            <TabsList className="grid w-full max-w-2xl grid-cols-3" data-testid="tabs-dashboard">
              <TabsTrigger value="products" data-testid="tab-products">My Products</TabsTrigger>
              <TabsTrigger 
                value="treatment" 
                disabled={!isPremium}
                data-testid="tab-treatment"
              >
                {isPremium ? 'Treatment Plan' : 'Treatment Plan (Premium)'}
              </TabsTrigger>
              <TabsTrigger value="library" data-testid="tab-library">Routine Library</TabsTrigger>
            </TabsList>

            {/* My Products Tab */}
            <TabsContent value="products" className="space-y-6 mt-6">
              {/* Morning Routine */}
              <Card data-testid="card-morning-routine">
                <CardHeader>
                  <CardTitle className="text-2xl">Morning Routine</CardTitle>
                  <CardDescription>Start your day with these products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {morningProducts.map((product: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover-elevate"
                      data-testid={`product-morning-${index}`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-medium text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        {product.affiliateLink && (
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => window.open(product.affiliateLink, '_blank')}
                              data-testid={`button-buy-morning-${index}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Buy Now
                            </Button>
                            
                            {isPremium && product.premiumOptions && product.premiumOptions.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Premium Alternatives:</p>
                                {product.premiumOptions.map((link: string, altIndex: number) => (
                                  <Button
                                    key={altIndex}
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => window.open(link, '_blank')}
                                    data-testid={`button-alternative-morning-${index}-${altIndex}`}
                                  >
                                    Option {altIndex + 1}
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {product.tier && (
                        <Badge variant="secondary">{product.tier}</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Evening Routine */}
              <Card data-testid="card-evening-routine">
                <CardHeader>
                  <CardTitle className="text-2xl">Evening Routine</CardTitle>
                  <CardDescription>Wind down with your PM skincare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {eveningProducts.map((product: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover-elevate"
                      data-testid={`product-evening-${index}`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-medium text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        {product.affiliateLink && (
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => window.open(product.affiliateLink, '_blank')}
                              data-testid={`button-buy-evening-${index}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Buy Now
                            </Button>
                            
                            {isPremium && product.premiumOptions && product.premiumOptions.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Premium Alternatives:</p>
                                {product.premiumOptions.map((link: string, altIndex: number) => (
                                  <Button
                                    key={altIndex}
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => window.open(link, '_blank')}
                                    data-testid={`button-alternative-evening-${index}-${altIndex}`}
                                  >
                                    Option {altIndex + 1}
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {product.tier && (
                        <Badge variant="secondary">{product.tier}</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

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
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>{routine.skinType} skin • {routine.acneSeverity} acne</p>
                            <p>{totalProducts} products total</p>
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
                  {((selectedRoutine.routineData as any)?.products?.morning || []).map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-xs">{product.category}</p>
                      </div>
                      {product.tier && (
                        <Badge variant="outline" className="text-xs">{product.tier}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evening Products */}
              <div className="space-y-3">
                <h3 className="font-medium">Evening Routine</h3>
                <div className="space-y-2">
                  {((selectedRoutine.routineData as any)?.products?.evening || []).map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-xs">{product.category}</p>
                      </div>
                      {product.tier && (
                        <Badge variant="outline" className="text-xs">{product.tier}</Badge>
                      )}
                    </div>
                  ))}
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
    </div>
  );
}
