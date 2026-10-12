import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({
  children,
  className = '',
  delay = 0,
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 48,
          scale: 0.97,
          filter: 'blur(5px)',
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          delay: Math.max(0, delay) / 1000,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility,filter',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            once: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
