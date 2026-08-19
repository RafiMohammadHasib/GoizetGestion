'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    project: 'Gestion locative',
    timeSlot: 'Matin (9h - 12h)'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Auto close after 3s
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    }, 500);
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
                <div className="w-16 h-16 bg-[#7A2234]/10 text-[#7A2234] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
                  Demande de rappel enregistrée
                </h3>
                <p className="text-sm text-[#6F6255] max-w-sm mx-auto">
                  Un conseiller spécialisé Maison Méridia vous rappellera à la créneau souhaité (<span className="font-medium text-[#171512]">{formData.timeSlot}</span>).
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#7A2234] mb-2">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Rappel Gratuit & Immédiat</span>
                  </div>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-[#171512]">
                    Échangez avec un expert immobilier à Bordeaux.
                  </h3>
                  <p className="text-xs text-[#6F6255] mt-1">
                    Indiquez vos coordonnées et votre projet. Nous vous contactons en moins de 2 heures.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Martin Duprat"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#171512]/15 rounded-xl text-sm focus:outline-none focus:border-[#7A2234] focus:ring-1 focus:ring-[#7A2234] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                      Téléphone de contact *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#171512]/15 rounded-xl text-sm focus:outline-none focus:border-[#7A2234] focus:ring-1 focus:ring-[#7A2234] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                        Votre projet
                      </label>
                      <select
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className="w-full px-3 py-3 bg-white border border-[#171512]/15 rounded-xl text-sm focus:outline-none focus:border-[#7A2234] transition-all"
                      >
                        <option value="Gestion locative">Mettre en gestion</option>
                        <option value="Estimation">Estimation locative/vente</option>
                        <option value="Louer un bien">Louer un appartement</option>
                        <option value="Acheter">Projet d'achat</option>
                        <option value="Autre">Autre demande</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#171512] mb-1.5">
                        Créneau de rappel
                      </label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full px-3 py-3 bg-white border border-[#171512]/15 rounded-xl text-sm focus:outline-none focus:border-[#7A2234] transition-all"
                      >
                        <option value="Matin (9h - 12h)">Matin (9h - 12h)</option>
                        <option value="Après-midi (14h - 17h)">Après-midi (14h - 17h)</option>
                        <option value="Fin de journée (17h - 19h)">Fin de journée (17h - 19h)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#7A2234] hover:bg-[#5C1D27] text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Confirmer ma demande de rappel</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-[#6F6255] pt-1">
                    Vos données restent strictement confidentielles selon les normes RGPD. Aucun spam.
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
