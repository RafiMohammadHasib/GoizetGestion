'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, Search, Plus, Filter, Edit, Trash2, Eye, CheckCircle2, 
  Archive, ArrowUpRight, Sparkles, RotateCcw, MoreHorizontal, Loader2 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPropertiesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.properties) {
          setPropertyList(data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = propertyList.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.reference?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProperties.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatus = (newStatus: any) => {
    setPropertyList(propertyList.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p));
    setSelectedIds([]);
  };

  const handleDeleteOne = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      setPropertyList(propertyList.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Main Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            GOIZET GESTION PROPERTY MANAGER
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Property Inventory & Catalog
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">{propertyList.length} properties in database</p>
        </div>

        <Link
          href="/admin/properties/new"
          className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#171717]/10 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {[
              { id: 'ALL', label: 'All Listings' },
              { id: 'Published', label: 'Published' },
              { id: 'Draft', label: 'Drafts' },
              { id: 'Reserved', label: 'Reserved' },
              { id: 'Rented', label: 'Rented' },
              { id: 'Archived', label: 'Archived' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  statusFilter === tab.id
                    ? 'bg-brand-gradient text-white shadow-brand'
                    : 'bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#171717]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, title or street address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F7F5] border border-[#171717]/10 rounded-xl text-xs focus:outline-none focus:border-[#748C8C]"
            />
          </div>

        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-[#748C8C]/10 border border-[#748C8C]/20 rounded-xl flex items-center justify-between text-xs text-[#748C8C]">
            <span className="font-semibold">{selectedIds.length} property(ies) selected</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatus('Published')}
                className="bg-brand-gradient text-white px-3 py-1 rounded-lg text-[11px] font-semibold shadow-brand"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkStatus('Archived')}
                className="bg-gray-200 text-[#171717] px-3 py-1 rounded-lg text-[11px] font-semibold hover:bg-gray-300"
              >
                Archive Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Listing Table */}
      <div className="bg-white rounded-3xl border border-[#171717]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-[#F7F7F5] border-b border-[#171717]/10 text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProperties.length && filteredProperties.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#171717]/20 text-[#748C8C]"
                  />
                </th>
                <th className="p-4">Property</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Views</th>
                <th className="p-4 text-center">Enquiries</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#171717]/5">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#6B6B6B]">
                    <Loader2 className="w-6 h-6 mx-auto animate-spin text-[#748C8C] mb-2" />
                    Loading properties from database...
                  </td>
                </tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <tr key={property.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                    
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(property.id)}
                        onChange={() => handleSelectOne(property.id)}
                        className="rounded border-[#171717]/20 text-[#748C8C]"
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.coverImage || property.images?.[0]}
                          alt={property.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#171717]/10 shrink-0"
                        />
                        <div className="max-w-xs truncate">
                          <Link href={`/biens/${property.slug}`} target="_blank" className="font-semibold text-[#171717] hover:text-[#748C8C] truncate block">
                            {property.title}
                          </Link>
                          <span className="text-[11px] text-[#6B6B6B] block truncate">{property.address}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-medium text-[#6B6B6B]">{property.reference}</td>

                    <td className="p-4 capitalize">
                      <span className="font-semibold">{property.propertyType}</span>
                      <span className="text-[10px] text-[#6B6B6B] block uppercase">({property.transactionType})</span>
                    </td>

                    <td className="p-4 font-serif-display font-bold text-[#171717]">
                      {property.price?.toLocaleString('fr-FR')} €
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        property.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : property.status === 'Draft'
                          ? 'bg-amber-100 text-amber-800'
                          : property.status === 'Reserved'
                          ? 'bg-blue-100 text-blue-800'
                          : property.status === 'Rented'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono">{property.views || 0}</td>

                    <td className="p-4 text-center font-mono font-bold text-[#748C8C]">{property.enquiriesCount || 0}</td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/biens/${property.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded-lg border border-[#171717]/10 hover:bg-brand-gradient hover:text-white hover:border-[#748C8C] transition-colors"
                        title="View on Public Website"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="inline-flex p-1.5 rounded-lg border border-[#171717]/10 hover:bg-[#171717] hover:text-white transition-colors"
                        title="Edit Property"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDeleteOne(property.id)}
                        className="inline-flex p-1.5 rounded-lg border border-[#171717]/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#6B6B6B]">
                    No properties match your filter.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
