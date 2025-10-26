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
import logoPath from "@assets/acne agent brand logo_1760328618927.png";
import productsIllustration from "@assets/product lineup_1761438760613.png";
import routineIllustration from "@assets/Frame 58_1761434440825.png";
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
              <img src={logoPath} alt="AcneAgent" className="h-8" />
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-login"
              >
                Log In
              </button>
              <button
                onClick={() => window.location.href = '/quiz'}
                className="text-sm text-primary-text hover:text-primary-text/80 font-normal underline transition-colors"
                data-testid="link-quiz-header"
              >
                Take the Quiz
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-5xl">
              AcneAgent understands your acne so you don't have to.
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
              AcneAgent tailors your personalized Clear Skin Plan to your unique skin profile using clinically proven protocols and rigorous ingredient analysis.
            </p>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-medium">
              No gimmicks. No guesswork. Just results.
            </p>

            {/* CTA */}
            <div className="space-y-3">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="px-8 py-6 h-auto rounded-full text-base font-normal"
                data-testid="button-hero-cta"
              >
                Get My Free Routine
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                No login required. Takes under 2 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ TRUST / PROOF STRIP - Science, Not Hype */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <h2 className="text-center font-serif text-2xl md:text-3xl font-semibold mb-12">
            Rooted in science. Built on ingredient integrity.
          </h2>
          
          <div className="space-y-16 max-w-4xl mx-auto">
            {/* Item 1 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Microscope className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">The only acne-safe marketplace</h3>
                <p className="text-sm text-muted-foreground">
                  Every product we recommend is screened for over 400 acne-causing ingredients. Our zero-tolerance policy means you can shop with confidence knowing any product we recommend is completely free of acne triggers.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Results-based treatment frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  We follow clinical data, not Tiktok trends. Your Clear Skin Plan is built on evidence-based protocols to ensure you get the best results.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Customized for your unique skin profile</h3>
                <p className="text-sm text-muted-foreground">
                  Each Clear Skin Plan is fine tuned to your unique skin profile, including skin type and tone, acne type, and barrier function.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Affordable recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Effective and accessible product recommendations.
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
              Learn how it works →
            </button>
          </div>
        </div>
      </section>

      {/* 3️⃣ HOW IT WORKS - Simple Process Visualization */}
      <section id="how-it-works" className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4">
            How AcneAgent helps you clear your skin — safely.
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Three simple steps to your personalized Clear Skin Plan.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full">
                  Step 1
                </Badge>
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-medium">Tell us about your skin and acne.</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick quiz — no photos. We assess acne type, tone, and barrier.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full">
                  Step 2
                </Badge>
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-medium">We build your Clear Skin Plan.</h3>
                  <p className="text-sm text-muted-foreground">
                    AcneAgent maps your skin profile to clinical acne treatment data to create a regimen of acne-safe products.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <Badge variant="secondary" className="rounded-full">
                  Step 3
                </Badge>
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-medium">Start your regimen and see results.</h3>
                  <p className="text-sm text-muted-foreground">
                    Put your old routine aside and start using only the products in your Clear Skin Plan to see results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-2">
            <Button
              size="lg"
              onClick={() => window.location.href = '/quiz'}
              className="px-8 py-6 h-auto rounded-full text-base font-normal"
              data-testid="button-how-it-works-cta"
            >
              Start my free plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Personalized, evidence-based guidance — not medical advice.
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
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
                AcneAgent takes the risk out of shopping for skincare.
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most "acne-safe" products still contain pore-clogging ingredients like coconut oil, shea butter, and Laureth-4. AcneAgent screens every formula for over 400 known acne triggers before adding it to our marketplace — so you can shop our recommendations with confidence.
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
                  See how we screen ingredients →
                </button>
              </div>
            </div>

            {/* Right Column - Comparison Visual */}
            <div className="space-y-4">
              <Card className="border-destructive/20 bg-destructive/5 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <X className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Flagged Ingredient</h4>
                      <p className="text-sm text-muted-foreground">
                        Laureth-4 detected — highly comedogenic surfactant found in many benzoyl peroxide treatments
                      </p>
                      <Badge variant="destructive" className="rounded-full text-xs">
                        Pore-clogging
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Approved Product</h4>
                      <p className="text-sm text-muted-foreground">
                        All ingredients verified acne-safe — no known comedogenic triggers
                      </p>
                      <Badge variant="secondary" className="rounded-full text-xs bg-primary/10 text-primary border-primary/20">
                        Integrity Verified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Ingredient screening and routine generation are for educational purposes only. AcneAgent does not diagnose, treat, or cure medical conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ FREE PLAN VALUE - Give First, Build Trust */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
              Everything you need to start — free.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get your personalized acne-safe AM + PM routine instantly. We recommend clinically effective products to address your unique concerns within your budget.
            </p>
          </div>

          <Card className="border-border shadow-sm rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Personalized routine</p>
                    <p className="text-sm text-muted-foreground">AM + PM plan tailored to your skin</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Vetted acne-safe products</p>
                    <p className="text-sm text-muted-foreground">Every product screened for 400+ triggers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">3 free product ingredient scans</p>
                    <p className="text-sm text-muted-foreground">Check any product for acne-causing ingredients</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Free to start, no account needed</p>
                    <p className="text-sm text-muted-foreground">Get your routine without signing up</p>
                  </div>
                </li>
              </ul>

              <div className="text-center space-y-2">
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/quiz'}
                  className="w-full px-8 py-6 h-auto rounded-full text-base font-normal"
                  data-testid="button-free-plan-cta"
                >
                  Generate my free routine
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
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
              Upgrade your routine — and your results.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Premium gives you control, unparalleled guidance, and insight into every step of your clear-skin journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Unlimited Ingredient Scans</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan any product for acne triggers
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
                  <h3 className="font-medium mb-2">Routine Coach</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed step-by-step guidance on ramping up on actives, personalized tips, progress tracking, and more.
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
                  <h3 className="font-medium mb-2">Product Alternatives</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize your routine without affecting your results. Budget to luxury options that fit your Clear Skin Plan.
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
                  <h3 className="font-medium mb-2">Routine History</h3>
                  <p className="text-sm text-muted-foreground">
                    View your complete routine history and take notes to track what works best for you.
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
                    Founding Rate
                  </Badge>
                </div>
                <p className="text-4xl md:text-5xl font-semibold">
                  <span className="text-muted-foreground line-through text-2xl md:text-3xl">$5.99</span>
                  {" "}$2.99<span className="text-xl text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Limited founding member rate — locks in forever and locks in discounted rate for Premium+.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  asChild
                  className="w-full px-8 py-6 h-auto rounded-full text-base font-normal"
                  data-testid="button-premium-cta"
                >
                  <Link href="/pricing">
                    Unlock Premium
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Keep using free if it's working. No pressure.
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
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
              One-time upgrades, lifetime value.
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the features you need without a subscription.
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
                  <h3 className="font-serif text-xl font-medium">Routine PDF Download</h3>
                  <p className="text-sm text-muted-foreground">
                    A PDF download with detailed instructions for your routine, ramping up on actives, and tips and tricks for your clear skin journey.
                  </p>
                  <p className="text-2xl font-semibold">$9.99</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  asChild
                  data-testid="button-pdf-upgrade"
                >
                  <Link href="/pricing">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-xl font-medium">Product Alternatives Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock all product options for each step of your current Clear Skin Plan, from drugstore to luxury brands.
                  </p>
                  <p className="text-2xl font-semibold">$9.99</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  asChild
                  data-testid="button-alternatives-upgrade"
                >
                  <Link href="/pricing">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Beaker className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-xl font-medium">Ingredient Scanner Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Buy credits to scan products you have (or products you want to try) for acne-causing ingredients.
                  </p>
                  <p className="text-2xl font-semibold">From $1.99</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  asChild
                  data-testid="button-checker-upgrade"
                >
                  <Link href="/pricing">Learn More</Link>
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
              Explore upgrades →
            </button>
          </div>
        </div>
      </section>
      
      {/* 7️⃣ PREMIUM+ TEASER - Future Vision */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/50">
              Coming Soon
            </Badge>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
              Premium+ — your skin's personal agent.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI-driven ingredient interaction tracking, seasonal adjustments, and image-based progress tracking to automatically adapt your routine to your unique skin.
            </p>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Advanced features for getting clear, staying clear, and the rest of your skincare journey.
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* 9️⃣ EDUCATIONAL / INGREDIENT SCIENCE SECTION */}
      <section id="ingredient-science" className="py-10 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="text-center space-y-20 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
              The science behind our core active and supporting ingredients.
            </h2>
            <div className="flex justify-center">
              <img 
                src={productsIllustration} 
                alt="Skincare products illustration" 
                className="w-full max-w-6xl rounded-2xl"
              />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AcneAgent uses proven actives balanced with barrier-supporting ingredients because you need a strong foundation to build on.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Benzoyl Peroxide */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">Benzoyl Peroxide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clears acne bacteria with powerful antimicrobial action
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
                  <h3 className="font-medium text-lg">Salicylic Acid</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unclogs pores with oil-soluble exfoliation
                </p>
              </CardContent>
            </Card>

            {/* Mandelic Acid */}
            <Card className="border-border shadow-sm rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">Mandelic Acid</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gentle exfoliation safe for sensitive skin
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
                  <h3 className="font-medium text-lg">Niacinamide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calms and balances skin barrier function
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
                  <h3 className="font-medium text-lg">Retinol</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Refines texture and accelerates cell turnover
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
                  <h3 className="font-medium text-lg">Bisabolol</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calms redness and reduces inflammation
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
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold">
              Ready to see your personalized acne-safe routine?
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              It's free, instant, and acne-safe. No email required.
            </p>

            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/quiz'}
                className="px-12 py-8 h-auto rounded-full text-lg font-normal"
                data-testid="button-final-cta"
              >
                Generate my routine
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-muted-foreground">
                For educational purposes only. AcneAgent does not diagnose, treat, or cure medical conditions.
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
              <img src={logoPath} alt="AcneAgent" className="h-8" />
              <p className="text-sm text-muted-foreground">
                Personalized acne care built on science and integrity.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => {
                      const howItWorksSection = document.getElementById('how-it-works');
                      howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-foreground transition-colors underline"
                  >
                    How It Works
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
                    Ingredient Screening
                  </button>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors underline">
                    Premium
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/affiliate-disclosure" className="hover:text-foreground transition-colors underline">
                    Affiliate Disclosure
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground transition-colors underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Get Started</h4>
              <Button
                onClick={() => window.location.href = '/quiz'}
                className="w-full rounded-full"
                data-testid="button-footer-cta"
              >
                Take the Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 space-y-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Medical Disclaimer:</strong> AcneAgent provides educational skincare guidance, not medical treatment. Our ingredient screening and routine recommendations are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider or dermatologist before starting any new skincare regimen, especially if you have severe acne, skin conditions, allergies, or are pregnant/nursing.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              © 2025 AcneAgent. All rights reserved.
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
