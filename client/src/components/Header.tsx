import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onLoginClick, isAuthenticated = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">SkinRhythm</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isAuthenticated && (
            <Button
              variant="ghost"
              onClick={onLoginClick}
              data-testid="button-login"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
