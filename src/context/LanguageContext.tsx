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
  // Navigation & Header
  navHome: { fr: 'Accueil', en: 'Home' },
  navRent: { fr: 'Louer', en: 'Rent' },
  navBuy: { fr: 'Acheter', en: 'Buy' },
  navManagement: { fr: 'Gestion locative', en: 'Management' },
  navDistricts: { fr: 'Quartiers', en: 'Districts' },
  navAbout: { fr: 'La Maison', en: 'About Us' },
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
  allPropertyTypes: { fr: 'Tous types de biens', en: 'All Property Types' },
  allDistricts: { fr: 'Tous secteurs de Bordeaux', en: 'All Bordeaux Districts' },
  anyBudget: { fr: 'Indifférent', en: 'Any Budget' },

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
  servicesLink: { fr: 'Découvrir tous nos mandats', en: 'Explore All Management Plans' },

  // Luxury GSAP Slider
  sliderBadge: { fr: 'COLLECTION EXCLUSIVE', en: 'EXCLUSIVE COLLECTION' },
  sliderTitle: { fr: 'Les résidences d\'exception.', en: 'Luxury Bordeaux Residences.' },
  sliderBtn: { fr: 'Découvrir cette résidence d\'exception', en: 'Explore Residence Details' },
  price: { fr: 'Prix', en: 'Price' },
  surface: { fr: 'Surface', en: 'Living Area' },
  bedrooms: { fr: 'Chambres', en: 'Bedrooms' },
  rooms: { fr: 'Pièces', en: 'Rooms' },
  forRent: { fr: 'À Louer', en: 'For Rent' },
  forSale: { fr: 'À Vendre', en: 'For Sale' },
  exclusiveBadge: { fr: 'Exclusivité', en: 'Exclusive' },
  perMonth: { fr: '/ mois', en: '/ mo' },

  // Property Showcase Section
  showcaseBadge: { fr: 'SÉLECTION PREMIUM DU MOMENT', en: 'CURRENT PREMIUM SELECTION' },
  showcaseTitle: { fr: 'Nos dernières opportunités à Bordeaux.', en: 'Latest Featured Opportunities.' },
  allPropertiesTab: { fr: 'Tous les biens', en: 'All Properties' },
  apartmentsTab: { fr: 'Appartements', en: 'Apartments' },
  townhousesTab: { fr: 'Échoppes & Maisons', en: 'Townhouses & Villas' },
  salesTab: { fr: 'Ventes exclusives', en: 'Exclusive Sales' },
  viewAllBtn: { fr: 'Voir tous les biens du catalogue', en: 'View All Available Properties' },

  // Bordeaux Explorer
  explorerBadge: { fr: 'EXPERTISES SECTORIELLES BORDEAUX', en: 'BORDEAUX DISTRICT EXPERTISE' },
  explorerTitle: { fr: 'Bien plus qu\'une agence. Une parfaite maîtrise du territoire bordelais.', en: 'More Than An Agency. Comprehensive Mastery of Bordeaux.' },
  explorerAll: { fr: 'Voir tous les secteurs de Bordeaux', en: 'View All Bordeaux Districts' },
  avgRent: { fr: 'Loyer Moyen', en: 'Average Rent' },
  avgSale: { fr: 'Prix Vente M2', en: 'Average Sale Price' },
  demandScore: { fr: 'Tension', en: 'Demand' },
  exploreDistrict: { fr: 'Explorer le quartier', en: 'Explore District' },

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
  ownerBtn: { fr: 'Estimer le loyer de mon bien', en: 'Valuate My Property Rent' },
  ownerSecondaryBtn: { fr: 'Découvrir nos formules de gestion', en: 'Explore Management Plans' },

  // Process Timeline
  processBadge: { fr: 'LE PARCOURS PROPRIÉTAIRE', en: 'THE LANDLORD JOURNEY' },
  processTitle: { fr: 'Une gestion locative fluide, étape par étape.', en: 'Seamless property management, step by step.' },
  processSub: {
    fr: 'Découvrez comment nous transformons la location de votre bien en une expérience sans friction.',
    en: 'Discover how we turn renting out your property into a frictionless experience.'
  },

  // Testimonials
  testimonialsBadge: { fr: 'TÉMOIGNAGES CLIENTS', en: 'CLIENT REVIEWS' },
  testimonialsTitle: { fr: 'Ce que disent nos propriétaires & locataires.', en: 'What our owners & tenants say.' },
  testimonialsSub: {
    fr: 'Une confiance accordée au quotidien pour la gestion et la valorisation de leur patrimoine immobilier à Bordeaux.',
    en: 'Daily trust placed in our team for managing and growing property wealth in Bordeaux.'
  },

  // Journal Section
  journalBadge: { fr: 'LE JOURNAL IMMOBILIER', en: 'REAL ESTATE JOURNAL' },
  journalTitle: { fr: 'Analyses, conseils & tendances du marché bordelais.', en: 'Market analysis, insights & Bordeaux trends.' },
  journalAll: { fr: 'Consulter tous les articles du Journal', en: 'Browse All Journal Articles' },
  readArticle: { fr: 'Lire l\'article', en: 'Read Article' },

  // Footer
  footerTagline: {
    fr: 'Une nouvelle vision de la gestion locative & de l\'immobilier bordelais.',
    en: 'A modern vision for property management & luxury real estate in Bordeaux.'
  },

  // Common UI
  resetFilters: { fr: 'Réinitialiser', en: 'Reset Filters' },
  loading: { fr: 'Chargement en cours…', en: 'Loading…' },
  backToHome: { fr: 'Retour à l\'accueil', en: 'Back to Home' },
  pageNotFound: { fr: 'Page non trouvée', en: 'Page Not Found' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('simplerent_lang') as Language;
      if (savedLang === 'fr' || savedLang === 'en') {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('simplerent_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore localStorage errors
    }
  };

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

