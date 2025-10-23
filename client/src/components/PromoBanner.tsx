import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  message: string;
  primaryCTA?: string;
  onPrimaryClick?: () => void;
  onDismiss: () => void;
}

export function PromoBanner({ message, primaryCTA, onPrimaryClick, onDismiss }: PromoBannerProps) {
  return (
    <div 
      className="bg-accent/10 border border-accent/20 rounded-md px-4 py-3 flex items-center justify-between gap-4"
      data-testid="promo-banner"
    >
      <p className="text-sm text-foreground flex-1" data-testid="banner-message">
        {message}
      </p>
      <div className="flex items-center gap-2">
        {primaryCTA && onPrimaryClick && (
          <Button
            size="sm"
            variant="default"
            onClick={onPrimaryClick}
            data-testid="button-banner-cta"
          >
            {primaryCTA}
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 flex-shrink-0"
          onClick={onDismiss}
          data-testid="button-dismiss-banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
