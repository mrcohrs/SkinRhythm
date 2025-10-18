import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <Card className="p-8 md:p-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
              <p>
                At AcneAgent, we value your privacy. We collect only the information necessary to 
                deliver your personalized acne routine and improve your experience. This may include 
                responses to our quiz, site usage data, and anonymized analytics.
              </p>

              <p>
                We never sell or share personal data with third parties, except as required to process 
                affiliate links or provide essential site functions. Third-party services (such as Google 
                Analytics, Amazon Associates, Rakuten, or Awin) may use cookies to track clicks and commissions.
              </p>

              <p>
                You can disable cookies in your browser settings at any time. If you have any questions 
                about our data practices, please contact us at{" "}
                <a href="mailto:acne-agent-help@gmail.com" className="text-primary underline hover:no-underline">
                  acne-agent-help@gmail.com
                </a>.
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
