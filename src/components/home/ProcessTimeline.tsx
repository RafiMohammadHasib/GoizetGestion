'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Camera, Share2, Users, FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProcessTimeline() {
  const { language, t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: language === 'fr' ? 'Estimation & Valorisation' : 'Valuation & Advisory',
      subtitle: language === 'fr' ? 'Étude comparative de marché' : 'Comparative Market Analysis',
      description: language === 'fr'
        ? 'Nous analysons l\'emplacement, l\'état général et les caractéristiques de votre appartement pour établir le loyer optimal conforme à la réglementation bordelaise.'
        : 'We evaluate location, finishes, and specific amenities to set optimal rental income adhering strictly to Bordeaux rent cap standards.',
      icon: Calculator,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '02',
      title: language === 'fr' ? 'Shooting & Mise en Valeur' : 'Architectural Photography & 3D Tour',
      subtitle: language === 'fr' ? 'Photographie professionnelle HD' : 'High-Definition Visual Staging',
      description: language === 'fr'
        ? 'Reportage photo réalisé par un photographe d\'architecture, visite virtuelle 3D Matterport et plans 2D détaillés pour un coup de cœur immédiat.'
        : 'High-end architectural photography, Matterport 3D digital twins, and dimensioned floor plans for immediate buyer and tenant appeal.',
      icon: Camera,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '03',
      title: language === 'fr' ? 'Multi-Diffusion Ciblée' : 'Multi-Channel Distribution',
      subtitle: language === 'fr' ? 'Visibilité maximale multi-canaux' : 'Targeted Global & National Reach',
      description: language === 'fr'
        ? 'Publication de l\'annonce sur plus de 15 portails de référence (SeLoger, LeBonCoin, Belles Demeures, Logic-Immo) et auprès de notre fichier d\'acquéreurs qualifiés.'
        : 'Listing syndicated across 15+ premier real estate portals and directly presented to our private network of qualified clients.',
      icon: Share2,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '04',
      title: language === 'fr' ? 'Sélection des Candidats' : 'Rigorous Tenant Vetting',
      subtitle: language === 'fr' ? 'Audit de solvabilité rigoureux' : 'Solvency & Background Audit',
      description: language === 'fr'
        ? 'Analyse approfondie des pièces justificatives, vérification de l\'authenticité des bulletins de paie et validation des garanties (Garantme, Visale, garants physiques).'
        : 'Deep solvency auditing, income verification, employment stability checks, and corporate guarantor validation (Garantme, Visale).',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '05',
      title: language === 'fr' ? 'Bail & État des Lieux HD' : 'Lease Agreement & HD Check-in',
      subtitle: language === 'fr' ? 'Signature 100% dématérialisée' : '100% Paperless Digital Signature',
      description: language === 'fr'
        ? 'Rédaction du bail notarié/conforme alur, état des lieux d\'entrée réalisé sur tablette avec photographies haute définition haute fidélité.'
        : 'Certified legal contract preparation, electronic signature, and tablet-based check-in inventory with high-resolution photographic documentation.',
      icon: FileCheck,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    },
    {
      num: '06',
      title: language === 'fr' ? 'Gestion & Reversement' : 'Ongoing Management & Rent Payouts',
      subtitle: language === 'fr' ? 'Loyer versé le 1er du mois' : 'Guaranteed Disbursement on the 1st',
      description: language === 'fr'
        ? 'Gestion technique des réparations avec nos artisans partenaires bordelais, encaissement des loyers, quittances et révision annuelle.'
        : 'Coordination of vetted local contractors, proactive rent collection, automated statements, and annual indexation.',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-y border-[#171512]/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
            {t('processBadge')}
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
            {t('processTitle')}
          </h2>
          <p className="text-sm text-[#6F6255] font-light">
            {t('processSub')}
          </p>
        </div>

        {/* Interactive Steps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Steps Navigation */}
          <div className="lg:col-span-6 space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-white border-[#748C8C] shadow-brand'
                      : 'bg-transparent border-transparent hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`font-serif-display text-2xl font-semibold ${
                      isActive ? 'text-[#748C8C]' : 'text-[#171512]/30'
                    }`}>
                      {step.num}
                    </span>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-semibold ${
                          isActive ? 'text-[#171512]' : 'text-[#171512]/70'
                        }`}>
                          {step.title}
                        </h3>
                        {isActive && <CheckCircle2 className="w-5 h-5 text-[#748C8C]" />}
                      </div>
                      <p className="text-xs text-[#6F6255] mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>

                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-[#6F6255] mt-3 pt-3 border-t border-[#171512]/10 leading-relaxed pl-10"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Visual Stage */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] border border-[#171512]/10">
              <img
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-full object-cover transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 backdrop-blur-md rounded-xl text-[#171512] border border-white/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
                  {language === 'fr' ? 'ÉTAPE' : 'STEP'} {steps[activeStep].num} — {steps[activeStep].subtitle}
                </span>
                <h4 className="font-serif-display text-xl font-medium">
                  {steps[activeStep].title}
                </h4>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
