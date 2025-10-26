import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { 
  ArrowRight, 
  Brain,
  FlaskConical,
  Shield,
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
  Crown,
  Microscope,
  Beaker,
  TestTube,
  Check,
  X
} from "lucide-react";
import logoPath from "@assets/skinrhythm-logo.svg";
import productsIllustration from "@assets/product lineup_1761438760613.png";
import routineIllustration from "@assets/Frame 58_1761434440825.png";
import algaeImg from "@assets/algae_1761481865848.png";
import coconutImg from "@assets/coconut_1761481865855.png";
import sheaImg from "@assets/shea_1761481865855.png";
import { LoginModal } from "@/components/LoginModal";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoPath} alt="SkinRhythm" className="h-8" />
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-login"
              >
                log in
              </button>
              <button
                onClick={() => window.location.href = '/quiz'}
                className="text-sm text-primary-text hover:text-primary-text/80 font-normal underline transition-colors"
                data-testid="link-quiz-header"
              >
                find your skinrhythm
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 1️⃣ HERO - The Emotional Hook + Core Promise */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-12">
            {/* Headline */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight max-w-5xl">
              skin∙rhythm composes custom acne routines perfectly tuned to make skin sing.
            </h1>
            
            {/* Hero Illustration */}
            <div className="w-full max-w-4xl">
              <img 
                src={routineIllustration} 
                alt="Personalized routine interface" 
                className="w-full rounded-2xl"
              />
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl">
              based on clinically proven protocols and rigorous ingredient analysis, skinrhythm uses science, not hype, to deliver results.
            </p>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-normal">
              no gimmicks. no guesswork. just clear skin.
            </p>

            {/* CTA */}
            <div className="space-y-3">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="px-6 py-3 h-auto rounded-full text-base font-normal"
                data-testid="button-hero-cta"
              >
                find your skinrhythm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                no login necessary. takes under 2 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ TRUST / PROOF STRIP - Science, Not Hype */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <h2 className="text-center font-serif text-2xl md:text-3xl font-light mb-12">
            rooted in science. built on ingredient integrity.
          </h2>
          
          <div className="space-y-16 max-w-4xl mx-auto">
            

            {/* Item 2 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-normal mb-1">results-based treatment frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  we follow clinical data, not tiktok trends. your skinrhythm routine is built on evidence-based protocols to clear your acne.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-normal mb-1">customized for your unique skinrhythm</h3>
                <p className="text-sm text-muted-foreground">
                  each clear skin plan is fine tuned to your skin's unique needs, including skin type and tone, acne type, and barrier function.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-normal mb-1">affordable recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  our basic plans are free and automatically generate the most cost-effective version of your clear skin plan.
                </p>
              </div>
            </div>
            {/* Item 1 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Microscope className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-normal mb-1">the only acne-safe marketplace</h3>
                <p className="text-sm text-muted-foreground">
                  skinrhythm has a zero-tolerance policy for 400+ acne triggers, so you can shop our product recommendations with confidence.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const howItWorksSection = document.getElementById('how-it-works');
                howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm text-primary-text hover:text-primary-text/80 font-normal underline"
              data-testid="link-learn-how"
            >
              learn how it works →
            </button>
          </div>
        </div>
      </section>

      {/* 3️⃣ HOW IT WORKS - Simple Process Visualization */}
      <section id="how-it-works" className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-center mb-4">
            how skinrhythm help's you clear your acne
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            in just three simple steps.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full">
                  step 1
                </Badge>
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-light">tell us about your skin and acne.</h3>
                  <p className="text-sm text-muted-foreground">
                    one quick quiz — no photos. we assess acne type, tone, and barrier to tune into your skinrhythm.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full">
                  step 2
                </Badge>
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-light">we compose your clear skin plan.</h3>
                  <p className="text-sm text-muted-foreground">
                    we map your unique skinrhythm to clinical data and create an optimized regimen of acne-safe products.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full">
                  step 3
                </Badge>
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-light">replace your products & see results.</h3>
                  <p className="text-sm text-muted-foreground">
                    replace your old routine with your clear skin plan. commit for at least 8 weeks, and your skin will sing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-2">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-6 py-3 h-auto rounded-full text-base font-normal"
              data-testid="button-how-it-works-cta"
            >
              start my free routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              personalized, evidence-based guidance — not medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* 4️⃣ WHY IT WORKS - Clinical Logic + Ingredient Integrity */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
                skinrhythm takes the risk out of shopping for skincare.
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                most "acne-safe" and "non-comedogenic" products contain pore-clogging ingredients. that's why every product in our marketplace is scanned for over 400 known acne triggers — so you can shop our recommendations with confidence.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    const ingredientsSection = document.getElementById('ingredient-science');
                    ingredientsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-primary-text hover:text-primary-text/80 font-normal underline"
                  data-testid="link-see-ingredients"
                >
                  all about ingredients →
                </button>
              </div>
            </div>


              <div className="space-y-6">
                <h4 className="font-normal text-center">common comedogenics often labeled non-comedogenic:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <img src={coconutImg} alt="Coconut oil" className="w-20 h-20 object-contain" />
                    <p className="text-sm text-muted-foreground">coconut oil</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <img src={sheaImg} alt="Shea butter" className="w-20 h-20 object-contain" />
                    <p className="text-sm text-muted-foreground">shea butter</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <img src={algaeImg} alt="Algae" className="w-20 h-20 object-contain" />
                    <p className="text-sm text-muted-foreground">algae</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                      <X className="w-10 h-10 text-destructive" />
                    </div>
                    <p className="text-sm text-muted-foreground">laureth-4</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                for educational purposes only. skinrhythm does not diagnose, treat, or cure medical conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ FREE PLAN VALUE - Give First, Build Trust */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              everything you need to start — free.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              get your personalized acne-safe am + pm routine instantly. we recommend clinically effective products to address your unique concerns within your budget.
            </p>
          </div>

          <Card className="border-border shadow-sm rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-normal">personalized routine</p>
                    <p className="text-sm text-muted-foreground">am + pm plan tailored to your skin</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-normal">vetted acne-safe products</p>
                    <p className="text-sm text-muted-foreground">every product screened for 400+ triggers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-normal">3 free product ingredient scans</p>
                    <p className="text-sm text-muted-foreground">check any product for acne-causing ingredients</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-normal">free to start, no email needed</p>
                    <p className="text-sm text-muted-foreground">get your custom skinrhythm routine without signing up</p>
                  </div>
                </li>
              </ul>

              <div className="text-center space-y-2">
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/quiz'}
                  className="w-full px-6 py-3 h-auto rounded-full text-base font-normal"
                  data-testid="button-free-plan-cta"
                >
                  see my free routine
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6️⃣ PREMIUM TIER - Upgrade for Guidance & Control */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              upgrade your routine — and your results.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              premium gives you control, unparalleled guidance, and insight into every step of your clear-skin journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-normal mb-2">unlimited ingredient scans</h3>
                  <p className="text-sm text-muted-foreground">
                    scan any product for acne triggers
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-normal mb-2">routine coach</h3>
                  <p className="text-sm text-muted-foreground">
                    detailed step-by-step guidance on ramping up on actives, personalized tips, progress tracking, and more.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-normal mb-2">product alternatives</h3>
                  <p className="text-sm text-muted-foreground">
                    customize your routine without affecting your results. budget to luxury options that fit your skinrhythm.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-normal mb-2">routine history</h3>
                  <p className="text-sm text-muted-foreground">
                    view your complete routine history and take notes to track what works best for you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 shadow-sm rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                  <Badge variant="secondary" className="rounded-full px-4 py-1">
                    founding rate
                  </Badge>
                </div>
                <p className="text-4xl md:text-5xl font-light">
                  <span className="text-muted-foreground line-through text-2xl md:text-3xl">$5.99</span>
                  {" "}$2.99<span className="text-xl text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  limited founding member rate — locks in forever, plus locks in your discounted rate for premium+.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  asChild
                  className="w-full px-6 py-3 h-auto rounded-full text-base font-normal"
                  data-testid="button-premium-cta"
                >
                  <Link href="/pricing">
                    unlock premium
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  keep using free if it's working. no pressure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* 8️⃣ ONE-TIME UPGRADES - Flexible Access */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              one-time upgrades, lifetime value.
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              choose the features you need without a subscription.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-xl font-light">detailed routine guidance (PDF download)</h3>
                  <p className="text-sm text-muted-foreground">
                    a PDF download with detailed instructions for your routine, how to ramp up on actives, and tips and tricks for your clear skin journey.
                  </p>
                  <p className="text-2xl font-normal">$9.99</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  asChild
                  data-testid="button-pdf-upgrade"
                >
                  <Link href="/pricing">learn more</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-xl font-light">access product alternatives</h3>
                  <p className="text-sm text-muted-foreground">
                    unlock all product options for each step of your current clear skin routine, from drugstore to luxury brands.
                  </p>
                  <p className="text-2xl font-normal">$9.99</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  asChild
                  data-testid="button-alternatives-upgrade"
                >
                  <Link href="/pricing">learn more</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Beaker className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-xl font-light">ingredient scanner credits</h3>
                  <p className="text-sm text-muted-foreground">
                    buy credits to scan products you have (or products you want to try) for acne-causing ingredients.
                  </p>
                  <p className="text-2xl font-normal">from $1.99</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  asChild
                  data-testid="button-checker-upgrade"
                >
                  <Link href="/pricing">learn more</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <button
              className="text-sm text-primary-text hover:text-primary-text/80 font-normal underline"
              onClick={() => window.location.href = '/pricing'}
              data-testid="link-explore-upgrades"
            >
              explore upgrades →
            </button>
          </div>
        </div>
      </section>
      
      {/* 7️⃣ PREMIUM+ TEASER - Future Vision */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/50">
              coming soon...
            </Badge>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              premium+ <p>your skinphony's personal conductor.</p>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI-driven ingredient interaction tracking, seasonal adjustments, and image-based progress tracking to make sure your skin is always in rhythm.
            </p>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                advanced features for getting clear, staying clear, and the rest of your skincare journey.
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* 9️⃣ EDUCATIONAL / INGREDIENT SCIENCE SECTION */}
      <section id="ingredient-science" className="py-10 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="text-center space-y-20 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
              the science behind our core active and supporting ingredients.
            </h2>
            <div className="flex justify-center">
              <img 
                src={productsIllustration} 
                alt="Skincare products illustration" 
                className="w-full max-w-6xl rounded-2xl"
              />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              skinrhythm uses proven actives balanced with barrier-supporting ingredients, because a resilient barrier is the foundation for clear skin.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Mandelic Acid */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-normal text-lg">mandelic acid</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  skinrhythm's lead singer: gentle but thorough exfoliant that kills bacteria and fungus, reduces inflammation, and fades hyperpigmentation.
                </p>
              </CardContent>
            </Card>
            {/* Benzoyl Peroxide */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-normal text-lg">benzoyl peroxide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  powerful antimicrobial that kills acne-causing bacteria
                </p>
              </CardContent>
            </Card>

            {/* Salicylic Acid */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-normal text-lg">salicylic acid</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  oil-soluble exfoliant that unclogs pores and kills bacteria
                </p>
              </CardContent>
            </Card>

           

            {/* Niacinamide */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-normal text-lg">niacinamide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  calms and balances skin barrier function, improves uneven tone, regulates sebum, and improves hydration.
                </p>
              </CardContent>
            </Card>

            {/* Retinal */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-normal text-lg">retinol</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  refines texture, accelerates cell turnover, and improves uneven tone.
                </p>
              </CardContent>
            </Card>

            {/* Zinc PCA */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-normal text-lg">bisabolol</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  calms redness and reduces inflammation, aids in healing, and improves absorption of other actives.
                </p>
              </CardContent>
            </Card>
          </div>

          
        </div>
      </section>

      {/* 🔟 FINAL CTA - Conversion Close */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <div className="text-center space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-thin">
              ready for your new skinrhythm routine?
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              it's free, instant, and acne-safe. no email required.
            </p>

            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="px-6 py-3 h-auto rounded-full text-lg font-normal"
                data-testid="button-final-cta"
              >
                get my skinrhythm routine
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-muted-foreground">
                for educational purposes only. skinrhythm does not diagnose, treat, or cure medical conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - Compliance + Brand Anchor */}
      <footer className="py-12 md:py-16 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <img src={logoPath} alt="SkinRhythm" className="h-8" />
              <p className="text-sm text-muted-foreground">
                personalized acne care built on science and integrity.
              </p>
            </div>

            <div>
              <h4 className="font-normal mb-4">product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => {
                      const howItWorksSection = document.getElementById('how-it-works');
                      howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-foreground transition-colors underline"
                  >
                    how it works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const ingredientsSection = document.getElementById('ingredient-science');
                      ingredientsSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-foreground transition-colors underline"
                  >
                    ingredient science
                  </button>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors underline">
                    premium
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/affiliate-disclosure" className="hover:text-foreground transition-colors underline">
                    affiliate disclosure
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground transition-colors underline">
                    privacy policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">find your skinrhythm</h4>
              <Button
                onClick={() => window.location.href = '/quiz'}
                className="w-full rounded-full"
                data-testid="button-footer-cta"
              >
                take the quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 space-y-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>medical disclaimer:</strong> skinrhythm provides educational skincare guidance, not medical treatment. our ingredient screening and routine recommendations are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. always consult with a qualified healthcare provider or dermatologist before starting any new skincare regimen, especially if you have severe acne, skin conditions, allergies, or are pregnant/nursing.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              © 2025 skinrhythm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal 
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
