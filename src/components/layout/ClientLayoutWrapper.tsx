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
import PropertyInquiryModal, { PropertyInquiryData } from '@/components/properties/PropertyInquiryModal';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isEntrustOpen, setIsEntrustOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<PropertyInquiryData | null>(null);

  // Listen for global custom events to open modals
  useEffect(() => {
    const handleOpenEntrust = () => setIsEntrustOpen(true);
    const handleOpenCallback = () => setIsCallbackOpen(true);
    const handleOpenInquiry = (e: any) => {
      if (e?.detail) {
        setInquiryProperty(e.detail);
      }
    };

    window.addEventListener('open-entrust-modal', handleOpenEntrust);
    window.addEventListener('open-callback-modal', handleOpenCallback);
    window.addEventListener('open-inquiry-modal', handleOpenInquiry);

    return () => {
      window.removeEventListener('open-entrust-modal', handleOpenEntrust);
      window.removeEventListener('open-callback-modal', handleOpenCallback);
      window.removeEventListener('open-inquiry-modal', handleOpenInquiry);
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
        <PropertyInquiryModal
          isOpen={!!inquiryProperty}
          onClose={() => setInquiryProperty(null)}
          property={inquiryProperty}
        />
      </SmoothScroll>
    </LanguageProvider>
  );
}
