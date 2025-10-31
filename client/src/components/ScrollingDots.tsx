import { useEffect, useState } from "react";

export function ScrollingDots() {
  const [scrollProgress, setScrollProgress] = useState(0);

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
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Pattern dot positions
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

  const isTransitioning = scrollProgress > 0;
  
  // Tracker fades in as dots move (same progress, opposite direction)
  const guideOpacity = scrollProgress;
  
  // Calculate which tracker dot should be active based on scroll
  const activeTrackerDot = Math.floor(scrollProgress * 6);

  return (
    <>
      {/* Hero Pattern Dots - Right Side */}
      <div className="absolute right-4 md:right-20 lg:right-32 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] pointer-events-none z-[50]">
        {patternDots.map((dot, index) => {
          const dotProgress = Math.max(0, Math.min(1, (scrollProgress - (index * 0.02)) * 1.1));
          
          // Move dots across the entire viewport width (from right side to left)
          // The dots start on the right, need to travel the full width
          const fullWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
          const moveX = -fullWidth * dotProgress; // Travel full width left
          const scale = 1 - (dotProgress * 0.4);
          
          // Fade out in the last 20% of movement (when dotProgress > 0.8)
          let fadeOpacity: number;
          if (!isTransitioning) {
            fadeOpacity = 0.6; // Always visible when not scrolling
          } else if (dotProgress > 0.8) {
            // Fade out in last 20% of movement
            fadeOpacity = (1 - dotProgress) / 0.2; // Goes from 1 to 0 as progress goes 0.8 to 1
          } else {
            fadeOpacity = 0.6; // Visible during first 80% of movement
          }

          return (
            <div
              key={index}
              className="absolute rounded-full"
              style={{
                top: dot.top,
                left: dot.left,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                backgroundColor: '#C4958A',
                boxShadow: '0 2px 8px rgba(196, 149, 138, 0.3)',
                animation: isTransitioning ? 'none' : `pattern-pulse 4s ease-in-out infinite`,
                animationDelay: `${dot.delay}s`,
                transform: isTransitioning ? `translate(${moveX}px, 0) scale(${scale})` : 'none',
                opacity: fadeOpacity,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              }}
            />
          );
        })}
      </div>

      {/* Rhythm Guide - Left Side Tracker */}
      <div
        className="fixed left-8 md:left-16 lg:left-20 top-1/2 -translate-y-1/2 w-[60px] h-[300px] z-[100] pointer-events-none"
        style={{
          opacity: guideOpacity,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="relative flex flex-col gap-[45px] items-center">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isActive = index === activeTrackerDot;
            
            return (
              <div
                key={index}
                className="w-2 h-2 rounded-full relative"
                style={{
                  backgroundColor: '#D4A59A',
                  opacity: isActive ? 1 : 0.3,
                  transform: isActive ? 'scale(1.5)' : 'scale(1)',
                  boxShadow: isActive ? '0 0 20px rgba(212, 165, 154, 0.5)' : 'none',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Pulse ring on active dot */}
                {isActive && (
                  <div
                    className="absolute w-6 h-6 border-2 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      borderColor: '#D4A59A',
                      animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
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
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }
      `}</style>
    </>
  );
}
