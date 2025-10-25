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
  Check,
  DollarSign
} from "lucide-react";
import logoPath from "@assets/acne agent brand logo_1760328618927.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
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
                className="text-sm text-secondary hover:text-primary/80 font-medium transition-colors"
                data-testid="link-quiz"
              >
                Take the Quiz
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            A simple, affordable, effective clear skin plan — made just for you.
          </h1>
          
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-muted-foreground mb-12">
            Based on science, not trial and error.
          </h1>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <p className="text-base text-muted-foreground">
                Get a personalized acne routine and shop only acne-safe products that are screened for pore-clogging ingredients.
              </p>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Guidance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your virtual skincare coach adapts your plan over time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Clinically-Informed Routines</h3>
                    <p className="text-sm text-muted-foreground">
                      We use clinically validated logic to build your routines, not TikTok trends.
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
                      Every product is screened for 400+ pore-clogging ingredients before we recommend it.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Upgrade to Premium for unlimited product ingredient scanning and multiple product options for each step of your routine.
              </p>

              <div className="space-y-2">
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/quiz'}
                  className="w-full sm:w-auto px-8 py-6 h-auto rounded-full text-base font-medium"
                  data-testid="button-hero-cta"
                >
                  Generate My Free Routine
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  No login. Takes under 2 minutes.
                </p>
                <p className="text-xs text-muted-foreground">
                  Educational skincare guidance only; not a medical diagnosis.
                </p>
              </div>
            </div>

            {/* Right Column - Preview Card */}
            <div className="lg:flex justify-center">
              <Card className="border-border shadow-sm bg-muted/30 rounded-2xl max-w-md w-full">
                <CardContent className="p-8 space-y-6">
                  <h3 className="font-serif text-xl font-semibold text-center">Your Starter Routine (example)</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-medium">Hydrating Facial Cleanser</p>
                      </div>
                      <p className="text-sm font-medium">$10-20</p>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-medium">Calm Nourishing Milky Toner</p>
                      </div>
                      <p className="text-sm font-medium">$20-35</p>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-medium">Mandelic Acid 10% + HA</p>
                      </div>
                      <p className="text-sm font-medium">&lt;$10</p>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-medium">Hyaluronic Acid Serum</p>
                      </div>
                      <p className="text-sm font-medium">&lt;$10</p>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-medium">Moisturizing Gel Cream</p>
                      </div>
                      <p className="text-sm font-medium">$10-20</p>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-medium">Solar Shade Chemical Sunscreen</p>
                      </div>
                      <p className="text-sm font-medium">$20-35</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-sm text-muted-foreground">
                      All products in your plan are acne-safe.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      For free users, AcneAgent recommends the most affordable product options for each step. Upgrade to Premium for multiple product options for each step.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                  Step 1
                </Badge>
                
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ClipboardCheck className="w-16 h-16 text-primary" strokeWidth={2} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold">Tell us about your skin and acne</h3>
                  <p className="text-sm text-muted-foreground">
                    Answer a few quick questions about oiliness, sensitivity, breakout pattern, and skin tone. No photos needed.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Not all acne is the same. We learn your specific needs to build a personalized routine.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                  Step 2
                </Badge>
                
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-16 h-16 text-primary" strokeWidth={2} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold">Get your personalized acne routine</h3>
                  <p className="text-sm text-muted-foreground">
                    You get a morning + night routine built specifically for your skin + acne type(s), using only acne-safe products from our marketplace.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No login required to view and shop your first routine.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                  Step 3
                </Badge>
                
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-16 h-16 text-primary" strokeWidth={2} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold">Shop your routine and stay on track</h3>
                  <p className="text-sm text-muted-foreground">
                    Purchase and commit to your acne-safe routine, removing any current products that don’t pass the Ingredient Scanner.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create an account to get 3 free Ingredient Scanner credits to see if your products are acne-safe.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-2">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base font-medium"
              data-testid="button-how-it-works-cta"
            >
              Generate My Free Routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              This is educational skincare guidance, not a medical diagnosis.
            </p>
          </div>
        </div>
      </section>

      {/* PERSONALIZATION FLOW */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              How AcneAgent Personalizes Your Routine
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Here's how we generate your personalized acne routine in under 2 minutes — and why it's not just another generic 'skin type' quiz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Node 1 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <ClipboardCheck className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Skin Quiz</h3>
                <p className="text-xs text-muted-foreground">
                  We learn your skin, lifestyle, and breakout patterns. Because not all acne is the same.
                </p>
              </div>
            </div>

            {/* Node 2 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <BarChart3 className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analysis</h3>
                <p className="text-xs text-muted-foreground">
                  We customize a routine for your specific skin profile: actives, concentrations, and supporting formulations.
                </p>
              </div>
            </div>

            {/* Node 3 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <Shield className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ingredient Scan</h3>
                <p className="text-xs text-muted-foreground">
                  We screen all products for 400+ pore-clogging ingredients. Only acne-safe products make it to your plan.
                </p>
              </div>
            </div>

            {/* Node 4 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <FlaskConical className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Routine Builder</h3>
                <p className="text-xs text-muted-foreground">
                  We build a step by step AM + PM plan with the highest-quality, most budget-friendly products.
                </p>
              </div>
            </div>

            {/* Node 5 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Clear Skin Plan</h3>
                <p className="text-xs text-muted-foreground">
                  You get a routine tailored to your skin's needs that you can actually follow and afford.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base font-medium"
              data-testid="button-personalization-cta"
            >
              Take the Free Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              No login required.
            </p>
          </div>
        </div>
      </section>

      {/* WHY ACNEAGENT WORKS - Block A: Ingredient Integrity */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="text-center mb-8 space-y-4">
            <Badge className="rounded-full bg-primary text-primary-foreground">
              The 'Non-Comedogenic' Myth
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              Most skincare products contain ingredients that can cause acne.
            </h2>
          </div>

          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            'Non-comedogenic' means nothing because it's not regulated by the FDA. That's why we've created the only acne-safe skincare marketplace that screens products for 400+ pore-clogging ingredients before we recommend them. If you do nothing else, avoid the following ingredients:
          </p>

          <div className="grid sm:grid-cols-2 xlg:grid-cols-2 gap-4">
            {/* Tile 1: Benzoyl Peroxide */}
            <Card className="border-border bg-secondary/10 shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Laureth-4</div>
                <h3 className="font-semibold text-lg">The Undercover Pore Clogger</h3>
                <div className="flex flex-wrap gap-2">
                  Found in: 
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Cleansers
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Lotions
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Acne Creams
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Highly comedogenic ingredient used as a surfactant and emulsifier in almost <b>every benzoyl peroxide treatment</b> on the market today. If you've ever tried a benzoyl peroxide cream to clear your acne, chances are it was doing as much harm as it was good.
                </p>
              </CardContent>
            </Card>

            {/* Tile 2: Salicylic Acid */}
            <Card className="border-border bg-secondary/10 shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Shea Butter</div>
                <h3 className="font-semibold text-lg">The Inescapable One</h3>
                <div className="flex flex-wrap gap-2">
                  Found in:
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Moisturizers
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Lotions
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Cleansers
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maybe the most widely used comedogenic ingredient in skincare. Finding products without shea butter, especially for dry skin, is a nearly impossible task... but AcneAgent has you covered.
                </p>
               
              </CardContent>
            </Card>

            {/* Tile 3: Mandelic Acid */}
            <Card className="border-border bg-secondary/10 shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Coconut Oil</div>
                <h3 className="font-semibold text-lg">The One People Defend</h3>
                <div className="flex flex-wrap gap-2">
                  Found in:
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                   Lotions
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                   Cleansers
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                   Hair Care
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Another highly comedogenic ingredient that's used in almost every moisturizer and cleanser on the market. This includes any derivatives of coconut oil.
                </p>
              </CardContent>
            </Card>

            {/* Tile 4: Retinal */}
            <Card className="border-border bg-secondary/10 shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Algae</div>
                <h3 className="font-semibold text-lg">The Trendy One</h3>
                <div className="flex flex-wrap gap-2">
                  Found in:
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Skin Care
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Body Care
                  </Badge>
                  <Badge className="rounded-full text-xs bg-outline text-black border-black">
                    Hair Care
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maybe the trendiest ingredient on this shortlist, any form of algae (including the ones you consume) is highly comedogenic due to the high iodine content. 
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* WHY ACNEAGENT WORKS - Block B: The Science */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="text-center mb-8 space-y-4">
            <Badge className="rounded-full bg-primary text-primary-foreground">
              Ingredients with Integrity
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              The ingredients that help to make your skin clearer and healthier.
            </h2>
          </div>

          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            We prioritize proven acne-fighting ingredients — benzoyl peroxide, salicylic acid, mandelic acid, retinol, and many more — and strategically deploy them depending on your skin and acne type(s). 
            <p>Free users get access to the most budget-friendly product option for each step of their routine, while Premium users get access to multiple effective product variants at various price points for each step, because we think you can have acne and still experiment and have fun with your skincare.</p>
          </p>

          <div className="grid sm:grid-cols-2 xlg:grid-cols-2 gap-4">
            {/* Tile 1: Benzoyl Peroxide */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Bp</div>
                <h3 className="font-semibold text-lg">Benzoyl Peroxide</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Antibacterial
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary text-black border-primary/20">
                    Kerotolytic
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
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Sa</div>
                <h3 className="font-semibold text-lg">Salicylic Acid</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Exfoliant
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary text-black border-primary/20">
                    Anti-inflammatory
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dissolves oil buildup inside the pore to help prevent new clogs from forming.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: blackheads, congestion, acne rosacea, body acne
                </p>
              </CardContent>
            </Card>

            {/* Tile 3: Mandelic Acid */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Ma</div>
                <h3 className="font-semibold text-lg">Mandelic Acid</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Gentle AHA
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary text-black border-primary/20">
                    Brightening
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Resurfaces without burning or thinning sensitive skin.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: non-inflamed acne, inflamed acne, uneven tone, deeper skin tones
                </p>
              </CardContent>
            </Card>

            {/* Tile 4: Retinal */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl font-bold text-black">Re</div>
                <h3 className="font-semibold text-lg">Retinol</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Cell turnover
                  </Badge>
                  <Badge className="rounded-full text-xs bg-primary text-black border-primary/20">
                    Barrier support
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Speeds renewal and supports collagen while helping clear stubborn congestion.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Best for: non-inflamed acne, adult acne, texture, fine lines
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY ACNEAGENT WORKS - Block C: Personalization Proof */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <Card className="border-t-4 border-t-primary overflow-hidden rounded-2xl">
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
                    AcneAgent builds your custom plan based on various clinically-proven acne treatment structures. Free users will get the most budget-friendly product options for each step of their routine, while Premium users get access to multiple effective product variants at various price points for each step to ensure your routine feels like <b>your</b> routine.
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
                  <Card className="border-primary/20 bg-primary/5 rounded-2xl">
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

                  <Card className="border-secondary/20 bg-secondary/5 rounded-2xl">
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

                  <Card className="border-primary/20 bg-primary/5 rounded-2xl">
                    <CardContent className="p-6 space-y-2">
                      <h3 className="font-semibold">Riley, 28</h3>
                      <p className="text-sm text-muted-foreground">
                        Adult acne + early fine lines
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Routine pairs retinal with barrier repair to help prevent irritation.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12 space-y-2">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base font-medium"
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

      {/* PREMIUM VS FREE */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
            Free vs. Premium
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Free Card */}
            <Card className="border-border shadow-sm rounded-2xl bg-background">
              <CardContent className="p-8 space-y-6">
                <h3 className="font-serif text-2xl font-semibold">Free</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Personalized acne routine with the most affordable product options</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Acne-safe product picks you can buy right now</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Three free Ingredient Scans to check your existing products (account required)</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
                  Great if you're just getting started.
                </p>
              </CardContent>
            </Card>

            {/* Premium Card */}
            <Card className="border-primary shadow-sm rounded-2xl bg-background">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-2xl font-semibold">Premium</h3>
                  <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                    More control
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Multiple vetted product options for each step of your routine, from drugstore to luxury skin care brands.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Access to Routine Coach: personal, in-depth routine guidance to help you reach your goals faster</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Unlimited Ingredient Scans: paste any product's full ingredient list to see if it contains any pore-cloggers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm">Lock-in Founder's Rate ($2.99/month until you cancel) before it goes up to $5.99/month</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
                  Founding rate: $2.99/mo
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-2">
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="px-8 py-6 h-auto rounded-full text-base font-medium"
              data-testid="button-unlock-premium"
            >
              Unlock Premium
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Keep using the free plan if it's working. No pressure.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-16 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
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

          <div className="space-y-4 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground max-w-3xl">
              AcneAgent is the only acne-safe skincare marketplace that gives you a personalized routine, ingredient screening, and budget-friendly alternatives.
            </p>
            <p className="text-xs text-muted-foreground max-w-3xl">
              AcneAgent provides evidence-based acne guidance and acne-safe skincare recommendations. This is not a substitute for medical care. We offer personalized acne routine recommendations with non-comedogenic products screened for pore-clogging ingredients.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
