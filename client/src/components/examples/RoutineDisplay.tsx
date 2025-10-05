import { RoutineDisplay } from "../RoutineDisplay";
import { ThemeProvider } from "../ThemeProvider";
import { useState } from "react";

export default function RoutineDisplayExample() {
  const [priceTier, setPriceTier] = useState<"budget" | "standard" | "premium">("standard");

  const mockProducts = {
    morning: [
      {
        name: "CeraVe Foaming Facial Cleanser",
        brand: "CeraVe",
        price: 14.99,
        priceTier: "budget" as const,
        benefits: ["Gentle foaming cleanser", "Contains ceramides", "Non-comedogenic"],
        affiliateLink: "https://example.com",
      },
      {
        name: "Paula's Choice 2% BHA",
        brand: "Paula's Choice",
        price: 32.00,
        priceTier: "standard" as const,
        benefits: ["Exfoliates skin", "Unclogs pores", "Reduces blackheads"],
        affiliateLink: "https://example.com",
      },
      {
        name: "SkinCeuticals C E Ferulic",
        brand: "SkinCeuticals",
        price: 169.00,
        priceTier: "premium" as const,
        benefits: ["Advanced antioxidant serum", "Brightens skin", "Medical-grade formula"],
        affiliateLink: "https://example.com",
      },
    ],
    evening: [
      {
        name: "The Ordinary Niacinamide",
        brand: "The Ordinary",
        price: 6.99,
        priceTier: "budget" as const,
        benefits: ["Reduces blemishes", "Controls oil", "Affordable treatment"],
        affiliateLink: "https://example.com",
      },
      {
        name: "La Roche-Posay Effaclar Duo",
        brand: "La Roche-Posay",
        price: 36.99,
        priceTier: "standard" as const,
        benefits: ["Treats acne", "Reduces marks", "Dermatologist recommended"],
        affiliateLink: "https://example.com",
      },
      {
        name: "Drunk Elephant T.L.C. Framboos",
        brand: "Drunk Elephant",
        price: 90.00,
        priceTier: "premium" as const,
        benefits: ["Glycolic & salicylic acid blend", "Luxury formulation", "Visible results"],
        affiliateLink: "https://example.com",
        isPremiumOnly: true,
      },
    ],
  };

  return (
    <ThemeProvider>
      <RoutineDisplay
        userName="Alex"
        skinType="oily"
        products={mockProducts}
        isPremiumUser={false}
        selectedPriceTier={priceTier}
        onPriceTierChange={setPriceTier}
      />
    </ThemeProvider>
  );
}
