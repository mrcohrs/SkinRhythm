import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/Header";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ComedogenicCarousel } from "@/components/ComedogenicCarousel";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState(0);
  const [rhythmGuideVisible, setRhythmGuideVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Pulsing dots animation
  useEffect(() => {
    const dots = document.querySelectorAll('.pulse-dot');
    dots.forEach((dot, index) => {
      const delay = index * 0.6;
      (dot as HTMLElement).style.animationDelay = `${delay}s`;
    });
  }, []);

  // Scroll tracker and dot movement
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRect.height;
      const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroHeight));

      // Move and fade dots
      const dots = document.querySelectorAll('.pulse-dot');
      dots.forEach((dot) => {
        const htmlDot = dot as HTMLElement;
        const initialLeft = parseFloat(htmlDot.dataset.initialLeft || '0');
        const moveDistance = initialLeft * scrollProgress;
        const fadeAmount = Math.max(0, 1 - (scrollProgress * 2));
        
        htmlDot.style.transform = `translateX(-${moveDistance}px)`;
        htmlDot.style.opacity = fadeAmount.toString();
      });

      // Show/hide rhythm guide
      if (scrollProgress > 0.25) {
        setRhythmGuideVisible(true);
      } else {
        setRhythmGuideVisible(false);
      }

      // Update active section for rhythm tracker
      const windowHeight = window.innerHeight;
      const sections = sectionsRef.current.filter(Boolean);
      
      let newActiveSection = 0;
      sections.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
          newActiveSection = index;
        }
      });
      
      setActiveSection(newActiveSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Landing Page',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  const sectionTitles = ['How It Works', 'Your Timeline', 'Safety', 'Approach', 'Features'];

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <FloatingCTA premiumSectionId="features-section" />

      {/* Rhythm Guide - Fixed left sidebar tracker */}
      <div 
        className={`hidden lg:block fixed left-[80px] top-[180px] z-50 transition-opacity duration-300 ${
          rhythmGuideVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-[45px]">
          {sectionTitles.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-primary scale-150'
                  : 'border-2 border-primary bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section 
        ref={heroRef}
        className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
      >
        {/* Pulsing dots - hidden on mobile */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {[
            { size: 8, top: '15%', right: '12%', initialLeft: 88 },
            { size: 12, top: '25%', right: '18%', initialLeft: 82 },
            { size: 6, top: '35%', right: '8%', initialLeft: 92 },
            { size: 10, top: '45%', right: '22%', initialLeft: 78 },
            { size: 14, top: '20%', right: '28%', initialLeft: 72 },
            { size: 7, top: '55%', right: '15%', initialLeft: 85 },
            { size: 11, top: '65%', right: '10%', initialLeft: 90 },
            { size: 9, top: '30%', right: '25%', initialLeft: 75 },
            { size: 8, top: '50%', right: '20%', initialLeft: 80 },
            { size: 13, top: '40%', right: '14%', initialLeft: 86 },
            { size: 10, top: '60%', right: '19%', initialLeft: 81 },
            { size: 6, top: '70%', right: '16%', initialLeft: 84 },
          ].map((dot, index) => (
            <div
              key={index}
              className="pulse-dot absolute rounded-full bg-primary"
              data-initial-left={dot.initialLeft}
              style={{
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                top: dot.top,
                left: `${dot.initialLeft}%`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Headline - Updated branding */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight max-w-5xl text-foreground">
              skin<span className="text-primary">∙</span>rhythm finds your skin's natural rhythm, 
              then builds a routine that works with it—not against it.
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl font-light">
              Clinical protocols meet personalized care. We screen 400+ acne triggers 
              so you don't have to guess what's breaking you out.
            </p>

            {/* Primary CTA */}
            <Button
              onClick={() => {
                setLocation('/quiz');
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'click_start_quiz', {
                    location: 'hero'
                  });
                }
              }}
              size="lg"
              className="text-base px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid="button-hero-start-quiz"
            >
              Find Your Rhythm
            </Button>

            <p className="text-xs text-muted-foreground font-light tracking-wide">
              Free • 2 minutes • No login required
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 3 Steps */}
      <section 
        ref={(el) => (sectionsRef.current[0] = el)}
        className="py-20 md:py-28 lg:py-36 bg-card"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-[200px] max-w-7xl">
          <p className="text-xs uppercase tracking-[3px] text-secondary/70 mb-12 font-medium">
            How It Works
          </p>
          
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground">
            Three steps to clearer skin
          </h2>
          
          <p className="text-lg font-light text-foreground/80 mb-16 max-w-2xl leading-relaxed">
            No guesswork. No trial and error. Just a personalized routine built on science.
          </p>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                number: '01',
                title: 'Take the Quiz',
                description: '2-minute questionnaire about your skin type, concerns, and goals. We analyze 9 key factors including Fitzpatrick type and acne severity.'
              },
              {
                number: '02',
                title: 'Get Your Routine',
                description: 'Personalized AM/PM routine with products screened against 400+ acne triggers. Budget, standard, and premium options for every step.'
              },
              {
                number: '03',
                title: 'Track Your Progress',
                description: 'Premium members get weekly coaching, alternative products, and routine history to see what actually works for your skin over time.'
              }
            ].map((step, index) => (
              <div key={index} className="space-y-4">
                <div className="text-xs font-medium text-secondary/70 tracking-[3px] uppercase">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm font-light text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR TIMELINE - Week 2, 6, 12 */}
      <section 
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-20 md:py-28 lg:py-36 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-[200px] max-w-7xl">
          <p className="text-xs uppercase tracking-[3px] text-secondary/70 mb-12 font-medium">
            Your Timeline
          </p>
          
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground">
            What to expect
          </h2>
          
          <p className="text-lg font-light text-foreground/80 mb-16 max-w-2xl leading-relaxed">
            Clear skin doesn't happen overnight. Here's a realistic timeline based on clinical protocols.
          </p>

          {/* Timeline circles */}
          <div className="flex flex-col md:flex-row gap-16 md:gap-8 items-center justify-center mb-16">
            {[
              { week: '2', label: 'Skin adjusts to routine' },
              { week: '6', label: 'Visible improvements', pulse: true },
              { week: '12', label: 'Sustained results' }
            ].map((milestone, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-4">
                <div className={`relative w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center ${
                  milestone.pulse ? 'pulse-circle' : ''
                }`}>
                  <div className="text-2xl font-light text-foreground">
                    <span className="text-xs uppercase tracking-wider block text-muted-foreground">Week</span>
                    {milestone.week}
                  </div>
                </div>
                <p className="text-sm font-light text-secondary max-w-[140px]">
                  {milestone.label}
                </p>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { stat: '8-12', label: 'weeks to see results' },
              { stat: '4-7', label: 'products in routine' },
              { stat: '400+', label: 'acne triggers screened' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-light text-primary mb-2">
                  {item.stat}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INGREDIENT SAFETY - With ComedogenicCarousel */}
      <section 
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-20 md:py-28 lg:py-36 bg-card"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-[200px] max-w-7xl">
          <p className="text-xs uppercase tracking-[3px] text-secondary/70 mb-12 font-medium">
            Ingredient Safety
          </p>
          
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground">
            Not all "acne-safe" products are safe for acne
          </h2>
          
          <p className="text-lg font-light text-foreground/80 mb-12 max-w-3xl leading-relaxed">
            90% of personal care products contain at least one comedogenic ingredient—even ones 
            labeled "non-comedogenic." Our database screens against 400+ known acne triggers.
          </p>

          {/* Highlight box */}
          <div className="bg-primary/8 border-l-4 border-primary p-8 mb-12 max-w-3xl">
            <p className="text-base font-light text-foreground leading-relaxed">
              We found that <strong className="font-medium text-secondary">over 90%</strong> of benzoyl 
              peroxide formulations (the gold standard acne treatment) contain laureth-4—one of the most 
              comedogenic ingredients known to dermatology.
            </p>
          </div>

          {/* Carousel component */}
          <div className="max-w-4xl">
            <ComedogenicCarousel />
          </div>
        </div>
      </section>

      {/* OUR APPROACH - 3 Principles */}
      <section 
        ref={(el) => (sectionsRef.current[3] = el)}
        className="py-20 md:py-28 lg:py-36 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-[200px] max-w-7xl">
          <p className="text-xs uppercase tracking-[3px] text-secondary/70 mb-12 font-medium">
            Our Approach
          </p>
          
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground max-w-3xl">
            Clinical protocols. Truly personalized. Brand agnostic.
          </h2>
          
          <p className="text-lg font-light text-foreground/80 mb-20 max-w-2xl leading-relaxed">
            We're not here to sell you products. We're here to help you find what actually works.
          </p>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                title: 'Clinical Protocols',
                description: 'Every recommendation follows dermatological best practices. We use the same frameworks that dermatologists use—adjusted for your unique skin.'
              },
              {
                title: 'Truly Personalized',
                description: 'Not just skin type. We factor in Fitzpatrick classification, acne severity, pregnancy status, and 6 other variables to build your routine.'
              },
              {
                title: 'Brand Agnostic',
                description: 'We don\'t manufacture products. We recommend the best options across hundreds of brands at budget, standard, and premium price points.'
              }
            ].map((principle, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-medium text-secondary">
                  {principle.title}
                </h3>
                <p className="text-sm font-light text-foreground/70 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - 6 Cards with Free/Premium badges */}
      <section 
        ref={(el) => (sectionsRef.current[4] = el)}
        id="features-section"
        className="py-20 md:py-28 lg:py-36 bg-card"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 lg:pl-[200px] max-w-7xl">
          <p className="text-xs uppercase tracking-[3px] text-secondary/70 mb-12 font-medium">
            Features
          </p>
          
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground">
            Everything you need to clear your skin
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Routine',
                description: 'AM/PM routine tailored to your skin type, Fitzpatrick classification, and acne severity.',
                badge: 'Free'
              },
              {
                title: 'Ingredient Scanner',
                description: 'Paste any ingredient list to check for 400+ acne-causing ingredients instantly.',
                badge: 'Premium'
              },
              {
                title: 'Routine Coach',
                description: 'Week-by-week guidance on when to introduce active ingredients and how to layer products.',
                badge: 'Premium'
              },
              {
                title: 'Product Alternatives',
                description: 'Don\'t like a recommendation? Browse alternatives at every price point for each step.',
                badge: 'Premium'
              },
              {
                title: 'Acne-Safe Marketplace',
                description: 'Shop curated products across hundreds of brands—every one screened for acne triggers.',
                badge: 'Premium'
              },
              {
                title: 'Routine History',
                description: 'Track what products you\'ve tried and see what actually worked over time.',
                badge: 'Premium'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-8 space-y-4">
                <Badge 
                  variant={feature.badge === 'Free' ? 'outline' : 'default'}
                  className={feature.badge === 'Premium' ? 'bg-secondary text-secondary-foreground' : ''}
                >
                  {feature.badge}
                </Badge>
                <h3 className="text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm font-light text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - With dots swarming */}
      <section className="py-20 md:py-28 lg:py-36 bg-secondary text-secondary-foreground relative overflow-hidden">
        {/* Swarming dots */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="swarm-dot absolute w-2 h-2 rounded-full bg-primary/40"
              style={{
                left: `${20 + (index * 5)}%`,
                top: `${30 + (Math.sin(index) * 20)}%`,
                animationDelay: `${index * 0.3}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            Ready to find your rhythm?
          </h2>
          
          <p className="text-lg font-light mb-12 opacity-90 leading-relaxed">
            Get your personalized routine in under 2 minutes. Free. No login required.
          </p>

          <Button
            onClick={() => {
              setLocation('/quiz');
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'click_start_quiz', {
                  location: 'final_cta'
                });
              }
            }}
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 border-2 border-secondary-foreground"
            data-testid="button-final-cta-start-quiz"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-16 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-xl font-light text-foreground">
                skin<span className="text-primary">∙</span>rhythm
              </div>
              <p className="text-sm text-muted-foreground font-light">
                Personalized acne care built on science and integrity.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-sm text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setLocation('/quiz')}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    Take Quiz
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation('/pricing')}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation('/marketplace')}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    Marketplace
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-sm text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setLocation('/about')}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation('/privacy-policy')}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation('/affiliate-disclosure')}
                    className="text-muted-foreground hover:text-foreground transition-colors font-light"
                  >
                    Affiliate Disclosure
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-sm text-foreground">Legal</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Our ingredient screening and routine recommendations are for informational purposes only and do not constitute medical advice.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center font-light">
              © 2025 skin∙rhythm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .pulse-dot {
          animation: pulse-dot 5s ease-in-out infinite;
        }

        @keyframes pulse-circle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .pulse-circle {
          animation: pulse-circle 2s ease-in-out infinite;
        }

        @keyframes swarm {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, -15px);
          }
          50% {
            transform: translate(-15px, 10px);
          }
          75% {
            transform: translate(10px, -20px);
          }
        }

        .swarm-dot {
          animation: swarm 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
