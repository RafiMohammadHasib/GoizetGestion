'use client';

import React from 'react';
import { ArrowUpRight, Car, VolumeX, Sparkles, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function MaisonCalveSection() {
  const { language } = useLanguage();

  return (
    <section id="maison-calve" className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#141A1A] text-white overflow-hidden border-t border-[#748C8C]/20">
      
      {/* Background Architectural Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#748C8C]/12 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#2E4040]/25 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#748C8C_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        
        {/* ========================================================== */}
        {/* SECTION HEADER & BRAND BADGE                               */}
        {/* ========================================================== */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 border border-[#748C8C]/30 text-xs font-semibold backdrop-blur-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/maisonclave/maison-calve-icon.svg"
              alt="Maison Calvé"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs shrink-0"
            />
            <span className="text-[#90A5A5] uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] font-bold">
              {language === 'fr'
                ? 'ESPACE DE TRAVAIL & COWORKING · BORDEAUX'
                : 'BOUTIQUE WORKSPACE & COWORKING · BORDEAUX'}
            </span>
            <span className="text-white/30 hidden xs:inline">•</span>
            <span className="text-white/80 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold hidden xs:inline">
              {language === 'fr' ? 'PAR GOIZET GESTION' : 'BY GOIZET GESTION'}
            </span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight">
            {language === 'fr' ? (
              <>
                Maison Calvé — <span className="italic font-normal text-[#EAE6DF]">Bureaux d’exception</span> & Coworking feutré.
              </>
            ) : (
              <>
                Maison Calvé — <span className="italic font-normal text-[#EAE6DF]">Boutique Offices</span> & Peaceful Coworking.
              </>
            )}
          </h2>
        </div>

        {/* ========================================================== */}
        {/* EDITORIAL 2-COLUMN PRESENTATION                            */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Quote, 2x2 Highlights Grid & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 sm:space-y-7"
          >
            {/* Refined Quote Accent */}
            <div className="border-l-2 border-[#748C8C] pl-4 sm:pl-5 py-1">
              <p className="text-sm sm:text-base lg:text-lg text-[#D2CBC2] font-light leading-relaxed italic">
                {language === 'fr'
                  ? '« Un espace de travail à taille humaine, personnalisé et serein au cœur de Bordeaux. Fini le côté usine des grands coworkings : installez votre équipe dans un authentique hôtel particulier du XIXe siècle avec parking privé sécurisé sur place. »'
                  : '“A human-scale, personalized and serene workspace in central Bordeaux. Leave behind crowded factory-style coworking: set up your team in an authentic 19th-century private mansion with on-site secure parking.”'}
              </p>
            </div>

            {/* 4 Focused Highlights in 2x2 Grid (Airy & Compact on Mobile) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {[
                {
                  icon: Car,
                  title: language === 'fr' ? '9 Parkings Privatifs' : '9 Private Parkings',
                  desc: language === 'fr' ? 'Cour close & bornes VE' : 'Courtyard & EV chargers'
                },
                {
                  icon: VolumeX,
                  title: language === 'fr' ? 'Silence (<42 dB)' : 'Quiet Focus (<42 dB)',
                  desc: language === 'fr' ? 'Acoustique soignée' : 'Architectural acoustics'
                },
                {
                  icon: Sparkles,
                  title: language === 'fr' ? 'Hôtel Particulier' : '19th-Century Mansion',
                  desc: language === 'fr' ? 'Pierre blonde & cachet' : 'Historic limestone'
                },
                {
                  icon: Coffee,
                  title: language === 'fr' ? 'Prestations Tout Inclus' : 'All-Inclusive',
                  desc: language === 'fr' ? 'Fibre 1Gb/s, café barista' : '1Gb/s fiber & coffee'
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#90A5A5]">
                      <Icon className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                      <span className="font-semibold text-[11px] sm:text-xs text-white truncate">{item.title}</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#A2B2B2] font-light leading-tight">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Primary Redirection CTA Button */}
            <div className="pt-2">
              <a
                href="https://www.maisoncalve.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#748C8C] to-[#4F6565] hover:from-[#829C9C] hover:to-[#587272] text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-[0_8px_24px_rgba(116,140,140,0.35)] hover:shadow-[0_12px_32px_rgba(116,140,140,0.5)] hover:-translate-y-0.5 whitespace-nowrap text-center"
              >
                <span>{language === 'fr' ? 'Accéder au site officiel Maison Calvé' : 'Visit Official Maison Calvé Website'}</span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
                  <ArrowUpRight className="w-3 h-3 text-white" />
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Clean Visual Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <a
              href="https://www.maisoncalve.fr/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Découvrir Maison Calvé à Bordeaux"
              className="block group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-xl aspect-[16/11] sm:aspect-[16/11]"
            >
              {/* Main Exterior Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/maisonclave/calve-exterior.jpg"
                alt="Maison Calvé - Hôtel particulier au 48 rue Calvé, Bordeaux"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141A1A]/90 via-black/20 to-transparent" />

              {/* Top Pill: Heritage Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs text-white font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#748C8C]" />
                <span>{language === 'fr' ? 'Hôtel particulier & 9 parkings' : '19th-Century Mansion & 9 parkings'}</span>
              </div>

              {/* Bottom Inset: Address & Direct Link */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-between transition-all group-hover:bg-white/15">
                <div className="space-y-0.5">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#90A5A5]">
                    {language === 'fr' ? 'Bureaux · Coworking · Réunion' : 'Offices · Coworking · Meeting'}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-white truncate max-w-[220px] sm:max-w-none">
                    48 rue Calvé, 33000 Bordeaux
                  </p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#171512] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#748C8C]" />
                </div>
              </div>
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
