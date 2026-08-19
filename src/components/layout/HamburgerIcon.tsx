'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HamburgerIconProps {
  isOpen: boolean;
  colorClass?: string;
}

export default function HamburgerIcon({ isOpen, colorClass = 'stroke-current' }: HamburgerIconProps) {
  const variantTop = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 6 }
  };

  const variantMiddle = {
    closed: { opacity: 1, scaleX: 1 },
    open: { opacity: 0, scaleX: 0 }
  };

  const variantBottom = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -6 }
  };

  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5 cursor-pointer">
      <motion.span
        variants={variantTop}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`w-6 h-[2px] rounded-full block ${colorClass} origin-center`}
      />
      <motion.span
        variants={variantMiddle}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.2 }}
        className={`w-6 h-[2px] rounded-full block ${colorClass}`}
      />
      <motion.span
        variants={variantBottom}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`w-6 h-[2px] rounded-full block ${colorClass} origin-center`}
      />
    </div>
  );
}
