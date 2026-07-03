'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed right-4 bottom-20 md:bottom-6 z-40 w-11 h-11 rounded-full bg-brand text-white shadow-lg hover:bg-action transition-colors flex items-center justify-center cursor-pointer"
      data-testid="back-to-top"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}
