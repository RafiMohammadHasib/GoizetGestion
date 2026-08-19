'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpRight, MapPin, Home, Euro } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

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

  useEffect(() => {
    if (!heroImageRef.current || !heroSectionRef.current) return;

    // GSAP ScrollTrigger Parallax & Zoom Effect on Hero Image
    const ctx = gsap.context(() => {
      gsap.to(heroImageRef.current, {
        scale: 1.25,
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
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
    <section ref={heroSectionRef} className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#171512]">
      {/* Background High-End Architectural Image with GSAP Scroll Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={heroImageRef}
          src="/images/hero.jpg"
          alt="Luxury Haussmannian Bordeaux Architecture"
          className="w-full h-full object-cover opacity-55 scale-105 origin-center transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/45 to-[#171512]/75" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-12">
        
        {/* Main Editorial Typography */}
        <div className="max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#F7F5F0]/90 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-[#7A2234]" />
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
          className="max-w-5xl bg-[#FAF9F6]/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/40 text-[#171512]"
        >
          {/* Transaction Type Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#171512]/10 pb-4 mb-4">
            <div className="flex space-x-2 bg-[#EAE6DF]/60 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setTransactionType('louer')}
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
                onClick={() => setTransactionType('acheter')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  transactionType === 'acheter'
                    ? 'bg-[#171512] text-white shadow-sm'
                    : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                {t('tabBuy')}
              </button>
            </div>

            <Link
              href="/estimation"
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-[#7A2234] hover:underline whitespace-nowrap"
            >
              <span>{t('linkOwnerHero')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Search Inputs Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Field 1: Property Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1 whitespace-nowrap">
                <Home className="w-3 h-3 text-[#7A2234]" />
                <span>{t('fieldPropType')}</span>
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#171512]/10 rounded-xl text-xs font-medium focus:outline-none focus:border-[#7A2234]"
              >
                <option value="">{language === 'fr' ? 'Tous types de biens' : 'All Property Types'}</option>
                <option value="appartement">{language === 'fr' ? 'Appartement' : 'Apartment'}</option>
                <option value="echoppe">{language === 'fr' ? 'Échoppe bordelaise' : 'Bordeaux Townhouse'}</option>
                <option value="maison">{language === 'fr' ? 'Maison / Villa' : 'House / Villa'}</option>
                <option value="loft">{language === 'fr' ? 'Loft & Ateliers' : 'Loft & Studios'}</option>
                <option value="hotel-particulier">{language === 'fr' ? 'Hôtel Particulier' : 'Mansion / Estate'}</option>
              </select>
            </div>

            {/* Field 2: Neighborhood */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1 whitespace-nowrap">
                <MapPin className="w-3 h-3 text-[#7A2234]" />
                <span>{t('fieldSector')}</span>
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#171512]/10 rounded-xl text-xs font-medium focus:outline-none focus:border-[#7A2234]"
              >
                <option value="">{language === 'fr' ? 'Tous secteurs de Bordeaux' : 'All Bordeaux Areas'}</option>
                <option value="chartrons">Chartrons</option>
                <option value="cauderan">Caudéran</option>
                <option value="triangle-dor">Triangle d'Or / Centre</option>
                <option value="bastide">Bastide Rive Droite</option>
                <option value="saint-michel">Saint-Michel & Capucins</option>
                <option value="saint-augustin">Saint-Augustin & CHU</option>
              </select>
            </div>

            {/* Field 3: Max Budget */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1 whitespace-nowrap">
                <Euro className="w-3 h-3 text-[#7A2234]" />
                <span>{t('fieldBudget')}</span>
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#171512]/10 rounded-xl text-xs font-medium focus:outline-none focus:border-[#7A2234]"
              >
                <option value="">{language === 'fr' ? 'Budget libre' : 'Any Budget'}</option>
                {transactionType === 'louer' ? (
                  <>
                    <option value="1000">1 000 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                    <option value="1500">1 500 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                    <option value="2000">2 000 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                    <option value="3000">3 000 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                  </>
                ) : (
                  <>
                    <option value="400000">400 000 €</option>
                    <option value="600000">600 000 €</option>
                    <option value="1000000">1 000 000 €</option>
                    <option value="2500000">2 500 000 €</option>
                  </>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#7A2234] hover:bg-[#5C1D27] text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md flex items-center justify-center space-x-2 h-[42px] whitespace-nowrap shrink-0"
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
          className="flex flex-wrap items-center gap-4 text-xs font-semibold"
        >
          <Link
            href="/estimation"
            className="bg-white text-[#171512] hover:bg-[#FAF9F6] px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg flex items-center space-x-2 whitespace-nowrap shrink-0"
          >
            <span>{t('btnEstimate')}</span>
            <ArrowUpRight className="w-4 h-4 text-[#7A2234]" />
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
