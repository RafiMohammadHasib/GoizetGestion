export type TransactionType = 'louer' | 'acheter';
export type PropertyType = 'appartement' | 'maison' | 'loft' | 'echoppe' | 'hotel-particulier';
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Property {
  id: string;
  title: string;
  slug: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  price: number; // in Euros
  priceSuffix?: string; // e.g. "/ mois CC" or "FAI"
  location: string; // e.g. "Bordeaux — Chartrons"
  neighborhoodSlug: string;
  address: string;
  surface: number; // m²
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  energyRating: EnergyRating;
  gesRating: EnergyRating;
  description: string;
  features: string[];
  images: string[];
  isExclusive?: boolean;
  isFeatured?: boolean;
  availabilityDate?: string;
  charges?: number;
  deposit?: number;
  virtualTourUrl?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  postalCode: string;
  tagline: string;
  description: string;
  avgRentPerM2: number; // e.g. 18.5 €/m²
  avgSalePerM2: number; // e.g. 5200 €/m²
  demandScore: number; // out of 10
  highlights: string[];
  image: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or rich HTML
  category: 'Conseils Propriétaires' | 'Gestion Locative' | 'Marché Bordeaux' | 'Quartiers de Bordeaux' | 'Conseils Locataires';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g. "Propriétaire bailleur — Chartrons"
  location: string;
  quote: string;
  rating: number;
  propertyType: string;
  image?: string;
}

export interface EstimationFormData {
  propertyType: PropertyType;
  address: string;
  neighborhood: string;
  surface: number;
  rooms: number;
  condition: 'neuf' | 'excellent' | 'bon' | 'a-renover';
  objective: 'location' | 'vente' | 'gestion-complete';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredTime: string;
}
