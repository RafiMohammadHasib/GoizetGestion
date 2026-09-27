const fs = require('fs');

// Extract the functions and dictionary directly from propertyLocalization logic:
const FEATURE_TRANSLATIONS = {
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
  'Ascenseur': 'Elevator'
};

const TITLE_DICTIONARY = {
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
  'Appartement Bourgeois avec Hauteur sous Plafond': 'Bourgeois Apartment with High Ceilings'
};

function getLocalizedFeature(feat, language) {
  if (language !== 'en') return feat;
  if (FEATURE_TRANSLATIONS[feat]) return FEATURE_TRANSLATIONS[feat];
  for (const [fr, en] of Object.entries(FEATURE_TRANSLATIONS)) {
    if (feat.toLowerCase() === fr.toLowerCase()) return en;
  }
  return feat;
}

function getLocalizedFeatures(property, language) {
  if (language === 'en' && Array.isArray(property.featuresEn) && property.featuresEn.length > 0) {
    return property.featuresEn;
  }
  const feats = Array.isArray(property.features) ? property.features : [];
  if (language !== 'en') return feats;
  return feats.map((f) => getLocalizedFeature(f, 'en'));
}

function getLocalizedTitle(property, language) {
  if (!property) return '';
  if (language === 'en' && property.titleEn) return property.titleEn;
  if (language !== 'en' || !property.title) return property.title || '';

  const rawTitle = property.title.trim();
  if (TITLE_DICTIONARY[rawTitle]) return TITLE_DICTIONARY[rawTitle];

  if (rawTitle.includes(' - ')) {
    const parts = rawTitle.split(' - ');
    const mainTitle = parts[0].trim();
    const districtPart = parts.slice(1).join(' - ').trim();

    if (TITLE_DICTIONARY[mainTitle]) {
      return `${TITLE_DICTIONARY[mainTitle]} - ${districtPart}`;
    }
  }

  let translated = rawTitle;
  for (const [fr, en] of Object.entries(TITLE_DICTIONARY)) {
    if (translated.includes(fr)) {
      translated = translated.replace(fr, en);
    }
  }
  return translated;
}

function getLocalizedDescription(property, language) {
  if (!property) return '';
  if (language === 'en' && property.descriptionEn) return property.descriptionEn;
  if (language !== 'en' || !property.description) return property.description || '';

  const raw = property.description;
  const matchSeed = raw.match(/Exceptionnel bien immobilier situé au (cœur|coeur) du quartier (.*?) à Bordeaux\. Finitions raffinées, prestations haut de gamme et luminosité optimale\./i);
  if (matchSeed) {
    const hood = matchSeed[2];
    return `Exceptional property situated in the heart of the ${hood} district in Bordeaux. Refined finishes, premium amenities, and optimal natural light.`;
  }
  return raw;
}

async function test() {
  const res = await fetch('http://localhost:3000/api/properties?status=Published');
  const data = await res.json();
  const prop = data.properties[0];

  console.log('Testing prop_3 with language=en:');
  console.log('Title (en):', getLocalizedTitle(prop, 'en'));
  console.log('Description (en):', getLocalizedDescription(prop, 'en'));
  console.log('Features (en):', getLocalizedFeatures(prop, 'en'));
}

test();
