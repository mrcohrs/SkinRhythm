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
              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">What We Collect</h2>
                <p>
                  At AcneAgent, we value your privacy. We collect only the information necessary to 
                  deliver your personalized acne routine and improve your experience. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Responses to our skincare quiz (skin type, acne concerns, age, pregnancy status)</li>
                  <li>Saved skincare routines and product recommendations</li>
                  <li>Site usage data and anonymized analytics</li>
                  <li>Account information when you create an account (email, authentication data)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">AI Training & Data Use</h2>
                <p>
                  We are building the foundation for AI-powered skincare recommendations based on real user results. 
                  With your explicit consent, we may collect and use anonymized data including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your skincare routines and product usage history</li>
                  <li>Future skin analysis data from photos you upload (not currently implemented)</li>
                  <li>Treatment effectiveness data based on before/after assessments</li>
                  <li>Correlation between product usage and skin improvement over time</li>
                </ul>
                <p className="mt-4">
                  <strong>All data used for AI training is fully anonymized.</strong> We remove all personally 
                  identifiable information before using your data to improve our recommendation algorithms. 
                  You can provide or withdraw consent at any time from your account dashboard.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">How We Protect Your Privacy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Anonymization:</strong> Personal identifiers are removed from all data used for AI training</li>
                  <li><strong>Explicit consent:</strong> We ask for your permission before collecting data for AI purposes</li>
                  <li><strong>Secure storage:</strong> All data is stored securely using industry-standard encryption</li>
                  <li><strong>No selling:</strong> We never sell your personal data to third parties</li>
                  <li><strong>Your control:</strong> You can request data deletion or withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">Third-Party Services</h2>
                <p>
                  We never share personal data with third parties, except as required to process 
                  affiliate links or provide essential site functions. Third-party services (such as Google 
                  Analytics, Amazon Associates, Rakuten, or Awin) may use cookies to track clicks and commissions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal data we have about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (right to be forgotten)</li>
                  <li>Withdraw consent for data collection or AI training at any time</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of cookies (via your browser settings)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">GDPR & CCPA Compliance</h2>
                <p>
                  We comply with the General Data Protection Regulation (GDPR) and California Consumer 
                  Privacy Act (CCPA). If you are a resident of the EU or California, you have additional 
                  rights regarding your personal data. Contact us to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Us</h2>
                <p>
                  You can disable cookies in your browser settings at any time. If you have any questions 
                  about our data practices, want to exercise your privacy rights, or wish to withdraw consent, 
                  please contact us at{" "}
                  <a href="mailto:acne-agent-help@gmail.com" className="text-primary underline hover:no-underline">
                    acne-agent-help@gmail.com
                  </a>.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </section>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
