import { Property } from '@/types';

export const DISTRICT_TRANSLATIONS: Record<string, string> = {
  'Triangle d\'Or / Centre': 'Golden Triangle / City Centre',
  'Triangle d\'Or': 'Golden Triangle',
  'Bastide Rive Droite': 'Bastide Right Bank',
  'Bastide': 'Bastide',
  'Chartrons': 'Chartrons',
  'Caudéran': 'Caudéran',
  'Saint-Michel': 'Saint-Michel',
  'Saint-Augustin': 'Saint-Augustin',
  'Nansouty': 'Nansouty',
  'Bacalan': 'Bacalan',
  'Talence': 'Talence',
  'Mérignac': 'Mérignac',
  'Pessac': 'Pessac',
  'Bègles': 'Bègles',
  'Centre': 'City Centre'
};

export const FEATURE_TRANSLATIONS: Record<string, string> = {
  // Key amenities & architectural elements
  'Parquet massif': 'Hardwood floors',
  "Parquet d'époque & Moulures": 'Original hardwood & moldings',
  'Parquet chevron': 'Herringbone parquet',
  'Moulures': 'Decorative moldings',
  'Cheminée': 'Fireplace',
  'Cheminée en marbre': 'Marble fireplace',
  'Balcon': 'Balcony',
  'Balcon filant': 'Continuous balcony',
  'Terrasse': 'Terrace',
  'Terrasse panoramique': 'Panoramic terrace',
  'Patio': 'Private patio',
  'Cour pavée': 'Cobbled courtyard',
  'Climatisation': 'Air conditioning',
  'Climatisation réversible': 'Reversible AC',
  'Cave privative': 'Private cellar',
  'Cave privative de 12 m²': 'Private 12 m² cellar',
  'Ascenseur': 'Elevator',
  'Ascenseur prive': 'Private elevator',
  'Cuisine équipée': 'Fully equipped kitchen',
  'Cuisine équipée Miele': 'Miele equipped kitchen',
  'Cuisine américaine': 'Open-plan kitchen',
  'Jardin': 'Garden',
  'Jardin paysagé': 'Landscaped garden',
  'Jardin paysagé 180 m²': '180 m² landscaped garden',
  'Piscine': 'Swimming pool',
  'Bassin de nage chauffé': 'Heated lap pool',
  'Suite parentale RDC': 'Ground-floor master suite',
  'Suite parentale': 'Master suite',
  'Dressing': 'Walk-in closet',
  'Garage fermé 2 véhicules': 'Secure 2-car garage',
  'Garage': 'Garage',
  'Parking': 'Parking',
  'Parking sécurisé': 'Secure parking',
  'Pompe à chaleur neuve': 'New heat pump',
  'Système d\'alarme connecté': 'Smart alarm system',
  'Alarme': 'Alarm system',
  'Fibre optique très haut débit': 'High-speed fiber optic',
  'Fibre optique': 'Fiber optic',
  'Double vitrage phonique': 'Acoustic double glazing',
  'Double vitrage': 'Double glazing',
  'Vue dégagée': 'Unobstructed view',
  'Hauteur sous plafond': 'High ceilings',
  'Rénovation récente': 'Recently renovated',
  'Verrière d\'architecte': 'Architectural glass roof',
  'Interphone / Digicode': 'Intercom / Keypad entry',
  'Gardien': 'Concierge service',
  'Calme absolu': 'Total quiet',
  'Plein Sud': 'South-facing'
};

export const TITLE_DICTIONARY: Record<string, string> = {
  'Appartement Haussmannien avec Moulures & Balcon': 'Haussmannian Apartment with Moldings & Balcony',
  'Échoppe Bordelaise Rénovée avec Jardin & Piscine': 'Renovated Bordeaux Townhouse with Garden & Pool',
  'Penthouse Vue Dégagée sur la Garonne': 'Penthouse with Open Views of the Garonne',
  "Loft Contemporain sous Verrière d'Architecte": 'Contemporary Architect-Designed Loft with Glass Roof',
  'Hôtel Particulier du XVIIIe siècle avec Cour Pavée': '18th-Century Private Mansion with Cobbled Courtyard',
  'T2 Moderne avec Parking Sécurisé & Balcon': 'Modern 1-Bedroom with Secure Parking & Balcony',
  'Échoppe Double de Caractère avec Patio': 'Character Double Townhouse with Patio',
  'Duplex de Prestige avec Terrasse Panoramique': 'Prestige Duplex with Panoramic Terrace',
  'Studio Meublé Design Haut de Gamme': 'High-End Furnished Designer Studio',
  'Villa Familiale avec Parc Paysagé & Piscine': 'Family Villa with Landscaped Grounds & Pool',
  'T3 Lumineux avec Parquet Massif & Cheminée': 'Bright 2-Bedroom with Hardwood Floors & Fireplace',
  'Appartement Bourgeois avec Hauteur sous Plafond': 'Bourgeois Apartment with High Ceilings',
  // Variations
  'Appartement haussmannien avec moulures et balcon': 'Haussmannian Apartment with Moldings and Balcony',
  'Échoppe bordelaise rénovée avec jardin & piscine': 'Renovated Bordeaux Townhouse with Garden & Pool',
  'Loft contemporain sous verrière — Triangle d\'Or': 'Contemporary Loft with Glass Roof — Golden Triangle'
};

export function getLocalizedFeature(feat: string, language: string): string {
  if (language !== 'en' || !feat) return feat || '';
  const trimmed = feat.trim();
  if (FEATURE_TRANSLATIONS[trimmed]) return FEATURE_TRANSLATIONS[trimmed];

  // Case-insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const [fr, en] of Object.entries(FEATURE_TRANSLATIONS)) {
    if (lower === fr.toLowerCase()) return en;
  }
  return trimmed;
}

export function getLocalizedFeatures(property: Property | any, language: string): string[] {
  if (language === 'en' && Array.isArray(property?.featuresEn) && property.featuresEn.length > 0) {
    return property.featuresEn;
  }
  const feats = Array.isArray(property?.features) ? property.features : [];
  if (language !== 'en') return feats;
  return feats.map((f: string) => getLocalizedFeature(f, 'en'));
}

function translateTitlePhrases(title: string): string {
  let translated = title;
  for (const [fr, en] of Object.entries(TITLE_DICTIONARY)) {
    if (translated.includes(fr)) {
      translated = translated.replace(fr, en);
    }
  }

  translated = translated
    .replace(/^T1\b/i, 'Studio')
    .replace(/^T2\b/i, '1-Bedroom Apartment')
    .replace(/^T3\b/i, '2-Bedroom Apartment')
    .replace(/^T4\b/i, '3-Bedroom Apartment')
    .replace(/^T5\b/i, '4-Bedroom Apartment')
    .replace(/\bAppartement\b/gi, 'Apartment')
    .replace(/\bÉchoppe\b/gi, 'Townhouse')
    .replace(/\bEchoppe\b/gi, 'Townhouse')
    .replace(/\bMaison\b/gi, 'House')
    .replace(/\bHôtel Particulier\b/gi, 'Private Mansion')
    .replace(/\bavec\b/gi, 'with')
    .replace(/\bsous\b/gi, 'under')
    .replace(/\bJardin\b/gi, 'Garden')
    .replace(/\bPiscine\b/gi, 'Pool')
    .replace(/\bTerrasse\b/gi, 'Terrace')
    .replace(/\bBalcon\b/gi, 'Balcony')
    .replace(/\bLumineux\b/gi, 'Bright')
    .replace(/\bRénovée?\b/gi, 'Renovated')
    .replace(/\bMeublé?\b/gi, 'Furnished')
    .replace(/\bVue Dégagée\b/gi, 'Open View')
    .replace(/\bsur la Garonne\b/gi, 'of the Garonne')
    .replace(/\bParquet Massif\b/gi, 'Hardwood Floors')
    .replace(/\bCheminée\b/gi, 'Fireplace');

  return translated;
}

export function getLocalizedTitle(property: Property | any, language: string): string {
  if (!property) return '';
  if (language === 'en' && property.titleEn) return property.titleEn;
  if (language !== 'en' || !property.title) return property.title || '';

  const rawTitle = property.title.trim();

  // Direct match
  if (TITLE_DICTIONARY[rawTitle]) return TITLE_DICTIONARY[rawTitle];

  // District suffix match e.g. "Title - District"
  if (rawTitle.includes(' - ')) {
    const parts = rawTitle.split(' - ');
    const mainTitle = parts[0].trim();
    const districtPart = parts.slice(1).join(' - ').trim();

    const translatedMain = TITLE_DICTIONARY[mainTitle] || translateTitlePhrases(mainTitle);
    const translatedDistrict = DISTRICT_TRANSLATIONS[districtPart] || districtPart;
    return `${translatedMain} - ${translatedDistrict}`;
  }

  return translateTitlePhrases(rawTitle);
}

function translateDescriptionPhrases(raw: string): string {
  return raw
    .replace(/Au (?:cœur|coeur) du quartier prisé des Chartrons/gi, 'In the heart of the prestigious Chartrons district')
    .replace(/Rare sur le secteur de Caudéran/gi, 'A rare opportunity in Caudéran')
    .replace(/Superbe échoppe entièrement repensée/gi, 'Superb townhouse completely redesigned')
    .replace(/splendide appartement de type/gi, 'splendid apartment of type')
    .replace(/d'une superficie de/gi, 'with a surface area of')
    .replace(/Il se compose d'une vaste entrée/gi, 'It features an expansive entrance')
    .replace(/baigné de lumière/gi, 'bathed in natural light')
    .replace(/avec parquet chevron d'origine/gi, 'with original herringbone parquet')
    .replace(/moulures dorées et cheminée en marbre/gi, 'gilded moldings and marble fireplace')
    .replace(/Cuisine indépendante entièrement équipée haut de gamme/gi, 'Separate high-end fully equipped kitchen')
    .replace(/Deux chambres spacieuses au calme sur cour végétale/gi, 'Two quiet, spacious bedrooms overlooking a courtyard garden')
    .replace(/disponible immédiatement/gi, 'available immediately');
}

export function getLocalizedDescription(property: Property | any, language: string): string {
  if (!property) return '';
  if (language === 'en' && property.descriptionEn) return property.descriptionEn;
  if (language !== 'en' || !property.description) return property.description || '';

  const raw = property.description;

  // Flexible seed description regex matching (?:cœur|coeur)
  const matchSeed = raw.match(/Exceptionnel bien immobilier situé au (?:cœur|coeur) du quartier (.*?) à Bordeaux\. Finitions raffinées, prestations haut de gamme et luminosité optimale\./i);
  if (matchSeed) {
    const hood = matchSeed[1].trim();
    const hoodEn = DISTRICT_TRANSLATIONS[hood] || hood;
    return `Exceptional property situated in the heart of the ${hoodEn} district in Bordeaux. Refined finishes, premium amenities, and optimal natural light.`;
  }

  // Short description template
  const matchShort = raw.match(/Superbe propriété de (\d+) m² à (.*?) disponible immédiatement\./i);
  if (matchShort) {
    const surface = matchShort[1];
    const hood = matchShort[2].trim();
    const hoodEn = DISTRICT_TRANSLATIONS[hood] || hood;
    return `Superb ${surface} m² property in ${hoodEn} available immediately.`;
  }

  return translateDescriptionPhrases(raw);
}

export function getLocalizedPriceSuffix(property: Property | any, language: string): string {
  if (language === 'en' && property?.priceSuffixEn) return property.priceSuffixEn;
  const suffix = property?.priceSuffix || '';
  if (language !== 'en') return suffix;

  return suffix
    .replace('/ mois CC', '/ mo inc. charges')
    .replace('/ mois', '/ mo')
    .replace('FAI', 'fees inc.');
}

export function getLocalizedLocation(property: Property | any, language: string): string {
  const loc = property?.location || property?.address || 'Bordeaux';
  if (language !== 'en') return loc;

  if (DISTRICT_TRANSLATIONS[loc]) {
    return DISTRICT_TRANSLATIONS[loc];
  }

  let translated = loc;
  const sortedEntries = Object.entries(DISTRICT_TRANSLATIONS).sort((a, b) => b[0].length - a[0].length);
  for (const [fr, en] of sortedEntries) {
    if (translated.includes(fr)) {
      translated = translated.replace(fr, en);
      break;
    }
  }
  return translated;
}
