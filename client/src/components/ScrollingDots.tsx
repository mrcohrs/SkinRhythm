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
      
      // Debug logging
      if (scrollPos > 0) {
        console.log('Scroll Progress:', progress, 'ScrollY:', scrollPos);
      }
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
  
  // Make guide visible from start for testing
  const guideOpacity = 1;

  return (
    <>
      {/* Hero Pattern Dots - Right Side - ALWAYS VISIBLE */}
      <div className="absolute right-4 md:right-20 lg:right-32 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] pointer-events-none z-[50]">
        {patternDots.map((dot, index) => {
          const dotProgress = Math.max(0, Math.min(1, (scrollProgress - (index * 0.02)) * 1.1));
          
          // Calculate movement: dots slide to the left (negative X) as user scrolls
          const moveX = -window.innerWidth * 0.4 * dotProgress;
          const scale = 1 - (dotProgress * 0.4);
          const fadeOpacity = isTransitioning 
            ? Math.max(0, 0.6 - (dotProgress * 0.6))
            : 0.6; // Always visible when not scrolling

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

      {/* Rhythm Guide - Left Side Tracker - ALWAYS VISIBLE FOR TESTING */}
      <div
        className="fixed left-8 md:left-16 lg:left-20 top-1/2 -translate-y-1/2 w-[60px] h-[300px] z-[100] pointer-events-none"
        style={{
          opacity: guideOpacity,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="relative flex flex-col gap-[45px] items-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#D4A59A',
                opacity: 0.5,
              }}
            />
          ))}
          
          {/* Pulse ring animation on first dot */}
          <div
            className="absolute w-6 h-6 border-2 rounded-full top-0 left-1/2 -translate-x-1/2"
            style={{
              borderColor: '#D4A59A',
              animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
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
