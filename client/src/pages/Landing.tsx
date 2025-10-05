import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground">
              SkinRhythm
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your personalized acne skincare routine, crafted by experts
            </p>
          </div>

          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p>
              Answer a few simple questions about your skin, and we'll create a customized
              skincare routine designed specifically for your unique needs. Get expert-recommended
              products with direct links to purchase.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="gap-2"
              data-testid="button-get-started"
            >
              <Sparkles className="w-5 h-5" />
              Get Started
            </Button>
          </div>

          <div className="pt-12 grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-playfair text-xl font-semibold">Personalized</h3>
              <p className="text-sm text-muted-foreground">
                Routines tailored to your skin type, Fitzpatrick type, and specific acne concerns
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-playfair text-xl font-semibold">Expert-Curated</h3>
              <p className="text-sm text-muted-foreground">
                Product recommendations based on dermatological research and proven results
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-playfair text-xl font-semibold">Easy to Follow</h3>
              <p className="text-sm text-muted-foreground">
                Clear morning and evening routines with direct purchase links
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
