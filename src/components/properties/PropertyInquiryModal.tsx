'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MessageSquare, PhoneCall, ShieldCheck, Video, MapPin, Send, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedTitle, getLocalizedPriceSuffix } from '@/lib/propertyLocalization';

export interface PropertyInquiryData {
  id: string;
  title: string;
  slug: string;
  reference?: string;
  price: number;
  priceSuffix?: string;
  location: string;
  image: string;
  surface?: number;
  rooms?: number;
  transactionType?: 'louer' | 'acheter';
}

interface PropertyInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyInquiryData | null;
}

export default function PropertyInquiryModal({ isOpen, onClose, property }: PropertyInquiryModalProps) {
  const { language } = useLanguage();

  const [mode, setMode] = useState<'visite' | 'info'>('visite');
  const [visitType, setVisitType] = useState<'onsite' | 'video'>('onsite');
  const [preferredSlot, setPreferredSlot] = useState('Matin (9h - 12h)');
  const [infoTopics, setInfoTopics] = useState<string[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen, property]);

  const toggleTopic = (topic: string) => {
    setInfoTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg(language === 'fr' ? 'Veuillez saisir votre nom complet.' : 'Please enter your full name.');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMsg(language === 'fr' ? 'Veuillez indiquer au moins un téléphone ou un email.' : 'Please provide at least a phone number or email.');
      return;
    }

    setLoading(true);

    try {
      const subject = mode === 'visite'
        ? `Demande de visite (${visitType === 'onsite' ? 'Sur place' : 'Visio'}) : ${property?.title || 'Bien'}`
        : `Demande d'informations : ${property?.title || 'Bien'}`;

      let compiledMessage = message.trim();
      if (mode === 'visite') {
        compiledMessage = `Type de visite souhaitée: ${visitType === 'onsite' ? 'Visite physique à Bordeaux' : 'Visite vidéo à distance (WhatsApp/Visio)'}\nCréneau préféré: ${preferredSlot}\n\n${compiledMessage}`;
      } else if (infoTopics.length > 0) {
        compiledMessage = `Sujets demandés: ${infoTopics.join(', ')}\n\n${compiledMessage}`;
      }

      if (property?.reference) {
        compiledMessage += `\nRéférence bien: ${property.reference}`;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          name,
          phone,
          email,
          propertyId: property?.id,
          propertySlug: property?.slug,
          propertyTitle: property?.title,
          leadType: property?.transactionType === 'acheter' ? 'Buyer Request' : 'Tenant Request',
          budget: property ? `${property.price.toLocaleString('fr-FR')} € ${property.priceSuffix || '/mois'}` : undefined,
          surface: property?.surface ? `${property.surface} m²${property.rooms ? ` • ${property.rooms} pièces` : ''}` : undefined,
          subject,
          message: compiledMessage,
          timeSlot: preferredSlot,
          source: 'Modal Visite Rapide'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de transmission');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? 'Une erreur est survenue.' : 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && property && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171512]/80 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="relative w-full max-w-xl bg-[#FAF9F6] rounded-3xl shadow-2xl border border-[#171512]/10 overflow-hidden z-10 my-auto"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#171512] shadow-sm transition-colors border border-[#171512]/10 cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Property Preview Strip */}
            <div className="bg-white p-5 sm:p-6 border-b border-[#171512]/10">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#171512]/10 relative bg-[#171512]/5">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#171512]/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {property.transactionType === 'acheter' ? (language === 'fr' ? 'Vente' : 'For Sale') : (language === 'fr' ? 'Location' : 'For Rent')}
                  </span>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] text-[#748C8C] font-semibold uppercase tracking-wider">
                    <span className="truncate">{property.location}</span>
                    {property.reference && (
                      <span className="text-[#6F6255] font-mono">· Réf: {property.reference}</span>
                    )}
                  </div>
                  <h3 className="font-serif-display text-lg sm:text-xl font-medium text-[#171512] leading-snug line-clamp-2">
                    {getLocalizedTitle(property, language)}
                  </h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-serif-display text-xl font-semibold text-[#171512]">
                      {property.price.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} €
                    </span>
                    {property.priceSuffix && (
                      <span className="text-[11px] text-[#6F6255]">{getLocalizedPriceSuffix(property, language)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#748C8C]/15 text-[#748C8C] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-display text-2xl font-medium text-[#171512]">
                    {language === 'fr' ? 'Demande bien reçue !' : 'Request received!'}
                  </h4>
                  <p className="text-xs text-[#6F6255] max-w-md mx-auto leading-relaxed">
                    {language === 'fr'
                      ? 'Un conseiller de la Maison Goizet Gestion vous contactera dans les plus brefs délais pour convenir du rendez-vous.'
                      : 'An advisor from Maison Goizet Gestion will contact you shortly to schedule the appointment.'}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Délai moyen de réponse : moins de 2h' : 'Average response time: under 2 hours'}</span>
                    </span>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Mode Selector Tabs */}
                  <div className="grid grid-cols-2 gap-2 bg-[#171512]/5 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setMode('visite')}
                      className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        mode === 'visite'
                          ? 'bg-white text-[#171512] shadow-sm'
                          : 'text-[#6F6255] hover:text-[#171512]'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-[#748C8C]" />
                      <span>{language === 'fr' ? 'Organiser une visite' : 'Schedule a viewing'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('info')}
                      className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        mode === 'info'
                          ? 'bg-white text-[#171512] shadow-sm'
                          : 'text-[#6F6255] hover:text-[#171512]'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-[#748C8C]" />
                      <span>{language === 'fr' ? 'Demander des infos' : 'Request details'}</span>
                    </button>
                  </div>

                  {/* Mode-specific Fields */}
                  {mode === 'visite' ? (
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#171512]/5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255]">
                        {language === 'fr' ? 'Format de la visite' : 'Tour format'}
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setVisitType('onsite')}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all text-left cursor-pointer ${
                            visitType === 'onsite'
                              ? 'border-[#748C8C] bg-[#748C8C]/5 text-[#171512] font-semibold'
                              : 'border-[#171512]/10 text-[#6F6255] hover:border-[#171512]/20'
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-[#748C8C] shrink-0" />
                          <span className="truncate">{language === 'fr' ? 'Sur place (Bordeaux)' : 'In person'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisitType('video')}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all text-left cursor-pointer ${
                            visitType === 'video'
                              ? 'border-[#748C8C] bg-[#748C8C]/5 text-[#171512] font-semibold'
                              : 'border-[#171512]/10 text-[#6F6255] hover:border-[#171512]/20'
                          }`}
                        >
                          <Video className="w-4 h-4 text-[#748C8C] shrink-0" />
                          <span className="truncate">{language === 'fr' ? 'Vidéo WhatsApp' : 'Video call'}</span>
                        </button>
                      </div>

                      <div className="pt-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1.5">
                          {language === 'fr' ? 'Créneau horaire préféré' : 'Preferred time slot'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                          {['Matin (9h - 12h)', 'Après-midi (14h - 17h)', 'Fin de journée (17h - 19h)', 'Samedi'].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setPreferredSlot(slot)}
                              className={`py-2 px-2 text-center rounded-lg border transition-all cursor-pointer ${
                                preferredSlot === slot
                                  ? 'border-[#748C8C] bg-[#748C8C]/10 text-[#171512] font-semibold'
                                  : 'border-[#171512]/10 text-[#6F6255] hover:border-[#171512]/20'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-white p-4 rounded-2xl border border-[#171512]/5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-2">
                        {language === 'fr' ? 'Je souhaite recevoir :' : 'I would like to receive:'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {[
                          language === 'fr' ? 'Dossier complet du bien' : 'Full property brochure',
                          language === 'fr' ? 'Détail des charges & copro' : 'Charges & building details',
                          language === 'fr' ? 'Date de disponibilité exacte' : 'Exact availability date',
                          language === 'fr' ? 'Conditions de location' : 'Rental conditions'
                        ].map((topic) => {
                          const isSelected = infoTopics.includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => toggleTopic(topic)}
                              className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#748C8C] bg-[#748C8C]/10 text-[#171512] font-semibold'
                                  : 'border-[#171512]/10 text-[#6F6255] hover:border-[#171512]/20'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#748C8C] border-[#748C8C] text-white' : 'border-[#171512]/30'
                              }`}>
                                {isSelected && <span className="text-[10px] leading-none">✓</span>}
                              </div>
                              <span className="truncate">{topic}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Contact Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Nom et prénom *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Camille Dubois"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl text-xs font-medium focus:outline-none focus:border-[#748C8C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171512] mb-1">
                          {language === 'fr' ? 'Téléphone *' : 'Phone *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="06 12 34 56 78"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl text-xs font-medium focus:outline-none focus:border-[#748C8C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171512] mb-1">
                          {language === 'fr' ? 'Email *' : 'Email *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="camille@exemple.fr"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl text-xs font-medium focus:outline-none focus:border-[#748C8C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171512] mb-1">
                        {language === 'fr' ? 'Précisions complémentaires (optionnel)' : 'Additional details (optional)'}
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          mode === 'visite'
                            ? (language === 'fr' ? 'Ex: Disponible jeudi à partir de 16h ou samedi matin...' : 'E.g. Available Thursday after 4pm...')
                            : (language === 'fr' ? 'Ex: Vos questions particulières sur le bien...' : 'E.g. Any questions about the property...')
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-[#171512]/15 rounded-xl text-xs font-medium focus:outline-none focus:border-[#748C8C]"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-xs shadow-brand flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'fr' ? 'Transmission au CRM…' : 'Submitting to CRM…'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {mode === 'visite'
                            ? (language === 'fr' ? 'Confirmer ma demande de visite' : 'Confirm viewing request')
                            : (language === 'fr' ? 'Envoyer ma demande d\'informations' : 'Send inquiry')}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Immediate Agency Contact Alternative */}
                  <div className="pt-2 text-center text-[11px] text-[#6F6255] flex flex-wrap items-center justify-center gap-3">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#748C8C]" />
                      <span>{language === 'fr' ? 'Sans engagement · Réponse rapide' : 'No commitment · Fast reply'}</span>
                    </span>
                    <span>·</span>
                    <a
                      href="tel:+33556000000"
                      className="text-[#171512] font-semibold hover:text-[#748C8C] inline-flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3 h-3 text-[#748C8C]" />
                      <span>05 56 00 00 00</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
