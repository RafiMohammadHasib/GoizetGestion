'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building, Sparkles, ShieldCheck, HeartHandshake, Award, 
  MapPin, Phone, Mail, ArrowUpRight, CheckCircle2, TrendingUp, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();

  const founders = [
    {
      name: 'Paul Goizet',
      role: language === 'fr' ? 'Fondateur & Directeur Associé' : 'Founder & Managing Partner',
      image: '/paul-goizet.jpg',
      phone: '+33 6 95 57 70 33',
      email: 'paul@goizet-gestion.fr',
      bio: language === 'fr' 
        ? 'Expert en stratégie patrimoniale et gestion locative à Bordeaux. Passionné par l\'architecture bordelaise et l\'optimisation de rendement pour les propriétaires exigeants.'
        : 'Expert in real estate portfolio strategy and property management across Bordeaux. Dedicated to optimizing yields and offering bespoke advisory for property owners.',
      specialties: language === 'fr' 
        ? ['Stratégie Patrimoniale', 'Gestion Locative Haut de Gamme', 'Fiscalité Immobilière']
        : ['Portfolio Advisory', 'Luxury Property Management', 'Real Estate Tax Strategy']
    },
    {
      name: 'Edgar G.',
      role: language === 'fr' ? 'Co-Fondateur & Directeur du Développement' : 'Co-Founder & Head of Growth',
      image: '/edgar-g.jpg',
      phone: '+33 7 81 96 83 95',
      email: 'edgar@goizet-gestion.fr',
      bio: language === 'fr'
        ? 'Spécialiste de la valorisation d\'actifs et des relations investisseurs. Il orchestre la sélection rigoureuse des locataires et la commercialisation des biens d\'exception.'
        : 'Specialist in asset enhancement and investor relations. Orchestrating rigorous tenant selection, high-exposure marketing, and client relationships.',
      specialties: language === 'fr'
        ? ['Développement & Vente', 'Sélection & Relations Locataires', 'Marketing Immobilier']
        : ['Acquisitions & Sales', 'Tenant Onboarding & Relations', 'Property Marketing']
    }
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: language === 'fr' ? 'Transparence Absolue' : 'Absolute Transparency',
      desc: language === 'fr'
        ? 'Zéro frais dissimulés, rapports financiers en temps réel et accès instantané à votre espace propriétaire digitalisé.'
        : 'Zero hidden fees, real-time financial tracking, and continuous access to your digital owner portal.'
    },
    {
      icon: HeartHandshake,
      title: language === 'fr' ? 'Accompagnement Sur-Mesure' : 'Dedicated Personal Advisory',
      desc: language === 'fr'
        ? 'Un interlocuteur unique et dédié qui connaît parfaitement chaque détail de votre patrimoine et de votre quartier.'
        : 'A dedicated single point of contact who intimately knows your property, tenants, and district.'
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? 'Performance & Sérénité' : 'Performance & Peace of Mind',
      desc: language === 'fr'
        ? 'Sélection intransigeante des locataires, garantie loyers impayés intégrale et optimisation constante de la valeur vénale.'
        : 'Uncompromising tenant vetting, comprehensive rent default guarantee, and continuous asset appreciation.'
    }
  ];

  const stats = [
    { value: '100%', label: language === 'fr' ? 'Transparence de gestion' : 'Management Transparency' },
    { value: '< 24h', label: language === 'fr' ? 'Délai moyen de réponse' : 'Average Response Time' },
    { value: '0 %', label: language === 'fr' ? 'Taux de loyers impayés' : 'Rent Default Rate' },
    { value: '38', label: language === 'fr' ? 'Cours Portal, Chartrons' : 'Cours Portal, Chartrons' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171512] pt-32 pb-24">
      
      {/* Editorial Header & Manifesto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3.5 py-1.5 rounded-full border border-[#748C8C]/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'LA MAISON GOIZET GESTION' : 'ABOUT GOIZET GESTION'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-light text-[#171512] leading-[1.08] tracking-tight">
            {language === 'fr' ? (
              <>L'exigence d'une maison de conseil, la clarté d'une <span className="font-normal italic text-[#748C8C]">gestion moderne.</span></>
            ) : (
              <>Boutique advisory excellence, powered by <span className="font-normal italic text-[#748C8C]">modern clarity.</span></>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#6F6255] font-light leading-relaxed max-w-2xl">
            {language === 'fr' ? (
              <>Fondée à Bordeaux au cœur du quartier historique des Chartrons, Goizet Gestion réinvente la relation entre propriétaires, locataires et patrimoine immobilier à travers une approche haut de gamme, humaine et résolument transparente.</>
            ) : (
              <>Headquartered in the historic Chartrons district of Bordeaux, Goizet Gestion redefines property management and real estate advisory through tailored excellence, human connection, and uncompromising transparency.</>
            )}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-8 border-y border-[#171512]/10">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 text-center md:text-left">
              <span className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#748C8C] block">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-[#6F6255] font-medium block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* FOUNDERS SHOWCASE SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'DIRECTION & FONDATION' : 'FOUNDERSHIP & LEADERSHIP'}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-light text-[#171512]">
            {language === 'fr' ? 'Les Fondateurs' : 'Meet the Founders'}
          </h2>
          <p className="text-sm text-[#6F6255] font-light">
            {language === 'fr'
              ? 'Une équipe engagée au quotidien auprès de chaque propriétaire bordelais.'
              : 'Directly committed to the long-term success of each property portfolio.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-3xl border border-[#171512]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/5] sm:aspect-[1/1] w-full overflow-hidden bg-stone-100">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/80 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-medium tracking-tight">
                    {founder.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A2B2B2] font-light uppercase tracking-wider">
                    {founder.role}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#6F6255] font-light leading-relaxed">
                    {founder.bio}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#171512] block">
                      {language === 'fr' ? 'Domaines d\'expertise' : 'Areas of Expertise'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {founder.specialties.map(spec => (
                        <span key={spec} className="bg-[#FAF9F6] border border-[#171512]/10 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#171512]">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#171512]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <a
                    href={`tel:${founder.phone.replace(/\s+/g, '')}`}
                    className="flex items-center space-x-2 text-[#748C8C] hover:text-[#566e6e] font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{founder.phone}</span>
                  </a>

                  <a
                    href={`mailto:${founder.email}`}
                    className="flex items-center space-x-2 text-[#6F6255] hover:text-[#171512] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{founder.email}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* PHILOSOPHY & PILLARS SECTION                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'NOTRE MANIFESTE' : 'OUR CORE PILLARS'}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-light text-[#171512]">
            {language === 'fr' ? 'L\'Excellence en Trois Engagements' : 'Three Uncompromising Commitments'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-[#171512]/10 shadow-sm space-y-4 hover:border-[#748C8C]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-display text-xl font-medium text-[#171512]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6F6255] font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* AGENCY HEADQUARTERS & CONTACT CALLOUT                                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
        <div className="bg-[#171512] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/20 px-3 py-1 rounded-full border border-[#748C8C]/30">
              <MapPin className="w-3 h-3" />
              <span>BORDEAUX CHARTRONS</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-5xl font-light text-white leading-tight">
              {language === 'fr' ? (
                <>Échangeons autour de votre <span className="italic font-normal text-[#748C8C]">projet patrimonial.</span></>
              ) : (
                <>Let's discuss your <span className="italic font-normal text-[#748C8C]">property portfolio.</span></>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#A2B2B2] font-light leading-relaxed">
              {language === 'fr'
                ? 'Nous vous accueillons au 38 Cours Portal à Bordeaux pour une estimation personnalisée ou une étude complète de mise en gestion.'
                : 'Visit us at 38 Cours Portal in Bordeaux Chartrons for a private valuation consultation or comprehensive management review.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto z-10 shrink-0">
            <Link
              href="/estimation"
              className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-4 rounded-full font-semibold text-xs transition-all duration-300 shadow-brand text-center flex items-center justify-center space-x-2"
            >
              <span>{language === 'fr' ? 'Estimer mon bien' : 'Valuate Property'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="border border-white/20 hover:bg-white hover:text-[#171512] text-white px-8 py-4 rounded-full font-semibold text-xs transition-all duration-300 text-center"
            >
              {language === 'fr' ? 'Nous contacter' : 'Contact Agency'}
            </Link>
          </div>

          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#748C8C]/20 blur-[120px] rounded-full pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
