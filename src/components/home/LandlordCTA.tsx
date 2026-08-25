'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calculator, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function LandlordCTA() {
  const { language, t } = useLanguage();

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#171512] text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80"
          alt="Propriétaire à Bordeaux"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171512] via-[#171512]/90 to-[#171512]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-3.5 py-1 rounded-full border border-[#748C8C]/30 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('ownerBadge')}</span>
          </div>

          <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-white leading-tight">
            {t('ownerTitle')} <br />
            <span className="italic font-normal text-[#EAE6DF]">{t('ownerTitleSub')}</span>
          </h2>

          <p className="text-base text-[#9E9285] max-w-xl font-light leading-relaxed">
            {t('ownerDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#EAE6DF]">0 {language === 'fr' ? 'jour' : 'days'}</span>
              <p className="text-[#9E9285]">{t('ownerStat1')}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#EAE6DF]">100%</span>
              <p className="text-[#9E9285]">{t('ownerStat2')}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#EAE6DF]">2h</span>
              <p className="text-[#9E9285]">{t('ownerStat3')}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: High Conversion Glass Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 bg-white/10 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6"
        >
          <div className="space-y-2">
            <h3 className="font-serif-display text-2xl font-medium text-white">
              {language === 'fr' ? 'Estimez votre loyer ou votre bien gratuitement' : 'Estimate Your Rent or Property Value Free'}
            </h3>
            <p className="text-xs text-[#9E9285] leading-relaxed">
              {language === 'fr'
                ? 'Obtenez une analyse précise du marché bordelais selon les critères de votre adresse (Chartrons, Caudéran, Centre, etc.).'
                : 'Get an accurate valuation tailored to your Bordeaux street address (Chartrons, Caudéran, Golden Triangle).'}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/confier-un-bien"
              className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 px-6 rounded-xl font-semibold text-xs transition-all duration-300 shadow-brand flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'fr' ? 'Confier mon bien à l\'agence' : 'Entrust Us With Your Property'}</span>
              <ArrowUpRight className="w-4 h-4 ml-auto" />
            </Link>

            <Link
              href="/estimation"
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 px-6 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 text-[#748C8C]" />
              <span>{language === 'fr' ? 'Obtenir une estimation locative (2 min)' : 'Get a Rental Valuation (2 min)'}</span>
              <ArrowUpRight className="w-4 h-4 ml-auto" />
            </Link>

            <Link
              href="/gestion-locative"
              className="w-full border border-white/15 hover:bg-white hover:text-[#171512] text-white py-3 px-6 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <span>{language === 'fr' ? 'Découvrir nos offres de gestion locative' : 'Explore Management Plans'}</span>
            </Link>
          </div>

          <p className="text-[10px] text-center text-white/50">
            {language === 'fr' ? 'Gratuit, sans engagement et conforme à l\'encadrement des loyers de Bordeaux.' : 'Free, no obligation, fully compliant with Bordeaux rent control regulations.'}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
