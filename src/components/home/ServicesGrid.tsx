'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CORE_SERVICES } from '@/data/services';

export default function ServicesGrid() {
  const { language, t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-y border-[#171512]/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
              {t('servicesBadge')}
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-light text-[#171512] leading-tight">
              {t('servicesTitle')}
            </h2>
          </div>
          <Link
            href="/gestion-locative"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#748C8C] hover:text-[#4F6565] transition-colors whitespace-nowrap"
          >
            <span>{language === 'fr' ? 'Découvrir tous nos mandats' : 'Explore All Management Plans'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Streamlined Sage Green Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CORE_SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#668080] hover:bg-[#587272] text-white rounded-2xl p-8 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between min-h-[260px] border border-[#7A9494]/30"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/15 px-3 py-1 rounded-full">
                      {service.badge[language]}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="font-serif-display text-2xl font-medium tracking-tight text-white group-hover:text-white/95">
                      {service.title[language]}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E6EFEF] leading-relaxed font-light">
                      {service.shortDescription[language]}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/15 flex items-center justify-between mt-6">
                  <Link
                    href={service.href}
                    className="text-xs font-semibold text-white/95 group-hover:text-white inline-flex items-center space-x-1.5 transition-colors"
                  >
                    <span>{service.ctaText[language]}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
