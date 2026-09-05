import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
  description: 'Goizet Gestion — Maison de conseil immobilier et gestion locative d\'exception à Bordeaux. Location d\'appartements aux Chartrons, Caudéran, Triangle d\'Or. Estimation gratuite, rentabilité optimisée et sérénité garantie.',
  keywords: [
    'Goizet Gestion',
    'gestion locative Bordeaux',
    'location appartement Bordeaux',
    'agence immobiliere Bordeaux',
    'estimation immobiliere Bordeaux',
    'location maison Bordeaux',
    'louer appartement Chartrons',
    'gestion immobiliere Bordeaux'
  ],
  authors: [{ name: 'Goizet Gestion Bordeaux' }],
  icons: {
    icon: [
      { url: '/favicon.ico?v=5', sizes: 'any' },
      { url: '/LOGOMARK_3@2x.png', sizes: 'any', type: 'image/png' },
      { url: '/LOGOMARK_3@2x.png', sizes: '32x32', type: 'image/png' },
      { url: '/LOGOMARK_3@2x.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/LOGOMARK_3@2x.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=5',
  },
  openGraph: {
    title: 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
    description: 'Goizet Gestion — Boutique de conseil immobilier et gestion locative haut de gamme à Bordeaux. Visibilité maximale et gestion 100% sereine.',
    url: 'https://goizet-gestion.fr',
    siteName: 'GOIZET GESTION',
    images: [
      {
        url: '/LOGO_3@2x.png',
        width: 1200,
        height: 630,
        alt: 'GOIZET GESTION Bordeaux Real Estate'
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
    'name': 'GOIZET GESTION',
    'image': '/LOGO_3@2x.png',
    'description': 'Conseil immobilier et gestion locative d\'exception à Bordeaux',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '48 rue Calvé',
      'addressLocality': 'Bordeaux',
      'postalCode': '33000',
      'addressCountry': 'FR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 44.8512,
      'longitude': -0.5731
    },
    'url': 'https://goizet-gestion.fr',
    'telephone': '+33695577033',
    'priceRange': '€€€'
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className="bg-[#F7F5F0] text-[#171512] font-sans-ui selection:bg-[#748C8C]/25 selection:text-[#171512] antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
