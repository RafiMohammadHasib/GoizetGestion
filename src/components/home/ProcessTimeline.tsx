'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ProcessTimeline() {
  const { language, t } = useLanguage();

  const steps = [
    {
      num: '01',
      stepLabel: language === 'fr' ? 'Étape 1' : 'Step 1',
      title: language === 'fr' ? 'Estimation & Valorisation' : 'Valuation & Advisory',
      description: language === 'fr'
        ? 'Nous analysons les atouts de votre bien pour établir le loyer ou prix optimal conforme au marché bordelais.'
        : 'We analyze your property to establish the optimal rental income or sale value in line with Bordeaux market.'
    },
    {
      num: '02',
      stepLabel: language === 'fr' ? 'Étape 2' : 'Step 2',
      title: language === 'fr' ? 'Shooting & Mise en Valeur' : 'Photography & Staging',
      description: language === 'fr'
        ? 'Reportage photo professionnel HD et valorisation esthétique soignée pour déclencher un coup de cœur immédiat.'
        : 'High-definition architectural photography and aesthetic staging designed to capture immediate interest.'
    },
    {
      num: '03',
      stepLabel: language === 'fr' ? 'Étape 3' : 'Step 3',
      title: language === 'fr' ? 'Sélection des Candidats' : 'Rigorous Vetting',
      description: language === 'fr'
        ? 'Diffusion ciblée, vérification exhaustive de solvabilité et sélection rigoureuse des meilleurs profils.'
        : 'Targeted distribution, complete solvency auditing, and careful selection of top-tier profiles.'
    },
    {
      num: '04',
      stepLabel: language === 'fr' ? 'Étape 4' : 'Step 4',
      title: language === 'fr' ? 'Gestion & Sérénité' : 'Management & Peace of Mind',
      description: language === 'fr'
        ? 'Bail sécurisé dématérialisé, état des lieux certifié, encaissement régulier et réactivité absolue.'
        : 'Certified digital lease, check-in inventory, regular disbursements, and dedicated advisory.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-y border-[#171512]/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
            {t('processBadge')}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-light text-[#171512] leading-tight">
            {t('processTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6255] font-light max-w-xl mx-auto">
            {t('processSub')}
          </p>
        </div>

        {/* 4-Step Horizontal List (Clean & Compact) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#171512]/10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#748C8C] block">
                  {step.stepLabel}
                </span>
                <h3 className="font-serif-display text-xl font-medium text-[#171512] leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#6F6255] leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {/* Step Number Displayed Cleanly Below as in PDF Wireframe */}
              <div className="pt-4 border-t border-[#171512]/10 flex items-center justify-between">
                <span className="font-serif-display text-3xl font-light text-[#171512]/30">
                  {step.num}
                </span>
                <div className="w-2 h-2 rounded-full bg-[#748C8C]/40" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
