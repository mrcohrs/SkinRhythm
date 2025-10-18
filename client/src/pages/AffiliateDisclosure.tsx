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
               <b>WEBSITE DISCLAIMER</b>
              </p>
             <p> 
               The information provided by AcneAgent by SkinRhythm ("we," "us," or "our") on acne-agent.com (the "Site") is for general informational purposes only.
All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
            </p>
              <p>
                 <b>EXTERNAL LINKS DISCLAIMER</b>
                </p>
               <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
               </p>
              <p>
                 <b>PROFESSIONAL DISCLAIMER</b>
                </p>
               <p>The Site cannot and does not contain medical/health advice. The medical/health information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of medical/health advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.
               </p>
                 <p>
                 <b>AFFILIATES DISCLAIMER</b>
                 </p>
               <p>The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. There is no additional cost to you for using our affiliate links, and it is what allows us to provide personalized, evidence-based skincare routines for free.
               
                 We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn advertising fees by linking to Amazon.com and affiliated websites.
              
                We only recommend products that align with both our standards for being considered acne-safe and our mission of making evidence-based skincare guidance accessible to everyone.
              </p>
                   
            </div>
               </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
