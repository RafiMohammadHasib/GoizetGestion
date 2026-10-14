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
  navProperties: { fr: 'Nos Biens', en: 'Properties' },
  navManagement: { fr: 'Nos services', en: 'Our Services' },
  navDistricts: { fr: 'Quartiers', en: 'Districts' },
  navAbout: { fr: 'La Maison', en: 'About Us' },
  navJournal: { fr: 'Journal', en: 'Journal' },
  navContact: { fr: 'Contact', en: 'Contact' },
  btnCallback: { fr: 'Être rappelé', en: 'Request Callback' },
  btnEstimate: { fr: 'Estimer mon bien', en: 'Estimate Property' },
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
  tabOwner: { fr: 'Propriétaire', en: 'Property Owner' },
  tabOwnerSub: { fr: 'Louer ou vendre mon bien', en: 'Rent out or sell my property' },
  tabTenantBuyer: { fr: 'Locataire / Acheteur', en: 'Tenant / Buyer' },
  tabTenantBuyerSub: { fr: 'Louer ou acheter un bien', en: 'Rent or buy a property' },
  optRentOutProperty: { fr: 'Louer mon bien', en: 'Rent out my property' },
  optSellProperty: { fr: 'Vendre mon bien', en: 'Sell my property' },
  optRentProperty: { fr: 'Louer un bien', en: 'Rent a property' },
  optBuyProperty: { fr: 'Acheter un bien', en: 'Buy a property' },
  fieldFullName: { fr: 'Nom et prénom', en: 'Full Name' },
  fieldPhone: { fr: 'Numéro de téléphone', en: 'Phone Number' },
  fieldPropTypeSelect: { fr: 'Type de bien', en: 'Property Type' },
  propApartment: { fr: 'Appartement', en: 'Apartment' },
  propHouse: { fr: 'Maison', en: 'House' },
  propBuilding: { fr: 'Immeuble', en: 'Building' },
  fieldAdditionalInfo: { fr: 'Informations complémentaires', en: 'Additional Information' },
  fieldAdditionalInfoPlaceholder: {
    fr: 'Bonjour, j\'ai un appartement de 70 m² que je souhaite louer sous deux semaines. J\'attends votre appel.',
    en: 'Hello, I have a 70 m² apartment that I would like to rent out within the next two weeks. I\'m waiting for your call.'
  },
  fieldMaxBudget: { fr: 'Budget maximum (€)', en: 'Maximum Budget (€)' },
  fieldBedrooms: { fr: 'Nombre de chambres', en: 'Number of Bedrooms' },
  bedrooms1: { fr: '1 chambre', en: '1 bedroom' },
  bedrooms2: { fr: '2 chambres', en: '2 bedrooms' },
  bedrooms3: { fr: '3 chambres', en: '3 bedrooms' },
  bedrooms4Plus: { fr: '4 chambres ou plus', en: '4 or more bedrooms' },
  btnSubmitLeadOwner: { fr: 'Demander à être contacté', en: 'Request Contact' },
  btnSubmitLeadTenant: { fr: 'Lancer ma recherche', en: 'Search Properties' },
  leadSuccessMsg: { fr: 'Demande bien reçue ! Nos conseillers vous recontactent sous 2h.', en: 'Request received! Our team will reach out within 2 hours.' },
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

  // Approach Section Updates
  approachParagraph: {
    fr: 'Chez Goizet Gestion nous mettons la priorité absolue sur l’efficacité et la disponibilité pour chacun de nos clients.',
    en: 'At Goizet Gestion, we place absolute priority on efficiency and availability for each of our clients.'
  },
  approachQuote: {
    fr: '“Nous offrons une expérience client personnalisée et adaptée pour chacun”',
    en: '“We offer a personalized and tailored client experience for everyone”'
  },
  approachPoint2Title: {
    fr: 'Mise en location et gestion',
    en: 'Letting & Management'
  },
  approachPoint2Desc: {
    fr: 'Nous nous occupons de tout de A à Z avec des processus simples et efficaces',
    en: 'We take care of everything from A to Z with simple and effective processes'
  },

  // 3 Streamlined Services
  serviceRentalDescShort: {
    fr: 'Notre service de mise en location est simple : nous nous occupons de tout pour vous.',
    en: 'Our rental service is simple: we take care of everything for you.'
  },
  serviceManagementDescShort: {
    fr: 'Nous offrons une gestion locative efficace et personnalisée pour vos biens en location.',
    en: 'We offer efficient and personalized property management for your rental properties.'
  },
  serviceSalesDescShort: {
    fr: 'Travaillons ensemble pour vendre votre bien au meilleur prix possible.',
    en: 'Let’s work together to sell your property at the best possible price.'
  },

  // About Section Updates
  aboutHeadlineNew: {
    fr: 'Nos chiffres traduisent l’investissement pour nos clients.',
    en: 'Our numbers reflect our dedication to our clients.'
  },
  aboutDistrictNew: {
    fr: 'Fondée à Bordeaux au cœur du quartier Fondaudège, nous reconstruisons la relation entre propriétaires et locataires avec une réactivité irréprochable.',
    en: 'Founded in Bordeaux in the heart of the Fondaudège district, we rebuild the relationship between owners and tenants with flawless responsiveness.'
  },
  statSatisfaction: {
    fr: 'Taux de satisfaction client',
    en: 'Client satisfaction rate'
  },
  statUnpaidRent: {
    fr: 'Taux de loyers impayés',
    en: 'Unpaid rent rate'
  },
  statResponseTime: {
    fr: 'Délai moyen de réponse',
    en: 'Average response time'
  },

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

  // Owner Demand #1 Pillar Services & Strong CTAs
  btnEntrust: { fr: 'Confier mon bien', en: 'Entrust Property' },
  btnRentalValuation: { fr: 'Obtenir une estimation locative', en: 'Get a rental valuation' },
  btnContactUs: { fr: 'Nous contacter', en: 'Contact us' },
  btnSpeakWithAdvisor: { fr: 'Échanger avec un conseiller', en: 'Speak with an advisor' },
  btnStartManagement: { fr: 'Démarrer ma gestion', en: 'Start Management Agreement' },
  
  // 4 Core Owner Services
  serviceRentalManagementTitle: { fr: 'Gestion Locative 360°', en: 'Rental Management' },
  serviceRentalManagementSubtitle: { fr: 'Sérénité absolue & Loyers 100% garantis', en: 'Zero hassle & 100% guaranteed rent disbursements' },
  serviceRentalManagementDesc: {
    fr: 'Encaissement des loyers, gestion comptable, juridique et technique, garantie loyers impayés (GLI) intégrée sans carence.',
    en: 'Full rent collection, legal, technical, and accounting management with zero-delay rent default insurance (GLI).'
  },

  servicePropertyLettingTitle: { fr: 'Mise en Location', en: 'Property Letting' },
  servicePropertyLettingSubtitle: { fr: 'Attirer et sélectionner les meilleurs locataires', en: 'Attracting and vetting top-tier tenants' },
  servicePropertyLettingDesc: {
    fr: 'Reportage photo HD professionnel, diffusion multi-canaux premium, sélection rigoureuse des dossiers et état des lieux certifié.',
    en: 'HD architectural photography, multi-channel exposure, rigorous solvability vetting, and certified digital inventory.'
  },

  serviceRentalValuationTitle: { fr: 'Estimation Locative & Vente', en: 'Rental Valuation' },
  serviceRentalValuationSubtitle: { fr: 'Étude comparative de marché sous 48h', en: 'Data-driven Bordeaux yield appraisal in 48h' },
  serviceRentalValuationDesc: {
    fr: 'Audit précis du loyer conforme à l\'encadrement des loyers bordelais et valorisation patrimoniale actualisée.',
    en: 'Accurate rent analysis compliant with Bordeaux rent control regulations and updated sales market appraisal.'
  },

  servicePropertySalesTitle: { fr: 'Vente Immobilière de Prestige', en: 'Property Sales' },
  servicePropertySalesSubtitle: { fr: 'Valorisation & Transaction sur-mesure', en: 'Luxury valuation & bespoke transaction' },
  servicePropertySalesDesc: {
    fr: 'Stratégie de commercialisation ciblée, réseau d\'acquéreurs qualifiés et accompagnement notarié jusqu\'à l\'acte authentique.',
    en: 'Targeted marketing, pre-qualified buyer network, and comprehensive legal support through final notarized closing.'
  },

  // Owner Form & Modal labels
  modalEntrustTitle: { fr: 'Confier votre bien à Bordeaux', en: 'Entrust us with your Bordeaux property' },
  modalEntrustSubtitle: { fr: 'Gestion locative, mise en location, estimation ou vente : nos associés vous accompagnent sous 2h.', en: 'Rental management, letting, valuation or sales: our partners respond within 2h.' },
  stepServiceSelect: { fr: 'Votre projet', en: 'Your Objective' },
  stepPropertyInfo: { fr: 'Votre bien', en: 'Property Details' },
  stepContactInfo: { fr: 'Vos coordonnées', en: 'Contact Information' },
  optRentalManagement: { fr: 'Gestion Locative Complète', en: 'Complete Rental Management' },
  optPropertyLetting: { fr: 'Mise en Location Seule', en: 'Tenant Placement Only' },
  optRentalValuation: { fr: 'Estimation de Loyer / Vente', en: 'Rental / Sales Valuation' },
  optPropertySales: { fr: 'Vendre mon bien', en: 'Property Sales' },

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
        queueMicrotask(() => {
          setLanguageState(savedLang);
        });
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

