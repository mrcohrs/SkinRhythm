import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Sparkles, FlaskConical, Heart } from "lucide-react";
import { Link } from "wouter";

import moleculeImg from "@assets/molecule_1761251136047.png";
import bpoCardImg from "@assets/BPO Information Card-1_1761251136060.png";
import retinolCardImg from "@assets/BPO Information Card-2_1761251136061.png";
import mandelicCardImg from "@assets/BPO Information Card_1761251136061.png";
import bisabololCardImg from "@assets/Ingredient card for Bisabolol_1761251136062.png";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Molecule background - semi-transparent on the right side */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5 opacity-20 dark:opacity-10 bg-contain bg-right bg-no-repeat"
          style={{ backgroundImage: `url(${moleculeImg})` }}
        />
        
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-24">
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                Clear Skin, Backed by Science — Not Hype
              </h1>
              <p className="text-lg md:text-xl mb-6 leading-relaxed text-muted-foreground">
                Your personalized, acne-safe routine — powered by <strong className="text-foreground">clinical protocols developed by top acne experts</strong> and inspired by the <strong className="text-foreground">formulation standards of luxury skincare labs</strong>.
              </p>
              <p className="text-lg md:text-xl mb-8 leading-relaxed text-muted-foreground">
                SkinRhythm builds you a complete regimen using <strong className="text-foreground">budget-friendly, over-the-counter products</strong> that meet the same ingredient safety standards as premium lines.
              </p>
              <Button
                size="lg"
                onClick={onStartQuiz}
                className="text-base px-10 py-6 h-auto rounded-full mb-4"
                data-testid="button-start-quiz-hero"
              >
                Get My Free Routine
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground max-w-2xl">
                SkinRhythm provides educational skincare recommendations based on evidence-informed treatment protocols. It is not a substitute for medical care or diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ingredients Matter Section */}
      <section className="py-24 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Why Ingredients Matter
              </h2>
            </div>
            
            <div className="bg-background rounded-2xl p-8 md:p-12 mb-8">
              <h3 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
                90% of "Acne Products" Contain Acne-Causing Ingredients
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Even some luxury skincare and dermatologist-endorsed brands use <strong className="text-foreground">highly comedogenic ingredients</strong> like <em>laureth-4</em> and <em>isopropyl myristate</em>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Nearly <strong className="text-foreground">9 in 10 benzoyl peroxide products</strong> on the market contain <em>laureth-4</em>, which can block pores and undo results.
              </p>
              <p className="text-lg leading-relaxed">
                SkinRhythm only recommends <strong>benzoyl peroxide formulas free of laureth-4</strong> — and applies that same ingredient logic to every cleanser, serum, and moisturizer we suggest.
              </p>
            </div>
            
            <div className="text-center">
              <Link href="/ingredient-checker">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 h-auto rounded-full"
                  data-testid="button-scan-ingredients"
                >
                  Scan My Products for Acne-Causing Ingredients
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Meets Aesthetics Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Evidence Meets Aesthetics
            </h2>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
              Skincare That Feels Luxe — and Acts Clinical
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Each SkinRhythm routine is crafted with the same precision as a luxury skincare line: thoughtfully layered actives, ingredient synergy, and no pore-clogging fillers. We source from <strong className="text-foreground">accessible, evidence-based brands</strong> that perform like prestige skincare — without the inflated price tags.
            </p>
          </div>

          {/* Ingredient Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden border border-border">
                <img 
                  src={bpoCardImg} 
                  alt="Benzoyl Peroxide Information Card" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-xl font-semibold mb-2">Benzoyl Peroxide</h4>
              <p className="text-sm text-muted-foreground italic mb-2">Antibacterial Power</p>
              <p className="text-sm leading-relaxed">
                Eliminates acne-causing bacteria and keeps pores clear.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden border border-border">
                <img 
                  src={mandelicCardImg} 
                  alt="Mandelic Acid Information Card" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-xl font-semibold mb-2">Mandelic Acid</h4>
              <p className="text-sm text-muted-foreground italic mb-2">Gentle Luxury Exfoliant</p>
              <p className="text-sm leading-relaxed">
                Balances tone and clarity with the same actives used in high-end formulations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden border border-border">
                <img 
                  src={retinolCardImg} 
                  alt="Retinol Information Card" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-xl font-semibold mb-2">Retinol</h4>
              <p className="text-sm text-muted-foreground italic mb-2">Refines & Rejuvenates</p>
              <p className="text-sm leading-relaxed">
                Promotes cell turnover for visibly smoother skin.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden border border-border">
                <img 
                  src={bisabololCardImg} 
                  alt="Bisabolol Information Card" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-xl font-semibold mb-2">Bisabolol</h4>
              <p className="text-sm text-muted-foreground italic mb-2">Luxury-Caliber Calm</p>
              <p className="text-sm leading-relaxed">
                Derived from chamomile; soothes redness and irritation with a touch of botanical refinement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How SkinRhythm Works Section */}
      <section className="py-24 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              How SkinRhythm Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-5xl font-serif text-primary/20 mb-4">01</div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                Answer a few quick questions
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We analyze your acne type, skin tone, and sensitivity.
              </p>
            </div>

            <div className="group">
              <div className="text-5xl font-serif text-primary/20 mb-4">02</div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                AI applies expert treatment logic
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our system mirrors the approach licensed acne experts use to build clinical routines.
              </p>
            </div>

            <div className="group">
              <div className="text-5xl font-serif text-primary/20 mb-4">03</div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                Get your personalized routine
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Thoughtfully balanced, budget-conscious, and clinically grounded.
              </p>
            </div>

            <div className="group">
              <div className="text-5xl font-serif text-primary/20 mb-4">04</div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                Upgrade to Premium
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Unlock ingredient scanning, product alternatives, and routine coaching for $2.99/month.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={onStartQuiz}
              className="text-base px-10 py-6 h-auto rounded-full"
              data-testid="button-start-routine"
            >
              Start My Routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Users Love SkinRhythm Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Why Users Love SkinRhythm
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Luxury logic, accessible price
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Skincare designed with the discipline of a lab, not the markup of a spa.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Zero acne triggers
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every ingredient is vetted for comedogenicity and synergy.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Accessible evidence
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each routine is built from proven actives used by professionals worldwide.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Designed for modern skin
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Balanced for barrier health, tone, and texture — not just breakouts.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={onStartQuiz}
              className="text-base px-10 py-6 h-auto rounded-full"
              data-testid="button-see-routine"
            >
              See My Acne-Safe Routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
