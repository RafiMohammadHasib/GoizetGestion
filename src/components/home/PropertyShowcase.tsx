'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import PropertyCard from '../properties/PropertyCard';
import { useLanguage } from '@/context/LanguageContext';

export default function PropertyShowcase() {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'tout' | 'louer' | 'acheter'>('tout');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties?status=Published');
        const data = await res.json();
        if (data.properties) {
          setProperties(data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (filterType === 'tout') return true;
    return p.transactionType === filterType;
  });

  const rentCount = properties.filter(p => p.transactionType === 'louer').length;
  const saleCount = properties.filter(p => p.transactionType === 'acheter').length;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
              {language === 'fr' ? 'NOS BIENS EN GESTION & À LA VENTE' : 'FEATURED PROPERTIES & LISTINGS'}
            </span>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
              {language === 'fr' ? 'Une sélection d\'exception à Bordeaux.' : 'Curated luxury listings in Bordeaux.'}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-white/80 p-1.5 rounded-full border border-[#171512]/10 shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterType('tout')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'tout'
                  ? 'bg-brand-gradient text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Tous nos biens' : 'All Listings'} ({properties.length})
            </button>
            <button
              onClick={() => setFilterType('louer')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'louer'
                  ? 'bg-brand-gradient text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Locations' : 'For Rent'} ({rentCount})
            </button>
            <button
              onClick={() => setFilterType('acheter')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'acheter'
                  ? 'bg-brand-gradient text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Ventes' : 'For Sale'} ({saleCount})
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-[#748C8C] mx-auto animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                aspectRatio="video"
              />
            ))}
          </div>
        )}

        {/* View All Button Footer */}
        <div className="text-center pt-8">
          <Link
            href="/biens"
            className="inline-flex items-center space-x-2 bg-[#171512] hover:bg-[#2C2723] text-white px-8 py-4 rounded-full text-xs font-semibold transition-all duration-300 shadow-lg whitespace-nowrap"
          >
            <span>{language === 'fr' ? 'Explorer l\'ensemble du catalogue de biens' : 'Explore Entire Property Catalog'}</span>
            <ArrowUpRight className="w-4 h-4 text-[#748C8C]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
