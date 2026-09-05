import { AdminProperty, CRMLead, AdminOwner, AdminUser, ActivityLog } from './db';

export function generateSeedData() {
  const users: AdminUser[] = [
    {
      id: 'usr_1',
      name: 'Paul Goizet',
      email: 'goizetgestion@gmail.com',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: 'usr_2',
      name: 'Edgar Goizet',
      email: 'goizetgestion@gmail.com',
      role: 'Administrator',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-01-15T11:00:00Z'
    },
    {
      id: 'usr_3',
      name: 'Thomas Bernard',
      email: 'goizetgestion@gmail.com',
      role: 'Property Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-02-01T14:30:00Z'
    },
    {
      id: 'usr_4',
      name: 'Claire Dubois',
      email: 'goizetgestion@gmail.com',
      role: 'Content Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-02-10T09:00:00Z'
    },
    {
      id: 'usr_5',
      name: 'Julien Moreau',
      email: 'goizetgestion@gmail.com',
      role: 'Sales Agent',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-02-15T16:00:00Z'
    }
  ];

  const neighborhoods = [
    { slug: 'chartrons', name: 'Chartrons' },
    { slug: 'cauderan', name: 'Caudéran' },
    { slug: 'triangle-dor', name: 'Triangle d\'Or / Centre' },
    { slug: 'bastide', name: 'Bastide Rive Droite' },
    { slug: 'saint-michel', name: 'Saint-Michel' },
    { slug: 'saint-augustin', name: 'Saint-Augustin' },
    { slug: 'nansouty', name: 'Nansouty' },
    { slug: 'bacalan', name: 'Bacalan' },
    { slug: 'talence', name: 'Talence' },
    { slug: 'merignac', name: 'Mérignac' },
    { slug: 'pessac', name: 'Pessac' },
    { slug: 'begles', name: 'Bègles' }
  ];

  const sampleImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600566753086-35f138c65da1?auto=format&fit=crop&w=1600&q=80'
  ];

  // Generate 36 realistic Bordeaux properties
  const properties: AdminProperty[] = [];
  const propertyTitles = [
    'Appartement Haussmannien avec Moulures & Balcon',
    'Échoppe Bordelaise Rénovée avec Jardin & Piscine',
    'Penthouse Vue Dégagée sur la Garonne',
    'Loft Contemporain sous Verrière d\'Architecte',
    'Hôtel Particulier du XVIIIe siècle avec Cour Pavée',
    'T2 Moderne avec Parking Sécurisé & Balcon',
    'Échoppe Double de Caractère avec Patio',
    'Duplex de Prestige avec Terrasse Panoramique',
    'Studio Meublé Design Haut de Gamme',
    'Villa Familiale avec Parc Paysagé & Piscine',
    'T3 Lumineux avec Parquet Massif & Cheminée',
    'Appartement Bourgeois avec Hauteur sous Plafond'
  ];

  for (let i = 1; i <= 36; i++) {
    const n = neighborhoods[(i - 1) % neighborhoods.length];
    const isRental = i % 2 !== 0;
    const pType = i % 5 === 0 ? 'echoppe' : i % 7 === 0 ? 'loft' : i % 11 === 0 ? 'hotel-particulier' : 'appartement';
    const price = isRental ? 750 + (i * 70) : 220000 + (i * 35000);
    const surface = 35 + (i * 4);
    const title = `${propertyTitles[(i - 1) % propertyTitles.length]} - ${n.name}`;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i}`;

    properties.push({
      id: `prop_${i}`,
      reference: `BDX-2026-${100 + i}`,
      title,
      slug,
      description: `Exceptionnel bien immobilier situé au cœur du quartier ${n.name} à Bordeaux. Finitions raffinées, prestations haut de gamme et luminosité optimale.`,
      shortDescription: `Superbe propriété de ${surface} m² à ${n.name} disponible immédiatement.`,
      transactionType: isRental ? 'louer' : 'acheter',
      propertyType: pType as any,
      price,
      charges: isRental ? 80 + (i * 5) : undefined,
      deposit: isRental ? price : undefined,
      surface,
      rooms: Math.max(1, Math.floor(surface / 25)),
      bedrooms: Math.max(1, Math.floor(surface / 35)),
      bathrooms: Math.max(1, Math.floor(surface / 60)),
      floor: i % 4,
      totalFloors: 4,
      yearBuilt: 1880 + (i * 3),
      energyRating: (['A', 'B', 'C', 'D'][i % 4]) as any,
      gesRating: (['A', 'B', 'C'][i % 3]) as any,
      address: `${10 + i} Rue ${n.name}`,
      postalCode: '33000',
      city: 'Bordeaux',
      neighborhoodSlug: n.slug,
      neighborhoodName: n.name,
      isExclusive: i % 3 === 0,
      status: i > 30 ? 'Draft' : i % 5 === 0 ? 'Reserved' : i % 8 === 0 ? 'Rented' : 'Published',
      features: ['Parquet massif', 'Balcon filant', 'Climatisation', 'Cave privative', 'Ascenseur'],
      images: [sampleImages[(i - 1) % sampleImages.length], sampleImages[i % sampleImages.length]],
      coverImage: sampleImages[(i - 1) % sampleImages.length],
      views: 120 + (i * 15),
      enquiriesCount: 5 + (i * 2),
      ownerId: `own_${(i % 15) + 1}`,
      ownerName: `Propriétaire ${n.name}`,
      seoTitle: `${title} | Goizet Gestion`,
      seoDescription: `Location et vente d'exception à ${n.name} Bordeaux.`,
      updatedAt: new Date(Date.now() - i * 3600000).toISOString()
    });
  }

  // Generate 25 Owners & 30 Tenants
  const owners: AdminOwner[] = Array.from({ length: 25 }).map((_, idx) => ({
    id: `own_${idx + 1}`,
    name: `Propriétaire ${idx + 1} (${['Marie Laurent', 'Jean Dupont', 'Sophie Bernard', 'Marc Dubois', 'Claire Fontaine'][idx % 5]})`,
    email: `proprietaire${idx + 1}@exemple.fr`,
    phone: `06 ${10 + idx} ${20 + idx} ${30 + idx} ${40 + idx}`,
    address: `${15 + idx} Cours Portal, 33000 Bordeaux`,
    notes: `Propriétaire bailleur sous gestion locative exclusive Goizet Gestion.`,
    status: (['Managed', 'Qualified', 'New', 'Contacted'][idx % 4]) as any,
    propertiesCount: (idx % 3) + 1,
    createdAt: '2026-01-20T10:00:00Z'
  }));

  // Generate 52 Leads for rich CRM
  const leadTypes = ['Owner Enquiry', 'Tenant Request', 'Buyer Request', 'Seller Request', 'Valuation Request', 'Callback Request', 'Contact Message'] as const;
  const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'APPOINTMENT', 'IN_PROGRESS', 'CONVERTED', 'LOST'] as const;
  const sources = ['Website Form', 'Property Page', 'Google Search', 'Facebook Ads', 'Referral Direct', 'Blog Article'];

  const leads: CRMLead[] = Array.from({ length: 52 }).map((_, idx) => ({
    id: `lead_${idx + 1}`,
    name: `Prospect ${['Sarah Martin', 'Henri Lemaire', 'Élodie Roux', 'Antoine Mercier', 'Camille Vasseur'][idx % 5]} #${idx + 1}`,
    email: `prospect${idx + 1}@domaine.fr`,
    phone: `06 ${80 - idx} ${70 - idx} ${60 - idx} ${50 - idx}`,
    leadType: leadTypes[idx % leadTypes.length],
    status: leadStatuses[idx % leadStatuses.length],
    subject: `Demande d'information #${idx + 1}`,
    message: `Bonjour, je souhaite obtenir des renseignements complémentaires concernant vos services d'accompagnement immobilier à Bordeaux.`,
    propertyAddress: `${5 + idx} Allée de Tourny, 33000 Bordeaux`,
    budget: `${800 + idx * 50} € / mois`,
    surface: `${45 + idx * 2} m²`,
    source: sources[idx % sources.length],
    assignedTo: users[idx % users.length].name,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    notes: [
      { id: `n_${idx}_1`, author: users[idx % users.length].name, text: 'Premier contact qualifié avec succès par l\'équipe commercial.', date: 'Il y a 2 jours' }
    ],
    activities: [
      { id: `a_${idx}_1`, text: 'Demande enregistrée en base CRM.', date: 'Il y a 3 jours' }
    ]
  }));

  // Activity Logs
  const activityLogs: ActivityLog[] = [
    {
      id: 'log_seed_1',
      user: 'System Seed Engine',
      action: 'Base de données réinitialisée avec succès',
      object: 'System Database',
      timestamp: new Date().toISOString()
    }
  ];

  return {
    users,
    properties,
    leads,
    owners,
    activityLogs
  };
}
