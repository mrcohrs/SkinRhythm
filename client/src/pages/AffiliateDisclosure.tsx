import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

export default function AffiliateDisclosure() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <Card className="p-8 md:p-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">
              Affiliate Disclosure
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
              <p>
                AcneAgent is reader-supported. Some of the links on our website are affiliate links, 
                which means we may earn a small commission if you make a purchase through them—at no 
                additional cost to you.
              </p>

              <p>
                We only recommend products that are clinically backed, acne-safe, and align with our 
                mission of making professional-grade acne treatment and skincare guidance accessible 
                to everyone.
              </p>

              <p>
                As an Amazon Associate, AcneAgent earns from qualifying purchases.
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
