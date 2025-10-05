import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onLoginClick, isAuthenticated = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold">SkinRhythm</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isAuthenticated && (
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="rounded-full"
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
