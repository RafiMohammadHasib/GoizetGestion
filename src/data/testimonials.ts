import { Testimonial } from '@/types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Jean-Baptiste & Éléonore de V.',
    role: 'Propriétaires bailleurs',
    location: 'Bordeaux — Chartrons',
    quote: 'Maison Méridia a réinventé la gestion locative de nos deux appartements aux Chartrons. En moins de 48 heures, des locataires très solvables ont été retenus. Zéro tracasserie administrative et un espace propriétaire en ligne d\'une clarté exemplaire.',
    rating: 5,
    propertyType: '2 Appartements T3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-2',
    name: 'Sophie & Marc Aubert',
    role: 'Propriétaires d\'une échoppe',
    location: 'Bordeaux — Caudéran',
    quote: 'Nous hésitions entre vendre ou louer notre échoppe familiale. L\'équipe nous a présenté un plan d\'accompagnement sur-mesure avec une estimation locative d\'une exactitude remarquable. Le suivi est personnalisé et extrêmement réactif.',
    rating: 5,
    propertyType: 'Échoppe 140 m²',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-3',
    name: 'Thomas L.',
    role: 'Locataire cadre dirigeant',
    location: 'Bordeaux — Triangle d\'Or',
    quote: 'Muté à Bordeaux pour des raisons professionnelles, j\'ai trouvé mon appartement en attique en 3 jours grâce à la réactivité de Maison Méridia. La visite 3D et le dossier 100% dématérialisé m\'ont fait gagner un temps précieux.',
    rating: 5,
    propertyType: 'Loft 110 m²',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];
