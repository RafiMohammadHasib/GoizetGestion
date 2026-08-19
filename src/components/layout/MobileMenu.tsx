'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, ArrowUpRight, X, MapPin, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
  onOpenCallback?: () => void;
}

export default function MobileMenu({ isOpen, onClose, navItems, onOpenCallback }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 bg-[#171512] text-white flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto"
        >
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-6">
              <span className="text-xs uppercase tracking-widest text-[#9E9285] block mb-4">
                Navigation
              </span>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-serif-display text-3xl font-light text-white/90 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-5 h-5 text-white/40" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 pt-2">
              <Link
                href="/estimation"
                onClick={onClose}
                className="w-full bg-[#7A2234] text-white text-center py-3.5 rounded-full font-semibold text-sm flex items-center justify-center space-x-2"
              >
                <span>Estimer mon bien</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenCallback) onOpenCallback();
                }}
                className="w-full border border-white/20 text-white text-center py-3 rounded-full font-semibold text-sm flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Demander à être rappelé</span>
              </button>
            </div>
          </div>

          {/* Contact Details Footer */}
          <div className="border-t border-white/10 pt-6 mt-8 space-y-3 text-xs text-[#9E9285]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#7A2234]" />
              <span>38 Cours Portal, 33000 Bordeaux</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#7A2234]" />
              <span>05 56 00 12 34</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#7A2234]" />
              <span>contact@maison-meridia.fr</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
