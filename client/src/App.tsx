import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Quiz from "@/pages/Quiz";
import Dashboard from "@/pages/Dashboard";
import IngredientChecker from "@/pages/IngredientChecker";
import Pricing from "@/pages/Pricing";
import AffiliateDisclosure from "@/pages/AffiliateDisclosure";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import BeautyProducts from "@/pages/BeautyProducts";
import NotFound from "@/pages/not-found";
import type { Routine } from "@shared/schema";

function AuthenticatedHome() {
  const { data: currentRoutine, isLoading, error } = useQuery<Routine>({
    queryKey: ['/api/routines/current'],
    retry: 1, // Retry once on failure
  });

  // Show loading state while fetching current routine
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If there's a current routine, go to dashboard
  if (currentRoutine) {
    return <Redirect to="/dashboard" />;
  }

  // Check if error is 404 (no routine) vs other errors
  if (error) {
    const errorMessage = (error as Error).message;
    const is404 = errorMessage?.includes('404');
    
    // 404 means no routine exists - go to quiz
    if (is404) {
      return <Redirect to="/quiz" />;
    }
    
    // Other errors - show error state with retry
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <div className="text-lg text-destructive">Failed to load your routine</div>
        <Button onClick={() => window.location.reload()} data-testid="button-retry">
          Retry
        </Button>
      </div>
    );
  }

  // No data and no error - shouldn't happen, but redirect to quiz as fallback
  return <Redirect to="/quiz" />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/quiz" component={Quiz} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/affiliate-disclosure" component={AffiliateDisclosure} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/beauty-products" component={BeautyProducts} />
      {isLoading ? (
        <Route path="/">
          {() => (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-lg">Loading...</div>
            </div>
          )}
        </Route>
      ) : isAuthenticated ? (
        <>
          <Route path="/" component={AuthenticatedHome} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/ingredient-checker" component={IngredientChecker} />
        </>
      ) : (
        <Route path="/" component={Landing} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
