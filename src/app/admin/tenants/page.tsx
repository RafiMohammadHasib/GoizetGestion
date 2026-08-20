'use client';

import React, { useState } from 'react';
import { Users, Phone, Mail, Home, Euro } from 'lucide-react';

export default function AdminTenantsPage() {
  const tenants = [
    {
      id: 'ten_1',
      name: 'Claire Fontaine',
      email: 'claire.fontaine@domaine.fr',
      phone: '06 98 76 54 32',
      searchTarget: 'T3 Chartrons ou Triangle d\'Or',
      budget: '2 000 € / mois',
      moveInDate: '01/09/2026',
      status: 'Qualified'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-[#171717]/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
          GOIZET GESTION TENANT CRM
        </span>
        <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
          Tenant Candidates & Rental Requests ({tenants.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {tenants.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {t.status}
                </span>
                <h2 className="font-serif-display text-2xl font-medium text-[#171717] mt-1">{t.name}</h2>
              </div>
              <span className="font-bold text-xs text-[#748C8C] bg-[#748C8C]/10 px-2.5 py-1 rounded-lg">
                {t.budget}
              </span>
            </div>

            <div className="space-y-2 text-[#6B6B6B]">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#748C8C]" />
                <span>{t.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#748C8C]" />
                <span>{t.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="w-3.5 h-3.5 text-[#748C8C]" />
                <span>Target: {t.searchTarget}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
