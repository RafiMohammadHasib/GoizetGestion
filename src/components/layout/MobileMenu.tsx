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
  const { language, setLanguage, t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#171512] text-white flex flex-col justify-between pt-6 pb-8 px-6 overflow-y-auto"
        >
          {/* Top Bar with Logo, Language Toggle, and Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/" onClick={onClose} className="flex items-center space-x-2">
              <img
                src="/logo-cream.png"
                alt="Goizet Gestion"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center space-x-3">
              {/* Drawer Language Toggle (Protected from Auto-Translation) */}
              <div
                translate="no"
                className="notranslate inline-flex items-center p-0.5 rounded-full border border-white/20 bg-white/10"
              >
                <button
                  onClick={() => setLanguage('fr')}
                  translate="no"
                  className={`notranslate px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all ${
                    language === 'fr' ? 'bg-white text-[#171512] shadow-xs' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span translate="no" className="notranslate">FR</span>
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  translate="no"
                  className={`notranslate px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all ${
                    language === 'en' ? 'bg-white text-[#171512] shadow-xs' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span translate="no" className="notranslate">EN</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-8 pt-4 flex-1">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C] block mb-4">
                {language === 'fr' ? 'Navigation' : 'Navigation'}
              </span>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 + 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-serif-display text-2xl sm:text-3xl font-light text-white/90 hover:text-white transition-colors flex items-center justify-between group py-1"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
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
                className="w-full bg-brand-gradient text-white text-center py-3.5 rounded-full font-semibold text-xs tracking-wide flex items-center justify-center space-x-2 shadow-brand"
              >
                <span>{t('btnEntrust')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <Link
                href="/estimation"
                onClick={onClose}
                className="w-full bg-white text-[#171512] text-center py-3.5 rounded-full font-semibold text-xs tracking-wide flex items-center justify-center space-x-2 shadow-xs"
              >
                <span>{t('btnEstimate')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenCallback) onOpenCallback();
                }}
                className="w-full border border-white/25 text-white text-center py-3 rounded-full font-semibold text-xs tracking-wide flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t('btnCallback')}</span>
              </button>
            </div>
          </div>

          {/* Contact Details Footer */}
          <div className="border-t border-white/10 pt-6 mt-6 space-y-2.5 text-xs text-[#9E9285]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
              <span>48 rue Calvé, 33000 Bordeaux</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <a href="tel:+33695577033" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span>Paul Goizet : +33 6 95 57 70 33</span>
              </a>
              <a href="tel:+33781968395" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span>Edgar Goizet : +33 7 81 96 83 95</span>
              </a>
            </div>
            <div className="pt-1">
              <a href="mailto:goizetgestion@gmail.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span>goizetgestion@gmail.com</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
