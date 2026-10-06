'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminEditPropertyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/crm');
  }, [router]);

  return (
    <div className="p-8 text-center text-sm text-[#6B6B6B]">
      Redirection vers le CRM en cours...
    </div>
  );
}
