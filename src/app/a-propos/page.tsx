'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building, Sparkles, ShieldCheck, HeartHandshake, Award, 
  MapPin, Phone, Mail, ArrowUpRight, CheckCircle2, TrendingUp, Users,
  Clock, Zap, Star
} from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

function AnimatedCounter({
  from = 0,
  to,
  duration = 1.8,
  prefix = '',
  suffix = '',
  decimals = 0
}: {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setValue(decimals > 0 ? parseFloat(latest.toFixed(decimals)) : Math.round(latest));
      }
    });
    return () => controls.stop();
  }, [inView, from, to, duration, decimals]);

  return (
    <span ref={ref} suppressHydrationWarning className="tabular-nums font-serif-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#171512] tracking-tight">
      {prefix}{value.toLocaleString('fr-FR')}{suffix}
    </span>
  );
}

export default function AboutPage() {
  const { language } = useLanguage();

  const founders = [
    {
      name: 'Paul Goizet',
      role: language === 'fr' ? 'Fondateur & Directeur Associé' : 'Founder & Managing Partner',
      image: '/paul-goizet.jpg',
      phone: '+33 6 95 57 70 33',
      email: 'goizetgestion@gmail.com',
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
      email: 'goizetgestion@gmail.com',
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171512] pt-36 sm:pt-40 pb-24">
      
      {/* Editorial Header & Manifesto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header & Breadcrumbs Group */}
        <div className="space-y-7 sm:space-y-8">
          <Breadcrumbs items={[{ label: language === 'fr' ? 'À Propos' : 'About Us' }]} />

          {/* Top Manifesto Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3.5 py-1.5 rounded-full border border-[#748C8C]/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'LA MAISON GOIZET GESTION' : 'ABOUT GOIZET GESTION'}</span>
              </div>

              <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-light text-[#171512] leading-[1.08] tracking-tight">
                {language === 'fr' ? (
                  <>Nos chiffres traduisent l’investissement <span className="font-normal italic text-[#748C8C]">pour nos clients.</span></>
                ) : (
                  <>Our numbers reflect our dedication <span className="font-normal italic text-[#748C8C]">to our clients.</span></>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#6F6255] font-light leading-relaxed max-w-2xl">
                {language === 'fr' ? (
                  <>Fondée à Bordeaux au cœur du quartier Fondaudège, nous reconstruisons la relation entre propriétaires et locataires avec une réactivité irréprochable.</>
                ) : (
                  <>Founded in Bordeaux in the heart of the Fondaudège district, we rebuild the relationship between owners and tenants with flawless responsiveness.</>
                )}
              </p>
            </div>

            {/* District Heritage Card */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-[#171512]/10 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#748C8C]">
                <MapPin className="w-4 h-4" />
                <span className="uppercase tracking-widest text-[10px] font-bold">Bordeaux • Fondaudège</span>
              </div>
              <p className="text-xs text-[#6F6255] leading-relaxed">
                {language === 'fr'
                  ? 'Une présence locale ancrée, au plus près des propriétaires et des locataires des plus beaux quartiers bordelais.'
                  : 'Deep local roots across Bordeaux’s most prestigious historic districts.'}
              </p>
              <div className="pt-3 border-t border-[#171512]/5 flex items-center justify-between text-[11px] font-semibold text-[#171512]">
                <span>48 rue Calvé, 33000 Bordeaux</span>
                <span className="inline-flex items-center space-x-1 text-[#748C8C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'fr' ? 'Boutique ouverte' : 'Office open'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern 3-Card Animated Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Stat 1: 100% Satisfaction */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group bg-white/95 backdrop-blur-md p-8 sm:p-9 rounded-3xl border border-[#171512]/10 hover:border-[#748C8C]/40 shadow-[0_8px_30px_rgba(23,21,18,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                  {language === 'fr' ? 'Excellence' : 'Top Tier'}
                </span>
              </div>

              <div className="pt-2">
                <AnimatedCounter from={0} to={100} suffix="%" duration={1.6} />
                <h3 className="text-sm font-semibold text-[#171512] mt-2 block tracking-tight">
                  {language === 'fr' ? 'Taux de satisfaction client' : 'Client satisfaction rate'}
                </h3>
                <p className="text-xs text-[#6F6255] leading-relaxed mt-1 font-light">
                  {language === 'fr'
                    ? '100% de nos propriétaires et locataires recommandent l’accompagnement de la maison.'
                    : '100% of our clients recommend our bespoke management and advisory.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#171512]/5 flex items-center space-x-2 text-[11px] font-medium text-[#748C8C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Indice de fidélité maximal' : 'Maximum retention rate'}</span>
            </div>
          </motion.div>

          {/* Stat 2: 0% Impayés */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group bg-white/95 backdrop-blur-md p-8 sm:p-9 rounded-3xl border border-[#171512]/10 hover:border-[#748C8C]/40 shadow-[0_8px_30px_rgba(23,21,18,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#3D5252] border border-[#748C8C]/30 px-3 py-1 rounded-full">
                  {language === 'fr' ? 'Sécurité 100%' : '100% Secure'}
                </span>
              </div>

              <div className="pt-2">
                <AnimatedCounter from={6} to={0} suffix=" %" duration={1.5} />
                <h3 className="text-sm font-semibold text-[#171512] mt-2 block tracking-tight">
                  {language === 'fr' ? 'Taux de loyers impayés' : 'Unpaid rent rate'}
                </h3>
                <p className="text-xs text-[#6F6255] leading-relaxed mt-1 font-light">
                  {language === 'fr'
                    ? 'Sélection intransigeante des dossiers et assurance GLI intégrée sans délai ni carence.'
                    : 'Uncompromising candidate vetting and zero-delay rent default guarantee.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#171512]/5 flex items-center space-x-2 text-[11px] font-medium text-[#748C8C]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Loyers garantis dès le 1er du mois' : 'Disbursed on the 1st of every month'}</span>
            </div>
          </motion.div>

          {/* Stat 3: < 1h Réactivité */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group bg-white/95 backdrop-blur-md p-8 sm:p-9 rounded-3xl border border-[#171512]/10 hover:border-[#748C8C]/40 shadow-[0_8px_30px_rgba(23,21,18,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                  {language === 'fr' ? 'Réactivité Immédiate' : 'Immediate Response'}
                </span>
              </div>

              <div className="pt-2">
                <AnimatedCounter from={12} to={1} prefix="< " suffix="h" duration={1.8} />
                <h3 className="text-sm font-semibold text-[#171512] mt-2 block tracking-tight">
                  {language === 'fr' ? 'Délai moyen de réponse' : 'Average response time'}
                </h3>
                <p className="text-xs text-[#6F6255] leading-relaxed mt-1 font-light">
                  {language === 'fr'
                    ? 'Ligne directe avec les fondateurs Paul & Edgar, sans standard vocal ni attente.'
                    : 'Direct WhatsApp and phone line with founders Paul & Edgar, with zero delay.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#171512]/5 flex items-center space-x-2 text-[11px] font-medium text-[#748C8C]">
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Joignable 7 jours sur 7' : 'Available 7 days a week'}</span>
            </div>
          </motion.div>

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
                ? 'Nous vous accueillons au 48 rue Calvé à Bordeaux pour une estimation personnalisée ou une étude complète de mise en gestion.'
                : 'Visit us at 48 rue Calvé in Bordeaux for a private valuation consultation or comprehensive management review.'}
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
