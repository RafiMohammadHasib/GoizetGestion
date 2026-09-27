'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Key, Calculator, Tag, Home, Building, 
  ArrowRight, CheckCircle2, Phone, Mail, User, Clock, Sparkles, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { sanitizeInjection, isValidEmail, isValidPhone } from '@/lib/security';

import { CORE_SERVICES } from '@/data/services';

interface EntrustPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: 'Rental management' | 'Property letting' | 'Rental valuation' | 'Property sales' | string;
}

export default function EntrustPropertyModal({ isOpen, onClose, initialService = 'Rental management' }: EntrustPropertyModalProps) {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: initialService,
    propertyType: 'appartement',
    neighborhood: 'chartrons',
    address: '',
    surface: 65,
    rooms: 3,
    condition: 'excellent',
    fullName: '',
    email: '',
    phone: '',
    timeSlot: 'Matin (9h - 12h)',
    message: ''
  });

  const services = CORE_SERVICES.map(s => ({
    id: s.serviceKey,
    title: s.title[language],
    desc: s.shortDescription[language],
    icon: s.icon,
    badge: s.badge[language]
  }));

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final Step Validation & Submit
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
          source: 'Modal Confier mon bien'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission.');
      }

      setSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? 'Erreur lors de l\'enregistrement.' : 'Submission error.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#171512]/10 z-10 my-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 text-[#171512]/50 hover:text-[#171512] transition-colors p-2 rounded-full hover:bg-[#171512]/5 z-20"
              aria-label={language === 'fr' ? 'Fermer' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              /* Success State */
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 bg-[#748C8C]/10 text-[#748C8C] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20">
                    {language === 'fr' ? 'DOSSIER PROPRIÉTAIRE TRANSMIS' : 'OWNER FILE TRANSMITTED'}
                  </span>
                  <h3 className="font-serif-display text-3xl font-medium text-[#171512]">
                    {language === 'fr' ? 'Merci pour votre confiance' : 'Thank You For Your Trust'}
                  </h3>
                  <p className="text-xs text-[#6F6255] leading-relaxed">
                    {language === 'fr' ? (
                      <>Votre demande a été attribuée à <strong>Paul & Edgar Goizet</strong>. Nous vous recontacterons au <strong>{formData.phone}</strong> pour échanger sur votre bien et fixer un rendez-vous sur place à Bordeaux.</>
                    ) : (
                      <>Your request has been assigned to founding partners <strong>Paul & Edgar Goizet</strong>. We will contact you at <strong>{formData.phone}</strong> within 2 hours.</>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#171512]/10 max-w-md mx-auto text-left text-xs space-y-2 text-[#6F6255]">
                  <div className="flex items-center space-x-2 text-[#171512] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#748C8C]" />
                    <span>{language === 'fr' ? 'Engagement Qualité Goizet Gestion' : 'Goizet Quality Guarantee'}</span>
                  </div>
                  <p className="text-[11px]">
                    {language === 'fr'
                      ? 'Dossier confidentiel, zéro démarchage commercial abusif, audit personnalisé du marché bordelais offert.'
                      : 'Strictly confidential, zero spam, complimentary customized Bordeaux market appraisal.'}
                  </p>
                </div>

                <button
                  onClick={handleResetAndClose}
                  className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3 rounded-full text-xs font-semibold shadow-brand transition-all"
                >
                  {language === 'fr' ? 'Fermer la fenêtre' : 'Close window'}
                </button>
              </div>
            ) : (
              /* Multi-Step Flow */
              <div className="space-y-6">
                
                {/* Header */}
                <div className="space-y-1 pr-8">
                  <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-3 py-0.5 rounded-full border border-[#748C8C]/20">
                    <Sparkles className="w-3 h-3" />
                    <span>{language === 'fr' ? 'ESPACE PROPRIÉTAIRE & BAILLEUR' : 'PROPERTY OWNER & LANDLORD'}</span>
                  </div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-light text-[#171512]">
                    {t('modalEntrustTitle')}
                  </h2>
                  <p className="text-xs text-[#6F6255]">
                    {t('modalEntrustSubtitle')}
                  </p>
                </div>

                {/* Stepper Progress */}
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#171512]/10 -translate-y-1/2 z-0" />
                  {[
                    { num: 1, label: t('stepServiceSelect') },
                    { num: 2, label: t('stepPropertyInfo') },
                    { num: 3, label: t('stepContactInfo') }
                  ].map((s) => (
                    <div key={s.num} className="relative z-10 flex flex-col items-center space-y-1">
                      <div
                        className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                          step >= s.num
                            ? 'bg-brand-gradient text-white shadow-xs'
                            : 'bg-white text-[#6F6255] border border-[#171512]/20'
                        }`}
                      >
                        {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                      </div>
                      <span className="text-[10px] font-medium text-[#6F6255] hidden sm:block">{s.label}</span>
                    </div>
                  ))}
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Step Forms */}
                <form onSubmit={handleNext} className="space-y-4">
                  <AnimatePresence mode="wait">
                    
                    {/* STEP 1: Select Intent / Service */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-3"
                      >
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512]">
                          {language === 'fr' ? 'Sélectionnez le service souhaité :' : 'Select your primary objective:'}
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {services.map((srv) => {
                            const Icon = srv.icon;
                            const isSelected = formData.serviceType === srv.id;
                            return (
                              <div
                                key={srv.id}
                                onClick={() => setFormData({ ...formData, serviceType: srv.id as any })}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 relative ${
                                  isSelected
                                    ? 'border-[#748C8C] bg-white shadow-md'
                                    : 'border-[#171512]/10 bg-white/60 hover:bg-white hover:border-[#171512]/25'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-brand-gradient text-white shadow-xs' : 'bg-[#171512]/5 text-[#171512]'}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#171512]/5 text-[#6F6255]">
                                    {srv.badge}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-xs text-[#171512]">{srv.title}</h4>
                                  <p className="text-[11px] text-[#6F6255] leading-tight mt-0.5">{srv.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Property Characteristics */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-4 text-xs"
                      >
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'appartement', label: language === 'fr' ? 'Appartement' : 'Apartment', icon: Building },
                            { id: 'echoppe', label: language === 'fr' ? 'Échoppe' : 'Townhouse', icon: Home },
                            { id: 'maison', label: language === 'fr' ? 'Maison / Villa' : 'House / Villa', icon: Home },
                          ].map((tItem) => {
                            const Icon = tItem.icon;
                            const isSel = formData.propertyType === tItem.id;
                            return (
                              <div
                                key={tItem.id}
                                onClick={() => setFormData({ ...formData, propertyType: tItem.id })}
                                className={`p-3 rounded-xl border-2 cursor-pointer text-center space-y-1 transition-all ${
                                  isSel ? 'border-[#748C8C] bg-white text-[#748C8C] shadow-xs' : 'border-[#171512]/10 bg-white/60 text-[#171512]'
                                }`}
                              >
                                <Icon className="w-4 h-4 mx-auto" />
                                <span className="text-[11px] font-semibold block">{tItem.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                              {language === 'fr' ? 'Quartier / Secteur *' : 'Bordeaux District *'}
                            </label>
                            <CustomSelect
                              options={[
                                { value: 'chartrons', label: 'Chartrons', sublabel: '33300' },
                                { value: 'cauderan', label: 'Caudéran', sublabel: '33200' },
                                { value: 'triangle-dor', label: language === 'fr' ? "Triangle d'Or / Centre" : "Golden Triangle / City Centre", sublabel: '33000' },
                                { value: 'bastide', label: language === 'fr' ? 'Bastide Rive Droite' : 'Bastide Right Bank', sublabel: '33100' },
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
                              placeholder={language === 'fr' ? 'Ex: 48 Rue Calvé' : 'E.g. 48 Rue Calvé'}
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                              {language === 'fr' ? `Superficie (${formData.surface} m²)` : `Surface (${formData.surface} m²)`}
                            </label>
                            <input
                              type="range"
                              min="15"
                              max="300"
                              value={formData.surface}
                              onChange={(e) => setFormData({ ...formData, surface: parseInt(e.target.value, 10) })}
                              className="w-full accent-[#748C8C] cursor-pointer h-2 bg-[#171512]/10 rounded-lg"
                            />
                            <div className="flex justify-between text-[10px] text-[#6F6255] mt-0.5">
                              <span>15 m²</span>
                              <span>300 m²</span>
                            </div>
                          </div>

                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                              {language === 'fr' ? 'Nombre de pièces' : 'Rooms'}
                            </label>
                            <CustomSelect
                              options={[
                                { value: '1', label: language === 'fr' ? '1 pièce (Studio/T1)' : '1 room (Studio/1-bed)' },
                                { value: '2', label: language === 'fr' ? '2 pièces (T2)' : '2 rooms (1-bedroom)' },
                                { value: '3', label: language === 'fr' ? '3 pièces (T3)' : '3 rooms (2-bedroom)' },
                                { value: '4', label: language === 'fr' ? '4 pièces (T4)' : '4 rooms (3-bedroom)' },
                                { value: '5', label: language === 'fr' ? '5 pièces et +' : '5+ rooms' },
                              ]}
                              value={String(formData.rooms)}
                              onChange={(val) => setFormData({ ...formData, rooms: parseInt(val, 10) })}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Owner Contact Information */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-3 text-xs"
                      >
                        <div>
                          <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                            {language === 'fr' ? 'Nom & Prénom *' : 'Full Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Jean-Marc Vasseur"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                              {language === 'fr' ? 'Téléphone de contact *' : 'Phone *'}
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="06 12 34 56 78"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                              {language === 'fr' ? 'Adresse Email *' : 'Email *'}
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="proprietaire@exemple.fr"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          <div>
                            <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                              {language === 'fr' ? 'Commentaire / Précisions' : 'Additional Notes (Optional)'}
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Bien actuellement meublé..."
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="pt-3 border-t border-[#171512]/10 flex items-center justify-between">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="text-xs font-semibold text-[#6F6255] hover:text-[#171512] transition-colors"
                      >
                        {language === 'fr' ? '← Étape précédente' : '← Previous Step'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#6F6255]">
                        {language === 'fr' ? 'Traitement garanti sous 2h' : 'Direct response under 2h'}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-3 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all disabled:opacity-50"
                    >
                      <span>
                        {step === 3 
                          ? (loading ? (language === 'fr' ? 'Enregistrement sécurisé...' : 'Transmitting...') : (language === 'fr' ? 'Confier mon bien à l\'agence' : 'Submit Property Agreement'))
                          : (language === 'fr' ? 'Continuer' : 'Continue')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
