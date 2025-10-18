import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, TrendingUp, Search, Droplet, BarChart3, Shield } from "lucide-react";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import { Footer } from "@/components/Footer";

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

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-left space-y-8">
            <Badge variant="secondary" className="mx-auto" data-testid="badge-tagline">
              Insider-Informed. Clinically Guided. Budget-Friendly.
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Luxury-Grade Skincare Guidance — Without the Luxury Price Tag.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl">
              After years in the luxury skincare world, I saw how much people overpay for what's essentially smart formulation and consistency. So I built AcneAgent — an AI-powered tool that re-creates those high-end acne care frameworks using affordable, acne-safe products that won't compromise your skin barrier, deepen hyperpigmentation, or worsen scarring. Because effective care shouldn't cost an arm and a leg.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-left items-left pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="gap-2 min-w-[200px]"
                data-testid="button-get-routine"
              >
                <Sparkles className="w-5 h-5" />
                Get Your Routine
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - How It Works */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Professional Logic. Everyday Accessibility.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-card-border" data-testid="card-step-1">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Tell Us About Your Skin</h3>
                <p className="text-sm text-muted-foreground">
                  Answer seven quick questions about your skin type, tone, and breakout patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border" data-testid="card-step-2">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Get a Personalized Routine</h3>
                <p className="text-sm text-muted-foreground">
                  AI translates proven professional acne care methods into a routine built with safe, accessible products.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border" data-testid="card-step-3">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Evolve Over Time</h3>
                <p className="text-sm text-muted-foreground">
                  Your plan adjusts as your skin changes — helping you stay consistent and confident.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 max-w-3xl mx-auto">
            For educational use only. AcneAgent doesn't diagnose or treat medical conditions.
          </p>
        </div>
      </section>

      {/* Section 3 - Why It's Different */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Created by a Former Luxury Skincare Insider.
            </h2>
            <p className="text-lg text-muted-foreground">
              I've seen the mark-ups, the marketing, and the misinformation. Most "premium" acne programs simply repackage the same active ingredients found in affordable, evidence-based formulations. AcneAgent rebuilds those professional protocols with products vetted for ingredient safety and accessibility, so you can get results that feel luxurious — without the luxury markup.
            </p>
            <p className="text-sm text-muted-foreground italic">
              The formulas aren't secret. The access usually is. Until now.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 - Your Routine Tools */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Everything You Need — Nothing You Don't.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-card-border hover-elevate" data-testid="card-ingredient-checker">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Ingredient Checker</h3>
                <p className="text-sm text-muted-foreground">
                  Spot acne-triggering or barrier-disrupting ingredients instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate" data-testid="card-routine-builder">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Routine Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized AM/PM plans grounded in clinical methodology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate" data-testid="card-product-alternatives">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Product Alternatives</h3>
                <p className="text-sm text-muted-foreground">
                  Find comparable options across price tiers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate" data-testid="card-progress-insights">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold">Progress Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how your skin adapts over time. (Coming Soon)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="gap-2"
              data-testid="button-unlock-premium"
            >
              Unlock Premium Access
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Cancel anytime — no subscriptions you'll regret later.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 - Built for Real Skin */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Inclusive Guidance for Every Skin Tone and Age.
            </h2>
            <p className="text-lg text-muted-foreground">
              Each AcneAgent routine considers tone, sensitivity, and pigmentation risk — ensuring all skin types are supported with care. This isn't one-size-fits-all skincare; it's smarter, safer, and made for how real skin actually behaves.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 - Smarter Skincare Starts Here */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Smart. Honest. Accessible.
            </h2>
            <p className="text-lg text-muted-foreground">
              Effective skincare shouldn't be a luxury. With AcneAgent, you'll get guidance built on real expertise, not marketing hype — helping you care for your skin with confidence, clarity, and a little insider know-how.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="gap-2 min-w-[200px]"
                data-testid="button-start-routine"
              >
                <Sparkles className="w-5 h-5" />
                Start Your Routine
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Footer Note */}
      <section className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto">
            AcneAgent provides educational skincare guidance and product recommendations. It does not diagnose, treat, or prevent medical conditions. Always consult a licensed dermatologist before starting a new regimen.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
