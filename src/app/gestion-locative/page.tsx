'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ArrowUpRight, ShieldCheck, CheckCircle2, Calculator, Lock, FileCheck2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function GestionLocativePage() {
  const { language, t } = useLanguage();
  const [rentAmount, setRentAmount] = useState(1200);
  const feePercentage = 6.8;
  const managementFee = Math.round((rentAmount * feePercentage) / 100);
  const netIncome = rentAmount - managementFee;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Gestion Locative' : 'Property Management' }]} />

      {/* Editorial Header */}
      <div className="max-w-4xl space-y-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
          {language === 'fr' ? 'MANDAT DE GESTION LOCATIVE SUR-MESURE' : 'BOUTIQUE PROPERTY MANAGEMENT AGREEMENT'}
        </span>
        <h1 className="font-serif-display text-4xl sm:text-7xl font-light text-[#171512] leading-[1.08]">
          {language === 'fr' ? 'Une gestion locative pensée pour vous simplifier la vie.' : 'Property management designed for peace of mind.'}
        </h1>
        <p className="text-base sm:text-xl text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Libérez-vous des contraintes administratives, juridiques et techniques. Nous garantissons la valorisation de votre patrimoine bordelais et le versement ponctuel de vos loyers.'
            : 'Free yourself from administrative, legal, and maintenance burdens. We optimize your Bordeaux portfolio yield and guarantee punctual rent disbursements.'}
        </p>
      </div>

      {/* Interactive ROI & Fee Calculator */}
      <div className="bg-[#171512] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
            <Calculator className="w-4 h-4" />
            <span>{language === 'fr' ? 'CALCULATEUR DE REVENUS NETS' : 'NET INCOME CALCULATOR'}</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-light">
            {language === 'fr' ? 'Transparence totale sur nos honoraires de gestion.' : 'Complete fee transparency.'}
          </h2>

          <p className="text-xs text-[#9E9285] leading-relaxed">
            {language === 'fr'
              ? 'Ajustez votre loyer mensuel estimé pour simuler la rémunération nette versée sur votre compte bancaire chaque 1er du mois.'
              : 'Adjust your estimated monthly rent to simulate net income disbursed to your bank account on the 1st of every month.'}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>{language === 'fr' ? 'Loyer mensuel estimé :' : 'Estimated monthly rent:'}</span>
              <span className="font-serif-display text-2xl text-[#EAE6DF]">{rentAmount.toLocaleString('fr-FR')} € / {language === 'fr' ? 'mois' : 'mo'}</span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="50"
              value={rentAmount}
              onChange={(e) => setRentAmount(parseInt(e.target.value, 10))}
              className="w-full accent-[#7A2234] cursor-pointer h-2 bg-white/20 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#9E9285]">
              <span>500 €</span>
              <span>4 000 €</span>
            </div>
          </div>
        </div>

        {/* Calculated Output Box */}
        <div className="lg:col-span-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 space-y-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9285]">
            {language === 'fr' ? 'REVENU NET PROPRIÉTAIRE ESTIMÉ' : 'ESTIMATED NET OWNER INCOME'}
          </span>
          <div className="font-serif-display text-5xl font-bold text-[#EAE6DF]">
            {netIncome.toLocaleString('fr-FR')} € <span className="text-sm font-light text-white/70">/ {language === 'fr' ? 'mois' : 'mo'}</span>
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-[#9E9285]">
            <div>
              <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? `Honoraires de Gestion (${feePercentage}%)` : `Management Fees (${feePercentage}%)`}</span>
              <span className="font-semibold text-white">{managementFee} € / {language === 'fr' ? 'mois' : 'mo'}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-white/50">{language === 'fr' ? 'Garantie Loyers Impayés (GLI)' : 'Rent Default Insurance'}</span>
              <span className="font-semibold text-white">{language === 'fr' ? 'Inclus sans carence' : 'Included zero delay'}</span>
            </div>
          </div>

          <Link
            href="/estimation"
            className="w-full bg-[#7A2234] hover:bg-[#5C1D27] text-white py-4 rounded-xl font-semibold text-xs transition-all shadow-xl flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <span>{language === 'fr' ? 'Confier mon bien en gestion' : 'Start Management Agreement'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
