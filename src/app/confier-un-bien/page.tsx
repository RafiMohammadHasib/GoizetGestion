'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  ShieldCheck, Key, Calculator, Tag, ArrowRight, CheckCircle2, 
  Building, Home, Phone, Mail, Clock, Sparkles, AlertCircle, ArrowUpRight, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { sanitizeInjection, isValidEmail, isValidPhone } from '@/lib/security';

export default function ConfierUnBienPage() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: 'Rental management',
    propertyType: 'appartement',
    neighborhood: 'chartrons',
    address: '',
    surface: 70,
    rooms: 3,
    condition: 'excellent',
    fullName: '',
    email: '',
    phone: '',
    timeSlot: 'Matin (9h - 12h)',
    message: ''
  });

  const services = [
    {
      id: 'Rental management',
      title: language === 'fr' ? 'Gestion Locative 360°' : 'Rental Management',
      desc: language === 'fr' ? 'Gestion intégrale, encaissement, GLI garantie loyers impayés sans carence' : 'End-to-end management, rent collection & rent default insurance',
      icon: ShieldCheck,
      badge: language === 'fr' ? 'Recommandé' : 'Popular',
      details: language === 'fr' 
        ? ['Honoraires déductibles à 100% des revenus fonciers', 'Garantie Loyers Impayés sans franchise', 'Espace propriétaire en ligne temps réel']
        : ['100% tax deductible management fees', 'Zero deductible rent default guarantee', 'Real-time online owner dashboard']
    },
    {
      id: 'Property letting',
      title: language === 'fr' ? 'Mise en Location' : 'Property Letting',
      desc: language === 'fr' ? 'Shooting photo HD, multi-diffusion, vérification solvabilité et baux certifiés' : 'HD photo shoot, portal syndication, solvency check & compliant leases',
      icon: Key,
      badge: language === 'fr' ? 'Bailleurs' : 'Landlords',
      details: language === 'fr'
        ? ['Candidats rigoureusement qualifiés (3x le loyer)', 'Visites ciblées et baux bilingues', 'État des lieux numérique sur tablette']
        : ['Strict candidate qualification (3x rent income)', 'Vetted viewings & digital leases', 'Certified tablet inventory report']
    },
    {
      id: 'Rental valuation',
      title: language === 'fr' ? 'Estimation Locative' : 'Rental Valuation',
      desc: language === 'fr' ? 'Étude de marché comparative sous 48h conforme encadrement des loyers' : 'Comparative market study within 48h compliant with rent cap',
      icon: Calculator,
      badge: language === 'fr' ? 'Offert' : 'Free',
      details: language === 'fr'
        ? ['Analyse micro-quartier bordelais', 'Conformité stricte encadrement des loyers', 'Simulation de rentabilité nette']
        : ['Micro-neighborhood Bordeaux audit', 'Strict rent control adherence', 'Net yield optimization analysis']
    },
    {
      id: 'Property sales',
      title: language === 'fr' ? 'Vente Immobilière' : 'Property Sales',
      desc: language === 'fr' ? 'Commercialisation de prestige, réseau d\'acquéreurs et suivi notarial' : 'Boutique marketing, vetted buyer portfolio and complete notary support',
      icon: Tag,
      badge: language === 'fr' ? 'Prestige' : 'Sales',
      details: language === 'fr'
        ? ['Stratégie marketing personnalisée', 'Fichier d\'acquéreurs financés', 'Accompagnement jusqu\'à la signature de l\'acte']
        : ['Tailored marketing strategy', 'Pre-qualified cash/funded buyers', 'Complete notary closing guidance']
    }
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const cleanName = sanitizeInjection(formData.fullName);
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg(language === 'fr' ? 'Veuillez saisir votre nom complet.' : 'Please enter your full name.');
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
      const res = await fetch('/api/owner-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          serviceType: formData.serviceType,
          propertyType: formData.propertyType,
          neighborhood: formData.neighborhood,
          address: formData.address,
          surface: formData.surface,
          rooms: formData.rooms,
          timeSlot: formData.timeSlot,
          message: formData.message,
          source: 'Page Dédiée /confier-un-bien'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission.');
      }

      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? 'Erreur lors de l\'enregistrement.' : 'Submission error.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Confier mon bien' : 'Entrust your property' }]} />

      {/* Hero Banner Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-4 py-1.5 rounded-full border border-[#748C8C]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'MANDAT SUR-MESURE & VALORISATION DU PATRIMOINE' : 'BESPOKE OWNER MANDATE & ASSET MANAGEMENT'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-light text-[#171512] leading-[1.08]">
            {language === 'fr' ? 'Confiez votre bien à Bordeaux en toute sérénité.' : 'Entrust your Bordeaux property with total peace of mind.'}
          </h1>

          <p className="text-base sm:text-xl text-[#6F6255] font-light leading-relaxed">
            {language === 'fr'
              ? 'Gestion locative intégrale, recherche de locataires exigeante, estimation précise ou vente de prestige. Une approche boutique et humaine portée par des directeurs bordelais.'
              : 'End-to-end rental management, executive tenant placement, accurate valuation, or bespoke sales. A boutique advisory led by local Bordeaux partners.'}
          </p>

          {/* Key Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#171512]/10 text-xs">
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#748C8C]">0 jour</span>
              <p className="text-[#6F6255] text-[11px]">{language === 'fr' ? 'de vacance moyenne' : 'avg vacancy delay'}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#748C8C]">100%</span>
              <p className="text-[#6F6255] text-[11px]">{language === 'fr' ? 'loyers garantis (GLI)' : 'rent default coverage'}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#748C8C]">&lt; 2h</span>
              <p className="text-[#6F6255] text-[11px]">{language === 'fr' ? 'délai de réponse moyen' : 'advisor response time'}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif-display text-2xl font-bold text-[#748C8C]">4.9 / 5</span>
              <p className="text-[#6F6255] text-[11px]">{language === 'fr' ? 'avis propriétaires' : 'owner satisfaction'}</p>
            </div>
          </div>
        </div>

        {/* Right Info Card: Direct Partners */}
        <div className="lg:col-span-5 bg-[#171512] text-white rounded-3xl p-8 shadow-2xl border border-white/10 space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'ACCOMPAGNEMENT DÉDIÉ' : 'DEDICATED ADVISORY'}
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-light">
            {language === 'fr' ? 'Vos interlocuteurs uniques à Bordeaux' : 'Your dedicated partners in Bordeaux'}
          </h2>
          <p className="text-xs text-[#9E9285] leading-relaxed">
            {language === 'fr'
              ? 'Chez Goizet Gestion, chaque propriétaire échange directement avec les fondateurs. Ni standard impersonnel, ni intermédiaire changeant.'
              : 'At Goizet Gestion, every property owner works directly with the founders. No call centers, no constantly changing personnel.'}
          </p>

          <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
              <div>
                <span className="font-semibold text-white block">Paul Goizet</span>
                <span className="text-[10px] text-[#748C8C]">{language === 'fr' ? 'Gestion & Stratégie Locative' : 'Rental Management & Strategy'}</span>
              </div>
              <a href="tel:+33695577033" className="p-2 bg-white/10 rounded-full hover:bg-[#748C8C] transition-colors">
                <Phone className="w-4 h-4 text-white" />
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
              <div>
                <span className="font-semibold text-white block">Edgar Goizet</span>
                <span className="text-[10px] text-[#748C8C]">{language === 'fr' ? 'Développement & Transactions' : 'Development & Sales'}</span>
              </div>
              <a href="tel:+33781968395" className="p-2 bg-white/10 rounded-full hover:bg-[#748C8C] transition-colors">
                <Phone className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Lead Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#171512]/10 shadow-2xl space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
            {language === 'fr' ? 'FORMULAIRE PROPRIÉTAIRE EXPRESS' : 'EXPRESS OWNER ENQUIRY'}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-light text-[#171512]">
            {language === 'fr' ? 'Dites-nous en plus sur votre projet immobilier' : 'Tell us about your real estate objective'}
          </h2>
          <p className="text-xs text-[#6F6255]">
            {language === 'fr'
              ? 'Remplissez ces quelques informations. Nous analysons votre bien et vous recontactons avec une proposition sur-mesure sous 2 heures.'
              : 'Complete this brief form. We analyze your asset and respond with a customized proposal within 2 hours.'}
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between max-w-md relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#171512]/10 -translate-y-1/2 z-0" />
          {[
            { num: 1, label: language === 'fr' ? '1. Service souhaité' : '1. Service' },
            { num: 2, label: language === 'fr' ? '2. Caractéristiques du bien' : '2. Property' },
            { num: 3, label: language === 'fr' ? '3. Vos coordonnées' : '3. Contact' }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center space-y-1">
              <div
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step >= s.num
                    ? 'bg-brand-gradient text-white shadow-brand'
                    : 'bg-[#FAF9F6] text-[#6F6255] border border-[#171512]/20'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className="text-[10px] font-medium text-[#6F6255]">{s.label}</span>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2 max-w-xl">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="py-12 text-center space-y-6 max-w-xl mx-auto">
            <div className="w-20 h-20 bg-[#748C8C]/10 text-[#748C8C] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-3.5 py-1 rounded-full border border-[#748C8C]/30">
                {language === 'fr' ? 'DOSSIER ENREGISTRÉ AU CRM' : 'RECORD REGISTERED IN CRM'}
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl font-light text-[#171512]">
                {language === 'fr' ? 'Votre demande a été prise en compte' : 'Your request has been received'}
              </h3>
              <p className="text-sm text-[#6F6255] leading-relaxed">
                {language === 'fr' ? (
                  <>Merci <strong>{formData.fullName}</strong>. Votre conseiller dédié Goizet Gestion vous contactera au <strong>{formData.phone}</strong> au créneau souhaité (<strong>{formData.timeSlot}</strong>) pour fixer un rendez-vous d'expertise à votre adresse.</>
                ) : (
                  <>Thank you <strong>{formData.fullName}</strong>. Your dedicated advisor will contact you at <strong>{formData.phone}</strong> during your selected timeslot (<strong>{formData.timeSlot}</strong>).</>
                )}
              </p>
            </div>

            <div className="pt-4 flex justify-center space-x-4">
              <Link
                href="/gestion-locative"
                className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-full text-xs font-semibold shadow-brand transition-all"
              >
                {language === 'fr' ? 'Découvrir nos offres de gestion' : 'Explore Management Plans'}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Choose 1 of 4 Services */}
              {step === 1 && (
                <motion.div
                  key="page-step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171512]">
                    {language === 'fr' ? '1. Choisissez le mandat ou service souhaité :' : '1. Select your target service:'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => {
                      const Icon = srv.icon;
                      const isSelected = formData.serviceType === srv.id;

                      return (
                        <div
                          key={srv.id}
                          onClick={() => setFormData({ ...formData, serviceType: srv.id as any })}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-4 relative ${
                            isSelected
                              ? 'border-[#748C8C] bg-[#FAF9F6] shadow-lg ring-1 ring-[#748C8C]/30'
                              : 'border-[#171512]/10 bg-white hover:border-[#171512]/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-brand-gradient text-white shadow-xs' : 'bg-[#171512]/5 text-[#171512]'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#171512]/5 text-[#748C8C]">
                              {srv.badge}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-serif-display text-xl font-medium text-[#171512]">{srv.title}</h4>
                            <p className="text-xs text-[#6F6255] mt-1 leading-relaxed">{srv.desc}</p>
                          </div>

                          <ul className="space-y-1.5 text-[11px] text-[#6F6255] pt-2 border-t border-[#171512]/5">
                            {srv.details.map((d, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all"
                    >
                      <span>{language === 'fr' ? 'Étape suivante : Caractéristiques' : 'Next: Property Details'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Property Characteristics */}
              {step === 2 && (
                <motion.div
                  key="page-step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-xs"
                >
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171512]">
                    {language === 'fr' ? '2. Caractéristiques de votre bien bordelais :' : '2. Property characteristics:'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'appartement', label: language === 'fr' ? 'Appartement' : 'Apartment', icon: Building },
                      { id: 'echoppe', label: language === 'fr' ? 'Échoppe bordelaise' : 'Bordeaux Townhouse', icon: Home },
                      { id: 'maison', label: language === 'fr' ? 'Maison / Villa' : 'House / Villa', icon: Home }
                    ].map((tItem) => {
                      const Icon = tItem.icon;
                      const isSel = formData.propertyType === tItem.id;
                      return (
                        <div
                          key={tItem.id}
                          onClick={() => setFormData({ ...formData, propertyType: tItem.id })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer text-center space-y-2 transition-all ${
                            isSel ? 'border-[#748C8C] bg-[#748C8C]/5 text-[#748C8C]' : 'border-[#171512]/10 bg-white hover:border-[#171512]/30 text-[#171512]'
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto" />
                          <span className="text-xs font-semibold block">{tItem.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Quartier / Secteur *' : 'District *'}
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
                        placeholder="Ex: Rue Calvé, Rue Sainte-Catherine..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? `Surface Habitable (${formData.surface} m²)` : `Living Area (${formData.surface} m²)`}
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
                        {language === 'fr' ? 'Nombre de pièces' : 'Number of rooms'}
                      </label>
                      <CustomSelect
                        options={[
                          { value: '1', label: '1 pièce (Studio/T1)' },
                          { value: '2', label: '2 pièces (T2)' },
                          { value: '3', label: '3 pièces (T3)' },
                          { value: '4', label: '4 pièces (T4)' },
                          { value: '5', label: '5 pièces et +' },
                        ]}
                        value={String(formData.rooms)}
                        onChange={(val) => setFormData({ ...formData, rooms: parseInt(val, 10) })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-[#6F6255] hover:text-[#171512]"
                    >
                      {language === 'fr' ? '← Revenir au choix du service' : '← Back to services'}
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all"
                    >
                      <span>{language === 'fr' ? 'Étape suivante : Coordonnées' : 'Next: Contact info'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Owner Details */}
              {step === 3 && (
                <motion.div
                  key="page-step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-xs"
                >
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171512]">
                    {language === 'fr' ? '3. Vos coordonnées pour convenir d\'un échange :' : '3. Your contact details:'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Nom & Prénom *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Claire Delmas"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Numéro de téléphone *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Adresse Email *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="claire.delmas@exemple.fr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Créneau de rappel souhaité' : 'Preferred Callback Time'}
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'Matin (9h - 12h)', label: 'Matin (9h - 12h)' },
                          { value: 'Après-midi (14h - 17h)', label: 'Après-midi (14h - 17h)' },
                          { value: 'Fin de journée (17h - 19h)', label: 'Fin de journée (17h - 19h)' },
                        ]}
                        value={formData.timeSlot}
                        onChange={(val) => setFormData({ ...formData, timeSlot: val })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                      {language === 'fr' ? 'Précisions supplémentaires sur votre projet (facultatif)' : 'Additional details (optional)'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={language === 'fr' ? 'Ex: Mon appartement se libère le mois prochain, je souhaite une mise en gestion locative avec garantie impayés...' : 'Any details about your property...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-[#6F6255] hover:text-[#171512]"
                    >
                      {language === 'fr' ? '← Revenir aux caractéristiques' : '← Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-10 py-4 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all disabled:opacity-50"
                    >
                      <span>{loading ? (language === 'fr' ? 'Enregistrement sécurisé...' : 'Processing...') : (language === 'fr' ? 'Transmettre mon dossier propriétaire' : 'Submit Property Mandate')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>
        )}
      </div>

      {/* 4 Pillars Summary Section with Strong CTAs */}
      <div className="space-y-8 pt-8 border-t border-[#171512]/10">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'OFFRE COMPLÈTE PROPRIÉTAIRE' : 'COMPLETE OWNER SUITE'}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-light text-[#171512]">
            {language === 'fr' ? 'Les 4 engagements Goizet Gestion' : 'Our 4 Core Owner Commitments'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: language === 'fr' ? 'Gestion Locative 360°' : 'Rental Management',
              desc: language === 'fr' ? 'Libérez-vous des soucis. Rentrée des loyers garantie chaque 1er du mois.' : 'Guaranteed rent payments on the 1st of every month without delays.',
              icon: ShieldCheck,
              cta: language === 'fr' ? 'Démarrer ma gestion' : 'Start Management',
              link: '/gestion-locative'
            },
            {
              title: language === 'fr' ? 'Mise en Location' : 'Property Letting',
              desc: language === 'fr' ? 'Reportage photo HD, sélection des meilleurs profils et baux conformes.' : 'HD photos, top profile selection, compliant leases.',
              icon: Key,
              cta: language === 'fr' ? 'Louer mon bien' : 'Let Property',
              link: '/confier-un-bien'
            },
            {
              title: language === 'fr' ? 'Estimation Locative' : 'Rental Valuation',
              desc: language === 'fr' ? 'Estimez la valeur locative ou de vente en 2 minutes en ligne.' : 'Get a 2-minute rental & sales valuation estimate.',
              icon: Calculator,
              cta: language === 'fr' ? 'Obtenir une estimation' : 'Get Valuation',
              link: '/estimation'
            },
            {
              title: language === 'fr' ? 'Vente Immobilière' : 'Property Sales',
              desc: language === 'fr' ? 'Valorisation et cession au prix fort du marché bordelais.' : 'Tailored advisory to sell at premium market price.',
              icon: Tag,
              cta: language === 'fr' ? 'Contacter un conseiller' : 'Contact Us',
              link: '/contact?subject=vente'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#171512]/10 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-display text-xl font-medium text-[#171512]">{item.title}</h3>
                  <p className="text-xs text-[#6F6255] leading-relaxed">{item.desc}</p>
                </div>
                <Link
                  href={item.link}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#748C8C] hover:text-[#4F6565] transition-colors pt-2 border-t border-[#171512]/5"
                >
                  <span>{item.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
