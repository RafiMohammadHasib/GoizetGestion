'use client';

import React from 'react';
import Link from 'next/link';
import { NEIGHBORHOODS } from '@/data/neighborhoods';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { MapPin, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function NeighborhoodsIndexPage() {
  const { language } = useLanguage();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Secteurs & Quartiers' : 'Bordeaux Districts' }]} />

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
          {language === 'fr' ? 'GUIDE DES QUARTIERS DE BORDEAUX' : 'BORDEAUX NEIGHBORHOOD GUIDE'}
        </span>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Explorer l\'immobilier quartier par quartier.' : 'Explore Bordeaux real estate district by district.'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Chartrons, Caudéran, Triangle d\'Or, Bastide... Découvrez la tension locative, les rendements moyens et les spécificités architecturales des plus beaux secteurs bordelais.'
            : 'Chartrons, Caudéran, Golden Triangle, Bastide... Discover rental demand, average yields, and architectural highlights of Bordeaux\'s prime areas.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {NEIGHBORHOODS.map((hood) => (
          <motion.div
            key={hood.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={hood.image}
                alt={hood.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/80 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#171512] flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#7A2234]" />
                <span>{hood.postalCode} Bordeaux</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="font-serif-display text-3xl font-medium tracking-tight">
                  {hood.name}
                </h2>
                <p className="text-xs text-white/80 font-light truncate">{hood.tagline}</p>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#6F6255] leading-relaxed line-clamp-3">
                {hood.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF9F6] p-3 rounded-xl border border-[#171512]/5">
                <div>
                  <span className="text-[10px] uppercase text-[#6F6255] block">Loyer Moyen</span>
                  <span className="font-semibold text-[#171512]">{hood.avgRentPerM2} € / m²</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6F6255] block">Prix Vente M2</span>
                  <span className="font-semibold text-[#171512]">{hood.avgSalePerM2.toLocaleString('fr-FR')} € / m²</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#171512]/10 flex items-center justify-between">
                <Link
                  href={`/quartiers/${hood.slug}`}
                  className="text-xs font-semibold text-[#7A2234] group-hover:underline inline-flex items-center space-x-1 whitespace-nowrap"
                >
                  <span>{language === 'fr' ? 'Guide complet du quartier' : 'District Guide'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
