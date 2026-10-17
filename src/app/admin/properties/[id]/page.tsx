'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminEditPropertyPage() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    router.replace('/admin/crm');
  }, [router]);

  return (
    <div className="p-8 text-center text-sm text-[#6B6B6B]">
      {language === 'fr' ? 'Redirection vers le CRM en cours...' : 'Redirecting to CRM...'}
    </div>
  );
}
