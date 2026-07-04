'use client';

import { useEffect, useRef, useState } from 'react';

// Magic UI-style count-up number, ported dependency-free.
// Starts when scrolled into view; respects prefers-reduced-motion.
export default function NumberTicker({ value, duration = 1400, className = '' }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;

    // Value changed after the initial animation — jump straight to it
    if (started.current) {
      setDisplay(target);
      return;
    }

    if (
      typeof window === 'undefined' ||
      !window.IntersectionObserver ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      started.current = true;
      setDisplay(target);
      return;
    }

    const el = ref.current;
    if (!el) {
      setDisplay(target);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(2, -10 * p); // easeOutExpo
          setDisplay(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
          else setDisplay(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {display}
    </span>
  );
}
