'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck, Cookie, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { isValidEmail } from '@/lib/security';

interface FooterProps {
  onOpenCallback?: () => void;
  onOpenEntrust?: () => void;
  onOpenCookieSettings?: () => void;
}

export default function Footer({ onOpenCallback, onOpenEntrust, onOpenCookieSettings }: FooterProps) {
  const { language, t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(newsletterEmail)) {
      setError(language === 'fr' ? 'Email invalide' : 'Invalid email');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#121818] text-[#F7F5F0] pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#748C8C]/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#4F6565]/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Editorial Callout & Newsletter Glass Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-cream.png"
                alt="GOIZET GESTION"
                className="h-10 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/15 px-3 py-1 rounded-full border border-[#748C8C]/30">
              <Sparkles className="w-3 h-3" />
              <span>GOIZET GESTION BORDEAUX</span>
            </div>

            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-white leading-tight">
              {t('footerTagline')}
            </h2>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href="/#lead-section"
                className="bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 px-7 rounded-full font-semibold text-xs transition-all duration-300 shadow-brand flex items-center space-x-2 whitespace-nowrap"
              >
                <span>{language === 'fr' ? 'Confier mon bien' : 'Entrust Property'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href="/contact"
                className="border border-white/20 hover:bg-white hover:text-[#171512] text-white py-3.5 px-7 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap flex items-center space-x-2"
              >
                <span>{language === 'fr' ? 'Nous contacter' : 'Contact us'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#748C8C]/20 blur-3xl pointer-events-none rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C] block">
              {language === 'fr' ? 'LE JOURNAL & ANALYSES DE MARCHÉ' : 'NEWSLETTER & MARKET INSIGHTS'}
            </span>
            <h3 className="font-serif-display text-2xl font-medium text-white">
              {language === 'fr' ? 'Recevez nos études sur l\'immobilier à Bordeaux' : 'Receive our Bordeaux market reports'}
            </h3>
            <p className="text-xs text-[#A2B2B2] leading-relaxed">
              {language === 'fr'
                ? 'Analyses de la tension locative, plafonds de loyers et opportunités d\'investissement exclusives.'
                : 'Quarterly rental yield reports, rent cap updates, and exclusive off-market listings.'}
            </p>

            {subscribed ? (
              <div className="p-4 bg-[#748C8C]/20 border border-[#748C8C]/40 rounded-xl text-xs text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#748C8C] shrink-0" />
                <span>{language === 'fr' ? 'Merci ! Vous êtes désormais inscrit à notre Journal.' : 'Thank you! You are now subscribed.'}</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    required
                    placeholder={language === 'fr' ? 'votre.email@exemple.fr' : 'your.email@example.com'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#748C8C]"
                  />
                  <button
                    type="submit"
                    className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 whitespace-nowrap shrink-0 shadow-brand"
                  >
                    <span>{language === 'fr' ? 'S\'abonner' : 'Subscribe'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-red-400 pl-1">{error}</p>}
              </form>
            )}

            <p className="text-[10px] text-white/40">
              {language === 'fr' ? 'Zéro spam. Désabonnement en 1 clic. Vos données restent 100% confidentielles.' : 'Zero spam. Unsubscribe anytime. Your data remains strictly confidential.'}
            </p>
          </div>

        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-white/10 text-xs">
          
          {/* Col 1: Propriétaires & Bailleurs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Propriétaires & Bailleurs' : 'Property Owners & Landlords'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/#lead-section" className="text-[#748C8C] hover:text-white font-semibold transition-colors flex items-center space-x-1">
                  <span>{language === 'fr' ? 'Confier mon bien' : 'Entrust your property'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/gestion-locative" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Gestion Locative 360°' : 'Rental Management'}
                </Link>
              </li>
              <li>
                <Link href="/estimation" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Estimation Locative & Vente' : 'Rental Valuation'}
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=vente" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Vente Immobilière' : 'Property Sales'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: La Maison & Méthode */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'La Maison Goizet' : 'About Goizet'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Les Fondateurs' : 'Meet the Founders'}
                </Link>
              </li>
              <li>
                <Link href="/gestion-locative" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Notre Méthode de Gestion' : 'Management Method'}
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Nos Valeurs & Chiffres' : 'Our Values & Numbers'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Nous Contacter' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Adresse */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Agence & Contacts' : 'Bordeaux Office & Contacts'}
            </h3>
            <div className="space-y-3 text-[#A2B2B2] text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#748C8C] shrink-0 mt-0.5" />
                <span>48 rue Calvé, 33000 Bordeaux</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-white/5">
                <a href="tel:+33695577033" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <span>Paul : +33 6 95 57 70 33</span>
                </a>
                <a href="tel:+33781968395" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <span>Edgar : +33 7 81 96 83 95</span>
                </a>
              </div>
              <div className="pt-1">
                <a href="mailto:goizetgestion@gmail.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-[#748C8C] shrink-0" />
                  <span className="truncate">goizetgestion@gmail.com</span>
                </a>
              </div>
              <div className="pt-2 border-t border-white/5 space-y-1 text-[10px] text-white/50">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <span>CPI33012025000000128 (CCI Bordeaux)</span>
                </div>
                <div className="pl-5">
                  <span>SIRET 944 393 487 00011</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* 🏛️ MODERN ARCHITECTURAL BRAND WATERMARK                   */}
        {/* ========================================================== */}
        <div className="w-full select-none pointer-events-none overflow-hidden pt-8 pb-2 border-t border-white/10 relative">
          <div className="w-full flex items-center justify-center text-center">
            <span className="font-serif-display font-light text-[11vw] sm:text-[12.5vw] lg:text-[13vw] leading-none tracking-tight uppercase whitespace-nowrap bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-transparent bg-clip-text text-transparent">
              GOIZET GESTION
            </span>
          </div>
        </div>

        {/* Bottom Legal, Copyright & Developer Credit Bar */}
        <div className="pt-2 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#A2B2B2] space-y-4 md:space-y-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span suppressHydrationWarning>
              © {new Date().getFullYear()} GOIZET GESTION. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>
              {language === 'fr' ? 'Développé par ' : 'Developed by '}
              <a
                href="https://euroitechnology.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-[#748C8C] transition-colors underline underline-offset-2"
              >
                EURO IT
              </a>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              {language === 'fr' ? 'Mentions Légales' : 'Legal Notice'}
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              {language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </Link>
            <Link href="/conditions-generales" className="hover:text-white transition-colors">
              {language === 'fr' ? 'Conditions Générales' : 'Terms & Conditions'}
            </Link>
            <button
              onClick={onOpenCookieSettings}
              className="hover:text-white transition-colors inline-flex items-center space-x-1"
            >
              <Cookie className="w-3 h-3 text-[#748C8C]" />
              <span>{language === 'fr' ? 'Gérer les cookies' : 'Manage Cookies'}</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
