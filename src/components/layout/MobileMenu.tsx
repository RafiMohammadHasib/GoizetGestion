'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, ArrowUpRight, X, MapPin, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
  onOpenCallback?: () => void;
  onOpenEntrust?: () => void;
}

export default function MobileMenu({ isOpen, onClose, navItems, onOpenCallback, onOpenEntrust }: MobileMenuProps) {
  const { language, t } = useLanguage();

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
                {language === 'fr' ? 'Navigation' : 'Menu Navigation'}
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
              <button
                onClick={() => {
                  onClose();
                  if (onOpenEntrust) onOpenEntrust();
                }}
                className="w-full bg-brand-gradient text-white text-center py-3.5 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 shadow-brand"
              >
                <span>{t('btnEntrust')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <Link
                href="/estimation"
                onClick={onClose}
                className="w-full bg-white text-[#171512] text-center py-3 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 shadow-xs"
              >
                <span>{t('btnEstimate')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenCallback) onOpenCallback();
                }}
                className="w-full border border-white/20 text-white text-center py-3 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-white/10"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('btnCallback')}</span>
              </button>
            </div>
          </div>

          {/* Contact Details Footer */}
          <div className="border-t border-white/10 pt-6 mt-8 space-y-2 text-xs text-[#9E9285]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
              <span>38 Cours Portal, 33000 Bordeaux</span>
            </div>
            <div className="space-y-1 pt-1">
              <a href="tel:+33695577033" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span>Paul : +33 6 95 57 70 33</span>
              </a>
              <a href="tel:+33781968395" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span>Edgar : +33 7 81 96 83 95</span>
              </a>
            </div>
            <div className="pt-1">
              <a href="mailto:Goizetgestion@gmail.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span>Goizetgestion@gmail.com</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
