import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { checkIngredients } from "@shared/acneCausingIngredients";
import { useEntitlements } from "@/hooks/useEntitlements";
import { ScanPaywallModal } from "@/components/ScanPaywallModal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";

export default function IngredientChecker() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<{
    foundIngredients: string[];
    safeIngredients: string[];
    totalChecked: number;
  } | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { toast } = useToast();
  
  const { data: entitlements, refetch: refetchEntitlements, isLoading: entitlementsLoading } = useEntitlements();
  const canScan = entitlements?.hasUnlimitedScans || (entitlements?.scanCount ?? 0) > 0;
  const remainingScans = entitlements?.scanCount ?? 0;
  const hasUnlimited = entitlements?.hasUnlimitedScans ?? false;

  const handleCheck = async () => {
    // Wait for entitlements to load before checking access
    if (entitlementsLoading) {
      return;
    }
    
    // Check if user can scan
    if (!canScan) {
      setShowPaywall(true);
      return;
    }

    // Perform the scan
    const checkResults = checkIngredients(inputText);
    setResults(checkResults);
    setHasChecked(true);

    // Track the scan usage on backend
    if (!hasUnlimited) {
      try {
        await apiRequest("POST", "/api/scans/use-credit");
        
        // Refresh entitlements to show updated scan count
        await refetchEntitlements();
        
        toast({
          title: "Scan Complete",
          description: `${remainingScans - 1} scan${remainingScans - 1 === 1 ? '' : 's'} remaining`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to track scan usage",
          variant: "destructive",
        });
      }
    }
  };

  const handleClear = () => {
    setInputText("");
    setResults(null);
    setHasChecked(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back-home">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <img src={logoPath} alt="AcneAgent" className="h-10" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title Section */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground">
              Ingredient <span className="bg-yellow-300 dark:bg-yellow-400 px-2 text-foreground">Checker</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Paste your product's ingredient list below to check for acne-causing ingredients. Enter one ingredient per line - use only ingredient names from product labels, not marketing descriptions.
            </p>
            
            {/* Scan Credits Display */}
            <div className="flex items-center gap-2">
              {hasUnlimited ? (
                <Badge variant="default" className="gap-1" data-testid="badge-unlimited-scans">
                  <Sparkles className="h-3 w-3" />
                  Unlimited Scans
                </Badge>
              ) : (
                <Badge variant="outline" data-testid="badge-scans-remaining">
                  {remainingScans} scan{remainingScans === 1 ? '' : 's'} remaining
                </Badge>
              )}
              {!hasUnlimited && remainingScans === 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPaywall(true)}
                  data-testid="button-get-more-scans"
                >
                  Get more scans
                </Button>
              )}
            </div>
          </div>

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredient List</CardTitle>
              <CardDescription>
                Copy and paste the ingredients from your product label
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
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                data-testid="textarea-ingredients"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleCheck}
                  disabled={!inputText.trim() || entitlementsLoading}
                  className="flex-1"
                  data-testid="button-check-ingredients"
                >
                  {entitlementsLoading ? 'Loading...' : (canScan ? 'Check Ingredients' : 'Unlock Scanning')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!inputText && !hasChecked}
                  data-testid="button-clear"
                >
                  Clear
                </Button>
              </div>
              
              {!canScan && (
                <p className="text-sm text-muted-foreground text-center">
                  You've used all your free scans. Purchase scan packs or upgrade to Premium for unlimited scanning.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {hasChecked && results && (
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
                        {results.totalChecked}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total Checked
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-destructive/10">
                      <div className="text-3xl font-bold text-destructive">
                        {results.foundIngredients.length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Acne-Causing
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <div className="text-3xl font-bold text-primary">
                        {results.safeIngredients.length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Safe
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acne-Causing Ingredients */}
              {results.foundIngredients.length > 0 && (
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
                      {results.foundIngredients.map((ingredient, index) => (
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
              {results.safeIngredients.length > 0 && (
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
                      {results.safeIngredients.map((ingredient, index) => (
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
              {results.foundIngredients.length === 0 && results.totalChecked > 0 && (
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

          {/* Info Section */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This tool checks your product ingredients against a database of 348 known acne-causing (comedogenic) ingredients.
              </p>
              <p>
                These ingredients are commonly found in skincare and makeup products and can clog pores, leading to breakouts. Common culprits include coconut oil, cocoa butter, algae extracts, and certain silicones.
              </p>
              <p>
                <strong className="text-foreground">Note:</strong> Even if an ingredient is marked as safe, individual reactions may vary. If you're experiencing breakouts, consult with a dermatologist.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scan Paywall Modal */}
      <ScanPaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
