'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings');
  }, [router]);

  return (
    <div className="p-8 text-center text-sm text-[#6B6B6B]">
      Redirection vers les paramètres...
    </div>
  );
}
