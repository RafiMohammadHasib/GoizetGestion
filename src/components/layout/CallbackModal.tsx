'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/ui/CustomSelect';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    project: 'Gestion locative',
    timeSlot: 'Matin (9h - 12h)'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg(language === 'fr' ? 'Veuillez renseigner votre nom.' : 'Please enter your name.');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg(language === 'fr' ? 'Numéro de téléphone obligatoire.' : 'Phone number is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          leadType: 'Callback Request',
          project: formData.project,
          timeSlot: formData.timeSlot,
          subject: `Demande de Rappel: ${formData.project} (${formData.timeSlot})`,
          message: `Demande de rappel téléphonique. Projet: ${formData.project}. Créneau souhaité: ${formData.timeSlot}.`,
          source: 'Modal Rappel Immédiat'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la transmission');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 3500);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? 'Erreur lors de la demande de rappel.' : 'Callback request error.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#171512]/10 z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-[#171512]/50 hover:text-[#171512] transition-colors p-1.5 rounded-full hover:bg-[#171512]/5"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#748C8C]/10 text-[#748C8C] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
                  {language === 'fr' ? 'Demande de rappel enregistrée' : 'Callback Request Confirmed'}
                </h3>
                <p className="text-sm text-[#6F6255] max-w-sm mx-auto">
                  {language === 'fr' ? (
                    <>Un conseiller spécialisé Goizet Gestion vous rappellera au créneau souhaité (<span className="font-medium text-[#171512]">{formData.timeSlot}</span>).</>
                  ) : (
                    <>A dedicated Goizet Gestion advisor will call you at your preferred time slot (<span className="font-medium text-[#171512]">{formData.timeSlot}</span>).</>
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#748C8C] mb-2">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Rappel Gratuit & Immédiat' : 'Free Priority Callback'}</span>
                  </div>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-[#171512]">
                    {language === 'fr' ? 'Échangez avec un expert immobilier à Bordeaux.' : 'Speak with a Bordeaux real estate specialist.'}
                  </h3>
                  <p className="text-xs text-[#6F6255] mt-1">
                    {language === 'fr'
                      ? 'Indiquez vos coordonnées et votre projet. Nous vous contactons en moins de 2 heures.'
                      : 'Provide your details and project outline. We will contact you within 2 hours.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                      {language === 'fr' ? 'Nom complet *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Martin Duprat"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#171512]/15 rounded-xl text-sm focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                      {language === 'fr' ? 'Téléphone de contact *' : 'Contact Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#171512]/15 rounded-xl text-sm focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                        {language === 'fr' ? 'Votre projet' : 'Project Type'}
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'Gestion locative', label: language === 'fr' ? 'Mettre en gestion' : 'Property Management' },
                          { value: 'Estimation', label: language === 'fr' ? 'Estimation locative/vente' : 'Valuation / Rental Yield' },
                          { value: 'Louer un bien', label: language === 'fr' ? 'Louer un appartement' : 'Renting a Residence' },
                          { value: 'Acheter', label: language === 'fr' ? 'Projet d\'achat' : 'Property Acquisition' },
                          { value: 'Autre', label: language === 'fr' ? 'Autre demande' : 'Other Advisory' },
                        ]}
                        value={formData.project}
                        onChange={(val) => setFormData({ ...formData, project: val })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                        {language === 'fr' ? 'Créneau de rappel' : 'Preferred Timeslot'}
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'Matin (9h - 12h)', label: language === 'fr' ? 'Matin (9h - 12h)' : 'Morning (9:00 AM - 12:00 PM)' },
                          { value: 'Après-midi (14h - 17h)', label: language === 'fr' ? 'Après-midi (14h - 17h)' : 'Afternoon (2:00 PM - 5:00 PM)' },
                          { value: 'Fin de journée (17h - 19h)', label: language === 'fr' ? 'Fin de journée (17h - 19h)' : 'Evening (5:00 PM - 7:00 PM)' },
                        ]}
                        value={formData.timeSlot}
                        onChange={(val) => setFormData({ ...formData, timeSlot: val })}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-brand flex items-center justify-center space-x-2 disabled:opacity-60"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{loading ? (language === 'fr' ? 'Transmission sécurisée...' : 'Submitting...') : (language === 'fr' ? 'Confirmer ma demande de rappel' : 'Confirm Callback Request')}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-[#6F6255] pt-1">
                    {language === 'fr'
                      ? 'Vos données restent strictement confidentielles selon les normes RGPD. Aucun spam.'
                      : 'Your data remains strictly confidential in compliance with GDPR standards.'}
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
