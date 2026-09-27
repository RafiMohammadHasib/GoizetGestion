'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Home, Building2, Phone, User, CheckCircle2, Loader2, Sparkles, Building, Euro, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const { t, language } = useLanguage();

  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Main navigation between the two required sections: Property Owner & Tenant / Buyer
  const [mainSection, setMainSection] = useState<'owner' | 'tenant'>('owner');

  // Owner options: "Rent out my property" vs "Sell my property"
  const [ownerOption, setOwnerOption] = useState<'rent_out' | 'sell'>('rent_out');

  // Tenant / Buyer options: "Rent a property" vs "Buy a property"
  const [tenantOption, setTenantOption] = useState<'rent' | 'buy'>('rent');

  // Form State: Property Owner
  const [ownerFullName, setOwnerFullName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerPropertyType, setOwnerPropertyType] = useState('appartement');
  const [ownerMessage, setOwnerMessage] = useState('');

  // Form State: Tenant / Buyer
  const [tenantFullName, setTenantFullName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantPropertyType, setTenantPropertyType] = useState('appartement');
  const [tenantBudget, setTenantBudget] = useState('');
  const [tenantBedrooms, setTenantBedrooms] = useState('2');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!heroImageRef.current || !heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(heroImageRef.current, {
        scale: 1.2,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!ownerFullName.trim()) {
      setErrorMessage(language === 'fr' ? 'Veuillez saisir votre nom et prénom.' : 'Please enter your full name.');
      return;
    }
    if (!ownerPhone.trim()) {
      setErrorMessage(language === 'fr' ? 'Veuillez saisir votre numéro de téléphone.' : 'Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/owner-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: ownerFullName,
          phone: ownerPhone,
          propertyType: ownerPropertyType,
          message: ownerMessage,
          serviceType: ownerOption === 'rent_out' ? 'Rent out my property' : 'Sell my property',
          source: 'Hero Lead Form - Espace Propriétaire'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la soumission');

      setSubmitted(true);
      setOwnerFullName('');
      setOwnerPhone('');
      setOwnerMessage('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!tenantFullName.trim()) {
      setErrorMessage(language === 'fr' ? 'Veuillez saisir votre nom et prénom.' : 'Please enter your full name.');
      return;
    }
    if (!tenantPhone.trim()) {
      setErrorMessage(language === 'fr' ? 'Veuillez saisir votre numéro de téléphone.' : 'Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      const serviceName = tenantOption === 'rent' ? 'Rent a property' : 'Buy a property';
      const detailMessage = `Recherche: ${tenantOption === 'rent' ? 'Location' : 'Achat'} • Type: ${tenantPropertyType} • Budget max: ${tenantBudget || 'Non spécifié'} € • Nb chambres: ${tenantBedrooms}`;

      const res = await fetch('/api/owner-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: tenantFullName,
          phone: tenantPhone,
          propertyType: tenantPropertyType,
          budget: tenantBudget,
          rooms: tenantBedrooms,
          message: detailMessage,
          serviceType: serviceName,
          source: 'Hero Lead Form - Espace Locataire/Acheteur'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la soumission');

      setSubmitted(true);
      setTenantFullName('');
      setTenantPhone('');
      setTenantBudget('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      ref={heroSectionRef} 
      className="relative z-20 min-h-screen lg:h-screen lg:max-h-[960px] flex flex-col justify-center pt-24 pb-8 sm:pt-28 sm:pb-10 px-4 sm:px-6 lg:px-8 bg-[#171512] overflow-hidden"
    >
      {/* Background High-End Architectural Image with GSAP Scroll Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={heroImageRef}
          src="/images/hero.jpg"
          alt="Luxury Haussmannian Bordeaux Architecture"
          className="w-full h-full object-cover opacity-55 scale-105 origin-center will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/45 to-[#171512]/75" />
      </div>

      <div className="relative z-20 max-w-5xl w-full mx-auto space-y-6 sm:space-y-7 my-auto">
        
        {/* Editorial Headline Block - Tight, Elegant, Above-The-Fold Proportions */}
        <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#F7F5F0]/90 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#748C8C]" />
            <span>{t('heroBadge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.06] tracking-tight"
          >
            {t('heroTitleLine1')}{' '}
            <span className="italic font-normal text-[#EAE6DF]">{t('heroTitleLine2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm text-[#B5ABA0] max-w-2xl font-light leading-relaxed hidden sm:block"
          >
            {t('heroSub')}
          </motion.p>
        </div>

        {/* Anchor point for smooth scrolling */}
        <div id="lead-section" className="scroll-mt-24" />

        {/* High-End Glassmorphic Lead Capture Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-40 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/90 text-[#171512]"
        >
          {/* Header Bar: Integrated Role Selector & Intent Sub-options */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#171512]/10 pb-3 mb-4">
            
            {/* Main Segmented Toggle: Owner vs Tenant */}
            <div className="flex bg-[#EAE6DF]/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMainSection('owner');
                  setSubmitted(false);
                  setErrorMessage('');
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  mainSection === 'owner'
                    ? 'bg-[#171512] text-white shadow-xs'
                    : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${mainSection === 'owner' ? 'text-[#748C8C]' : 'text-[#6F6255]'}`} />
                <span>{language === 'fr' ? 'Espace Propriétaire' : 'Property Owner'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMainSection('tenant');
                  setSubmitted(false);
                  setErrorMessage('');
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  mainSection === 'tenant'
                    ? 'bg-[#171512] text-white shadow-xs'
                    : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                <Home className={`w-3.5 h-3.5 ${mainSection === 'tenant' ? 'text-[#748C8C]' : 'text-[#6F6255]'}`} />
                <span>{language === 'fr' ? 'Locataire / Acheteur' : 'Tenant / Buyer'}</span>
              </button>
            </div>

            {/* Sub-Option Switcher (Inline on the right) */}
            <div className="flex items-center space-x-1.5 self-center sm:self-auto bg-[#FAF9F6] p-1 rounded-lg border border-[#171512]/10">
              {mainSection === 'owner' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setOwnerOption('rent_out')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      ownerOption === 'rent_out'
                        ? 'bg-[#748C8C] text-white shadow-xs'
                        : 'text-[#6F6255] hover:text-[#171512]'
                    }`}
                  >
                    {language === 'fr' ? 'Louer mon bien' : 'Rent out property'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOwnerOption('sell')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      ownerOption === 'sell'
                        ? 'bg-[#748C8C] text-white shadow-xs'
                        : 'text-[#6F6255] hover:text-[#171512]'
                    }`}
                  >
                    {language === 'fr' ? 'Vendre mon bien' : 'Sell property'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setTenantOption('rent')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      tenantOption === 'rent'
                        ? 'bg-[#748C8C] text-white shadow-xs'
                        : 'text-[#6F6255] hover:text-[#171512]'
                    }`}
                  >
                    {language === 'fr' ? 'Louer un bien' : 'Rent a property'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenantOption('buy')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      tenantOption === 'buy'
                        ? 'bg-[#748C8C] text-white shadow-xs'
                        : 'text-[#6F6255] hover:text-[#171512]'
                    }`}
                  >
                    {language === 'fr' ? 'Acheter un bien' : 'Buy a property'}
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Submission Feedback Toast */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 bg-[#748C8C]/15 border border-[#748C8C]/30 rounded-xl text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#748C8C] text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif-display text-lg font-semibold text-[#171512]">
                  {language === 'fr' ? 'Demande bien reçue !' : 'Request Received!'}
                </h3>
                <p className="text-xs text-[#6F6255] max-w-sm mx-auto">
                  {language === 'fr'
                    ? 'Un associé de Goizet Gestion analyse votre demande et vous rappelle sous 2 heures.'
                    : 'A Goizet Gestion managing partner will contact you within 2 hours.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-[11px] font-semibold text-[#748C8C] hover:underline pt-1"
                >
                  {language === 'fr' ? 'Envoyer une autre demande' : 'Submit another request'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!submitted && (
            <div>
              {/* SECTION 1: OWNER FORM (Compact 2-Row Grid) */}
              {mainSection === 'owner' && (
                <form onSubmit={handleOwnerSubmit} className="space-y-3">
                  
                  {/* Row 1: 3 Essential Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    
                    {/* 1. Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <User className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Nom et prénom' : 'First & Last Name'} *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerFullName}
                        onChange={(e) => setOwnerFullName(e.target.value)}
                        placeholder={language === 'fr' ? 'ex: Jean Dupont' : 'e.g. John Doe'}
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden"
                      />
                    </div>

                    {/* 2. Property Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <Building className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Type de bien' : 'Property Type'}</span>
                      </label>
                      <select
                        value={ownerPropertyType}
                        onChange={(e) => setOwnerPropertyType(e.target.value)}
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden cursor-pointer"
                      >
                        <option value="appartement">{language === 'fr' ? 'Appartement' : 'Apartment'}</option>
                        <option value="maison">{language === 'fr' ? 'Maison / Villa' : 'House / Villa'}</option>
                        <option value="immeuble">{language === 'fr' ? 'Immeuble' : 'Building'}</option>
                      </select>
                    </div>

                    {/* 3. Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Téléphone' : 'Phone Number'} *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder={language === 'fr' ? '06 12 34 56 78' : '+33 6 12 34 56 78'}
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden"
                      />
                    </div>

                  </div>

                  {/* Row 2: Additional Info + Submit Button side-by-side on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-0.5">
                    
                    {/* Additional info compact input */}
                    <div className="sm:col-span-8 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <span>{language === 'fr' ? 'Informations complémentaires' : 'Additional Information'}</span>
                      </label>
                      <input
                        type="text"
                        value={ownerMessage}
                        onChange={(e) => setOwnerMessage(e.target.value)}
                        placeholder={
                          language === 'fr'
                            ? 'ex: Appartement de 70 m² à louer sous 2 semaines…'
                            : 'e.g. 70 m² apartment to rent out within 2 weeks…'
                        }
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="sm:col-span-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-xl text-xs font-semibold transition-all duration-300 shadow-brand flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{language === 'fr' ? 'Envoi…' : 'Submitting…'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {ownerOption === 'rent_out'
                                ? (language === 'fr' ? 'Estimer mon loyer' : 'Estimate Rent')
                                : (language === 'fr' ? 'Estimer mon bien' : 'Estimate Value')}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {errorMessage && (
                    <p className="text-[11px] text-red-600 pt-1">{errorMessage}</p>
                  )}

                  {/* Micro reassurance strip */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#6F6255]">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-[#748C8C]" />
                      <span>{language === 'fr' ? 'Confidentialité assurée • Réponse garantie sous 2h' : '100% Confidential • Contact within 2h'}</span>
                    </span>
                    <span className="hidden sm:inline text-[#748C8C] font-semibold">
                      {language === 'fr' ? 'Goizet Gestion Bordeaux' : 'Goizet Gestion Bordeaux'}
                    </span>
                  </div>

                </form>
              )}

              {/* SECTION 2: TENANT / BUYER FORM (Compact 2-Row Grid) */}
              {mainSection === 'tenant' && (
                <form onSubmit={handleTenantSubmit} className="space-y-3">
                  
                  {/* Row 1: 3 Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <User className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Nom et prénom' : 'First & Last Name'} *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tenantFullName}
                        onChange={(e) => setTenantFullName(e.target.value)}
                        placeholder={language === 'fr' ? 'ex: Marie Legrand' : 'e.g. Marie Smith'}
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Téléphone' : 'Phone Number'} *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        placeholder={language === 'fr' ? '06 98 76 54 32' : '+33 6 98 76 54 32'}
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden"
                      />
                    </div>

                    {/* Property Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <Home className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Type de bien' : 'Property Type'}</span>
                      </label>
                      <select
                        value={tenantPropertyType}
                        onChange={(e) => setTenantPropertyType(e.target.value)}
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden cursor-pointer"
                      >
                        <option value="appartement">{language === 'fr' ? 'Appartement' : 'Apartment'}</option>
                        <option value="maison">{language === 'fr' ? 'Maison' : 'House'}</option>
                      </select>
                    </div>

                  </div>

                  {/* Row 2: Budget + Bedrooms + Search Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-0.5">
                    
                    {/* Budget max */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] flex items-center space-x-1">
                        <Euro className="w-3 h-3 text-[#748C8C]" />
                        <span>{language === 'fr' ? 'Budget max (€)' : 'Max Budget (€)'}</span>
                      </label>
                      <input
                        type="text"
                        value={tenantBudget}
                        onChange={(e) => setTenantBudget(e.target.value)}
                        placeholder={
                          tenantOption === 'rent'
                            ? (language === 'fr' ? 'ex: 1 500 €' : 'e.g. 1,500 €')
                            : (language === 'fr' ? 'ex: 450 000 €' : 'e.g. 450,000 €')
                        }
                        className="w-full h-10 bg-white/90 border border-[#171512]/15 focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] text-[#171512] text-xs rounded-xl px-3 transition-all outline-hidden"
                      />
                    </div>

                    {/* Bedrooms compact pills */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] block">
                        {language === 'fr' ? 'Chambres' : 'Bedrooms'}
                      </label>
                      <div className="grid grid-cols-4 gap-1 h-10">
                        {['1', '2', '3', '4+'].map((beds) => (
                          <button
                            key={beds}
                            type="button"
                            onClick={() => setTenantBedrooms(beds)}
                            className={`h-full text-xs font-semibold rounded-lg border transition-all ${
                              tenantBedrooms === beds
                                ? 'bg-[#171512] text-white border-[#171512] shadow-xs'
                                : 'bg-white/90 text-[#6F6255] border-[#171512]/15 hover:border-[#748C8C]'
                            }`}
                          >
                            {beds}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="sm:col-span-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-xl text-xs font-semibold transition-all duration-300 shadow-brand flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{language === 'fr' ? 'Recherche…' : 'Searching…'}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === 'fr' ? 'Trouver un bien' : 'Find Property'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {errorMessage && (
                    <p className="text-[11px] text-red-600 pt-1">{errorMessage}</p>
                  )}

                  {/* Micro reassurance strip */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#6F6255]">
                    <span>
                      {language === 'fr' ? 'Accès direct aux biens hors marché de Bordeaux' : 'Direct access to off-market Bordeaux opportunities'}
                    </span>
                    <span className="text-[#748C8C] font-semibold">
                      {tenantOption === 'rent' ? (language === 'fr' ? 'Location' : 'Rental') : (language === 'fr' ? 'Achat' : 'Sales')}
                    </span>
                  </div>

                </form>
              )}
            </div>
          )}
        </motion.div>

        {/* Minimal Luxury Trust Indicators Strip (Above-The-Fold) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 pt-1 text-[11px] text-white/70 font-light"
        >
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#748C8C]" />
            <span>{language === 'fr' ? 'Vacance locative minimale' : 'Minimized void periods'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#748C8C]" />
            <span>{language === 'fr' ? 'Garantie loyers impayés 100%' : '100% Guaranteed rent'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#748C8C]" />
            <span>{language === 'fr' ? 'Réponse garantie sous 2h' : 'Guaranteed response in 2h'}</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
