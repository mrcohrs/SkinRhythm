import { useState } from "react";
import { Header } from "@/components/Header";
import { LandingPage } from "@/components/LandingPage";
import { QuizFlow, type QuizAnswers } from "@/components/QuizFlow";
import { RoutineDisplay } from "@/components/RoutineDisplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PageView = "landing" | "quiz" | "routine";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<PageView>("landing");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [priceTier, setPriceTier] = useState<"budget" | "standard" | "premium">("standard");

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setShowAuthModal(true);
  };

  const handleAuthComplete = () => {
    setShowAuthModal(false);
    setCurrentView("routine");
  };

  const mockProducts = {
    morning: [
      {
        name: "CeraVe Foaming Facial Cleanser",
        brand: "CeraVe",
        price: 14.99,
        priceTier: "budget" as const,
        benefits: ["Gentle foaming cleanser for oily skin", "Contains ceramides and hyaluronic acid", "Non-comedogenic"],
        affiliateLink: "https://example.com/cerave-cleanser",
      },
      {
        name: "Paula's Choice 2% BHA Liquid Exfoliant",
        brand: "Paula's Choice",
        price: 32.00,
        priceTier: "standard" as const,
        benefits: ["Exfoliates and unclogs pores", "Reduces blackheads and breakouts", "Gentle daily use formula"],
        affiliateLink: "https://example.com/paulas-choice-bha",
      },
      {
        name: "SkinCeuticals C E Ferulic",
        brand: "SkinCeuticals",
        price: 169.00,
        priceTier: "premium" as const,
        benefits: ["Advanced antioxidant protection", "Brightens and firms skin", "Medical-grade vitamin C serum"],
        affiliateLink: "https://example.com/skinceuticals-ce",
      },
      {
        name: "Neutrogena Hydro Boost",
        brand: "Neutrogena",
        price: 18.99,
        priceTier: "budget" as const,
        benefits: ["Lightweight gel moisturizer", "Hyaluronic acid hydration", "Oil-free and non-comedogenic"],
        affiliateLink: "https://example.com/neutrogena-hydroboost",
      },
      {
        name: "EltaMD UV Clear SPF 46",
        brand: "EltaMD",
        price: 39.00,
        priceTier: "standard" as const,
        benefits: ["Broad spectrum UV protection", "Contains niacinamide", "Lightweight for acne-prone skin"],
        affiliateLink: "https://example.com/eltamd-uv",
      },
      {
        name: "La Roche-Posay Anthelios",
        brand: "La Roche-Posay",
        price: 42.99,
        priceTier: "premium" as const,
        benefits: ["Ultra-light sunscreen", "Antioxidant complex", "Dermatologist tested"],
        affiliateLink: "https://example.com/lrp-anthelios",
      },
    ],
    evening: [
      {
        name: "The Ordinary Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        price: 6.99,
        priceTier: "budget" as const,
        benefits: ["Reduces blemishes and congestion", "Regulates sebum production", "Affordable and effective"],
        affiliateLink: "https://example.com/ordinary-niacinamide",
      },
      {
        name: "Differin Gel (Adapalene 0.1%)",
        brand: "Differin",
        price: 14.99,
        priceTier: "budget" as const,
        benefits: ["Retinoid treatment for acne", "Prevents breakouts", "FDA approved"],
        affiliateLink: "https://example.com/differin-gel",
      },
      {
        name: "La Roche-Posay Effaclar Duo",
        brand: "La Roche-Posay",
        price: 36.99,
        priceTier: "standard" as const,
        benefits: ["Dual-action acne treatment", "Reduces marks and blemishes", "Dermatologist recommended"],
        affiliateLink: "https://example.com/lrp-effaclar",
      },
      {
        name: "Drunk Elephant T.L.C. Framboos",
        brand: "Drunk Elephant",
        price: 90.00,
        priceTier: "premium" as const,
        benefits: ["Glycolic & salicylic acid blend", "Luxury night serum", "Visible results in weeks"],
        affiliateLink: "https://example.com/de-framboos",
        isPremiumOnly: true,
      },
      {
        name: "CeraVe PM Facial Moisturizer",
        brand: "CeraVe",
        price: 16.99,
        priceTier: "budget" as const,
        benefits: ["Night moisturizer with niacinamide", "Restores skin barrier", "Non-comedogenic"],
        affiliateLink: "https://example.com/cerave-pm",
      },
      {
        name: "First Aid Beauty Ultra Repair Cream",
        brand: "First Aid Beauty",
        price: 38.00,
        priceTier: "standard" as const,
        benefits: ["Intense hydration therapy", "Colloidal oatmeal", "Soothes irritation"],
        affiliateLink: "https://example.com/fab-ultra-repair",
      },
    ],
  };

  return (
    <>
      <Header
        onLoginClick={() => setShowAuthModal(true)}
        isAuthenticated={currentView === "routine"}
      />

      {currentView === "landing" && (
        <LandingPage onStartQuiz={() => setCurrentView("quiz")} />
      )}

      {currentView === "quiz" && (
        <QuizFlow
          onComplete={handleQuizComplete}
          onBack={() => setCurrentView("landing")}
        />
      )}

      {currentView === "routine" && quizAnswers && (
        <RoutineDisplay
          userName={quizAnswers.name}
          skinType={quizAnswers.skinType}
          products={mockProducts}
          isPremiumUser={false}
          selectedPriceTier={priceTier}
          onPriceTierChange={setPriceTier}
        />
      )}

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent data-testid="dialog-auth">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Save your personalized routine and track your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Sign up to save your personalized skincare routine and access it anytime.
            </p>
            <div className="space-y-2">
              <Button className="w-full" onClick={handleAuthComplete} data-testid="button-signup-demo">
                Create Account (Demo)
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                In the full app, you'll use Replit Auth to sign in with Google, GitHub, or email
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
