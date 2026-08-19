'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import CallbackModal from './CallbackModal';
import CookieConsent from './CookieConsent';
import SmoothScroll from './SmoothScroll';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Admin routes use their own self-contained SaaS layout — no public chrome
  if (isAdmin) {
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <SmoothScroll>
        <CustomCursor />
        <Header onOpenCallback={() => setIsCallbackOpen(true)} />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer
          onOpenCallback={() => setIsCallbackOpen(true)}
          onOpenCookieSettings={() => setIsCookieModalOpen(true)}
        />
        <CallbackModal
          isOpen={isCallbackOpen}
          onClose={() => setIsCallbackOpen(false)}
        />
        <CookieConsent
          forceOpenModal={isCookieModalOpen}
          onCloseModal={() => setIsCookieModalOpen(false)}
        />
      </SmoothScroll>
    </LanguageProvider>
  );
}
