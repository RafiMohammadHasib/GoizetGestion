import { generateSeedData } from './db_seed';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Administrator' | 'Property Manager' | 'Content Manager' | 'Sales Agent' | 'Editor';
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadType: 'Owner Enquiry' | 'Tenant Request' | 'Buyer Request' | 'Seller Request' | 'Valuation Request' | 'Callback Request' | 'Contact Message';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'APPOINTMENT' | 'IN_PROGRESS' | 'CONVERTED' | 'LOST';
  subject?: string;
  message?: string;
  propertyAddress?: string;
  budget?: string;
  surface?: string;
  assignedTo?: string;
  source: string;
  createdAt: string;
  notes: { id: string; author: string; text: string; date: string }[];
  activities: { id: string; text: string; date: string }[];
}

export interface AdminProperty {
  id: string;
  reference: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  transactionType: 'louer' | 'acheter';
  propertyType: 'appartement' | 'echoppe' | 'maison' | 'loft' | 'hotel-particulier';
  price: number;
  charges?: number;
  deposit?: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  energyRating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  gesRating: 'A' | 'B' | 'C' | 'D' | 'E';
  address: string;
  postalCode: string;
  city: string;
  neighborhoodSlug: string;
  neighborhoodName: string;
  isExclusive: boolean;
  status: 'Draft' | 'Published' | 'Available' | 'Reserved' | 'Rented' | 'Sold' | 'Archived';
  features: string[];
  images: string[];
  coverImage: string;
  views: number;
  enquiriesCount: number;
  ownerId?: string;
  ownerName?: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}

export interface AdminOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Managed' | 'Converted';
  propertiesCount: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  object: string;
  timestamp: string;
}

// In-memory cache singleton fallback for client environment
let memoryStoreCache: any = null;

export function getDb() {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'src', 'data', 'admin_db.json');

      if (!fs.existsSync(dataFile)) {
        const seed = generateSeedData();
        saveDb(seed);
        return seed;
      }
      const raw = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.properties || parsed.properties.length < 10) {
        const seed = generateSeedData();
        saveDb(seed);
        return seed;
      }
      return parsed;
    } catch (err) {
      return generateSeedData();
    }
  } else {
    // Client-side execution
    if (!memoryStoreCache) {
      memoryStoreCache = generateSeedData();
    }
    return memoryStoreCache;
  }
}

export function saveDb(data: any) {
  memoryStoreCache = data;
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'src', 'data', 'admin_db.json');
      const dir = path.dirname(dataFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write admin DB file:', err);
    }
  }
}

export function resetAndSeedDb() {
  const seed = generateSeedData();
  saveDb(seed);
  return seed;
}
