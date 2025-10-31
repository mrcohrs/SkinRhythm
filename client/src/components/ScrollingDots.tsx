import { useEffect, useRef, useState } from "react";

export function ScrollingDots() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroPatternRef = useRef<HTMLDivElement>(null);
  const rhythmGuideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const heroSection = document.querySelector('section') as HTMLElement;
      const heroBottom = heroSection 
        ? heroSection.offsetTop + heroSection.offsetHeight 
        : window.innerHeight;
      
      const progress = Math.min(scrollPos / (heroBottom * 0.7), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate individual dot positions and opacity
  const getDotStyle = (index: number) => {
    if (scrollProgress === 0) {
      return {
        transform: '',
        opacity: '',
      };
    }

    const guideRect = rhythmGuideRef.current?.getBoundingClientRect();
    const heroPatternRect = heroPatternRef.current?.getBoundingClientRect();

    if (!guideRect || !heroPatternRect) {
      return { transform: '', opacity: '' };
    }

    const targetX = guideRect.left - heroPatternRect.left + 26;
    const targetY = (guideRect.top - heroPatternRect.top) + (index * 40) + 100;

    const dotProgress = Math.max(0, Math.min(1, (scrollProgress - (index * 0.02)) * 1.1));
    const currentX = targetX * dotProgress;
    const currentY = targetY * dotProgress;
    const currentScale = 1 - (dotProgress * 0.4);
    const fadeOutOpacity = Math.max(0, 0.6 - (dotProgress * 0.6));

    return {
      transform: `translate(${currentX}px, ${currentY}px) scale(${currentScale})`,
      opacity: fadeOutOpacity,
    };
  };

  // Guide visibility based on scroll
  const guideOpacity = scrollProgress > 0.25 ? (scrollProgress - 0.25) / 0.75 : 0;

  // Pattern dot positions (matching HTML positioning)
  const patternDots = [
    { top: '10%', left: '15%', size: 12, delay: 0 },
    { top: '25%', left: '45%', size: 8, delay: 0.5 },
    { top: '15%', left: '70%', size: 10, delay: 1 },
    { top: '35%', left: '25%', size: 6, delay: 1.5 },
    { top: '45%', left: '55%', size: 14, delay: 0.3 },
    { top: '40%', left: '85%', size: 9, delay: 1.2 },
    { top: '60%', left: '20%', size: 7, delay: 0.8 },
    { top: '55%', left: '50%', size: 11, delay: 1.8 },
    { top: '70%', left: '75%', size: 8, delay: 0.6 },
    { top: '80%', left: '35%', size: 13, delay: 1.3 },
    { top: '85%', left: '65%', size: 7, delay: 0.9 },
    { top: '5%', left: '40%', size: 10, delay: 1.6 },
  ];

  return (
    <>
      {/* Hero Pattern Dots - Right Side */}
      <div 
        ref={heroPatternRef}
        className="absolute right-[120px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-[1]"
        style={{ position: 'absolute' }}
      >
        {patternDots.map((dot, index) => {
          const dotStyle = getDotStyle(index);
          const isTransitioning = scrollProgress > 0;

          return (
            <div
              key={index}
              className="absolute rounded-full bg-[#C4958A]"
              style={{
                top: dot.top,
                left: dot.left,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                boxShadow: '0 2px 8px rgba(196, 149, 138, 0.3)',
                animation: isTransitioning ? 'none' : `pattern-pulse 4s ease-in-out infinite`,
                animationDelay: `${dot.delay}s`,
                transform: dotStyle.transform,
                opacity: dotStyle.opacity || 0.4,
                transition: isTransitioning ? 'none' : 'all 0.3s ease',
              }}
            />
          );
        })}
      </div>

      {/* Rhythm Guide - Left Side */}
      <div
        ref={rhythmGuideRef}
        className="fixed left-[80px] top-1/2 -translate-y-1/2 w-[60px] h-[300px] z-[100] pointer-events-none"
        style={{
          opacity: guideOpacity,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex flex-col gap-[45px] items-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-[#D4A59A] transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Pulse ring animation */}
        <div
          className="absolute w-6 h-6 border-2 border-[#D4A59A] rounded-full top-0 left-1/2 -translate-x-1/2"
          style={{
            opacity: 0,
            animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes pattern-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-ring {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.5);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) scale(2);
          }
        }
      `}</style>
    </>
  );
}
