import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap, Shield } from "lucide-react";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <img src={logoPath} alt="AcneAgent" className="h-10" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login-header"
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="mx-auto" data-testid="badge-ai-powered">
              AI-Powered Skin Analysis
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              AcneAgent Takes the Guesswork Out of Acne Treatment.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              Treating acne can feel like an endless cycle of trial and error. End the cycle with AcneAgent. Answer 7 questions about your skin and your acne to get a personalized skincare routine that is clinically validated to clear your skin, for free. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="gap-2 min-w-[200px]"
                data-testid="button-get-started"
              >
                <Sparkles className="w-5 h-5" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">New Update 2.0</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Exciting New Features in Update 2.0
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhanced AI accuracy, improved skin analysis, and personalized skincare 
              recommendations for optimal results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-card-border hover-elevate" data-testid="card-ai-diagnosis">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">AI Diagnosis</h3>
                <p className="text-sm text-muted-foreground">
                  Get accurate, real-time skin assessments using advanced AI technology, 
                  enabling personalized and recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate" data-testid="card-progress-monitoring">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Progress Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Track your skin's improvement over time with AI-driven analytics, 
                  personalized insights, and tailored skin care plans.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate" data-testid="card-product-suggestions">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Product Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Get AI-driven skincare recommendations personalized to your skin 
                  type, concerns, and goals, ensuring the best products for optimal results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate" data-testid="card-treatment-guidance">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Treatment Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Receive expert backed, AI-driven treatment recommendations tailored 
                  to your skin concerns, ensuring effective, personalized skincare.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     
    </div>
  );
}
