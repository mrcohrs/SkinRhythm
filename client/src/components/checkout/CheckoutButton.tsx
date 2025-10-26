import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { trackCheckoutInitiated } from "@/lib/analytics";

interface CheckoutButtonProps {
  priceId: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  className?: string;
  productType?: string;
  amount?: number;
}

export function CheckoutButton({
  priceId,
  label = "Purchase",
  variant = "default",
  size = "default",
  disabled = false,
  className,
  productType = "unknown",
  amount = 0,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    
    // Track begin_checkout event
    trackCheckoutInitiated({
      productType,
      amount,
      currency: 'USD'
    });
    
    try {
      const response = await apiRequest("POST", "/api/payments/create-checkout", {
        priceId,
        successUrl: `${window.location.origin}/dashboard?payment=success&product=${encodeURIComponent(productType)}&amount=${amount}`,
        cancelUrl: `${window.location.origin}/pricing?payment=cancelled`,
      });
      const data = await response.json() as { sessionId: string; url: string };

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
      data-testid={`button-checkout-${priceId}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        label
      )}
    </Button>
  );
}
