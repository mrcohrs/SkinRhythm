import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCTAProps {
  premiumSectionId: string;
}

export function FloatingCTA({ premiumSectionId }: FloatingCTAProps) {
  const [isInPremiumSection, setIsInPremiumSection] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Show CTA after a brief delay
    const showTimer = setTimeout(() => setIsVisible(true), 1000);

    // Set up intersection observer for premium section
    const premiumSection = document.getElementById(premiumSectionId);
    
    if (premiumSection) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Update state when premium section enters or leaves viewport
            setIsInPremiumSection(entry.isIntersecting);
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of the section is visible
          rootMargin: '0px 0px -200px 0px', // Trigger before bottom of viewport
        }
      );

      observerRef.current.observe(premiumSection);
    }

    return () => {
      clearTimeout(showTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [premiumSectionId]);

  const handleClick = () => {
    if (isInPremiumSection) {
      window.location.href = '/pricing';
    } else {
      window.location.href = '/quiz';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 left-0 right-0 z-50 px-4"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          data-testid="floating-cta"
        >
          <motion.div
            key={isInPremiumSection ? 'premium' : 'quiz'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-md mx-auto"
          >
            <Button
              onClick={handleClick}
              size="lg"
              className="w-full rounded-full h-auto py-3 px-6 shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
              data-testid={isInPremiumSection ? "floating-cta-premium" : "floating-cta-quiz"}
            >
              {isInPremiumSection ? (
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4 flex-shrink-0" />
                  <span className="font-normal text-sm sm:text-base">Upgrade to Premium</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="font-normal text-sm sm:text-base">Find Your SkinRhythm</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
