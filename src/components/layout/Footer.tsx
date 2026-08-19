'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck, Cookie, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { isValidEmail } from '@/lib/security';

interface FooterProps {
  onOpenCallback?: () => void;
  onOpenCookieSettings?: () => void;
}

export default function Footer({ onOpenCallback, onOpenCookieSettings }: FooterProps) {
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
    <footer className="bg-[#12100E] text-[#F7F5F0] pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7A2234]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Editorial Callout & Newsletter Glass Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#7A2234] bg-[#7A2234]/15 px-3 py-1 rounded-full border border-[#7A2234]/30">
              <Sparkles className="w-3 h-3" />
              <span>MAISON MÉRIDIA BORDEAUX</span>
            </div>

            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-white leading-tight">
              {t('footerTagline')}
            </h2>

            <p className="text-sm text-[#9E9285] max-w-xl font-light leading-relaxed">
              {language === 'fr'
                ? 'Nous allions la réactivité d\'une plateforme technologique moderne à l\'exigence d\'une maison de conseil immobilier sur-mesure. Transparence, valorisation et rendement optimisé.'
                : 'We combine the speed of a modern technology platform with the standards of a boutique real estate advisory. Transparency, asset valuation, and optimized returns.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/estimation"
                className="bg-[#7A2234] hover:bg-[#5C1D27] text-white py-3.5 px-6 rounded-full font-semibold text-xs transition-all duration-300 shadow-xl flex items-center space-x-2 whitespace-nowrap"
              >
                <span>{t('btnEstimate')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onOpenCallback}
                className="border border-white/20 hover:bg-white hover:text-[#171512] text-white py-3.5 px-6 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap"
              >
                {t('btnCallback')}
              </button>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234] block">
              {language === 'fr' ? 'LE JOURNAL & ANALYSES DE MARCHÉ' : 'NEWSLETTER & MARKET INSIGHTS'}
            </span>
            <h3 className="font-serif-display text-2xl font-medium text-white">
              {language === 'fr' ? 'Recevez nos études sur l\'immobilier à Bordeaux' : 'Receive our Bordeaux market reports'}
            </h3>
            <p className="text-xs text-[#9E9285] leading-relaxed">
              {language === 'fr'
                ? 'Analyses de la tension locative, plafonds de loyers et opportunités d\'investissement exclusives.'
                : 'Quarterly rental yield reports, rent cap updates, and exclusive off-market listings.'}
            </p>

            {subscribed ? (
              <div className="p-4 bg-[#7A2234]/20 border border-[#7A2234]/40 rounded-xl text-xs text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#7A2234] shrink-0" />
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
                    className="flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#7A2234]"
                  />
                  <button
                    type="submit"
                    className="bg-[#7A2234] hover:bg-[#5C1D27] text-white px-5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 whitespace-nowrap shrink-0"
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-16 border-b border-white/10 text-xs">
          
          {/* Col 1: Propriétaires */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Propriétaires' : 'Property Owners'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/estimation" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Estimation en ligne' : 'Online Property Valuation'}
                </Link>
              </li>
              <li>
                <Link href="/gestion-locative" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Mandat de Gestion Locative' : 'Property Management Agreement'}
                </Link>
              </li>
              <li>
                <Link href="/gestion-locative#garanties" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Garantie Loyers Impayés (GLI)' : 'Rent Default Insurance'}
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=vente" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Vendre un bien à Bordeaux' : 'Sell Property in Bordeaux'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Recherche / Locataires */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Immobilier & Recherche' : 'Real Estate Search'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/biens?type=louer" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Appartements à louer' : 'Apartments for Rent'}
                </Link>
              </li>
              <li>
                <Link href="/biens?type=louer&propertyType=echoppe" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Échoppes & Maisons' : 'Townhouses & Villas'}
                </Link>
              </li>
              <li>
                <Link href="/biens?type=acheter" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Ventes & Biens d\'exception' : 'Properties for Sale'}
                </Link>
              </li>
              <li>
                <Link href="/biens?exclusive=true" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Projets Exclusifs' : 'Exclusive Listings'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quartiers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Secteurs Bordeaux' : 'Bordeaux Districts'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/quartiers/chartrons" className="hover:text-white transition-colors">
                  Chartrons
                </Link>
              </li>
              <li>
                <Link href="/quartiers/cauderan" className="hover:text-white transition-colors">
                  Caudéran
                </Link>
              </li>
              <li>
                <Link href="/quartiers/triangle-dor" className="hover:text-white transition-colors">
                  Triangle d'Or
                </Link>
              </li>
              <li>
                <Link href="/quartiers/bastide" className="hover:text-white transition-colors">
                  Bastide Rive Droite
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Le Journal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Le Journal' : 'The Journal'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Analyses du Marché' : 'Market Insights'}
                </Link>
              </li>
              <li>
                <Link href="/journal/quel-quartier-choisir-pour-louer-appartement-bordeaux" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Guide d\'Investissement' : 'Investment Guide'}
                </Link>
              </li>
              <li>
                <Link href="/journal/gestion-locative-bordeaux-seul-ou-agence" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Encadrement des Loyers' : 'Rent Control Rules'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Adresse */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Agence Bordeaux' : 'Bordeaux Office'}
            </h3>
            <div className="space-y-3 text-[#9E9285] text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#7A2234] shrink-0 mt-0.5" />
                <span>38 Cours Portal, 33000 Bordeaux (Chartrons)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#7A2234] shrink-0" />
                <span>05 56 00 12 34</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#7A2234] shrink-0" />
                <span>contact@maison-meridia.fr</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center space-x-2 text-[10px] text-white/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7A2234]" />
                <span>CPI 3301 2026 000 012 — CCI Bordeaux</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal, Copyright & Developer Credit Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#9E9285] space-y-4 md:space-y-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span>
              © {new Date().getFullYear()} MAISON MÉRIDIA SARL. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>
              {language === 'fr' ? 'Développé par ' : 'Developed by '}
              <a
                href="https://euroitechnology.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-[#7A2234] transition-colors underline underline-offset-2"
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
              <Cookie className="w-3 h-3 text-[#7A2234]" />
              <span>{language === 'fr' ? 'Gérer les cookies' : 'Manage Cookies'}</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
