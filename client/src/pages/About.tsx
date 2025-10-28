import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-8 lg:px-16 max-w-4xl py-12 md:py-16">
          {/* Header */}
          <div className="mb-12 space-y-4">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Founder Letter
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight">
              Why I Built SkinRhythm
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              No miracle cures. Just real, personalized acne care that doesn't lie to you.
            </p>
          </div>

          {/* Author */}
          <div className="mb-12 pb-8 border-b border-border">
            <p className="text-lg">
              Mark Cohrs, Founder of SkinRhythm
            </p>
          </div>

          {/* Letter Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <p>
              Hi, I'm Mark — founder of SkinRhythm.
            </p>

            <p>
              As someone who's lived with acne, I know firsthand how emotional, isolating, and exhausting it can be. How every new "miracle cure" brings a spark of hope, only to leave you right back where you started, feeling worse than before.
            </p>

            <p>
              That endless cycle chips away at our ability to trust, our confidence, and sometimes even our happiness.
            </p>

            <p className="text-xl font-normal">
              The truth: there is no miracle cure for acne.
            </p>

            <p>
              But there is a way to manage it — with knowledge, precision, and consistency.
            </p>

            <h2 className="text-2xl md:text-3xl font-light mt-12 mb-6">
              What I saw inside "professional" acne treatment
            </h2>

            <p>
              While working for a professional acne treatment brand with a 90%+ success rate, I learned the basic science behind why this program seemed to work so much more reliably than anything I had seen before: <strong>it all comes down to customization</strong>.
            </p>

            <p>
              Acne isn't one condition. It's dozens of overlapping patterns, and every person needs a slightly different plan. The active ingredient that clears one skin type can destroy someone else's barrier. The exfoliant strength that's perfect for oily skin can be way too aggressive for reactive or melanated skin.
            </p>

            <p>
              That's what SkinRhythm was built to do: build you a personalized acne routine that's designed specifically for your skin — not someone else's.
            </p>

            <h2 className="text-2xl md:text-3xl font-light mt-12 mb-6">
              What makes SkinRhythm different
            </h2>

            <h3 className="text-xl font-normal mt-8 mb-4">
              1. AI that's actually trained for acne — not generic skincare marketing
            </h3>

            <p>
              SkinRhythm uses advanced AI trained on clinically proven acne-treatment frameworks to build a routine just for you. We're not guessing. We're mapping your skin, your acne type, your oil production, your sensitivity, and your pigmentation risk — and then matching the right active ingredients at the right strengths.
            </p>

            <h3 className="text-xl font-normal mt-8 mb-4">
              2. A zero-tolerance ingredient policy
            </h3>

            <p>
              Every routine is built under our zero-tolerance policy for 400+ known acne triggers. That means every product you ever receive from SkinRhythm is guaranteed to not include a single ingredient that will clog pores, inflame existing breakouts, or secretly keep you stuck.
            </p>

            <p>
              You can always check for pore-clogging ingredients in anything you're already using — skincare, makeup, even "non-comedogenic" products — using our acne ingredient checker tool.
            </p>

            <p>
              And if you want to shop products we've already screened, you can browse acne-safe skincare products across different brands and price points.
            </p>

            <h3 className="text-xl font-normal mt-8 mb-4">
              3. Flexibility, not gatekeeping
            </h3>

            <p>
              Clear skin shouldn't only be available to people who can spend $400 on products every month. SkinRhythm lets you mix and match brands and price points, so your routine is both effective and realistic. You'll always see affordable options next to higher-end options.
            </p>

            <p>
              Our job is to make clear skin more accessible, flexible, and achievable than ever before — not to upsell you 15 steps you don't actually need.
            </p>

            <h2 className="text-2xl md:text-3xl font-light mt-12 mb-6">
              What I learned as a "luxury acne treatment insider"
            </h2>

            <p>
              Here's what nobody tells you:
            </p>

            <ul className="space-y-3 list-disc pl-6">
              <li>
                <strong>There's no single product that works for everyone.</strong> But there is an answer for every kind of acne — and it starts with understanding your acne type and matching the right active ingredients at the right strengths.
              </li>
              <li>
                You need tools that help you avoid hidden breakout triggers in your skincare, makeup, and diet.
              </li>
              <li>
                You have to stop trusting marketing terms like "non-comedogenic." That label is not regulated by the FDA. Brands can put it on basically anything, even if it still contains known pore-clogging ingredients. (This is why we built our own acne ingredient checker instead of trusting the label.)
              </li>
            </ul>

            <p>
              Did you know most leading "acne creams" at the drugstore contain Laureth-4, one of the most comedogenic (pore-clogging) ingredients out there? That's not an accident — it's a business model. The worse your barrier gets, the more products you buy trying to fix it.
            </p>

            <p className="text-xl font-normal">
              SkinRhythm refuses to play that game.
            </p>

            <h2 className="text-2xl md:text-3xl font-light mt-12 mb-6">
              Why I built SkinRhythm
            </h2>

            <p>
              I built SkinRhythm for everyone who's ever felt like nothing works. For the people who've tried everything, who don't want to take Accutane, but also don't want to give up.
            </p>

            <p>
              Because I believe clear skin should be attainable for everyone — and that happiness is a human right, not a privilege.
            </p>

            <p className="mt-8">
              — Mark<br />
              Founder, SkinRhythm
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-16 pt-12 border-t border-border space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-center">
              Ready to start your routine?
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions about your skin and get a customized, acne-safe routine matched to your acne type, your oil production, and your budget. You'll see affordable options for every step — cleanser, moisturizer, SPF, actives — all screened against 400+ known acne triggers.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setLocation('/quiz')}
                size="lg"
                className="text-base"
                data-testid="button-quiz-cta"
              >
                Take the personalized acne routine quiz →
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              No subscription required to see your starter plan.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-sm font-normal mb-4 uppercase tracking-wider">
              Transparency + Medical Disclaimer
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SkinRhythm provides educational skincare information only and does not replace professional medical advice, diagnosis, or treatment. Always consult a licensed medical provider or board-certified dermatologist for individual concerns.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
