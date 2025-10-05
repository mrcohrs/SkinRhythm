import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-primary-foreground">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
                  Smart AI-Powered Skin Analysis for Healthier and Radiant Skin
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Receive AI-driven assessments, personalized recommendations, and expert insights for a skincare routine tailored to your unique skin.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onStartQuiz}
                  className="text-base px-8 py-6 h-auto bg-accent hover:bg-accent text-accent-foreground rounded-full"
                  data-testid="button-start-quiz"
                >
                  Start Your Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-3xl p-8 border border-primary-foreground/20">
                  <div className="aspect-[3/4] bg-primary-foreground/5 rounded-2xl flex items-center justify-center">
                    <p className="text-primary-foreground/60 text-sm">AI Analysis Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">How It Works</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Your Personalized Skincare Journey
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Skin Analysis",
                description: "Complete our comprehensive quiz about your skin type, concerns, and lifestyle.",
              },
              {
                step: "02",
                title: "AI Recommendations",
                description: "Get science-backed product recommendations tailored to your unique skin profile.",
              },
              {
                step: "03",
                title: "Track & Improve",
                description: "Monitor your progress and receive updated recommendations as your skin evolves.",
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <div className="text-5xl font-serif text-primary/20 mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">Start free, upgrade anytime</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="border border-border rounded-2xl p-8 md:p-10">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-semibold mb-2">Free</h3>
                <p className="text-muted-foreground">Perfect to get started</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "AI-powered skin analysis",
                  "Personalized product recommendations",
                  "Budget-friendly options",
                  "Save your routine",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-2 border-primary rounded-2xl p-8 md:p-10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground px-4 py-1 text-sm rounded-full">
                  Popular
                </Badge>
              </div>
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-semibold mb-2">Premium</h3>
                <p className="text-muted-foreground">For serious skin transformation</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Free",
                  "Progress tracking with photos",
                  "Updated routine recommendations",
                  "Alternative product suggestions",
                  "Expert skincare insights",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 rounded-full" 
                data-testid="button-upgrade-premium"
              >
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
            Start Your Skin Journey Today
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands achieving clearer, healthier skin with personalized routines
          </p>
          <Button
            size="lg"
            onClick={onStartQuiz}
            className="text-base px-10 py-6 h-auto bg-primary hover:bg-primary/90 rounded-full"
            data-testid="button-start-quiz-footer"
          >
            Get Your Free Analysis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
