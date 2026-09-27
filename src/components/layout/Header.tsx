'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
import HamburgerIcon from './HamburgerIcon';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onOpenCallback?: () => void;
  onOpenEntrust?: () => void;
}

export default function Header({ onOpenCallback, onOpenEntrust }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const isHomePage = pathname === '/';
  const isDarkHeader = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('navProperties'), href: '/biens' },
    { label: t('navManagement'), href: '/gestion-locative' },
    { label: t('navAbout'), href: '/a-propos' },
    { label: t('navContact'), href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-out pointer-events-none px-3 sm:px-6 lg:px-8 ${
          isScrolled ? 'top-3 sm:top-4' : 'top-4 sm:top-6'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto pointer-events-auto rounded-full transition-all duration-300 ease-out flex items-center justify-between gap-3 sm:gap-6 ${
            isScrolled
              ? isDarkHeader
                ? 'bg-[#171512]/60 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.35)] text-white py-3 sm:py-3.5 px-5 sm:px-7'
                : 'bg-white/95 backdrop-blur-2xl border border-[#171512]/10 shadow-[0_12px_36px_-5px_rgba(23,21,18,0.08)] text-[#171512] py-3 sm:py-3.5 px-5 sm:px-7'
              : isDarkHeader
                ? 'bg-[#171512]/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.3)] text-white py-3.5 sm:py-4.5 px-6 sm:px-8'
                : 'bg-white/90 backdrop-blur-2xl border border-[#171512]/10 shadow-[0_10px_35px_-5px_rgba(23,21,18,0.06)] text-[#171512] py-3.5 sm:py-4.5 px-6 sm:px-8'
          }`}
        >
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center shrink-0 py-0.5" aria-label="Goizet Gestion Homepage">
            <div className="relative flex items-center transition-all duration-300 group-hover:scale-[1.01]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDarkHeader ? '/logo-cream.png' : '/logo-teal.png'}
                alt="GOIZET GESTION"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-8 sm:h-9.5 md:h-10' : 'h-9 sm:h-11 md:h-12'
                }`}
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (Modern Pill Indicators) */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-[13px] xl:text-[15px] tracking-normal transition-all duration-200 px-4 py-2 rounded-full whitespace-nowrap ${
                    isDarkHeader
                      ? isActive
                        ? 'bg-white/15 text-white font-semibold shadow-2xs'
                        : 'text-white/85 hover:text-white hover:bg-white/10 font-medium'
                      : isActive
                        ? 'bg-[#748C8C]/12 text-[#243B3B] font-semibold'
                        : 'text-[#171512]/80 hover:text-[#171512] hover:bg-[#171512]/5 font-medium'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions & Language Group */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-3.5 shrink-0">
            
            {/* Minimalist Segmented Language Toggle (Protected from Auto-Translation) */}
            <div
              translate="no"
              className={`notranslate inline-flex items-center p-1 rounded-full border transition-all duration-300 ${
                isDarkHeader
                  ? 'border-white/20 bg-white/10 backdrop-blur-md text-white'
                  : 'border-[#171512]/10 bg-[#FAF9F6] text-[#171512]'
              }`}
            >
              <button
                onClick={() => setLanguage('fr')}
                aria-label="Français"
                translate="no"
                className={`notranslate px-3 py-1.5 text-xs font-bold tracking-wider rounded-full transition-all duration-200 active:scale-95 ${
                  language === 'fr'
                    ? isDarkHeader
                      ? 'bg-white text-[#171512] shadow-2xs'
                      : 'bg-[#171512] text-white shadow-2xs'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                <span translate="no" className="notranslate">FR</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                aria-label="English"
                translate="no"
                className={`notranslate px-3 py-1.5 text-xs font-bold tracking-wider rounded-full transition-all duration-200 active:scale-95 ${
                  language === 'en'
                    ? isDarkHeader
                      ? 'bg-white text-[#171512] shadow-2xs'
                      : 'bg-[#171512] text-white shadow-2xs'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                <span translate="no" className="notranslate">EN</span>
              </button>
            </div>

            {/* Secondary CTA: Confier mon bien */}
            <button
              onClick={onOpenEntrust}
              className={`h-10 sm:h-11 inline-flex items-center text-xs sm:text-[13px] font-semibold px-5 sm:px-6 rounded-full transition-all duration-200 whitespace-nowrap ${
                isDarkHeader
                  ? 'border border-white/25 text-white hover:bg-white/15 hover:border-white/40 bg-white/5 backdrop-blur-xs'
                  : 'border border-[#171512]/15 text-[#171512] hover:border-[#748C8C] hover:text-[#748C8C] hover:bg-[#748C8C]/5'
              }`}
            >
              <span>{t('btnEntrust')}</span>
            </button>

            {/* Primary CTA: Estimer mon bien */}
            <Link
              href="/estimation"
              className={`h-10 sm:h-11 inline-flex items-center space-x-2 text-xs sm:text-[13px] font-semibold px-5 sm:px-6 rounded-full transition-all duration-200 whitespace-nowrap shadow-xs group ${
                isDarkHeader
                  ? 'bg-white text-[#171512] hover:bg-[#FAF9F6] shadow-sm'
                  : 'bg-brand-gradient text-white hover:opacity-95 shadow-brand'
              }`}
            >
              <span>{t('btnEstimate')}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Controls (Clean, Compact, Never Crowded) */}
          <div className="flex items-center space-x-2 lg:hidden shrink-0">
            
            {/* Quick Language Toggle (Protected from Auto-Translation) */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              translate="no"
              className={`notranslate text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                isDarkHeader
                  ? 'border-white/30 bg-white/10 backdrop-blur-md text-white'
                  : 'border-[#171512]/15 bg-white/80 text-[#171512]'
              }`}
              aria-label="Toggle language"
            >
              <span translate="no" className="notranslate">
                {language === 'fr' ? 'EN' : 'FR'}
              </span>
            </button>

            {/* Compact Quick Estimation CTA (Visible on tablets & larger phones) */}
            <Link
              href="/estimation"
              className={`hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-xs group ${
                isDarkHeader
                  ? 'bg-white text-[#171512]'
                  : 'bg-brand-gradient text-white shadow-brand'
              }`}
            >
              <span>{language === 'fr' ? 'Estimer' : 'Estimate'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Animated Hamburger Icon Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-full transition-colors ${
                isDarkHeader ? 'text-white hover:bg-white/10' : 'text-[#171512] hover:bg-[#171512]/5'
              }`}
              aria-label="Toggle menu"
            >
              <HamburgerIcon
                isOpen={isMobileMenuOpen}
                colorClass={isDarkHeader ? 'bg-white' : 'bg-[#171512]'}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onOpenCallback={onOpenCallback}
        onOpenEntrust={onOpenEntrust}
      />
    </>
  );
}
