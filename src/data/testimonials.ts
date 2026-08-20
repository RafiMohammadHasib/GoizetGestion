import { Testimonial } from '@/types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Jean-Baptiste & Éléonore de V.',
    role: 'Propriétaires bailleurs',
    roleEn: 'Property Owners & Landlords',
    location: 'Bordeaux — Chartrons',
    locationEn: 'Bordeaux — Chartrons',
    quote: 'Goizet Gestion a réinventé la gestion locative de nos deux appartements aux Chartrons. En moins de 48 heures, des locataires très solvables ont été retenus. Zéro tracasserie administrative et un espace propriétaire en ligne d\'une clarté exemplaire.',
    quoteEn: 'Goizet Gestion has truly redefined the property management of our two Chartrons apartments. Within 48 hours, fully-vetted tenants were signed. Zero administrative hassle and an owner portal of exemplary clarity.',
    rating: 5,
    propertyType: '2 Appartements T3',
    propertyTypeEn: '2 x 2-Bedroom Apartments',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-2',
    name: 'Sophie & Marc Aubert',
    role: 'Propriétaires d\'une échoppe',
    roleEn: 'Townhouse Owners',
    location: 'Bordeaux — Caudéran',
    locationEn: 'Bordeaux — Caudéran',
    quote: 'Nous hésitions entre vendre ou louer notre échoppe familiale. L\'équipe nous a présenté un plan d\'accompagnement sur-mesure avec une estimation locative d\'une exactitude remarquable. Le suivi est personnalisé et extrêmement réactif.',
    quoteEn: 'We hesitated between selling or renting out our family townhouse. The team presented a tailored advisory plan with a remarkably accurate rental valuation. The ongoing support is personal and exceptionally responsive.',
    rating: 5,
    propertyType: 'Échoppe 140 m²',
    propertyTypeEn: '140 m² Bordeaux Townhouse',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-3',
    name: 'Thomas L.',
    role: 'Locataire cadre dirigeant',
    roleEn: 'Executive Tenant',
    location: 'Bordeaux — Triangle d\'Or',
    locationEn: 'Bordeaux — Golden Triangle',
    quote: 'Muté à Bordeaux pour des raisons professionnelles, j\'ai trouvé mon appartement en attique en 3 jours grâce à la réactivité de Goizet Gestion. La visite 3D et le dossier 100% dématérialisé m\'ont fait gagner un temps précieux.',
    quoteEn: 'Relocating to Bordeaux for business, I secured my penthouse within 3 days thanks to Goizet Gestion\'s responsiveness. The 3D virtual tour and paperless onboarding saved me invaluable time.',
    rating: 5,
    propertyType: 'Loft 110 m²',
    propertyTypeEn: '110 m² Luxury Loft',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];
