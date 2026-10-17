import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://goizet-gestion.fr'),
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
      { url: '/favicon.ico?v=6', sizes: 'any' },
      { url: '/favicon-32.png?v=6', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png?v=6', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png?v=6', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-192.png?v=6', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=6', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=6',
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
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  // Attributes injected by browser extensions (Bitwarden, Grammarly, ColorZilla, etc.)
  // that cause Next.js / React hydration mismatches on DOM elements.
  var BAD_ATTRS = [
    'bis_skin_checked',
    'bis_register',
    'data-gr-ext-installed',
    'data-new-gr-c-s-check-loaded',
    'cz-shortcut-listen',
    'data-adblockkey'
  ];

  function cleanEl(el) {
    if (!el || el.nodeType !== 1) return;
    for (var i = 0; i < BAD_ATTRS.length; i++) {
      if (el.hasAttribute(BAD_ATTRS[i])) {
        el.removeAttribute(BAD_ATTRS[i]);
      }
    }
  }

  function cleanTree(node) {
    if (!node || node.nodeType !== 1) return;
    cleanEl(node);
    var children = node.children;
    if (children) {
      for (var i = 0; i < children.length; i++) {
        cleanTree(children[i]);
      }
    }
  }

  if (typeof document !== 'undefined') {
    cleanTree(document.documentElement);

    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === 'attributes' && m.target && m.target.removeAttribute) {
            cleanEl(m.target);
          } else if (m.type === 'childList') {
            for (var c = 0; c < m.addedNodes.length; c++) {
              cleanTree(m.addedNodes[c]);
            }
          }
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: BAD_ATTRS,
        childList: true
      });
    }

    // Guard dev-overlay from errors and hydration warnings triggered by external browser extensions (Urban VPN, Bitwarden, Grammarly, etc.)
    if (typeof window !== 'undefined') {
      function isExtensionError(msg, source, err) {
        var s = String(source || (err && (err.stack || err.filename)) || '');
        var m = String(msg || (err && err.message) || '');
        return (
          s.indexOf('chrome-extension://') !== -1 ||
          s.indexOf('moz-extension://') !== -1 ||
          s.indexOf('safari-extension://') !== -1 ||
          s.indexOf('eppiocemhmnlbhjplcgkofciiegomcon') !== -1 ||
          m.indexOf('M_ID') !== -1
        );
      }

      window.addEventListener('error', function(event) {
        if (isExtensionError(event.message, event.filename, event.error)) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return true;
        }
      }, true);

      window.addEventListener('unhandledrejection', function(event) {
        var reason = event.reason;
        if (isExtensionError(reason && reason.message, reason && reason.stack, reason)) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return true;
        }
      }, true);

      var origOnError = window.onerror;
      window.onerror = function(message, source, lineno, colno, error) {
        if (isExtensionError(message, source, error)) {
          return true;
        }
        if (origOnError) return origOnError.apply(this, arguments);
      };

      var origError = console.error;
      console.error = function() {
        for (var k = 0; k < arguments.length; k++) {
          var arg = arguments[k];
          if (typeof arg === 'string' && (
            arg.indexOf('bis_skin_checked') !== -1 ||
            arg.indexOf('bis_register') !== -1 ||
            arg.indexOf('data-gr-ext-installed') !== -1 ||
            arg.indexOf('chrome-extension://') !== -1 ||
            arg.indexOf('M_ID') !== -1 ||
            (arg.indexOf('hydrated but some attributes') !== -1 && arg.indexOf('browser extension') !== -1)
          )) {
            return;
          }
        }
        return origError.apply(console, arguments);
      };
    }
  }
})();
            `
          }}
        />
      </head>
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
