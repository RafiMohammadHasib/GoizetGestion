'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-[75vh] flex items-center justify-center pt-32 pb-24 px-4 text-center">
      <div className="max-w-md space-y-6">
        <span className="font-serif-display text-8xl font-light text-[#748C8C]">404</span>
        <h1 className="font-serif-display text-3xl font-medium text-[#171512]">
          {language === 'fr' ? 'Page introuvable' : 'Page Not Found'}
        </h1>
        <p className="text-xs text-[#6F6255] leading-relaxed">
          {language === 'fr'
            ? 'La page que vous recherchez n\'existe pas ou a été déplacée. Retrouvez tous nos biens et services d\'exception sur notre site.'
            : 'The page you are looking for does not exist or has been moved. Explore our luxury residences and management services.'}
        </p>
        <div className="pt-4 flex items-center justify-center space-x-3">
          <Link
            href="/"
            className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-3 rounded-full text-xs font-semibold shadow-brand transition-all flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
