import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'MAISON MÉRIDIA | Immobilier & Gestion Locative à Bordeaux',
  description: 'Maison de conseil immobilier et gestion locative d\'exception à Bordeaux. Location d\'appartements aux Chartrons, Caudéran, Triangle d\'Or. Estimation gratuite, rentabilité optimisée et sérénité garantie.',
  keywords: [
    'gestion locative Bordeaux',
    'location appartement Bordeaux',
    'agence immobiliere Bordeaux',
    'estimation immobiliere Bordeaux',
    'location maison Bordeaux',
    'louer appartement Chartrons',
    'gestion immobiliere Bordeaux'
  ],
  authors: [{ name: 'Maison Méridia Bordeaux' }],
  openGraph: {
    title: 'MAISON MÉRIDIA | Immobilier & Gestion Locative à Bordeaux',
    description: 'Boutique de conseil immobilier et gestion locative haut de gamme à Bordeaux. Visibilité maximale et gestion 100% sereine.',
    url: 'https://maison-meridia.fr',
    siteName: 'MAISON MÉRIDIA',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Maison Méridia Bordeaux Real Estate'
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'MAISON MÉRIDIA',
    'image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'description': 'Conseil immobilier et gestion locative d\'exception à Bordeaux',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '38 Cours Portal',
      'addressLocality': 'Bordeaux',
      'postalCode': '33000',
      'addressCountry': 'FR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 44.8512,
      'longitude': -0.5731
    },
    'url': 'https://maison-meridia.fr',
    'telephone': '+33556001234',
    'priceRange': '€€€'
  };

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F7F5F0] text-[#171512] font-sans-ui selection:bg-[#7A2234]/15 selection:text-[#5C1D27] antialiased">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
