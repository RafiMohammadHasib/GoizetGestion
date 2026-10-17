'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Phone, Mail, MapPin, Building, Plus, Search, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminOwnersPage() {
  const { language } = useLanguage();
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  async function fetchOwners() {
    try {
      const res = await fetch('/api/admin/owners');
      const data = await res.json();
      if (data.owners) {
        setOwners(data.owners);
      }
    } catch (err) {
      console.error('Failed to load owners:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOwners();

    const interval = setInterval(() => {
      fetchOwners();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredOwners = owners.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.name || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.phone || '').toLowerCase().includes(q) ||
      (o.address || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
              {language === 'fr' ? 'CRM PROPRIÉTAIRES GOIZET GESTION' : 'GOIZET GESTION OWNER CRM'}
            </span>
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Live</span>
            </span>
          </div>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717] mt-1">
            {language === 'fr' ? 'Portefeuille Propriétaires' : 'Property Owners Portfolio'} ({owners.length})
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            {language === 'fr'
              ? 'Bailleurs avec mandats de gestion actifs & opportunités CRM converties'
              : 'Landlords with active management mandates & newly converted CRM opportunities'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder={language === 'fr' ? 'Rechercher un propriétaire...' : 'Search owners...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#171717]/10 rounded-xl text-xs focus:outline-none focus:border-[#748C8C] w-48 shadow-2xs"
            />
          </div>

          <button
            onClick={() => fetchOwners()}
            className="p-2 rounded-xl bg-white border border-[#171717]/10 hover:bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#171717] transition-colors shadow-2xs"
            title={language === 'fr' ? 'Actualiser' : 'Refresh'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#748C8C]" />
          <span className="text-xs text-[#6B6B6B]">
            {language === 'fr' ? 'Chargement du portefeuille propriétaires...' : 'Loading owner portfolio...'}
          </span>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-3xl border border-[#171717]/10 p-8">
          <UserCheck className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-serif-display text-lg font-medium text-[#171717]">
            {language === 'fr' ? 'Aucun Propriétaire Trouvé' : 'No Owners Found'}
          </h3>
          <p className="text-xs text-[#6B6B6B]">
            {language === 'fr'
              ? 'Convertissez des opportunités gagnées depuis le Pipeline CRM pour les afficher ici.'
              : 'Convert won opportunities from the CRM Opportunity Board to see them here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {filteredOwners.map(owner => (
            <div key={owner.id} className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {language === 'fr'
                      ? (owner.status === 'Managed' || owner.status === 'Sous Gestion' ? 'Sous Gestion' : owner.status === 'Qualified' || owner.status === 'Qualifié' ? 'Qualifié' : owner.status === 'New' || owner.status === 'Nouveau' ? 'Nouveau' : 'Contacté')
                      : (owner.status === 'Managed' || owner.status === 'Sous Gestion' ? 'Managed' : owner.status === 'Qualified' || owner.status === 'Qualifié' ? 'Qualified' : owner.status === 'New' || owner.status === 'Nouveau' ? 'New' : owner.status || 'Managed')}
                  </span>
                  <h2 className="font-serif-display text-xl font-medium text-[#171717] mt-1.5">{owner.name}</h2>
                </div>
                <span className="font-mono text-xs font-semibold bg-[#F7F7F5] px-2.5 py-1 rounded-lg border border-[#171717]/10">
                  {owner.propertiesCount || 1} {language === 'fr' ? (Number(owner.propertiesCount) > 1 ? 'Biens' : 'Bien') : (Number(owner.propertiesCount) > 1 ? 'Properties' : 'Property')}
                </span>
              </div>

              <div className="space-y-2 text-[#6B6B6B] pt-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  {owner.email && !owner.email.includes('@lead.goizet.fr') && !owner.email.includes('@client.goizet') ? (
                    <a href={`mailto:${owner.email}`} className="hover:text-[#748C8C] truncate">{owner.email}</a>
                  ) : (
                    <span className="text-stone-400 italic text-[11px] truncate">
                      {language === 'fr' ? 'Non renseigné' : 'Not provided'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  {owner.phone && owner.phone !== 'Non renseigné' ? (
                    <a href={`tel:${owner.phone}`} className="hover:text-[#748C8C]">{owner.phone}</a>
                  ) : (
                    <span className="text-stone-400 italic text-[11px] truncate">
                      {language === 'fr' ? 'Non renseigné' : 'Not provided'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <span className="truncate">
                    {language === 'en'
                      ? (owner.address || '')
                          .replace(/\bappartement\b/gi, 'Apartment')
                          .replace(/\bmaison\b/gi, 'House')
                          .replace(/\bimmeuble\b/gi, 'Building')
                          .replace(/\bechoppe\b/gi, 'Échoppe')
                          .replace(/\bhotel-particulier\b/gi, 'Townhouse / Mansion')
                          .replace(/\bterrain\b/gi, 'Land / Plot')
                          .replace(/Non renseigné/gi, 'Not specified')
                      : owner.address}
                  </span>
                </div>
              </div>

              {owner.notes && (
                <p className="p-3 bg-[#F7F7F5] rounded-xl text-stone-600 leading-relaxed text-[11px] border border-[#171717]/5">
                  {language === 'en'
                    ? owner.notes
                        .replace(/Converti depuis le CRM Opportunity Board/gi, 'Converted from CRM Opportunity Board')
                        .replace(/Propriétaire bailleur sous gestion locative exclusive Goizet Gestion\./gi, 'Landlord under exclusive Goizet Gestion rental management.')
                        .replace(/Nouveau propriétaire converti depuis le CRM\./gi, 'New owner converted from CRM.')
                        .replace(/Non renseigné/gi, 'Not specified')
                    : owner.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
