import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "@/pages/HomePage";
import Landing from "@/pages/Landing";
import Quiz from "@/pages/Quiz";
import Dashboard from "@/pages/Dashboard";
import IngredientChecker from "@/pages/IngredientChecker";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/quiz" component={Quiz} />
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
          <Route path="/" component={HomePage} />
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
