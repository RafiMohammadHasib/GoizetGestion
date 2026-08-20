'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Phone, Mail, MapPin, Building, Plus, Search, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminOwnersPage() {
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

    // Supabase Realtime subscription
    const channel = supabase
      .channel('admin-owners-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'owners' }, () => {
        fetchOwners();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
              GOIZET GESTION OWNER CRM
            </span>
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Live</span>
            </span>
          </div>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717] mt-1">
            Property Owners Portfolio ({owners.length})
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Landlords with active management mandates & newly converted CRM opportunities
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#171717]/10 rounded-xl text-xs focus:outline-none focus:border-[#748C8C] w-48 shadow-2xs"
            />
          </div>

          <button
            onClick={() => fetchOwners()}
            className="p-2 rounded-xl bg-white border border-[#171717]/10 hover:bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#171717] transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#748C8C]" />
          <span className="text-xs text-[#6B6B6B]">Loading owner portfolio...</span>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-3xl border border-[#171717]/10 p-8">
          <UserCheck className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-serif-display text-lg font-medium text-[#171717]">No Owners Found</h3>
          <p className="text-xs text-[#6B6B6B]">Convert won opportunities from the CRM Opportunity Board to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {filteredOwners.map(owner => (
            <div key={owner.id} className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {owner.status || 'Managed'}
                  </span>
                  <h2 className="font-serif-display text-xl font-medium text-[#171717] mt-1.5">{owner.name}</h2>
                </div>
                <span className="font-mono text-xs font-semibold bg-[#F7F7F5] px-2.5 py-1 rounded-lg border border-[#171717]/10">
                  {owner.propertiesCount || 1} {Number(owner.propertiesCount) > 1 ? 'Biens' : 'Bien'}
                </span>
              </div>

              <div className="space-y-2 text-[#6B6B6B] pt-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <a href={`mailto:${owner.email}`} className="hover:text-[#748C8C] truncate">{owner.email}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <a href={`tel:${owner.phone}`} className="hover:text-[#748C8C]">{owner.phone}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                  <span className="truncate">{owner.address}</span>
                </div>
              </div>

              {owner.notes && (
                <p className="p-3 bg-[#F7F7F5] rounded-xl text-stone-600 leading-relaxed text-[11px] border border-[#171717]/5">
                  {owner.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
