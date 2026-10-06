'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  ArrowUpRight, CheckCircle2, Calculator, ShieldCheck, Tag, Key, Phone, Mail, FileText, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CORE_SERVICES } from '@/data/services';
import EntrustPropertyModal from '@/components/layout/EntrustPropertyModal';

export default function GestionLocativePage() {
  const { language, t } = useLanguage();
  const [isEntrustModalOpen, setIsEntrustModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<'Rental management' | 'Property letting' | 'Rental valuation' | 'Property sales'>('Rental management');

  // Active Simulator Service Tab
  const [simService, setSimService] = useState<'gestion' | 'vente' | 'location'>('gestion');

  // 1. Gestion Locative Calculator State (6.5% fee)
  const [rentAmount, setRentAmount] = useState(1350);
  const feePercentage = 6.5;
  const managementFee = Math.round((rentAmount * feePercentage) / 100);
  const netIncome = rentAmount - managementFee;

  // 2. Vente Immobilière Calculator State (Degressive scale)
  const [salePrice, setSalePrice] = useState(350000);
  const getSaleRate = (price: number) => {
    if (price <= 150000) return 6;
    if (price <= 250000) return 5.5;
    if (price <= 400000) return 5;
    if (price <= 600000) return 4.5;
    if (price <= 900000) return 4;
    if (price <= 1500000) return 3.5;
    return 3;
  };
  const saleRate = getSaleRate(salePrice);
  const rawSaleFee = Math.round((salePrice * saleRate) / 100);
  const saleFee = Math.max(6000, rawSaleFee);
  const netSeller = salePrice - saleFee;
  const isMinSaleFee = saleFee === 6000 && rawSaleFee < 6000;

  // 3. Mise en Location Calculator State (13.12 € / m²)
  const [surface, setSurface] = useState(50);
  const locationVisiteFee = Math.round(surface * 10.09 * 100) / 100;
  const locationEtatFee = Math.round(surface * 3.03 * 100) / 100;
  const locationTotalFee = Math.round(surface * 13.12 * 100) / 100;

  const openEntrust = (service: 'Rental management' | 'Property letting' | 'Rental valuation' | 'Property sales') => {
    setSelectedService(service);
    setIsEntrustModalOpen(true);
  };

  return (
    <div className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-20">
      
      {/* Header & Breadcrumbs Group */}
      <div className="space-y-7 sm:space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: language === 'fr' ? 'Nos Services & Solutions Bailleurs' : 'Our Services & Owner Solutions' }]} />

        {/* Editorial Header */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-3.5 py-1 rounded-full border border-[#748C8C]/30">
            <span className="w-2 h-2 rounded-full bg-[#748C8C]" />
            <span>{language === 'fr' ? 'SOLUTIONS PROPRIÉTAIRES & BAILLEURS BORDEAUX' : 'BORDEAUX OWNER & LANDLORD SOLUTIONS'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-7xl font-light text-[#171512] leading-[1.08]">
            {language === 'fr' ? 'Des services immobiliers haut de gamme, sans contraintes.' : 'Luxury real estate services designed for peace of mind.'}
          </h1>

          <p className="text-base sm:text-xl text-[#6F6255] font-light leading-relaxed">
            {language === 'fr'
              ? 'Libérez-vous de l\'intégralité des contraintes administratives, techniques et juridiques. Nous garantissons la valorisation de votre patrimoine bordelais et le versement ponctuel de vos loyers chaque 1er du mois.'
              : 'Free yourself completely from administrative, legal, and maintenance burdens. We optimize your Bordeaux portfolio yield and guarantee punctual rent disbursements on the 1st of every month.'}
          </p>

          {/* Top Direct Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => openEntrust('Rental management')}
              className="bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 px-6 rounded-full font-semibold text-xs transition-all shadow-brand flex items-center space-x-2"
            >
              <span>{t('btnEntrust')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <Link
              href="/estimation"
              className="bg-white hover:bg-[#FAF9F6] text-[#171512] border border-[#171512]/20 py-3.5 px-6 rounded-full font-semibold text-xs transition-all shadow-2xs flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4 text-[#748C8C]" />
              <span>{t('btnRentalValuation')}</span>
            </Link>

            <Link
              href="/contact"
              className="text-xs font-semibold text-[#6F6255] hover:text-[#171512] px-4 py-3.5 transition-colors"
            >
              {t('btnContactUs')} →
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Core Services for Property Owners - Dynamically Matched with Homepage */}
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#748C8C]">
            {t('servicesBadge')}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-light text-[#171512]">
            {t('servicesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6255] max-w-2xl font-light">
            {language === 'fr'
              ? 'Gestion locative, vente immobilière et mise en location : un accompagnement sur-mesure pour valoriser et sécuriser votre patrimoine bordelais.'
              : 'Property management, real estate sales, and lettings: tailored advisory and execution to maximize and protect your Bordeaux real estate assets.'}
          </p>
        </div>

        {/* 3 Core Services Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CORE_SERVICES.map((service, index) => {
            const Icon = service.icon;
            const badgeColor = 
              service.id === 'gestion-locative'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : service.id === 'vente-immobiliere'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 sm:p-9 rounded-3xl border border-[#171512]/10 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-xl hover:border-[#748C8C]/40 transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${badgeColor}`}>
                      {service.badge[language]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#748C8C] uppercase tracking-wider block">
                      {service.subtitle[language]}
                    </span>
                    <h3 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#171512]">
                      {service.title[language]}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#171512]/85 leading-relaxed">
                    {service.shortDescription[language]}
                  </p>

                  <p className="text-xs text-[#6F6255] leading-relaxed pt-1">
                    {service.fullDescription[language]}
                  </p>

                  <div className="pt-4 border-t border-[#171512]/10 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C] block">
                      {language === 'fr' ? 'Engagements & Prestations :' : 'Deliverables & Guarantees:'}
                    </span>
                    <ul className="space-y-2 text-xs text-[#171512]">
                      {service.deliverables[language].map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#748C8C] shrink-0 mt-0.5" />
                          <span className="leading-snug text-[#2C2723]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* All 3 Buttons in signature Brand Green Gradient */}
                <div className="pt-4">
                  {service.id === 'gestion-locative' ? (
                    <button
                      onClick={() => openEntrust('Rental management')}
                      className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
                    >
                      <span>{service.ctaButton[language]}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : service.id === 'vente-immobiliere' ? (
                    <button
                      onClick={() => openEntrust('Property sales')}
                      className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
                    >
                      <span>{service.ctaButton[language]}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openEntrust('Property letting')}
                      className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
                    >
                      <span>{service.ctaButton[language]}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Interactive Fee Transparency & Simulators for ALL 3 Services             */}
      {/* ========================================================================= */}
      <div className="bg-[#171512] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/10 space-y-10">
        
        {/* Header & Service Tab Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
              <Calculator className="w-4 h-4" />
              <span>{language === 'fr' ? 'SIMULATEUR & TRANSPARENCE TARIFAIRE' : 'SIMULATOR & COMPLETE FEE TRANSPARENCY'}</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-light">
              {language === 'fr' ? 'Transparence totale sur nos honoraires.' : 'Complete fee transparency.'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9E9285] leading-relaxed font-light">
              {language === 'fr'
                ? 'Consultez en direct nos barèmes et simulez vos honoraires pour chacun de nos 3 services : gestion locative (6,5%), vente immobilière et mise en location (13,12€/m²).'
                : 'Directly check our rates and calculate exact fees for each of our 3 services: rental management (6.5%), real estate sales, and letting (13.12€/sqm).'}
            </p>
          </div>

          {/* 3 Interactive Service Pills */}
          <div className="flex flex-wrap sm:flex-nowrap p-1.5 rounded-2xl bg-white/5 border border-white/15 gap-1.5 shrink-0">
            <button
              onClick={() => setSimService('gestion')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                simService === 'gestion'
                  ? 'bg-brand-gradient text-white shadow-brand'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Gestion Locative (6,5%)' : 'Management (6.5%)'}</span>
            </button>

            <button
              onClick={() => setSimService('vente')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                simService === 'vente'
                  ? 'bg-brand-gradient text-white shadow-brand'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Vente Immobilière' : 'Property Sales'}</span>
            </button>

            <button
              onClick={() => setSimService('location')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                simService === 'location'
                  ? 'bg-brand-gradient text-white shadow-brand'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Mise en Location' : 'Property Letting'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Gestion Locative Simulator */}
        {simService === 'gestion' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                  {language === 'fr' ? 'MANDAT DE GESTION LOCATIVE' : 'RENTAL MANAGEMENT MANDATE'}
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-white">
                  {language === 'fr' ? 'Simulez vos revenus nets de gestion' : 'Simulate your net management income'}
                </h3>
                <p className="text-xs text-[#9E9285] leading-relaxed">
                  {language === 'fr'
                    ? 'Nos honoraires de gestion locative sont fixés à 6,5% TTC. 100% de nos honoraires sont déductibles de vos revenus fonciers.'
                    : 'Our rental management fees are set at 6.5% incl. VAT. 100% of our fees are deductible from your property taxes.'}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white/90">{language === 'fr' ? 'Loyer mensuel charges comprises :' : 'Estimated monthly rent:'}</span>
                  <span className="font-serif-display text-2xl sm:text-3xl text-[#EAE6DF]">{rentAmount.toLocaleString('fr-FR')} € / {language === 'fr' ? 'mois' : 'mo'}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="4500"
                  step="50"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(parseInt(e.target.value, 10))}
                  className="w-full accent-[#748C8C] cursor-pointer h-2 bg-white/20 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#9E9285]">
                  <span>500 €</span>
                  <span>2 500 €</span>
                  <span>4 500 €</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs text-[#A2B2B2]">
                <div className="flex items-center space-x-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#748C8C] shrink-0" />
                  <span className="font-medium">{language === 'fr' ? 'Honoraires de gestion : 6,5 % TTC (non 6,8%)' : 'Management fees: 6.5% incl. VAT'}</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#748C8C] shrink-0" />
                  <span className="font-medium">{language === 'fr' ? 'Garantie loyer impayé GarantMe à 2,9 % d\'un mois de loyer' : 'GarantMe rent default guarantee at 2.9%'}</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 space-y-6 text-center shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9285]">
                {language === 'fr' ? 'REVENU NET MENSUEL ESTIMÉ PROPRIÉTAIRE' : 'ESTIMATED NET MONTHLY OWNER INCOME'}
              </span>
              <div className="font-serif-display text-5xl font-bold text-[#EAE6DF]">
                {netIncome.toLocaleString('fr-FR')} € <span className="text-sm font-light text-white/70">/ {language === 'fr' ? 'mois' : 'mo'}</span>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-[#9E9285]">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? `Honoraires (${feePercentage}%)` : `Management (${feePercentage}%)`}</span>
                  <span className="font-semibold text-white text-base">{managementFee} € / {language === 'fr' ? 'mois' : 'mo'}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? 'Garantie GarantMe' : 'GarantMe Insurance'}</span>
                  <span className="font-semibold text-emerald-400 text-base">{language === 'fr' ? 'Option 2,9%' : '2.9% Option'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openEntrust('Rental management')}
                  className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
                >
                  <span>{language === 'fr' ? 'Confier mon bien en gestion' : 'Entrust Property for Management'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-white/50">
                  {language === 'fr' ? 'Sans engagement • Réponse sous 2h ouvrées' : 'No obligation • Callback within 2 hours'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Vente Immobilière Simulator & Official Fee Scale */}
        {simService === 'vente' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                    {language === 'fr' ? 'TRANSACTION IMMOBILIÈRE' : 'REAL ESTATE TRANSACTION'}
                  </span>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-white">
                    {language === 'fr' ? 'Simulez le prix net vendeur de votre bien' : 'Simulate net proceeds from your sale'}
                  </h3>
                  <p className="text-xs text-[#9E9285] leading-relaxed">
                    {language === 'fr'
                      ? 'Les honoraires de vente dépendent du prix du bien selon notre barème officiel non cumulatif (de 3% à 6% TTC, minimum 6 000€ TTC).'
                      : 'Sales fees depend on property price according to our non-cumulative fee schedule (from 3% to 6% incl. VAT, min 6,000€).'}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-white/90">{language === 'fr' ? 'Prix de vente estimé :' : 'Estimated sale price:'}</span>
                    <span className="font-serif-display text-2xl sm:text-3xl text-[#EAE6DF]">{salePrice.toLocaleString('fr-FR')} €</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="10000"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseInt(e.target.value, 10))}
                    className="w-full accent-[#748C8C] cursor-pointer h-2 bg-white/20 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-[#9E9285]">
                    <span>100 000 €</span>
                    <span>1 000 000 €</span>
                    <span>2 000 000 €</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 text-xs text-[#A2B2B2]">
                  <div className="flex items-center justify-between text-white">
                    <span>{language === 'fr' ? 'Tranche tarifaire appliquée :' : 'Applied price bracket:'}</span>
                    <span className="font-bold text-[#748C8C]">{saleRate} % TTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'fr' ? 'Règle de calcul :' : 'Calculation rule:'}</span>
                    <span>{isMinSaleFee ? (language === 'fr' ? 'Honoraires minimum 6 000 € TTC appliqués' : 'Minimum 6,000 € fee applied') : (language === 'fr' ? 'Barème non cumulatif' : 'Non-cumulative schedule')}</span>
                  </div>
                </div>
              </div>

              {/* Calculated Output Box */}
              <div className="lg:col-span-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 space-y-6 text-center shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9285]">
                  {language === 'fr' ? 'PRIX NET VENDEUR ESTIMÉ' : 'ESTIMATED NET SELLER REVENUE'}
                </span>
                <div className="font-serif-display text-5xl font-bold text-[#EAE6DF]">
                  {netSeller.toLocaleString('fr-FR')} €
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-[#9E9285]">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? `Honoraires TTC (${saleRate}%)` : `Agency Fees (${saleRate}%)`}</span>
                    <span className="font-semibold text-white text-base">{saleFee.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? 'Accompagnement' : 'Service'}</span>
                    <span className="font-semibold text-emerald-400 text-base">{language === 'fr' ? 'Clé en main' : 'Turnkey'}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => openEntrust('Property sales')}
                    className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
                  >
                    <span>{language === 'fr' ? 'Vendre un bien avec l\'agence' : 'Sell Property with Us'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-white/50">
                    {language === 'fr' ? 'Estimation vénale offerte • Diffusion ciblée' : 'Free valuation • Targeted exposure'}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Pricing Scale Table - Exact from PDF */}
            <div className="bg-white text-[#171512] rounded-3xl p-6 sm:p-8 border border-[#171512]/10 space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171512]/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#748C8C]/15 text-[#748C8C] flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif-display text-xl font-semibold uppercase tracking-tight text-[#171512]">
                      TRANSACTION IMMOBILIÈRE
                    </h4>
                    <p className="text-xs text-[#6F6255]">Vente de biens immobiliers</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20 self-start sm:self-auto">
                  Barème officiel
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#668080] text-white font-semibold">
                      <th className="py-3 px-4 rounded-l-xl">Prix de vente du bien</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Honoraires TTC maximum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171512]/10 text-[#2C2723]">
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">Jusqu'à 150 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">6 %</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">De 150 001 € à 250 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">5,5 %</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">De 250 001 € à 400 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">5 %</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">De 400 001 € à 600 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">4,5 %</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">De 600 001 € à 900 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">4 %</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">De 900 001 € à 1 500 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">3,5 %</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4">Au-delà de 1 500 000 €</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">3 %</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-[#171512]/10 bg-[#FAF9F6] p-4 rounded-xl space-y-1 text-center">
                <p className="font-bold text-sm text-[#171512]">Honoraires minimum : 6 000 € TTC</p>
                <p className="text-[11px] text-[#6F6255]">Barème non cumulatif : un seul taux s'applique selon le prix de vente du bien.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Mise en Location Simulator & Regulatory Fee Breakdown */}
        {simService === 'location' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                    {language === 'fr' ? 'LOCATION RÈGLEMENTÉE (LOI DU 6 JUILLET 1989)' : 'STATUTORY LETTING SERVICE'}
                  </span>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-white">
                    {language === 'fr' ? 'Simulez les frais de mise en location' : 'Simulate letting service fees'}
                  </h3>
                  <p className="text-xs text-[#9E9285] leading-relaxed">
                    {language === 'fr'
                      ? 'Les honoraires de mise en location sont strictement encadrés par la loi : ils sont toujours de 13,12 € TTC par m² de surface habitable.'
                      : 'Property letting fees are regulated by law: always 13.12 € incl. VAT per sqm of living space.'}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-white/90">{language === 'fr' ? 'Surface habitable du bien :' : 'Living surface area:'}</span>
                    <span className="font-serif-display text-2xl sm:text-3xl text-[#EAE6DF]">{surface} m²</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="200"
                    step="1"
                    value={surface}
                    onChange={(e) => setSurface(parseInt(e.target.value, 10))}
                    className="w-full accent-[#748C8C] cursor-pointer h-2 bg-white/20 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-[#9E9285]">
                    <span>15 m²</span>
                    <span>100 m²</span>
                    <span>200 m²</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs text-[#A2B2B2]">
                  <div className="flex justify-between items-center text-white">
                    <span>Visite, constitution dossier & bail (10,09 € TTC/m²) :</span>
                    <span className="font-semibold text-[#EAE6DF]">{locationVisiteFee.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between items-center text-white">
                    <span>État des lieux d'entrée (3,03 € TTC/m²) :</span>
                    <span className="font-semibold text-[#EAE6DF]">{locationEtatFee.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-[#9E9285]">
                    {language === 'fr' ? 'Plafond légal : 13,12 € TTC / m² au total' : 'Statutory cap: 13.12 € incl. VAT / sqm total'}
                  </div>
                </div>
              </div>

              {/* Calculated Output Box */}
              <div className="lg:col-span-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 space-y-6 text-center shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9285]">
                  {language === 'fr' ? 'HONORAIRES TOTAUX DE MISE EN LOCATION' : 'TOTAL LETTING SERVICE FEES'}
                </span>
                <div className="font-serif-display text-5xl font-bold text-[#EAE6DF]">
                  {locationTotalFee.toLocaleString('fr-FR')} € <span className="text-sm font-light text-white/70">TTC</span>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-[#9E9285]">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase text-white/50">Visite & Bail</span>
                    <span className="font-semibold text-white text-base">10,09 € / m²</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase text-white/50">État des lieux</span>
                    <span className="font-semibold text-white text-base">3,03 € / m²</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => openEntrust('Property letting')}
                    className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
                  >
                    <span>{language === 'fr' ? 'Rechercher un locataire' : 'Find Qualified Tenants'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-white/50">
                    {language === 'fr' ? 'Plafond légal respecté • Candidats vérifiés' : 'Compliant with ALUR law • Vetted applicants'}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Letting Table - Exact from PDF */}
            <div className="bg-white text-[#171512] rounded-3xl p-6 sm:p-8 border border-[#171512]/10 space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171512]/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#748C8C]/15 text-[#748C8C] flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif-display text-xl font-semibold uppercase tracking-tight text-[#171512]">
                      MISE EN LOCATION
                    </h4>
                    <p className="text-xs text-[#6F6255]">Pour les locations d'habitation soumises à la loi du 6 juillet 1989</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20 self-start sm:self-auto">
                  Plafond légal ALUR
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody className="divide-y divide-[#171512]/10 text-[#2C2723]">
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4 font-medium text-[#171512]">Visite, constitution du dossier, rédaction du bail :</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">10,09 € TTC / m²</td>
                    </tr>
                    <tr className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4 font-medium text-[#171512]">État des lieux d'entrée :</td>
                      <td className="py-3 px-4 font-bold text-right text-[#171512]">3,03 € TTC / m²</td>
                    </tr>
                    <tr className="bg-[#668080]/15 font-bold text-[#171512]">
                      <td className="py-3.5 px-4 text-sm">Total maximum :</td>
                      <td className="py-3.5 px-4 text-sm text-right text-[#171512]">13,12 € TTC / m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-[11px] text-[#6F6255] italic text-center">
                La part imputable au locataire respecte les plafonds légaux en vigueur.
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Direct Advisor Contacts Box */}
      <div className="bg-[#FAF9F6] rounded-3xl p-8 sm:p-12 border border-[#171512]/10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'RENCONTREZ L\'ÉQUIPE' : 'MEET THE TEAM'}
          </span>
          <h2 className="font-serif-display text-3xl font-light text-[#171512]">
            {language === 'fr' ? 'Un projet à Bordeaux ? Échangeons dès aujourd\'hui.' : 'Have a property in Bordeaux? Speak with us today.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-[#171512]/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-serif-display text-xl font-medium text-[#171512]">Paul Goizet</span>
              <span className="text-[10px] font-bold text-[#748C8C] bg-[#748C8C]/10 px-2.5 py-0.5 rounded-full">Associé</span>
            </div>
            <p className="text-[#6F6255]">Spécialiste de la gestion locative, de la valorisation des rendements et du cadre juridique bordelais.</p>
            <div className="pt-2 border-t border-[#171512]/5 flex items-center justify-between">
              <a href="tel:+33695577033" className="font-semibold text-[#171512] hover:text-[#748C8C] flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#748C8C]" />
                <span>+33 6 95 57 70 33</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#171512]/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-serif-display text-xl font-medium text-[#171512]">Edgar Goizet</span>
              <span className="text-[10px] font-bold text-[#748C8C] bg-[#748C8C]/10 px-2.5 py-0.5 rounded-full">Associé</span>
            </div>
            <p className="text-[#6F6255]">Spécialiste de la commercialisation, des transactions de prestige et de l'acquisition patrimoniale.</p>
            <div className="pt-2 border-t border-[#171512]/5 flex items-center justify-between">
              <a href="tel:+33781968395" className="font-semibold text-[#171512] hover:text-[#748C8C] flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#748C8C]" />
                <span>+33 7 81 96 83 95</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EntrustPropertyModal
        isOpen={isEntrustModalOpen}
        onClose={() => setIsEntrustModalOpen(false)}
        initialService={selectedService}
      />

    </div>
  );
}
