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

            <p className="text-sm text-[#A2B2B2] max-w-xl font-light leading-relaxed">
              {language === 'fr'
                ? 'Nous allions la réactivité d\'une plateforme technologique moderne à l\'exigence d\'une maison de conseil immobilier sur-mesure. Transparence, valorisation et rendement optimisé.'
                : 'We combine the speed of a modern technology platform with the standards of a boutique real estate advisory. Transparency, asset valuation, and optimized returns.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/confier-un-bien"
                className="bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 px-6 rounded-full font-semibold text-xs transition-all duration-300 shadow-brand flex items-center space-x-2 whitespace-nowrap"
              >
                <span>{t('btnEntrust')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href="/estimation"
                className="border border-white/20 hover:bg-white hover:text-[#171512] text-white py-3.5 px-6 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap flex items-center space-x-2"
              >
                <span>{t('btnRentalValuation')}</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-16 border-b border-white/10 text-xs">
          
          {/* Col 1: Propriétaires */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {language === 'fr' ? 'Propriétaires & Bailleurs' : 'Property Owners & Landlords'}
            </h3>
            <ul className="space-y-2.5 text-[#9E9285]">
              <li>
                <Link href="/confier-un-bien" className="text-[#748C8C] hover:text-white font-semibold transition-colors flex items-center space-x-1">
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
                <Link href="/confier-un-bien" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Mise en Location' : 'Property Letting'}
                </Link>
              </li>
              <li>
                <Link href="/estimation" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Estimation Locative & Vente' : 'Rental Valuation'}
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=vente" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Vente Immobilière de Prestige' : 'Property Sales'}
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
          {/* Col 5: Contact & Adresse */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
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

        {/* Bottom Legal, Copyright & Developer Credit Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#A2B2B2] space-y-4 md:space-y-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span>
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
