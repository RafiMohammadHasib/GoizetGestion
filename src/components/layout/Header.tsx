'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PhoneCall, ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
import HamburgerIcon from './HamburgerIcon';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onOpenCallback?: () => void;
}

export default function Header({ onOpenCallback }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('navRent'), href: '/biens?type=louer' },
    { label: t('navBuy'), href: '/biens?type=acheter' },
    { label: t('navManagement'), href: '/gestion-locative' },
    { label: t('navDistricts'), href: '/quartiers' },
    { label: t('navAbout'), href: '/a-propos' },
    { label: t('navJournal'), href: '/journal' },
    { label: t('navContact'), href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'top-2 sm:top-4 px-3 sm:px-6 lg:px-8'
            : 'top-0 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#171512]/80 via-[#171512]/40 to-transparent text-white'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-500 ease-out ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl sm:rounded-full shadow-[0_10px_35px_rgba(23,21,18,0.08)] py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8'
              : 'py-6 sm:py-8'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo - Prominent & Crisp */}
            <Link href="/" className="group flex items-center space-x-3 shrink-0 py-1">
              <div className="relative flex items-center transition-transform duration-300 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isScrolled ? "/logo-teal.png" : "/logo-cream.png"}
                  alt="GOIZET GESTION"
                  className={`w-auto object-contain transition-all duration-500 ${
                    isScrolled ? 'h-8 sm:h-9' : 'h-10 sm:h-12'
                  }`}
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7 shrink-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-xs xl:text-sm font-medium tracking-wide transition-all duration-200 relative py-1.5 whitespace-nowrap shrink-0 ${
                      isScrolled
                        ? isActive
                          ? 'text-[#748C8C] font-semibold'
                          : 'text-[#171512]/85 hover:text-[#748C8C]'
                        : isActive
                          ? 'text-white font-semibold'
                          : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                        isScrolled ? 'bg-[#748C8C]' : 'bg-white'
                      }`} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-2.5 xl:space-x-3.5 shrink-0 ml-auto xl:ml-0">
              
              {/* Native Language Switcher Button (FR | EN) */}
              <div className={`flex items-center space-x-1 p-1 rounded-full border text-[11px] font-semibold shrink-0 transition-all ${
                isScrolled ? 'border-[#171512]/15 bg-[#FAF9F6] text-[#171512]' : 'border-white/20 bg-white/10 text-white'
              }`}>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-2.5 py-0.5 rounded-full transition-all whitespace-nowrap ${
                    language === 'fr'
                      ? 'bg-brand-gradient text-white shadow-xs'
                      : 'hover:opacity-100 opacity-70'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-0.5 rounded-full transition-all whitespace-nowrap ${
                    language === 'en'
                      ? 'bg-brand-gradient text-white shadow-xs'
                      : 'hover:opacity-100 opacity-70'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Callback Button */}
              <button
                onClick={onOpenCallback}
                className={`inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'border border-[#171512]/20 text-[#171512] hover:bg-[#748C8C] hover:border-[#748C8C] hover:text-white'
                    : 'border border-white/30 text-white hover:bg-white hover:text-[#171512]'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{t('btnCallback')}</span>
              </button>

              {/* Primary Estimation CTA */}
              <Link
                href="/estimation"
                className={`inline-flex items-center space-x-2 text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'bg-brand-gradient text-white hover:bg-brand-gradient-hover shadow-brand'
                    : 'bg-white text-[#171512] hover:bg-[#F7F5F0]'
                }`}
              >
                <span className="whitespace-nowrap">{t('btnEstimate')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Controls with Animated Icon */}
            <div className="flex items-center space-x-2.5 lg:hidden shrink-0">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border transition-all ${
                  isScrolled ? 'border-[#171512]/20 bg-white/70 text-[#171512]' : 'border-white/30 bg-white/10 text-white'
                }`}
              >
                {language === 'fr' ? 'EN' : 'FR'}
              </button>

              <Link
                href="/estimation"
                className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all shadow-xs ${
                  isScrolled ? 'bg-brand-gradient text-white shadow-brand' : 'bg-white text-[#171512]'
                }`}
              >
                {language === 'fr' ? 'Estimer' : 'Valuate'}
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled ? 'text-[#171512] hover:bg-[#171512]/5' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Menu"
              >
                <HamburgerIcon
                  isOpen={isMobileMenuOpen}
                  colorClass={isScrolled ? 'bg-[#171512]' : 'bg-white'}
                />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onOpenCallback={onOpenCallback}
      />
    </>
  );
}
