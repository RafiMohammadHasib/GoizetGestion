'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight, TrendingUp } from 'lucide-react';
import { NEIGHBORHOODS } from '@/data/neighborhoods';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function BordeauxExplorer() {
  const { language, t } = useLanguage();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
              {t('explorerBadge')}
            </span>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
              {t('explorerTitle')}
            </h2>
          </div>

          <Link
            href="/quartiers"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#748C8C] hover:underline"
          >
            <span>{t('explorerAll')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Neighborhood Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEIGHBORHOODS.map((hood, idx) => {
            const tagline = (language === 'en' && hood.taglineEn) ? hood.taglineEn : hood.tagline;
            const description = (language === 'en' && hood.descriptionEn) ? hood.descriptionEn : hood.description;

            return (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                data-cursor={language === 'fr' ? 'EXPLORER' : 'EXPLORE'}
              >
                {/* Image Preview */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hood.image}
                    alt={hood.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#171512] flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>{hood.postalCode} Bordeaux</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-brand-gradient text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-brand">
                    <TrendingUp className="w-3 h-3" />
                    <span>{language === 'fr' ? 'Demande' : 'Demand'} {hood.demandScore}/10</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif-display text-2xl font-medium tracking-tight">
                      {hood.name}
                    </h3>
                    <p className="text-xs text-white/80 font-light truncate">{tagline}</p>
                  </div>
                </div>

                {/* Data Strip */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF9F6] p-3 rounded-xl border border-[#171512]/5">
                    <div>
                      <span className="text-[10px] uppercase text-[#6F6255] block">{t('avgRent')}</span>
                      <span className="font-semibold text-[#171512]">{hood.avgRentPerM2} € / m²</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#6F6255] block">{t('avgSale')}</span>
                      <span className="font-semibold text-[#171512]">{hood.avgSalePerM2.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} € / m²</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6F6255] line-clamp-2 leading-relaxed">
                    {description}
                  </p>

                  <div className="pt-3 border-t border-[#171512]/10 flex items-center justify-between">
                    <Link
                      href={`/quartiers/${hood.slug}`}
                      className="text-xs font-semibold text-[#171512] group-hover:text-[#748C8C] inline-flex items-center space-x-1.5 transition-colors"
                    >
                      <span>{t('exploreDistrict')}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
