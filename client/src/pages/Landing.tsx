import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Brain, 
  FlaskConical, 
  Shield, 
  ClipboardCheck,
  BarChart3,
  Sparkles,
  CheckCircle,
  Clock,
  X,
  Check
} from "lucide-react";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="AcneAgent molecule icon">
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="6" cy="8" r="1.5" />
                <circle cx="18" cy="8" r="1.5" />
                <circle cx="6" cy="16" r="1.5" />
                <circle cx="18" cy="16" r="1.5" />
                <line x1="10.5" y1="11" x2="7.5" y2="9" />
                <line x1="13.5" y1="11" x2="16.5" y2="9" />
                <line x1="10.5" y1="13" x2="7.5" y2="15" />
                <line x1="13.5" y1="13" x2="16.5" y2="15" />
              </svg>
              <img src={logoPath} alt="AcneAgent" className="h-8" />
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-login"
              >
                Log In
              </button>
              <button
                onClick={() => window.location.href = '/quiz'}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                data-testid="link-quiz"
              >
                Take the Quiz
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-4xl">
          <div className="space-y-8">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center">
              A Simple, Affordable, and Effective Clear Skin Plan. Made Just for You.
            </h1>
            
            <p className="text-lg text-muted-foreground text-center">
              Based on science, not trial and error.
            </p>

            <div className="space-y-6">
              <div className="flex items-start justify-center gap-3">
                <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="molecule icon">
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="6" cy="8" r="1.5" />
                  <circle cx="18" cy="8" r="1.5" />
                </svg>
                <p className="text-sm text-muted-foreground">
                  AcneAgent takes the guesswork out of acne with:
                </p>
              </div>

              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Guidance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your virtual skincare coach learns your skin and adapts your plan over time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Clinically-Proven Routines</h3>
                    <p className="text-sm text-muted-foreground">
                      Built from treatment methods shown to clear acne in over 90% of cases.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">The Only Acne-Safe Marketplace</h3>
                    <p className="text-sm text-muted-foreground">
                      Every product we recommend is screened for 400+ pore-clogging ingredients, so you never unknowingly sabotage your skin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 flex flex-col items-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="w-full sm:w-auto px-8 py-6 h-auto rounded-full text-base"
                data-testid="button-hero-cta"
              >
                Generate Free Custom Routine
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Educational skincare guidance only; not a medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
            {/* Card 1 */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                  Step 1
                </Badge>
                
                <div className="w-full aspect-square max-w-xs mx-auto flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 bg-muted/30 rounded-2xl p-8">
                      <div className="space-y-3">
                        <div className="h-3 bg-muted rounded-full" />
                        <div className="h-3 bg-muted rounded-full" />
                        <div className="h-3 bg-primary/60 rounded-full" />
                        <div className="h-3 bg-muted rounded-full" />
                      </div>
                      <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-background flex items-center justify-center text-lg">
                        ?
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold">Tell us about your skin.</h3>
                  <p className="text-sm text-muted-foreground">
                    Answer a few quick questions. We build your skin profile in under 2 minutes — no confusing dermatology jargon.
                  </p>
                </div>

                <button 
                  onClick={() => window.location.href = '/quiz'}
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                  data-testid="link-start-quiz-step1"
                >
                  Start My Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                  Step 2
                </Badge>
                
                <div className="w-full aspect-square max-w-xs mx-auto flex items-center justify-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="w-32 h-40 rounded-3xl bg-primary/10 border-2 border-primary/30" />
                    <div className="absolute top-8 w-20 h-24 rounded-2xl bg-primary/20 border border-primary/40" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold">See your custom routine instantly.</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll get a personalized, acne-safe morning + night routine right away — cleanser, treatment, moisturizer, SPF — mapped exactly to your skin type.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No account required to view your first draft.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                  Step 3
                </Badge>
                
                <div className="w-full aspect-square max-w-xs mx-auto flex items-center justify-center">
                  <div className="relative flex gap-3 items-end">
                    {[60, 80, 70].map((height, i) => (
                      <div key={i} className="relative">
                        <div 
                          className="w-12 rounded-xl bg-gradient-to-t from-primary/30 to-primary/10 border border-primary/30"
                          style={{ height: `${height}px` }}
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                          <CheckCircle className="w-5 h-5 text-primary" fill="currentColor" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold">Lock it in and start clearing.</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your free account to unlock the Ingredient Checker, get budget-friendly alternatives, and track weekly progress.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Every product we recommend has passed our 400+ trigger scan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                Every recommended product is screened for pore-clogging ingredients.
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                Takes under 2 minutes.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base"
              data-testid="button-how-it-works-cta"
            >
              Generate My Free Routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* PERSONALIZATION FLOW */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              How AcneAgent Personalizes Your Routine
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From your answers to your perfect product lineup — powered by ingredient science.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative">
              {/* Connection Line - Desktop */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-primary/20">
                <div className="h-full w-1/5 bg-gradient-to-r from-primary/60 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
              </div>

              {/* Node 1 */}
              <div className="flex flex-col items-center text-center space-y-3 relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary bg-background flex items-center justify-center hover:scale-105 transition-transform">
                  <ClipboardCheck className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Skin Quiz</h3>
                  <p className="text-xs text-muted-foreground">
                    We learn your skin, lifestyle, and breakout pattern.
                  </p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="flex flex-col items-center text-center space-y-3 relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary bg-background flex items-center justify-center hover:scale-105 transition-transform">
                  <BarChart3 className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Analysis</h3>
                  <p className="text-xs text-muted-foreground">
                    We match you to a dermatologist-informed treatment structure.
                  </p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="flex flex-col items-center text-center space-y-3 relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary bg-background flex items-center justify-center hover:scale-105 transition-transform">
                  <Shield className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ingredient Scan</h3>
                  <p className="text-xs text-muted-foreground">
                    We block products with known acne triggers.
                  </p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="flex flex-col items-center text-center space-y-3 relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary bg-background flex items-center justify-center hover:scale-105 transition-transform">
                  <FlaskConical className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Routine Builder</h3>
                  <p className="text-xs text-muted-foreground">
                    We build an AM + PM plan step by step.
                  </p>
                </div>
              </div>

              {/* Node 5 */}
              <div className="flex flex-col items-center text-center space-y-3 relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary bg-background flex items-center justify-center hover:scale-105 transition-transform">
                  <Sparkles className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Clear Skin Plan</h3>
                  <p className="text-xs text-muted-foreground">
                    You get exact products and how to use them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base"
              data-testid="button-personalization-cta"
            >
              Take the Free Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* WHY ACNEAGENT WORKS - Block A: The Problem */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <Card className="bg-slate-900 dark:bg-slate-950 text-slate-50 border-slate-800 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <Badge className="rounded-full bg-secondary text-secondary-foreground mb-6">
                THE PROBLEM
              </Badge>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold">
                    Most 'acne-safe' products aren't acne-safe.
                  </h2>
                  <p className="text-slate-200 leading-relaxed">
                    Over 70% of skincare products marketed as 'non-comedogenic' still contain pore-clogging ingredients. AcneAgent screens every formula for 400+ known acne triggers — so you never waste money on products that quietly make breakouts worse.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Rejected Card */}
                  <div className="bg-slate-800/50 border border-secondary/30 rounded-2xl p-6 space-y-3">
                    <h3 className="font-semibold">Drugstore 'non-comedogenic' cleanser</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-300">Contains common pore-clogging fillers</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-300">Not barrier-safe for daily use</p>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-secondary text-secondary-foreground">
                      Rejected
                    </Badge>
                  </div>

                  {/* Approved Card */}
                  <div className="bg-slate-800/50 border border-primary/30 rounded-2xl p-6 space-y-3">
                    <h3 className="font-semibold">AcneAgent-approved cleanser</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-300">0 pore-clogging ingredients</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-300">Barrier-safe for daily use</p>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-primary text-primary-foreground">
                      Approved
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 text-center pt-2">
                    Every single product in your plan is vetted like this.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* WHY ACNEAGENT WORKS - Block B: The Science */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12 space-y-4">
            <Badge className="rounded-full bg-primary text-primary-foreground">
              THE SCIENCE
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              The ingredients your skin actually needs.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Tile 1: Benzoyl Peroxide */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-primary">Bp</div>
                <h3 className="font-semibold text-lg">Benzoyl Peroxide</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Antibacterial
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary/10 text-primary border-primary/20">
                    Clears pores
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Kills acne-causing bacteria and calms active breakouts.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: inflamed acne, oily / resilient skin
                </p>
              </CardContent>
            </Card>

            {/* Tile 2: Salicylic Acid */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-primary">Sa</div>
                <h3 className="font-semibold text-lg">Salicylic Acid</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Exfoliant
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary/10 text-primary border-primary/20">
                    Anti-inflammatory
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dissolves oil buildup inside the pore to stop new clogs from forming.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: blackheads, congestion, body acne
                </p>
              </CardContent>
            </Card>

            {/* Tile 3: Mandelic Acid */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-primary">Ma</div>
                <h3 className="font-semibold text-lg">Mandelic Acid</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Gentle AHA
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary/10 text-primary border-primary/20">
                    Brightening
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Resurfaces without burning or thinning sensitive skin.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: non-inflamed acne, uneven tone, deeper skin tones
                </p>
              </CardContent>
            </Card>

            {/* Tile 4: Retinal */}
            <Card className="border-border shadow-sm hover-elevate transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-primary">Re</div>
                <h3 className="font-semibold text-lg">Retinal</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Cell turnover
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary/10 text-primary border-primary/20">
                    Barrier support
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Speeds renewal and supports collagen while clearing stubborn congestion.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: adult acne, texture, fine lines
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY ACNEAGENT WORKS - Block C: Personalization Proof */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <Card className="border-t-4 border-t-primary overflow-hidden">
            <CardContent className="p-8 md:p-12 bg-muted/30">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column */}
                <div className="space-y-6">
                  <Badge className="rounded-full bg-primary text-primary-foreground">
                    PERSONALIZED, NOT GENERIC
                  </Badge>
                  
                  <h2 className="font-serif text-3xl md:text-4xl font-bold">
                    No two routines are the same.
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    AcneAgent builds your plan from 60 dermatologist-informed treatment structures. Each step in those structures can be filled with vetted, acne-safe product options. That produces over 112,000 possible routine combinations — and yours keeps adapting as your skin changes.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm font-medium">Always acne-safe</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm font-medium">Budget-first recommendations</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-sm font-medium">Smart swaps if you're sensitive</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Persona Cards */}
                <div className="space-y-4">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6 space-y-2">
                      <h3 className="font-semibold">Alex, 23</h3>
                      <p className="text-sm text-muted-foreground">
                        Hormonal breakouts · Oily · Fitz 3
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Routine uses benzoyl peroxide + oil-balancing cleanser.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-secondary/20 bg-secondary/5">
                    <CardContent className="p-6 space-y-2">
                      <h3 className="font-semibold">Sam, 32</h3>
                      <p className="text-sm text-muted-foreground">
                        Non-inflamed acne · Sensitive · Fitz 5
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Routine avoids harsh BHAs. Uses mandelic acid + barrier serum.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6 space-y-2">
                      <h3 className="font-semibold">Riley, 28</h3>
                      <p className="text-sm text-muted-foreground">
                        Adult acne + early fine lines
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Routine pairs retinal with barrier repair to prevent irritation.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12 space-y-3">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base"
              data-testid="button-personalization-proof-cta"
            >
              Get My Free Routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Takes under 2 minutes. No credit card.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-16 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="6" cy="8" r="1.5" />
                <circle cx="18" cy="8" r="1.5" />
                <circle cx="6" cy="16" r="1.5" />
                <circle cx="18" cy="16" r="1.5" />
              </svg>
              <img src={logoPath} alt="AcneAgent" className="h-8" />
            </div>

            <div className="flex flex-wrap gap-6">
              <a href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/affiliate-disclosure" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="mailto:contact@acneagent.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground max-w-3xl">
              AcneAgent provides evidence-based acne guidance and acne-safe skincare recommendations. This is not a substitute for medical care. We offer personalized acne routine recommendations with non-comedogenic products screened for pore-clogging ingredients.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
