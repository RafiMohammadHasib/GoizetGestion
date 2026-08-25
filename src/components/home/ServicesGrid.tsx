'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Key, ShieldCheck, Tag, Calculator, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesGrid() {
  const { language, t } = useLanguage();

  const services = [
    {
      icon: ShieldCheck,
      title: language === 'fr' ? 'Gestion Locative 360°' : 'Rental Management',
      subtitle: language === 'fr' ? 'Sérénité absolue & Garantie impayés' : 'Complete peace of mind & default insurance',
      description: language === 'fr'
        ? 'Gestion comptable, technique et juridique complète. Garantie des Loyers Impayés (GLI) intégrée sans carence.'
        : 'Full accounting, maintenance, and legal management. Rent Default Insurance included with zero delay.',
      href: '/gestion-locative',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      badge: language === 'fr' ? 'Gestion' : 'Management'
    },
    {
      icon: Key,
      title: language === 'fr' ? 'Mise en Location' : 'Property Letting',
      subtitle: language === 'fr' ? 'Attirer et filtrer les meilleurs locataires' : 'Attracting & vetting top-tier tenants',
      description: language === 'fr'
        ? 'Shooting photo professionnel HD, rédaction d\'annonces premium, diffusion multi-canaux et visites ciblées.'
        : 'HD architectural photography, premium ad copywriting, multi-channel exposure, and vetted viewings.',
      href: '/confier-un-bien',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      badge: language === 'fr' ? 'Bailleurs' : 'Landlords'
    },
    {
      icon: Calculator,
      title: language === 'fr' ? 'Estimation Immobilière' : 'Rental Valuation',
      subtitle: language === 'fr' ? 'Évaluation locative & vente en 48h' : '48-hour rental & sales valuation report',
      description: language === 'fr'
        ? 'Estimation précise de votre valeur locative ou de vente selon les dernières transactions de votre quartier.'
        : 'Accurate rental or sales estimation tailored to recent transactions in your specific neighborhood.',
      href: '/estimation',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      badge: language === 'fr' ? 'Offert' : 'Free'
    },
    {
      icon: Tag,
      title: language === 'fr' ? 'Vente Immobilier de Prestige' : 'Property Sales',
      subtitle: language === 'fr' ? 'Valorisation & Transaction sur-mesure' : 'Bespoke Valuation & Advisory',
      description: language === 'fr'
        ? 'Accompagnement dédié pour la vente de votre appartement ou échoppe bordelaise au prix fort du marché.'
        : 'Tailored advisory to market and sell your apartment or Bordeaux townhouse at premium market value.',
      href: '/contact?subject=vente',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      badge: language === 'fr' ? 'Transaction' : 'Sales'
    },
    {
      icon: UserCheck,
      title: language === 'fr' ? 'Recherche Locative VIP' : 'Executive Tenant Search',
      subtitle: language === 'fr' ? 'Accompagnement candidats' : 'Boutique candidate service',
      description: language === 'fr'
        ? 'Service sur-mesure pour futurs locataires et cadres en mobilité professionnelle à Bordeaux.'
        : 'Boutique search service for corporate executives and qualified tenants relocating to Bordeaux.',
      href: '/biens?type=louer',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      badge: language === 'fr' ? 'Locataires' : 'Tenants'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-y border-[#171512]/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
              {t('servicesBadge')}
            </span>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
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

        {/* Services Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                data-cursor="DÉCOUVRIR"
              >
                {/* Top Image Preview */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/70 via-transparent to-transparent" />
                  
                  <div suppressHydrationWarning className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#171512] whitespace-nowrap">
                    {service.badge}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span suppressHydrationWarning className="text-xs font-light text-white/80 truncate pl-2">{service.subtitle}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 suppressHydrationWarning className="font-serif-display text-2xl font-medium text-[#171512] group-hover:text-[#748C8C] transition-colors">
                      {service.title}
                    </h3>
                    <p suppressHydrationWarning className="text-xs text-[#6F6255] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#171512]/5 flex items-center justify-between">
                    <Link
                      href={service.href}
                      className="text-xs font-semibold text-[#171512] group-hover:text-[#748C8C] inline-flex items-center space-x-1.5 transition-colors whitespace-nowrap"
                    >
                      <span>{language === 'fr' ? 'En savoir plus' : 'Learn More'}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
