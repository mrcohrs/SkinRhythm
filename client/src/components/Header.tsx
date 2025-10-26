import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { LoginModal } from '@/components/LoginModal';
import { Menu, LogOut, Crown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoPath from "@assets/neweww_1761485311132.png";

interface HeaderProps {
  showNavigation?: boolean;
}

export function Header({ showNavigation = true }: HeaderProps) {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setLocation('/dashboard');
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const navLinks = [
    { label: 'home', href: '/' },
    { label: 'marketplace', href: '/marketplace' },
    { label: 'pricing', href: '/pricing' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
              data-testid="button-logo"
            >
              <img src={logoPath} alt="SkinRhythm" className="h-8" />
            </button>

            {/* Desktop Navigation */}
            {showNavigation && !isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => setLocation(link.href)}
                    className={`text-sm transition-colors ${
                      location === link.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid={`link-${link.label}`}
                  >
                    {link.label}
                  </button>
                ))}
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-login"
                >
                  log in
                </button>
                <button
                  onClick={() => setLocation('/quiz')}
                  className="text-sm text-primary-text hover:text-primary-text/80 font-normal underline transition-colors"
                  data-testid="link-quiz-header"
                >
                  find your skinrhythm
                </button>
              </div>
            )}

            {/* Authenticated User Menu - Desktop */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-2"
                      data-testid="button-user-menu"
                    >
                      {(user as any)?.email}
                      {(user as any)?.membershipTier && (user as any).membershipTier !== 'free' && (
                        <Crown className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLocation('/dashboard')} data-testid="menu-dashboard">
                      dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/marketplace')} data-testid="menu-marketplace">
                      marketplace
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/pricing')} data-testid="menu-pricing">
                      pricing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            {showNavigation && (
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      data-testid="button-mobile-menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <SheetHeader>
                      <SheetTitle className="text-left">menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 mt-8">
                      {!isAuthenticated ? (
                        <>
                          {navLinks.map((link) => (
                            <button
                              key={link.href}
                              onClick={() => {
                                setLocation(link.href);
                                setMobileMenuOpen(false);
                              }}
                              className={`text-left py-2 transition-colors ${
                                location === link.href
                                  ? 'text-foreground font-normal'
                                  : 'text-muted-foreground'
                              }`}
                              data-testid={`mobile-link-${link.label}`}
                            >
                              {link.label}
                            </button>
                          ))}
                          <div className="border-t pt-4 mt-2">
                            <button
                              onClick={() => {
                                setShowLoginModal(true);
                                setMobileMenuOpen(false);
                              }}
                              className="w-full text-left py-2 text-muted-foreground"
                              data-testid="mobile-link-login"
                            >
                              log in
                            </button>
                            <button
                              onClick={() => {
                                setLocation('/quiz');
                                setMobileMenuOpen(false);
                              }}
                              className="w-full text-left py-2 text-primary-text font-normal"
                              data-testid="mobile-link-quiz"
                            >
                              find your skinrhythm
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setLocation('/dashboard');
                              setMobileMenuOpen(false);
                            }}
                            className="text-left py-2 text-muted-foreground"
                            data-testid="mobile-link-dashboard"
                          >
                            dashboard
                          </button>
                          <button
                            onClick={() => {
                              setLocation('/marketplace');
                              setMobileMenuOpen(false);
                            }}
                            className="text-left py-2 text-muted-foreground"
                            data-testid="mobile-link-marketplace"
                          >
                            marketplace
                          </button>
                          <button
                            onClick={() => {
                              setLocation('/pricing');
                              setMobileMenuOpen(false);
                            }}
                            className="text-left py-2 text-muted-foreground"
                            data-testid="mobile-link-pricing"
                          >
                            pricing
                          </button>
                          <div className="border-t pt-4 mt-2">
                            <div className="py-2 text-sm text-muted-foreground">
                              {(user as any)?.email}
                              {(user as any)?.membershipTier && (user as any).membershipTier !== 'free' && (
                                <Crown className="h-4 w-4 text-primary inline-block ml-2" />
                              )}
                            </div>
                            <button
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }}
                              className="w-full text-left py-2 text-muted-foreground flex items-center gap-2"
                              data-testid="mobile-link-logout"
                            >
                              <LogOut className="h-4 w-4" />
                              log out
                            </button>
                          </div>
                        </>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal 
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
