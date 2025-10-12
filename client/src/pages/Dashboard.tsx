import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, RefreshCw, Share2, ExternalLink, User } from "lucide-react";
import { useLocation } from "wouter";
import { WeeklyRoutine } from "@/components/WeeklyRoutine";
import type { Routine } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("products");

  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });

  const latestRoutine = routines?.[0];
  const routineData = latestRoutine?.routineData as any;
  const products = routineData?.products;
  const routineType = routineData?.routineType;

  const isPremium = (user as any)?.isPremium || false;

  const handleRetakeQuiz = () => {
    setLocation('/?retake=true');
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

  if (!latestRoutine || !products) {
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
                Your Routine{latestRoutine.name ? `, ${latestRoutine.name}` : ''}
              </h1>
              <p className="text-muted-foreground mt-1">
                {latestRoutine.skinType} skin • {latestRoutine.acneSeverity} acne
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
            <TabsList className="grid w-full max-w-md grid-cols-2" data-testid="tabs-dashboard">
              <TabsTrigger value="products" data-testid="tab-products">My Products</TabsTrigger>
              <TabsTrigger 
                value="treatment" 
                disabled={!isPremium}
                data-testid="tab-treatment"
              >
                {isPremium ? 'Detailed Treatment Plan' : 'Treatment Plan (Premium)'}
              </TabsTrigger>
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
                        {product.purchaseLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(product.purchaseLink, '_blank')}
                            data-testid={`button-buy-morning-${index}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Buy Now
                          </Button>
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
                        {product.purchaseLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(product.purchaseLink, '_blank')}
                            data-testid={`button-buy-evening-${index}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Buy Now
                          </Button>
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
              {isPremium && routineType && (
                <WeeklyRoutine
                  routineType={routineType}
                  products={products}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
