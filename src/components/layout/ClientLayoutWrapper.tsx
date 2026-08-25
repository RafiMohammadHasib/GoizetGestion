'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import CallbackModal from './CallbackModal';
import EntrustPropertyModal from './EntrustPropertyModal';
import CookieConsent from './CookieConsent';
import SmoothScroll from './SmoothScroll';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isEntrustOpen, setIsEntrustOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Listen for global custom events to open modals
  useEffect(() => {
    const handleOpenEntrust = () => setIsEntrustOpen(true);
    const handleOpenCallback = () => setIsCallbackOpen(true);

    window.addEventListener('open-entrust-modal', handleOpenEntrust);
    window.addEventListener('open-callback-modal', handleOpenCallback);

    return () => {
      window.removeEventListener('open-entrust-modal', handleOpenEntrust);
      window.removeEventListener('open-callback-modal', handleOpenCallback);
    };
  }, []);

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
        <Header 
          onOpenCallback={() => setIsCallbackOpen(true)} 
          onOpenEntrust={() => setIsEntrustOpen(true)}
        />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer
          onOpenCallback={() => setIsCallbackOpen(true)}
          onOpenEntrust={() => setIsEntrustOpen(true)}
          onOpenCookieSettings={() => setIsCookieModalOpen(true)}
        />
        <CallbackModal
          isOpen={isCallbackOpen}
          onClose={() => setIsCallbackOpen(false)}
        />
        <EntrustPropertyModal
          isOpen={isEntrustOpen}
          onClose={() => setIsEntrustOpen(false)}
        />
        <CookieConsent
          forceOpenModal={isCookieModalOpen}
          onCloseModal={() => setIsCookieModalOpen(false)}
        />
      </SmoothScroll>
    </LanguageProvider>
  );
}
