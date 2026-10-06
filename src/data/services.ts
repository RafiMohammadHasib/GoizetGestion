import { ShieldCheck, Tag, Key, LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: 'gestion-locative' | 'vente-immobiliere' | 'mise-en-location';
  serviceKey: 'Rental management' | 'Property sales' | 'Property letting';
  title: {
    fr: string;
    en: string;
  };
  subtitle: {
    fr: string;
    en: string;
  };
  badge: {
    fr: string;
    en: string;
  };
  shortDescription: {
    fr: string;
    en: string;
  };
  fullDescription: {
    fr: string;
    en: string;
  };
  deliverables: {
    fr: string[];
    en: string[];
  };
  href: string;
  ctaText: {
    fr: string;
    en: string;
  };
  ctaButton: {
    fr: string;
    en: string;
  };
  icon: LucideIcon;
}

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'gestion-locative',
    serviceKey: 'Rental management',
    title: {
      fr: 'Gestion Locative',
      en: 'Property Management'
    },
    subtitle: {
      fr: 'Sérénité & Performance',
      en: 'Peace of Mind & Yield'
    },
    badge: {
      fr: 'Gestion',
      en: 'Management'
    },
    shortDescription: {
      fr: 'Nous offrons une gestion locative efficace et personnalisée pour vos biens en location.',
      en: 'We offer efficient and personalized rental management for your rental properties.'
    },
    fullDescription: {
      fr: 'Une gestion locative haut de gamme et personnalisée pour vos biens à Bordeaux. Encaissement des loyers, gestion comptable, juridique et technique, garantie loyers impayés intégrée sans carence.',
      en: 'Boutique and tailored rental management for your Bordeaux properties. Rent collection, legal, technical and accounting management with zero-delay rent default insurance.'
    },
    deliverables: {
      fr: [
        'Encaissement des loyers & virement automatique dès le 1er du mois',
        'Garantie de loyer impayé GarantMe à 2,9% d’un mois de loyer',
        'Gestion des interventions techniques et sinistres par artisans certifiés bordelais',
        'Une réactivité irréprochable pour une gestion fluide et transparente'
      ],
      en: [
        'Automated rent collection & automatic transfer from the 1st of the month',
        'GarantMe unpaid rent guarantee at 2.9% of a month\'s rent',
        'Management of technical maintenance and claims by certified local artisans',
        'Flawless responsiveness for smooth and transparent property management'
      ]
    },
    href: '/gestion-locative',
    ctaText: {
      fr: 'Découvrir la gestion locative',
      en: 'Explore Property Management'
    },
    ctaButton: {
      fr: 'Confier mon bien en gestion',
      en: 'Start Rental Management'
    },
    icon: ShieldCheck
  },
  {
    id: 'vente-immobiliere',
    serviceKey: 'Property sales',
    title: {
      fr: 'Vente Immobilière',
      en: 'Property Sales'
    },
    subtitle: {
      fr: 'Valorisation & Transaction',
      en: 'Valuation & Transaction'
    },
    badge: {
      fr: 'Transaction',
      en: 'Transaction'
    },
    shortDescription: {
      fr: 'Travaillons ensemble pour vendre votre bien au meilleur prix possible.',
      en: 'Let’s work together to sell your property at the best possible price.'
    },
    fullDescription: {
      fr: 'Commercialisation sur-mesure, valorisation photographique de prestige et mise en relation directe avec notre fichier d’acquéreurs qualifiés et financés.',
      en: 'Tailored marketing, prime architectural photography, and direct exposure to our vetted, pre-qualified buyer portfolio.'
    },
    deliverables: {
      fr: [
        'Estimation vénale argumentée et stratégie de valorisation personnalisée',
        'Accès exclusif à notre portefeuille d\'acquéreurs premium solvables',
        'Reportage photo HD professionnel et diffusion multi-portails ciblée',
        'Négociation experte et accompagnement juridique jusqu\'à l\'acte authentique'
      ],
      en: [
        'Comprehensive market valuation and custom property staging strategy',
        'Direct access to our qualified high-net-worth buyer database',
        'High-definition architectural photography and targeted prime portal syndication',
        'Expert negotiation and complete legal support through notary closing'
      ]
    },
    href: '/contact?subject=vente',
    ctaText: {
      fr: 'Vendre un bien',
      en: 'Sell Property'
    },
    ctaButton: {
      fr: 'Vendre un bien avec l\'agence',
      en: 'Sell Property with Us'
    },
    icon: Tag
  },
  {
    id: 'mise-en-location',
    serviceKey: 'Property letting',
    title: {
      fr: 'Mise en Location',
      en: 'Property Rental'
    },
    subtitle: {
      fr: 'Diffusion & Sélection',
      en: 'Marketing & Vetting'
    },
    badge: {
      fr: 'Bailleurs',
      en: 'Landlords'
    },
    shortDescription: {
      fr: 'Notre service de mise en location est simple : nous nous occupons de tout pour vous.',
      en: 'Our rental service is simple: we take care of everything for you.'
    },
    fullDescription: {
      fr: 'Diffusion multi-canaux premium, sélection rigoureuse des dossiers de locataires et réalisation d’états des lieux certifiés sur tablette.',
      en: 'Multi-portal prime syndication, strict tenant solvability screening, and certified digital tablet check-in inventories.'
    },
    deliverables: {
      fr: [
        'Reportage photo professionnel HD et mise en valeur soignée du bien',
        'Audit exhaustif des dossiers candidats (revenus nets supérieurs à 3x le loyer)',
        'Rédaction du bail de location conforme aux réglementations ALUR/ELAN',
        'État des lieux d\'entrée numérique certifié avec photos horodatées'
      ],
      en: [
        'Professional HD architectural photo shoot and curated presentation',
        'Exhaustive candidate vetting and solvency auditing (net income > 3x rent)',
        'Legally certified lease agreement drafting compliant with rent control laws',
        'Certified digital entry inventory with timestamped high-resolution photos'
      ]
    },
    href: '#lead-section',
    ctaText: {
      fr: 'Mettre en location',
      en: 'Let Property'
    },
    ctaButton: {
      fr: 'Rechercher un locataire',
      en: 'Find Qualified Tenants'
    },
    icon: Key
  }
];
