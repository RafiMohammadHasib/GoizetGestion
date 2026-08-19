'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('[data-cursor]');
      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full mix-blend-difference"
      animate={{
        x: mousePosition.x - (isHovered ? 36 : 8),
        y: mousePosition.y - (isHovered ? 36 : 8),
        width: isHovered ? 72 : 16,
        height: isHovered ? 72 : 16,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 30, mass: 0.5 }}
    >
      {cursorText && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#171512] px-2 text-center select-none">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}
