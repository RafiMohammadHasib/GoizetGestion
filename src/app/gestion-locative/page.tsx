'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  ArrowUpRight, CheckCircle2, Calculator, Check, X as XIcon, Phone, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CORE_SERVICES } from '@/data/services';
import EntrustPropertyModal from '@/components/layout/EntrustPropertyModal';

export default function GestionLocativePage() {
  const { language, t } = useLanguage();
  const [rentAmount, setRentAmount] = useState(1350);
  const [isEntrustModalOpen, setIsEntrustModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<'Rental management' | 'Property letting' | 'Rental valuation' | 'Property sales'>('Rental management');

  const feePercentage = 6.8;
  const managementFee = Math.round((rentAmount * feePercentage) / 100);
  const netIncome = rentAmount - managementFee;

  const openEntrust = (service: 'Rental management' | 'Property letting' | 'Rental valuation' | 'Property sales') => {
    setSelectedService(service);
    setIsEntrustModalOpen(true);
  };

  return (
    <div className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-20">
      
      {/* Header & Breadcrumbs Group */}
      <div className="space-y-7 sm:space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: language === 'fr' ? 'Gestion Locative & Solutions Bailleurs' : 'Property Management & Owner Solutions' }]} />

        {/* Editorial Header */}
        <div className="max-w-4xl space-y-6">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-3.5 py-1 rounded-full border border-[#748C8C]/30">
          <span className="w-2 h-2 rounded-full bg-[#748C8C]" />
          <span>{language === 'fr' ? 'SOLUTIONS PROPRIÉTAIRES & BAILLEURS BORDEAUX' : 'BORDEAUX OWNER & LANDLORD SOLUTIONS'}</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-7xl font-light text-[#171512] leading-[1.08]">
          {language === 'fr' ? 'Une gestion locative haut de gamme, sans contraintes.' : 'Luxury property management designed for peace of mind.'}
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
                    <Link
                      href="/contact?subject=vente"
                      className="w-full bg-[#171512] hover:bg-[#2A2622] text-white py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{service.ctaButton[language]}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => openEntrust('Property letting')}
                      className="w-full bg-[#171512] hover:bg-[#2A2622] text-white py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2"
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

      {/* Interactive ROI & Fee Calculator */}
      <div className="bg-[#171512] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
            <Calculator className="w-4 h-4" />
            <span>{language === 'fr' ? 'SIMULATEUR DE REVENUS NETS BAILLEUR' : 'NET OWNER REVENUE SIMULATOR'}</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-light">
            {language === 'fr' ? 'Transparence totale sur nos honoraires.' : 'Complete fee transparency.'}
          </h2>

          <p className="text-xs text-[#9E9285] leading-relaxed">
            {language === 'fr'
              ? 'Ajustez votre loyer mensuel estimé pour simuler la rémunération nette versée sur votre compte bancaire chaque 1er du mois. 100% de nos honoraires sont déductibles de vos revenus fonciers.'
              : 'Adjust your estimated monthly rent to simulate net income disbursed to your bank account on the 1st of every month. 100% of our fees are tax deductible.'}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>{language === 'fr' ? 'Loyer mensuel charges comprises :' : 'Estimated monthly rent:'}</span>
              <span className="font-serif-display text-2xl text-[#EAE6DF]">{rentAmount.toLocaleString('fr-FR')} € / {language === 'fr' ? 'mois' : 'mo'}</span>
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
            <div className="flex justify-between text-[10px] text-[#9E9285]">
              <span>500 €</span>
              <span>4 500 €</span>
            </div>
          </div>
        </div>

        {/* Calculated Output Box */}
        <div className="lg:col-span-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 space-y-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9285]">
            {language === 'fr' ? 'REVENU NET MENSUEL ESTIMÉ PROPRIÉTAIRE' : 'ESTIMATED NET MONTHLY OWNER INCOME'}
          </span>
          <div className="font-serif-display text-5xl font-bold text-[#EAE6DF]">
            {netIncome.toLocaleString('fr-FR')} € <span className="text-sm font-light text-white/70">/ {language === 'fr' ? 'mois' : 'mo'}</span>
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-[#9E9285]">
            <div>
              <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? `Honoraires (${feePercentage}%)` : `Management (${feePercentage}%)`}</span>
              <span className="font-semibold text-white">{managementFee} € / {language === 'fr' ? 'mois' : 'mo'}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? 'Garantie Loyers Impayés (GLI)' : 'Rent Default Insurance'}</span>
              <span className="font-semibold text-emerald-400">{language === 'fr' ? 'Inclus sans carence' : 'Included zero delay'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => openEntrust('Rental management')}
              className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2"
            >
              <span>{language === 'fr' ? 'Confier mon bien avec cette estimation' : 'Entrust My Property With This Estimate'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-white/50">
              {language === 'fr' ? 'Sans engagement • Réponse sous 2h ouvrées' : 'No obligation • Callback within 2 hours'}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-6 pt-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'POURQUOI CHOISIR GOIZET GESTION' : 'WHY CHOOSE GOIZET GESTION'}
          </span>
          <h2 className="font-serif-display text-3xl font-light text-[#171512]">
            {language === 'fr' ? 'Une différence concrète au quotidien' : 'A Measurable Daily Advantage'}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-[#171512]/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#171512]/10 bg-[#FAF9F6]">
                  <th className="p-4 font-semibold text-[#171512]">{language === 'fr' ? 'Prestations & Garanties' : 'Services & Guarantees'}</th>
                  <th className="p-4 font-bold text-[#748C8C] bg-[#748C8C]/10 border-x border-[#748C8C]/20">GOIZET GESTION</th>
                  <th className="p-4 font-semibold text-[#6F6255]">{language === 'fr' ? 'Gestion Personnelle' : 'Self-Management'}</th>
                  <th className="p-4 font-semibold text-[#6F6255]">{language === 'fr' ? 'Agence Traditionnelle' : 'Traditional Agency'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171512]/5 text-[#6F6255]">
                {[
                  { label: language === 'fr' ? 'Interlocuteur unique (Fondateurs)' : 'Dedicated partner (Founders)', us: true, self: true, trad: false },
                  { label: language === 'fr' ? 'Garantie loyers impayés sans carence' : 'Zero-delay rent default insurance', us: true, self: false, trad: true },
                  { label: language === 'fr' ? 'Photos professionnelles HD & Visite 3D' : 'HD photography & 3D virtual tours', us: true, self: false, trad: false },
                  { label: language === 'fr' ? 'Vérification solvabilité IA & humaine' : 'Rigorous solvability screening', us: true, self: false, trad: false },
                  { label: language === 'fr' ? 'Espace bailleur connecté 24/7' : '24/7 digital landlord portal', us: true, self: false, trad: false },
                  { label: language === 'fr' ? 'Honoraires 100% déductibles fiscalement' : '100% tax deductible fees', us: true, self: false, trad: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="p-4 font-medium text-[#171512]">{row.label}</td>
                    <td className="p-4 bg-[#748C8C]/5 border-x border-[#748C8C]/20 text-[#748C8C] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                    </td>
                    <td className="p-4">
                      {row.self ? <Check className="w-4 h-4 text-stone-600" /> : <XIcon className="w-4 h-4 text-stone-300" />}
                    </td>
                    <td className="p-4">
                      {row.trad ? <Check className="w-4 h-4 text-stone-600" /> : <XIcon className="w-4 h-4 text-stone-300" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
