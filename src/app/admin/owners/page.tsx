'use client';

import React, { useState } from 'react';
import { UserCheck, Phone, Mail, MapPin, Building, Plus, Search } from 'lucide-react';

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState([
    {
      id: 'own_1',
      name: 'Jean Dupont',
      email: 'jean.dupont@exemple.fr',
      phone: '06 11 22 33 44',
      address: '34 Cours Portal, 33000 Bordeaux',
      notes: 'Propriétaire de 2 appartements aux Chartrons. Mandat de gestion à 6,8%.',
      status: 'Managed',
      propertiesCount: 2
    },
    {
      id: 'own_2',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@exemple.fr',
      phone: '06 55 66 77 88',
      address: '12 Avenue Bel Air, 33200 Bordeaux',
      notes: 'Propriétaire échoppe Caudéran.',
      status: 'Qualified',
      propertiesCount: 1
    }
  ]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234]">
            MAISON MÉRIDIA OWNER CRM
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Property Owners Database ({owners.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {owners.map(owner => (
          <div key={owner.id} className="bg-white p-6 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#7A2234] bg-[#7A2234]/10 px-2.5 py-0.5 rounded-full">
                  {owner.status}
                </span>
                <h2 className="font-serif-display text-2xl font-medium text-[#171717] mt-1">{owner.name}</h2>
              </div>
              <span className="font-mono text-xs font-bold bg-[#F7F7F5] px-2.5 py-1 rounded-lg border">
                {owner.propertiesCount} Property(ies)
              </span>
            </div>

            <div className="space-y-2 text-[#6B6B6B]">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#7A2234]" />
                <span>{owner.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#7A2234]" />
                <span>{owner.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#7A2234]" />
                <span>{owner.address}</span>
              </div>
            </div>

            <p className="p-3 bg-[#F7F7F5] rounded-xl text-[#6B6B6B] leading-relaxed">
              {owner.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
