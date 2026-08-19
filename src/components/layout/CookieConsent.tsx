'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export default function CookieConsent({ forceOpenModal, onCloseModal }: CookieConsentProps) {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('maison_meridia_cookie_consent');
    if (!consent && !forceOpenModal) {
      // Show banner after 1.5s
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [forceOpenModal]);

  useEffect(() => {
    if (forceOpenModal) {
      setShowSettingsModal(true);
    }
  }, [forceOpenModal]);

  const handleAcceptAll = () => {
    const fullConsent = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('maison_meridia_cookie_consent', JSON.stringify(fullConsent));
    setShowBanner(false);
    setShowSettingsModal(false);
    if (onCloseModal) onCloseModal();
  };

  const handleDeclineAll = () => {
    const minConsent = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('maison_meridia_cookie_consent', JSON.stringify(minConsent));
    setShowBanner(false);
    setShowSettingsModal(false);
    if (onCloseModal) onCloseModal();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('maison_meridia_cookie_consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettingsModal(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      <AnimatePresence>
        {showBanner && !showSettingsModal && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 bg-[#171512] text-[#F7F5F0] rounded-2xl p-6 shadow-2xl border border-white/15 space-y-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#7A2234]/20 text-[#7A2234] flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif-display text-lg font-medium text-white">
                  {language === 'fr' ? 'Respect de votre vie privée' : 'We value your privacy'}
                </h4>
                <p className="text-xs text-[#9E9285] leading-relaxed">
                  {language === 'fr'
                    ? 'Maison Méridia utilise des cookies essentiels pour assurer le bon fonctionnement du site et mesurer notre audience de manière anonyme.'
                    : 'Maison Méridia uses cookies to ensure smooth site navigation and measure audience statistics anonymously.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 text-xs font-semibold">
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 bg-[#7A2234] hover:bg-[#5C1D27] text-white py-2.5 px-4 rounded-xl transition-all shadow text-center"
              >
                {language === 'fr' ? 'Tout accepter' : 'Accept All'}
              </button>
              <button
                onClick={handleDeclineAll}
                className="w-full sm:w-auto border border-white/20 hover:bg-white/10 text-white py-2.5 px-3 rounded-xl transition-all text-center"
              >
                {language === 'fr' ? 'Refuser' : 'Refuse'}
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 text-[#9E9285] hover:text-white transition-colors"
                title={language === 'fr' ? 'Personnaliser' : 'Customize'}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Cookie Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSettingsModal(false);
                if (onCloseModal) onCloseModal();
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#FAF9F6] text-[#171512] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#171512]/10 z-10 space-y-6"
            >
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="absolute top-5 right-5 text-[#171512]/50 hover:text-[#171512] p-1.5 rounded-full hover:bg-[#171512]/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'fr' ? 'GESTION DES COOKIES' : 'COOKIE PREFERENCES'}</span>
                </div>
                <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
                  {language === 'fr' ? 'Paramètres de vos cookies' : 'Manage Cookie Preferences'}
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Essential Cookies */}
                <div className="p-4 bg-white rounded-xl border border-[#171512]/10 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="font-semibold text-[#171512] block">
                      {language === 'fr' ? 'Cookies Essentiels (Nécessaires)' : 'Essential Cookies (Required)'}
                    </span>
                    <p className="text-[11px] text-[#6F6255]">
                      {language === 'fr'
                        ? 'Indispensables pour la navigation sécurisée, les demandes d\'estimation et la prise de rendez-vous.'
                        : 'Required for secure browsing, property search, and estimation forms.'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#7A2234] bg-[#7A2234]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {language === 'fr' ? 'Toujours Actif' : 'Always Active'}
                  </span>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 bg-white rounded-xl border border-[#171512]/10 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="font-semibold text-[#171512] block">
                      {language === 'fr' ? 'Mesure d\'Audience Anonyme' : 'Anonymous Analytics'}
                    </span>
                    <p className="text-[11px] text-[#6F6255]">
                      {language === 'fr'
                        ? 'Nous aident à mesurer la fréquentation de nos annonces et la vitesse de chargement.'
                        : 'Helps us analyze listing traffic and page performance anonymously.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#171512]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7A2234]" />
                  </label>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 bg-white rounded-xl border border-[#171512]/10 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="font-semibold text-[#171512] block">
                      {language === 'fr' ? 'Personnalisation & Contenus' : 'Personalization & Content'}
                    </span>
                    <p className="text-[11px] text-[#6F6255]">
                      {language === 'fr'
                        ? 'Permet d\'afficher des suggestions de biens adaptées à vos quartiers préférés.'
                        : 'Enables tailored property suggestions based on your search history.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#171512]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7A2234]" />
                  </label>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs font-semibold">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#7A2234] hover:bg-[#5C1D27] text-white py-3 rounded-xl transition-all shadow text-center"
                >
                  {language === 'fr' ? 'Enregistrer mes choix' : 'Save Preferences'}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="bg-[#171512] hover:bg-[#2C2723] text-white py-3 px-5 rounded-xl transition-all text-center"
                >
                  {language === 'fr' ? 'Tout autoriser' : 'Allow All'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
