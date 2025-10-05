import { PremiumUpsell } from "../PremiumUpsell";
import { ThemeProvider } from "../ThemeProvider";

export default function PremiumUpsellExample() {
  return (
    <ThemeProvider>
      <div className="p-8 max-w-4xl">
        <PremiumUpsell />
      </div>
    </ThemeProvider>
  );
}
