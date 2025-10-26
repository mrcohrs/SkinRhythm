import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import logoPath from "@assets/neweww_1761485311132.png";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";

export default function BeautyProducts() {
  const [, setLocation] = useLocation();
  const [productType, setProductType] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || 'makeup';
    setProductType(type);
  }, []);

  const getTitle = () => {
    switch(productType) {
      case 'makeup':
        return 'Acne-Safe Makeup';
      case 'skin-tints':
        return 'Acne-Safe Skin Tints';
      default:
        return 'Acne-Safe Beauty Products';
    }
  };

  const getDescription = () => {
    switch(productType) {
      case 'makeup':
        return 'Browse our curated collection of non-comedogenic makeup products that won\'t clog pores or cause breakouts.';
      case 'skin-tints':
        return 'Discover lightweight tinted moisturizers and SPFs that provide coverage while treating your skin.';
      default:
        return 'Explore our collection of acne-safe beauty products.';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <img 
              src={logoPath} 
              alt="SkinRhythm" 
              className="h-8 w-auto"
            />
          </Link>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-4" data-testid="text-title">
              {getTitle()}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {getDescription()}
            </p>
          </div>

          {/* Placeholder Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="hover-elevate" data-testid={`product-card-${i}`}>
                <CardHeader>
                  <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Product Image</span>
                  </div>
                  <CardTitle className="text-lg">Product {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This is a placeholder for an acne-safe {productType === 'skin-tints' ? 'skin tint' : 'makeup'} product.
                  </p>
                  <Button variant="outline" className="w-full" data-testid={`button-view-${i}`}>
                    View Product
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-16 p-8 rounded-lg bg-muted/50 border border-border text-center">
            <h3 className="font-serif text-2xl font-semibold mb-2">
              Full Product Library Coming Soon
            </h3>
            <p className="text-muted-foreground">
              We're curating the best acne-safe beauty products for you. Check back soon for our complete collection with detailed reviews and ingredient analysis.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
