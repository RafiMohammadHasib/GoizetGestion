import { Neighborhood } from '@/types';

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'chartrons',
    name: 'Chartrons',
    slug: 'chartrons',
    postalCode: '33000',
    tagline: 'L\'esprit village, brocanteurs et quais de la Garonne',
    description: 'Ancien quartier des négociants en vin, les Chartrons incarnent aujourd\'hui l\'élégance bohème chic de Bordeaux. Entre boutiques d\'antiquités de la rue Notre-Dame, terrasses de la Halle des Chartrons et balades sur les quais, c\'est le secteur numéro 1 recherché par les jeunes cadres et investisseurs.',
    avgRentPerM2: 19.8,
    avgSalePerM2: 5450,
    demandScore: 9.8,
    highlights: ['Halle des Chartrons & Marché bio', 'Rue Notre-Dame & Brocanteurs', 'Proximité Tram B & Quais', 'Architecture néo-classique'],
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'cauderan',
    name: 'Caudéran',
    slug: 'cauderan',
    postalCode: '33200',
    tagline: 'Le Neuilly bordelais entre parc et échoppes familiales',
    description: 'Réputé pour son calme résidentiel, ses espaces verts comme le Parc Bordelais et ses établissements scolaires d\'excellence. Caudéran attire une clientèle exigeante de familles recherchant échoppes à jardin, maisons d\'architecte et grands appartements sécurisés.',
    avgRentPerM2: 16.5,
    avgSalePerM2: 4800,
    demandScore: 9.4,
    highlights: ['Parc Bordelais de 28 hectares', 'Écoles & Lycées d\'excellence', 'Échoppes familiales avec jardins', 'Cadre de vie paisible'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'triangle-dor',
    name: 'Triangle d\'Or / Centre-Ville',
    slug: 'triangle-dor',
    postalCode: '33000',
    tagline: 'Le prestige architectural ultime entre Tourny, Intendance & Grands Hommes',
    description: 'Bordé par les Cours de l\'Intendance, Georges Clemenceau et les Allées de Tourny, le Triangle d\'Or est l\'épicentre du luxe à Bordeaux. Immeubles XVIIIe inscrits au patrimoine UNESCO, boutiques haute couture et appartements de réception d\'une valeur patrimoniale inestimable.',
    avgRentPerM2: 22.4,
    avgSalePerM2: 6900,
    demandScore: 9.9,
    highlights: ['Grand Théâtre & Place de la Comédie', 'Marche des Grands Hommes', 'Immeubles classés UNESCO', 'Rendement locatif VIP'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'bastide',
    name: 'Bastide Rive Droite',
    slug: 'bastide',
    postalCode: '33100',
    tagline: 'Le renouveau contemporain avec vue imprenable sur la vieille ville',
    description: 'Sur la rive droite connectée par le Pont de Pierre et le Pont Chaban-Delmas, la Bastide vit une métamorphose spectaculaire. Eco-quartier Darwin, cinéma Megarama, parcs botaniques et programmes immobiliers neufs HQE offrent un rendement locatif exceptionnel.',
    avgRentPerM2: 17.2,
    avgSalePerM2: 4400,
    demandScore: 9.1,
    highlights: ['Espace alternatif Darwin', 'Parc aux Angéliques sur berges', 'Programmes neufs BBC', 'Vue dégagée rive gauche'],
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'saint-michel',
    name: 'Saint-Michel & Sainte-Croix',
    slug: 'saint-michel',
    postalCode: '33000',
    tagline: 'Vibration cosmopolite, création artistique et marché des Capucins',
    description: 'Emblématique quartier populaire devenu le refuge des créatifs et étudiants. Entre la Flèche Saint-Michel, l\'École des Beaux-Arts et le mythique Marché des Capucins ("le ventre de Bordeaux"), ce secteur garantit une vacance locative quasi nulle.',
    avgRentPerM2: 18.0,
    avgSalePerM2: 4650,
    demandScore: 9.6,
    highlights: ['Marché des Capucins', 'Flèche Saint-Michel & brocante', 'Quartier étudiants & artistes', 'Forte demande de petites surfaces'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'saint-augustin',
    name: 'Saint-Augustin & CHU',
    slug: 'saint-augustin',
    postalCode: '33000',
    tagline: 'Secteur médical prisé, maisons bordelaises et tranquillité',
    description: 'Articulé autour de l\'Hôpital Pellegrin et de la Faculté de Médecine, Saint-Augustin est l\'un des quartiers les plus recherchés par le personnel soignant et les universitaires. Atmosphère résidentielle très préservée.',
    avgRentPerM2: 17.5,
    avgSalePerM2: 4900,
    demandScore: 9.3,
    highlights: ['Pôle santé CHU Pellegrin', 'Tram A direct centre & aéroport', 'Échoppes & petites copropriétés', 'Profils locataires très solvables'],
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85'
  }
];
