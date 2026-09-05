'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ApproachSection() {
  const { language } = useLanguage();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Custom High-Res Team Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] border border-[#171512]/10" data-cursor="BORDEAUX">
              <img
                src="/Home-Section-1A.png"
                alt="Équipe d'experts Goizet Gestion à Bordeaux"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 backdrop-blur-md rounded-xl border border-white/40 text-[#171512]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
                  {language === 'fr' ? "L'EXIGENCE DU SUR-MESURE" : 'BOUTIQUE ADVISORY EXCELLENCE'}
                </span>
                <p className="font-serif-display text-lg font-medium mt-1">
                  {language === 'fr'
                    ? '« Nous redéfinissons les standards de la gestion locative pour offrir sérénité aux propriétaires et confort aux locataires. »'
                    : '“We redefine property management standards to offer absolute peace of mind to owners and premium comfort to tenants.”'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
                {language === 'fr' ? 'NOTRE APPROCHE' : 'OUR APPROACH'}
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-[1.1]">
                {language === 'fr' ? "Une nouvelle manière de penser l'immobilier." : 'A modern way of thinking about real estate.'}
              </h2>
              <p className="text-base text-[#6F6255] font-light leading-relaxed">
                {language === 'fr'
                  ? 'Les agences traditionnelles s\'appuient sur des processus désuets et opaques. Chez Goizet Gestion, nous combinons l\'expertise fine du marché bordelais à la puissance d\'outils digitaux modernes.'
                  : 'Traditional agencies rely on outdated and opaque processes. At Goizet Gestion, we combine deep Bordeaux market expertise with state-of-the-art digital tools.'}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                {
                  title: language === 'fr' ? 'Priorité à l\'efficacité & aux résultats' : 'Focus on efficiency & performance',
                  desc: language === 'fr' ? 'Commercialisation ultra-ciblée, sélection rigoureuse et vacance locative minimale.' : 'Targeted marketing, thorough tenant vetting, and minimized void periods.'
                },
                {
                  title: language === 'fr' ? 'Gestion simplifiée & transparente' : 'Streamlined & transparent management',
                  desc: language === 'fr' ? 'Accès 24/7 à vos documents juridiques, états des lieux HD et quittances dématérialisées.' : '24/7 access to your legal documents, HD inspection records, and digital receipts.'
                },
                {
                  title: language === 'fr' ? 'Ancrage local à Bordeaux' : 'Deep local Bordeaux footprint',
                  desc: language === 'fr' ? 'Connaissance exacte quartier par quartier (Chartrons, Caudéran, Triangle d\'Or, Bastide).' : 'Intimate neighborhood-by-neighborhood expertise (Chartrons, Caudéran, Golden Triangle).'
                }
              ].map((point) => (
                <div key={point.title} className="flex items-start space-x-3.5">
                  <CheckCircle className="w-5 h-5 text-[#748C8C] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#171512]">{point.title}</h3>
                    <p className="text-xs text-[#6F6255] mt-0.5 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                href="/gestion-locative"
                className="bg-[#171512] hover:bg-[#2C2723] text-white px-7 py-3.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center space-x-2 shadow-md whitespace-nowrap"
              >
                <span>{language === 'fr' ? 'Découvrir notre méthode de gestion' : 'Discover Our Management Method'}</span>
                <ArrowUpRight className="w-4 h-4 text-[#748C8C]" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
