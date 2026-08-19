'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

interface Dictionary {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export const dictionary: Dictionary = {
  // Header & Nav
  navHome: { fr: 'Accueil', en: 'Home' },
  navRent: { fr: 'Louer', en: 'Rent' },
  navBuy: { fr: 'Acheter', en: 'Buy' },
  navManagement: { fr: 'Gestion locative', en: 'Management' },
  navDistricts: { fr: 'Quartiers', en: 'Districts' },
  navJournal: { fr: 'Journal', en: 'Journal' },
  navContact: { fr: 'Contact', en: 'Contact' },
  btnCallback: { fr: 'Être rappelé', en: 'Request Callback' },
  btnEstimate: { fr: 'Estimer mon bien', en: 'Valuate Property' },
  badgeBordeaux: { fr: 'BORDEAUX', en: 'BORDEAUX' },

  // Hero Section
  heroBadge: {
    fr: 'Maison de Conseil Immobilier & Gestion Locative à Bordeaux',
    en: 'Real Estate Advisory & Property Management in Bordeaux'
  },
  heroTitleLine1: { fr: 'Votre bien mérite', en: 'Your property deserves' },
  heroTitleLine2: { fr: 'une gestion différente.', en: 'a modern approach.' },
  heroSub: {
    fr: 'Location, gestion locative optimisée et accompagnement immobilier d\'exception au cœur de Bordeaux. Transparence totale et visibilité maximale.',
    en: 'Rental, optimized property management, and boutique real estate services in Bordeaux. Total transparency and maximum exposure.'
  },
  tabRent: { fr: 'Louer un bien', en: 'Rent a Property' },
  tabBuy: { fr: 'Acheter un bien', en: 'Buy a Property' },
  fieldPropType: { fr: 'Type de bien', en: 'Property Type' },
  fieldSector: { fr: 'Quartier / Secteur', en: 'District / Area' },
  fieldBudget: { fr: 'Budget Max', en: 'Max Budget' },
  btnSearch: { fr: 'Trouver un bien', en: 'Search Properties' },
  btnExploreAll: { fr: 'Découvrir tous nos biens', en: 'Explore All Properties' },
  linkOwnerHero: { fr: 'Vous souhaitez louer votre bien ?', en: 'Looking to rent out your property?' },

  // Value Strip
  trust1Title: { fr: 'Orienté Résultats', en: 'Results Driven' },
  trust1Desc: { fr: 'Vacance locative optimisée et rentabilité maximale garantie.', en: 'Minimized void periods & maximized yield performance.' },
  trust2Title: { fr: 'Gestion Plus Simple', en: 'Streamlined Management' },
  trust2Desc: { fr: 'Dossiers 100% numérisés et espaces propriétaires en temps réel.', en: '100% digitalized records & real-time owner portal.' },
  trust3Title: { fr: 'Visibilité Maximale', en: 'Maximum Visibility' },
  trust3Desc: { fr: 'Multi-diffusion ciblée et visuels professionnels HD.', en: 'Targeted multi-channel exposure & HD photography.' },
  trust4Title: { fr: 'Accompagnement Humain', en: 'Dedicated Expert' },
  trust4Desc: { fr: 'Un conseiller unique dédié à votre patrimoine bordelais.', en: 'A dedicated local advisor for your Bordeaux portfolio.' },

  // Services
  servicesBadge: { fr: 'NOS SERVICES IMMOBILIERS', en: 'OUR REAL ESTATE SERVICES' },
  servicesTitle: { fr: 'Des prestations conçues pour maximiser votre patrimoine.', en: 'Tailored services engineered to maximize your portfolio.' },
  
  // Landlord CTA
  ownerBadge: { fr: 'Propriétaires & Bailleurs à Bordeaux', en: 'Property Owners & Landlords in Bordeaux' },
  ownerTitle: { fr: 'Vous êtes propriétaire ?', en: 'Are you a property owner?' },
  ownerTitleSub: { fr: 'Maximisez le rendement de votre bien.', en: 'Maximize your property return.' },
  ownerDesc: {
    fr: 'Confiez votre appartement ou maison à une équipe bordelaise qui privilégie l\'efficacité, la visibilité multi-canaux et la tranquillité d\'esprit totale.',
    en: 'Entrust your apartment or townhouse to a Bordeaux team prioritizing efficiency, multi-channel exposure, and complete peace of mind.'
  },
  ownerStat1: { fr: 'de vacance locative moyenne', en: 'average vacancy duration' },
  ownerStat2: { fr: 'de garanties loyers impayés', en: 'rent default insurance coverage' },
  ownerStat3: { fr: 'de délai de réponse moyen', en: 'average advisory response time' },

  // Footer
  footerTagline: {
    fr: 'Une nouvelle vision de la gestion locative & de l\'immobilier bordelais.',
    en: 'A modern vision for property management & luxury real estate in Bordeaux.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    if (dictionary[key]) {
      return dictionary[key][language] || dictionary[key]['fr'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
