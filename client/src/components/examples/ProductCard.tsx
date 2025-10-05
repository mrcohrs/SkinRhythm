import { ProductCard } from "../ProductCard";
import { ThemeProvider } from "../ThemeProvider";

export default function ProductCardExample() {
  const mockProduct = {
    name: "CeraVe Foaming Facial Cleanser",
    brand: "CeraVe",
    price: 14.99,
    priceTier: "budget" as const,
    benefits: [
      "Gentle foaming cleanser for oily skin",
      "Contains ceramides and hyaluronic acid",
      "Non-comedogenic and fragrance-free",
    ],
    affiliateLink: "https://example.com/product",
  };

  return (
    <ThemeProvider>
      <div className="p-8 max-w-sm">
        <ProductCard product={mockProduct} isPremiumUser={false} />
      </div>
    </ThemeProvider>
  );
}
