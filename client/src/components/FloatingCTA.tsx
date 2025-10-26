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
            setIsInPremiumSection(entry.isIntersecting);
          });
        },
        {
          threshold: 0.3, // Trigger when 30% of the section is visible
          rootMargin: '-100px 0px -100px 0px', // Adjust trigger point
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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 max-w-md w-full"
          data-testid="floating-cta"
        >
          <motion.div
            key={isInPremiumSection ? 'premium' : 'quiz'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleClick}
              size="lg"
              className="w-full rounded-full h-auto py-4 px-6 shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
              data-testid={isInPremiumSection ? "floating-cta-premium" : "floating-cta-quiz"}
            >
              {isInPremiumSection ? (
                <div className="flex items-center justify-center gap-3">
                  <Crown className="h-5 w-5" />
                  <span className="font-normal text-base">Upgrade to Premium</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="font-normal text-base">Find Your SkinRhythm</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
