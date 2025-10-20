import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  body: string;
  primaryCTA: string;
  secondaryCTA?: string;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
  onDismiss?: () => void;
  variant?: "default" | "compact";
}

export function InfoCard({
  title,
  body,
  primaryCTA,
  secondaryCTA,
  onPrimaryClick,
  onSecondaryClick,
  onDismiss,
  variant = "default",
}: InfoCardProps) {
  const isCompact = variant === "compact";

  return (
    <Card className={`relative ${isCompact ? "p-4" : "p-6"}`} data-testid="info-card">
      {onDismiss && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={onDismiss}
          data-testid="button-dismiss-card"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className={isCompact ? "pr-8" : "pr-10"}>
        <h3 className={`font-semibold ${isCompact ? "text-base" : "text-lg"} mb-2`} data-testid="card-title">
          {title}
        </h3>
        <p className={`text-muted-foreground ${isCompact ? "text-sm" : "text-base"} mb-4`} data-testid="card-body">
          {body}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button onClick={onPrimaryClick} data-testid="button-card-primary">
            {primaryCTA}
          </Button>
          {secondaryCTA && onSecondaryClick && (
            <Button variant="outline" onClick={onSecondaryClick} data-testid="button-card-secondary">
              {secondaryCTA}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
