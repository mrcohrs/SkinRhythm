import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  priceId: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  className?: string;
}

export function CheckoutButton({
  priceId,
  label = "Purchase",
  variant = "default",
  size = "default",
  disabled = false,
  className,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ sessionId: string; url: string }>(
        "/api/payments/create-checkout",
        {
          method: "POST",
          body: JSON.stringify({
            priceId,
            successUrl: `${window.location.origin}/dashboard?payment=success`,
            cancelUrl: `${window.location.origin}/pricing?payment=cancelled`,
          }),
        }
      );

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
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
