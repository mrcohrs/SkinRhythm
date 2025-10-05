import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, TrendingUp, Lock } from "lucide-react";
import heroImage from "@assets/generated_images/Diverse_clear_skin_hero_3ead8b65.png";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen pt-16">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Diverse individuals with healthy skin"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Clear Skin Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto">
            Get a personalized acne skincare routine in minutes. Science-backed recommendations tailored to your unique skin.
          </p>
          <Button
            size="lg"
            onClick={onStartQuiz}
            className="text-lg px-8 py-6 h-auto"
            data-testid="button-start-quiz"
          >
            Start Your Free Quiz
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Take the Quiz",
                description: "Answer questions about your skin type, concerns, and lifestyle in just 2 minutes.",
                icon: Sparkles,
              },
              {
                step: "2",
                title: "Get Your Routine",
                description: "Receive a personalized skincare routine with product recommendations for your budget.",
                icon: TrendingUp,
              },
              {
                step: "3",
                title: "Track Progress",
                description: "Premium members can track their skin journey and get updated recommendations.",
                icon: Lock,
              },
            ].map((item) => (
              <Card key={item.step} className="p-6 hover-elevate">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
            Free vs Premium
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <Badge className="mb-4">Free</Badge>
              <h3 className="text-2xl font-semibold mb-4">Get Started</h3>
              <ul className="space-y-3">
                {[
                  "Personalized routine generation",
                  "Product recommendations",
                  "Budget-friendly options",
                  "Save your routine",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card className="p-8 border-primary">
              <Badge className="mb-4 bg-accent text-accent-foreground">Premium</Badge>
              <h3 className="text-2xl font-semibold mb-4">Unlock Everything</h3>
              <ul className="space-y-3">
                {[
                  "Everything in Free",
                  "Progress tracking with photos",
                  "Updated routine recommendations",
                  "Alternative product options",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" variant="default" data-testid="button-upgrade-premium">
                Upgrade to Premium
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Join thousands who've found their perfect skincare routine
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={onStartQuiz}
            className="text-lg px-8 py-6 h-auto"
            data-testid="button-start-quiz-footer"
          >
            Start Your Free Quiz
          </Button>
        </div>
      </section>
    </div>
  );
}
