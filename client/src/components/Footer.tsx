import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AcneAgent. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="/affiliate-disclosure"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-footer-affiliate"
            >
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
