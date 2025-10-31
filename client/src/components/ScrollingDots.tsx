import { useEffect, useRef } from "react";

export function ScrollingDots() {
  const heroPatternRef = useRef<HTMLDivElement>(null);
  const rhythmGuideRef = useRef<HTMLDivElement>(null);
  const patternDotsRef = useRef<HTMLDivElement[]>([]);
  const guideDotsRef = useRef<HTMLDivElement[]>([]);
  const pulseDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroPattern = heroPatternRef.current;
    const rhythmGuide = rhythmGuideRef.current;
    const hero = document.querySelector('section') as HTMLElement;
    
    if (!heroPattern || !rhythmGuide || !hero) return;

    function updateGuide() {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const scrollProgress = Math.min(scrollPos / (heroBottom * 0.7), 1);
      
      // Move hero dots to tracker
      if (scrollPos > 0) {
        const guideRect = rhythmGuide!.getBoundingClientRect();
        const heroPatternRect = heroPattern!.getBoundingClientRect();
        
        patternDotsRef.current.forEach((dot, index) => {
          if (!dot) return;
          dot.classList.add('transitioning');
          
          const targetX = guideRect.left - heroPatternRect.left + 26;
          const targetY = (guideRect.top - heroPatternRect.top) + (index * 40) + 100;
          
          const dotProgress = Math.max(0, Math.min(1, (scrollProgress - (index * 0.02)) * 1.1));
          const currentX = targetX * dotProgress;
          const currentY = targetY * dotProgress;
          const currentScale = 1 - (dotProgress * 0.4);
          const fadeOutOpacity = Math.max(0, 0.6 - (dotProgress * 0.6));
          
          dot.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
          dot.style.opacity = String(fadeOutOpacity);
        });
        
        if (scrollProgress > 0.25) {
          rhythmGuide!.style.opacity = String((scrollProgress - 0.25) / 0.75);
          rhythmGuide!.classList.add('visible');
        } else {
          rhythmGuide!.style.opacity = '0';
          rhythmGuide!.classList.remove('visible');
        }
      } else {
        rhythmGuide!.style.opacity = '0';
        rhythmGuide!.classList.remove('visible');
        
        patternDotsRef.current.forEach((dot) => {
          if (!dot) return;
          dot.classList.remove('transitioning');
          dot.style.transform = '';
          dot.style.opacity = '';
        });
      }
      
      // Update active section for tracker dots
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        const sectionTop = section.getBoundingClientRect().top + scrollPos;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop - windowHeight / 2 && 
            scrollPos < sectionTop + sectionHeight - windowHeight / 2) {
          guideDotsRef.current.forEach(dot => dot?.classList.remove('active'));
          if (guideDotsRef.current[index]) {
            guideDotsRef.current[index].classList.add('active');
            
            const dotRect = guideDotsRef.current[index].getBoundingClientRect();
            const guideRect = rhythmGuide!.getBoundingClientRect();
            if (pulseDotRef.current) {
              pulseDotRef.current.style.top = (dotRect.top - guideRect.top) + 'px';
            }
          }
        }
      });
    }
    
    window.addEventListener('scroll', updateGuide);
    updateGuide();
    
    return () => {
      window.removeEventListener('scroll', updateGuide);
    };
  }, []);

  // Pattern dot positions (from HTML)
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
      >
        {patternDots.map((dot, index) => (
          <div
            key={index}
            ref={(el) => { if (el) patternDotsRef.current[index] = el; }}
            className="pattern-dot absolute rounded-full bg-[#C4958A]"
            style={{
              top: dot.top,
              left: dot.left,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              boxShadow: '0 2px 8px rgba(196, 149, 138, 0.3)',
              animation: `pattern-pulse 4s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Rhythm Guide - Left Side */}
      <div
        ref={rhythmGuideRef}
        className="rhythm-guide fixed left-[80px] top-1/2 -translate-y-1/2 w-[60px] h-[300px] z-[100] pointer-events-none opacity-0 transition-opacity duration-300"
      >
        <div className="rhythm-dots flex flex-col gap-[45px] items-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              ref={(el) => { if (el) guideDotsRef.current[index] = el; }}
              className="guide-dot w-2 h-2 rounded-full bg-[#D4A59A] opacity-30 transition-all duration-[600ms]"
            />
          ))}
        </div>

        {/* Pulse ring animation */}
        <div
          ref={pulseDotRef}
          className="guide-pulse absolute w-6 h-6 border-2 border-[#D4A59A] rounded-full left-1/2 -translate-x-1/2 opacity-0"
          style={{
            animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>

      <style>{`
        .pattern-dot.transitioning {
          animation: none !important;
        }

        .guide-dot.active {
          opacity: 1 !important;
          transform: scale(1.5);
          box-shadow: 0 0 20px rgba(212, 165, 154, 0.5);
        }

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
