'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Calculator, ArrowRight, CheckCircle2, Building, Home, MapPin, Sparkles, Phone, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeInjection, isValidEmail, isValidPhone } from '@/lib/security';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/ui/CustomSelect';

export default function EstimationPage() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: 'appartement',
    neighborhood: 'chartrons',
    address: '',
    surface: 75,
    rooms: 3,
    condition: 'excellent',
    objective: 'location',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [estimatedYield, setEstimatedYield] = useState<{ rentMin: number; rentMax: number; saleMin: number; saleMax: number } | null>(null);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 3) {
      const cleanFirst = sanitizeInjection(formData.firstName);
      const cleanLast = sanitizeInjection(formData.lastName);
      const cleanEmail = formData.email.trim();
      const cleanPhone = formData.phone.trim();

      if (!cleanFirst || !cleanLast) {
        setErrorMsg(language === 'fr' ? 'Veuillez renseigner votre prénom et nom.' : 'Please enter your first and last name.');
        return;
      }

      if (!isValidEmail(cleanEmail)) {
        setErrorMsg(language === 'fr' ? 'Adresse email invalide.' : 'Invalid email address.');
        return;
      }

      if (!isValidPhone(cleanPhone)) {
        setErrorMsg(language === 'fr' ? 'Numéro de téléphone invalide.' : 'Invalid phone number.');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch('/api/estimation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyType: formData.propertyType,
            neighborhood: formData.neighborhood,
            address: sanitizeInjection(formData.address),
            surface: formData.surface,
            rooms: formData.rooms,
            condition: formData.condition,
            name: `${cleanFirst} ${cleanLast}`,
            firstName: cleanFirst,
            lastName: cleanLast,
            email: cleanEmail,
            phone: cleanPhone
          })
        });

        const data = await res.json();
        if (!res.ok) {
          const serverErr = data.error || '';
          let translatedErr = serverErr;
          if (language === 'en') {
            if (serverErr.includes('Identifiants') || serverErr.includes('email invalides')) {
              translatedErr = 'Invalid name or email address.';
            } else if (serverErr.includes('Trop de requêtes')) {
              translatedErr = 'Too many requests. Please try again in a moment.';
            } else {
              translatedErr = 'Valuation calculation error. Please check your information.';
            }
          }
          throw new Error(translatedErr || (language === 'fr' ? 'Erreur lors du calcul d\'estimation.' : 'Valuation calculation error.'));
        }

        setEstimatedYield(data.valuation);
        setStep(4);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err: any) {
        setErrorMsg(err.message || (language === 'fr' ? 'Erreur lors du calcul d\'estimation.' : 'Valuation calculation error.'));
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Estimation en Ligne' : 'Property Valuation' }]} />

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3.5 py-1 rounded-full border border-[#748C8C]/20 whitespace-nowrap">
          <Calculator className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'ESTIMATION EN LIGNE SÉCURISÉE BORDEAUX' : 'SECURE ONLINE BORDEAUX VALUATION'}</span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Combien vaut votre bien à Bordeaux ?' : 'What is your property worth in Bordeaux?'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Estimez en 2 minutes la valeur locative ou de vente de votre appartement ou échoppe bordelaise.'
            : 'Get a 2-minute rental and sales valuation estimate for your Bordeaux property.'}
        </p>
      </div>

      {/* Multi-step Progress Indicator */}
      <div className="flex items-center justify-between max-w-lg mx-auto relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#171512]/10 -translate-y-1/2 z-0" />
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`relative z-10 w-9 h-9 rounded-full font-semibold text-xs flex items-center justify-center transition-all ${
              step >= num
                ? 'bg-brand-gradient text-white shadow-brand'
                : 'bg-white text-[#6F6255] border border-[#171512]/20'
            }`}
          >
            {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2 max-w-lg mx-auto">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Multi-Step Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#171512]/10 shadow-2xl relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1 */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNextStep}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                  {language === 'fr' ? 'Étape 1 sur 3' : 'Step 1 of 3'}
                </span>
                <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
                  {language === 'fr' ? 'Caractéristiques principales de votre bien' : 'Property Type & Sector'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'appartement', label: language === 'fr' ? 'Appartement' : 'Apartment', icon: Building },
                  { id: 'echoppe', label: language === 'fr' ? 'Échoppe bordelaise' : 'Townhouse', icon: Home },
                  { id: 'maison', label: language === 'fr' ? 'Maison / Villa' : 'House / Villa', icon: Home }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = formData.propertyType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setFormData({ ...formData, propertyType: item.id as any })}
                      className={`p-4 rounded-2xl border-2 cursor-pointer text-center space-y-2 transition-all ${
                        isSel ? 'border-[#748C8C] bg-[#748C8C]/5 text-[#748C8C]' : 'border-[#171512]/10 hover:border-[#171512]/30 text-[#171512]'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto" />
                      <span className="text-xs font-semibold block">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Secteur / Quartier à Bordeaux *' : 'Bordeaux District *'}
                  </label>
                  <CustomSelect
                    options={[
                      { value: 'chartrons', label: 'Chartrons', sublabel: '33300' },
                      { value: 'cauderan', label: 'Caudéran', sublabel: '33200' },
                      { value: 'triangle-dor', label: "Triangle d'Or / Centre", sublabel: '33000' },
                      { value: 'bastide', label: 'Bastide Rive Droite', sublabel: '33100' },
                      { value: 'saint-michel', label: 'Saint-Michel & Capucins', sublabel: '33000' },
                      { value: 'saint-augustin', label: 'Saint-Augustin', sublabel: '33000' },
                      { value: 'merignac', label: 'Mérignac', sublabel: '33700' },
                      { value: 'begles', label: 'Bègles', sublabel: '33130' },
                    ]}
                    value={formData.neighborhood}
                    onChange={(val) => setFormData({ ...formData, neighborhood: val })}
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Adresse ou Rue (facultatif)' : 'Address / Street (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rue Calvé, Rue Notre-Dame..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all whitespace-nowrap"
                >
                  <span>{language === 'fr' ? 'Étape suivante' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNextStep}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                  {language === 'fr' ? 'Étape 2 sur 3' : 'Step 2 of 3'}
                </span>
                <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
                  {language === 'fr' ? 'Superficie & Prestations' : 'Surface Area & Condition'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? `Surface Habitable (${formData.surface} m²)` : `Surface Area (${formData.surface} m²)`}
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="350"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#748C8C] cursor-pointer h-2 bg-[#171512]/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[#6F6255] mt-1">
                    <span>15 m²</span>
                    <span>350 m²</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Nombre de pièces' : 'Number of Rooms'}
                  </label>
                  <CustomSelect
                    options={[
                      { value: '1', label: language === 'fr' ? '1 pièce (Studio/T1)' : '1 room (Studio)' },
                      { value: '2', label: language === 'fr' ? '2 pièces (T2)' : '2 rooms (1 Bed)' },
                      { value: '3', label: language === 'fr' ? '3 pièces (T3)' : '3 rooms (2 Bed)' },
                      { value: '4', label: language === 'fr' ? '4 pièces (T4)' : '4 rooms (3 Bed)' },
                      { value: '5', label: language === 'fr' ? '5 pièces et plus' : '5 rooms +' },
                    ]}
                    value={String(formData.rooms)}
                    onChange={(val) => setFormData({ ...formData, rooms: parseInt(val, 10) })}
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block font-semibold uppercase tracking-wider text-[#171512]">
                  {language === 'fr' ? 'État du bien' : 'Condition'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'neuf', label: language === 'fr' ? 'Neuf / Rénové' : 'Renovated' },
                    { id: 'excellent', label: language === 'fr' ? 'Excellent état' : 'Excellent' },
                    { id: 'bon', label: language === 'fr' ? 'Bon état' : 'Good' },
                    { id: 'a-renover', label: language === 'fr' ? 'À rafraîchir' : 'Needs Work' }
                  ].map((cond) => (
                    <button
                      type="button"
                      key={cond.id}
                      onClick={() => setFormData({ ...formData, condition: cond.id as any })}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${
                        formData.condition === cond.id
                          ? 'border-[#748C8C] bg-brand-gradient text-white shadow-brand'
                          : 'border-[#171512]/15 bg-white text-[#171512]'
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#6F6255] hover:text-[#171512]"
                >
                  {language === 'fr' ? 'Retour' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all whitespace-nowrap"
                >
                  <span>{language === 'fr' ? 'Étape suivante' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNextStep}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                  {language === 'fr' ? 'Dernière étape' : 'Final Step'}
                </span>
                <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
                  {language === 'fr' ? 'Vos coordonnées' : 'Contact Information'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Prénom *' : 'First Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marc"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Nom *' : 'Last Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dubois"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Adresse Email *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="marc.dubois@exemple.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Téléphone *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-[#6F6255] hover:text-[#171512]"
                >
                  {language === 'fr' ? 'Retour' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-4 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? (language === 'fr' ? 'Calcul sécurisé...' : 'Calculating...') : (language === 'fr' ? 'Obtenir mon estimation' : 'Calculate Valuation')}</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 4 */}
          {step === 4 && estimatedYield && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-4"
            >
              <div className="w-16 h-16 bg-[#748C8C]/10 text-[#748C8C] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#748C8C]">
                  {language === 'fr' ? 'ESTIMATION CALCULÉE AVEC SUCCÈS' : 'VALUATION REPORT GENERATED'}
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-light text-[#171512]">
                  {language === 'fr' ? `Estimation pour votre bien (${formData.surface} m²)` : `Valuation Results (${formData.surface} m²)`}
                </h2>
              </div>

              {/* Yield Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#748C8C]/30 shadow-md flex flex-col justify-between space-y-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C] block">
                    {language === 'fr' ? 'VALEUR LOCATIVE MENSUELLE ESTIMÉE' : 'ESTIMATED MONTHLY RENTAL VALUE'}
                  </span>
                  <div className="flex items-baseline justify-center space-x-1.5 sm:space-x-2 text-[#748C8C] whitespace-nowrap">
                    <span className="font-serif-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight">
                      {estimatedYield.rentMin.toLocaleString('fr-FR')}&nbsp;€
                    </span>
                    <span className="text-stone-300 font-light text-base sm:text-lg">—</span>
                    <span className="font-serif-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight">
                      {estimatedYield.rentMax.toLocaleString('fr-FR')}&nbsp;€
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6F6255] font-medium block">
                    / {language === 'fr' ? 'mois charges comprises' : 'mo inc. charges'}
                  </span>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171512]/10 shadow-md flex flex-col justify-between space-y-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] block">
                    {language === 'fr' ? 'VALEUR PATRIMONIALE DE VENTE' : 'ESTIMATED PROPERTY SALES VALUE'}
                  </span>
                  <div className="flex items-baseline justify-center space-x-1.5 sm:space-x-2 text-[#171512] whitespace-nowrap">
                    <span className="font-serif-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight">
                      {estimatedYield.saleMin.toLocaleString('fr-FR')}&nbsp;€
                    </span>
                    <span className="text-stone-300 font-light text-base sm:text-lg">—</span>
                    <span className="font-serif-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight">
                      {estimatedYield.saleMax.toLocaleString('fr-FR')}&nbsp;€
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6F6255] font-medium block">
                    {language === 'fr' ? 'Valeur vénale FAI' : 'Market valuation'}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-[#171512] text-white rounded-2xl max-w-2xl mx-auto space-y-4 text-left">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#748C8C]" />
                  <h3 className="font-serif-display text-xl font-medium">
                    {language === 'fr' ? 'Un rapport d\'expertise complet est en cours d\'envoi' : 'Comprehensive appraisal report is on its way'}
                  </h3>
                </div>
                <p className="text-xs text-[#9E9285] leading-relaxed">
                  {language === 'fr' ? (
                    <>Merci <strong>{formData.firstName} {formData.lastName}</strong>. Notre directeur de secteur Bordeaux vous contactera au <strong>{formData.phone}</strong> sous 24h. Traitement confidentiel et sécurisé.</>
                  ) : (
                    <>Thank you <strong>{formData.firstName} {formData.lastName}</strong>. Our Bordeaux district director will contact you at <strong>{formData.phone}</strong> within 24h. Strictly confidential and secure.</>
                  )}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/confier-un-bien"
                    className="flex-1 bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3 px-4 rounded-xl font-semibold text-xs transition-all shadow-brand text-center"
                  >
                    {language === 'fr' ? 'Confier mon bien en gestion' : 'Entrust us with your property'}
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-4 rounded-xl font-semibold text-xs transition-all text-center"
                  >
                    {language === 'fr' ? 'Échanger avec un conseiller' : 'Speak with an advisor'}
                  </Link>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
