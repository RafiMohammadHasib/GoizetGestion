export type TransactionType = 'louer' | 'acheter';
export type PropertyType = 'appartement' | 'maison' | 'loft' | 'echoppe' | 'hotel-particulier';
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Property {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  price: number; // in Euros
  priceSuffix?: string; // e.g. "/ mois CC" or "FAI"
  priceSuffixEn?: string;
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
  descriptionEn?: string;
  features: string[];
  featuresEn?: string[];
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
  taglineEn?: string;
  description: string;
  descriptionEn?: string;
  avgRentPerM2: number; // e.g. 18.5 €/m²
  avgSalePerM2: number; // e.g. 5200 €/m²
  demandScore: number; // out of 10
  highlights: string[];
  highlightsEn?: string[];
  image: string;
}

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt: string;
  excerptEn?: string;
  content: string; // Markdown or rich HTML
  contentEn?: string;
  category: 'Conseils Propriétaires' | 'Gestion Locative' | 'Marché Bordeaux' | 'Quartiers de Bordeaux' | 'Conseils Locataires';
  categoryEn?: string;
  author: {
    name: string;
    role: string;
    roleEn?: string;
    avatar: string;
  };
  publishedAt: string;
  publishedAtEn?: string;
  readTime: string;
  readTimeEn?: string;
  image: string;
  featured?: boolean;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g. "Propriétaire bailleur — Chartrons"
  roleEn?: string;
  location: string;
  locationEn?: string;
  quote: string;
  quoteEn?: string;
  rating: number;
  propertyType: string;
  propertyTypeEn?: string;
  image?: string;
  initials?: string;
  bgColor?: string;
  date?: string;
  dateEn?: string;
  source?: 'google' | 'direct';
  googleReviewUrl?: string;
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
