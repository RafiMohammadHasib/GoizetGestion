'use client';

import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Home, Euro, RefreshCw, Loader2, Search, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminTenantsPage() {
  const { language } = useLanguage();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  async function fetchTenants() {
    try {
      const res = await fetch('/api/admin/tenants');
      const data = await res.json();
      if (data.tenants) {
        setTenants(data.tenants);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTenants();

    // Supabase Realtime subscription
    const channel = supabase
      .channel('admin-tenants-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tenants' }, () => {
        fetchTenants();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTenants = tenants.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.name || '').toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      (t.phone || '').toLowerCase().includes(q) ||
      (t.propertyTitle || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
              {language === 'fr' ? 'CRM LOCATAIRES GOIZET GESTION' : 'GOIZET GESTION TENANT CRM'}
            </span>
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Live</span>
            </span>
          </div>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717] mt-1">
            {language === 'fr' ? 'Locataires Actifs & Candidats' : 'Active Tenants & Candidates'} ({tenants.length})
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            {language === 'fr'
              ? 'Locataires en cours de bail et candidats convertis depuis le Pipeline CRM'
              : 'Tenants with signed leases and active tenants converted from the CRM Opportunity Board'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder={language === 'fr' ? 'Rechercher un locataire...' : 'Search tenants...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#171717]/10 rounded-xl text-xs focus:outline-none focus:border-[#748C8C] w-48 shadow-2xs"
            />
          </div>

          <button
            onClick={() => fetchTenants()}
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
            {language === 'fr' ? 'Chargement de la base locataires...' : 'Loading tenant database...'}
          </span>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-3xl border border-[#171717]/10 p-8">
          <Users className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-serif-display text-lg font-medium text-[#171717]">
            {language === 'fr' ? 'Aucun Locataire Trouvé' : 'No Tenants Found'}
          </h3>
          <p className="text-xs text-[#6B6B6B]">
            {language === 'fr'
              ? 'Convertissez des demandes locataires dans le CRM pour alimenter automatiquement cette liste.'
              : 'Convert tenant requests in the CRM board to automatically populate active tenants.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {filteredTenants.map(t => (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                    {t.status || (language === 'fr' ? 'Actif' : 'Active')}
                  </span>
                  <h2 className="font-serif-display text-xl font-medium text-[#171717] mt-1.5">{t.name}</h2>
                </div>
                {t.rentAmount && (
                  <span className="font-bold text-xs text-[#748C8C] bg-[#748C8C]/10 border border-[#748C8C]/20 px-2.5 py-1 rounded-lg">
                    {t.rentAmount} € {language === 'fr' ? '/ mois' : '/ month'}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-[#6B6B6B] pt-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <a href={`mailto:${t.email}`} className="hover:text-[#748C8C] truncate">{t.email}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <a href={`tel:${t.phone}`} className="hover:text-[#748C8C]">{t.phone}</a>
                </div>
                {t.propertyTitle && (
                  <div className="flex items-center space-x-2">
                    <Home className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                    <span className="truncate">{t.propertyTitle}</span>
                  </div>
                )}
                {t.leaseStart && (
                  <div className="flex items-center space-x-2 text-stone-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>
                      {language === 'fr' ? 'Bail :' : 'Lease:'}{' '}
                      {new Date(t.leaseStart).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
