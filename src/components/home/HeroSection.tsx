'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpRight, MapPin, Home, Euro } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/ui/CustomSelect';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const [transactionType, setTransactionType] = useState<'louer' | 'acheter'>('louer');
  const [propertyType, setPropertyType] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const propertyTypeOptions = useMemo(() => [
    { value: '', label: language === 'fr' ? 'Tous types de biens' : 'All Property Types' },
    { value: 'appartement', label: language === 'fr' ? 'Appartement' : 'Apartment' },
    { value: 'echoppe', label: language === 'fr' ? 'Échoppe bordelaise' : 'Bordeaux Townhouse' },
    { value: 'maison', label: language === 'fr' ? 'Maison / Villa' : 'House / Villa' },
    { value: 'loft', label: language === 'fr' ? 'Loft & Ateliers' : 'Loft & Studios' },
    { value: 'hotel-particulier', label: language === 'fr' ? 'Hôtel Particulier' : 'Mansion / Estate' },
  ], [language]);

  const neighborhoodOptions = useMemo(() => [
    { value: '', label: language === 'fr' ? 'Tous secteurs de Bordeaux' : 'All Bordeaux Areas' },
    { value: 'chartrons', label: 'Chartrons', sublabel: '33300' },
    { value: 'cauderan', label: 'Caudéran', sublabel: '33200' },
    { value: 'triangle-dor', label: "Triangle d'Or / Centre", sublabel: '33000' },
    { value: 'bastide', label: 'Bastide Rive Droite', sublabel: '33100' },
    { value: 'saint-michel', label: 'Saint-Michel & Capucins', sublabel: '33000' },
    { value: 'saint-augustin', label: 'Saint-Augustin & CHU', sublabel: '33000' },
    { value: 'merignac', label: 'Mérignac', sublabel: '33700' },
    { value: 'begles', label: 'Bègles', sublabel: '33130' },
  ], [language]);

  const priceOptions = useMemo(() => {
    if (transactionType === 'louer') {
      return [
        { value: '', label: language === 'fr' ? 'Budget libre' : 'Any Budget' },
        { value: '1000', label: `1 000 € / ${language === 'fr' ? 'mois' : 'mo'}` },
        { value: '1500', label: `1 500 € / ${language === 'fr' ? 'mois' : 'mo'}` },
        { value: '2000', label: `2 000 € / ${language === 'fr' ? 'mois' : 'mo'}` },
        { value: '3000', label: `3 000 € / ${language === 'fr' ? 'mois' : 'mo'}` },
      ];
    }
    return [
      { value: '', label: language === 'fr' ? 'Budget libre' : 'Any Budget' },
      { value: '400000', label: '400 000 €' },
      { value: '600000', label: '600 000 €' },
      { value: '1000000', label: '1 000 000 €' },
      { value: '2500000', label: '2 500 000 €' },
    ];
  }, [transactionType, language]);

  useEffect(() => {
    if (!heroImageRef.current || !heroSectionRef.current) return;

    // GSAP ScrollTrigger Parallax & Zoom Effect on Hero Image with 1:1 instant mouse-wheel synchronization
    const ctx = gsap.context(() => {
      gsap.to(heroImageRef.current, {
        scale: 1.25,
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true, // 1:1 immediate response to every mouse scroll tick
          invalidateOnRefresh: true,
        }
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('type', transactionType);
    if (propertyType) params.set('propertyType', propertyType);
    if (neighborhood) params.set('neighborhood', neighborhood);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/biens?${params.toString()}`);
  };

  return (
    <section ref={heroSectionRef} className="relative z-20 min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#171512]">
      {/* Background High-End Architectural Image with GSAP Scroll Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={heroImageRef}
          src="/images/hero.jpg"
          alt="Luxury Haussmannian Bordeaux Architecture"
          className="w-full h-full object-cover opacity-55 scale-105 origin-center will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/45 to-[#171512]/75" />
      </div>

      <div className="relative z-20 max-w-7xl w-full mx-auto space-y-12">
        
        {/* Main Editorial Typography */}
        <div className="max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#F7F5F0]/90 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-[#748C8C]" />
            <span>{t('heroBadge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight"
          >
            {t('heroTitleLine1')} <br />
            <span className="italic font-normal text-[#EAE6DF]">{t('heroTitleLine2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-xl text-[#9E9285] max-w-2xl font-light leading-relaxed"
          >
            {t('heroSub')}
          </motion.p>
        </div>

        {/* Floating Glass Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-40 max-w-5xl bg-[#FAF9F6] rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/40 text-[#171512]"
        >
          {/* Transaction Type Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#171512]/10 pb-4 mb-4">
            <div className="flex space-x-2 bg-[#EAE6DF]/60 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTransactionType('louer');
                  setMaxPrice('');
                }}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  transactionType === 'louer'
                    ? 'bg-[#171512] text-white shadow-sm'
                    : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                {t('tabRent')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTransactionType('acheter');
                  setMaxPrice('');
                }}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  transactionType === 'acheter'
                    ? 'bg-[#171512] text-white shadow-sm'
                    : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                {t('tabBuy')}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/confier-un-bien"
                className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-[#748C8C] hover:text-[#4F6565] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20 transition-colors whitespace-nowrap"
              >
                <span>{language === 'fr' ? 'Propriétaire ? Confier mon bien' : 'Property Owner? Entrust Property'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Search Inputs Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 relative z-20">
            
            {/* Field 1: Property Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1 whitespace-nowrap">
                <Home className="w-3 h-3 text-[#748C8C]" />
                <span>{t('fieldPropType')}</span>
              </label>
              <CustomSelect
                options={propertyTypeOptions}
                value={propertyType}
                onChange={setPropertyType}
                placeholder={language === 'fr' ? 'Tous types de biens' : 'All Property Types'}
              />
            </div>

            {/* Field 2: Neighborhood */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1 whitespace-nowrap">
                <MapPin className="w-3 h-3 text-[#748C8C]" />
                <span>{t('fieldSector')}</span>
              </label>
              <CustomSelect
                options={neighborhoodOptions}
                value={neighborhood}
                onChange={setNeighborhood}
                placeholder={language === 'fr' ? 'Tous secteurs de Bordeaux' : 'All Bordeaux Areas'}
              />
            </div>

            {/* Field 3: Max Budget */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1 whitespace-nowrap">
                <Euro className="w-3 h-3 text-[#748C8C]" />
                <span>{t('fieldBudget')}</span>
              </label>
              <CustomSelect
                options={priceOptions}
                value={maxPrice}
                onChange={setMaxPrice}
                placeholder={language === 'fr' ? 'Budget libre' : 'Any Budget'}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 shadow-brand flex items-center justify-center space-x-2 h-[42px] whitespace-nowrap shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{t('btnSearch')}</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-0 flex flex-wrap items-center gap-3 text-xs font-semibold"
        >
          <Link
            href="/confier-un-bien"
            className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-3.5 rounded-full transition-all duration-300 shadow-brand flex items-center space-x-2 whitespace-nowrap shrink-0"
          >
            <span>{t('btnEntrust')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/estimation"
            className="bg-white text-[#171512] hover:bg-[#FAF9F6] px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg flex items-center space-x-2 whitespace-nowrap shrink-0"
          >
            <span>{t('btnRentalValuation')}</span>
            <ArrowUpRight className="w-4 h-4 text-[#748C8C]" />
          </Link>

          <Link
            href="/biens"
            className="border border-white/30 text-white hover:bg-white/10 px-6 py-3.5 rounded-full transition-all duration-300 whitespace-nowrap shrink-0"
          >
            {t('btnExploreAll')}
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
