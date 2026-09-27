'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2, PhoneCall, Sparkles, Calendar, MessageSquare } from 'lucide-react';
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
    <section className="pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'NOS BIENS DISPONIBLES À BORDEAUX' : 'AVAILABLE PROPERTIES IN BORDEAUX'}</span>
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#171512] leading-tight">
              {language === 'fr' ? 'Une sélection rigoureuse au cœur des quartiers.' : 'Curated premium listings across Bordeaux.'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6F6255] font-light leading-relaxed">
              {language === 'fr'
                ? 'Consultez les photos, caractéristiques clés et loyers de nos biens. Planifiez votre visite physique ou à distance en quelques clics.'
                : 'Browse photos, key features, and pricing of our properties. Schedule your viewing in person or via video in just a few clicks.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-[#171512]/10 shrink-0 overflow-x-auto no-scrollbar shadow-2xs">
            <button
              onClick={() => setFilterType('tout')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'tout'
                  ? 'bg-brand-gradient text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Tous les biens' : 'All Listings'} ({properties.length})
            </button>
            <button
              onClick={() => setFilterType('louer')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'louer'
                  ? 'bg-brand-gradient text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Locations' : 'For Rent'} ({rentCount})
            </button>
            <button
              onClick={() => setFilterType('acheter')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#748C8C] mx-auto animate-spin" />
            <p className="text-xs text-[#6F6255]">{language === 'fr' ? 'Chargement des biens…' : 'Loading properties…'}</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                aspectRatio="video"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#171512]/10 space-y-3">
            <h4 className="font-serif-display text-xl text-[#171512]">
              {language === 'fr' ? 'Aucun bien dans cette catégorie pour le moment' : 'No properties in this category right now'}
            </h4>
            <p className="text-xs text-[#6F6255]">
              {language === 'fr' ? 'Contactez-nous pour connaître nos opportunités off-market.' : 'Contact us to learn about off-market opportunities.'}
            </p>
          </div>
        )}

        {/* View All & Quick Lead Gen Strip */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#171512]/10">
          <div className="flex items-center space-x-2 text-xs text-[#6F6255]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {language === 'fr'
                ? 'Accompagnement personnalisé et visites 6j/7 à Bordeaux'
                : 'Dedicated advisory and viewings 6 days a week in Bordeaux'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+33556000000"
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#FAF9F6] text-[#171512] px-5 py-3 rounded-full text-xs font-semibold border border-[#171512]/10 transition-colors shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#748C8C]" />
              <span>{language === 'fr' ? 'Conseiller direct : 05 56 00 00 00' : 'Direct line: 05 56 00 00 00'}</span>
            </a>

            <Link
              href="/biens"
              className="inline-flex items-center space-x-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-3 rounded-full text-xs font-semibold transition-all duration-300 shadow-brand whitespace-nowrap"
            >
              <span>{language === 'fr' ? 'Voir l\'ensemble du catalogue' : 'View full catalog'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
