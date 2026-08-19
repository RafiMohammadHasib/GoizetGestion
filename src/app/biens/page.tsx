'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/properties/PropertyCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Search, SlidersHorizontal, Grid, List, RotateCcw, Home, Loader2 } from 'lucide-react';
import { PropertyType, TransactionType } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

function PropertySearchContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [transactionType, setTransactionType] = useState<TransactionType>(
    (searchParams.get('type') as TransactionType) || 'louer'
  );
  const [propertyType, setPropertyType] = useState<string>(searchParams.get('propertyType') || '');
  const [neighborhood, setNeighborhood] = useState<string>(searchParams.get('neighborhood') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [minSurface, setMinSurface] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [allDbProperties, setAllDbProperties] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch from server API — reads the persisted JSON DB on the server side
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties?status=Published');
        const data = await res.json();
        if (data.properties) {
          setAllDbProperties(data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setPageLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return allDbProperties.filter((p: any) => {
      if (transactionType && p.transactionType !== transactionType) return false;
      if (propertyType && p.propertyType !== propertyType) return false;
      if (neighborhood && p.neighborhoodSlug !== neighborhood) return false;
      if (maxPrice && p.price > parseInt(maxPrice, 10)) return false;
      if (minSurface && p.surface < parseInt(minSurface, 10)) return false;
      return true;
    });
  }, [allDbProperties, transactionType, propertyType, neighborhood, maxPrice, minSurface]);

  const handleReset = () => {
    setTransactionType('louer');
    setPropertyType('');
    setNeighborhood('');
    setMaxPrice('');
    setMinSurface('');
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Nos Biens' : 'Properties' }]} />

      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
          {language === 'fr' ? 'CATALOGUE DYNAMIQUE DES BIENS' : 'DYNAMIC REAL ESTATE CATALOG'}
        </span>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Trouver un bien d\'exception à Bordeaux.' : 'Find an exceptional property in Bordeaux.'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Explorez nos appartements, échoppes et lofts rigoureusement sélectionnés au cœur des plus beaux quartiers bordelais.'
            : 'Explore our curated selection of apartments, townhouses, and lofts across Bordeaux\'s prime districts.'}
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#171512]/10 shadow-sm space-y-6">
        
        {/* Transaction Type Selector */}
        <div className="flex items-center justify-between border-b border-[#171512]/10 pb-4">
          <div className="flex space-x-2 bg-[#FAF9F6] p-1 rounded-xl border border-[#171512]/5">
            <button
              onClick={() => setTransactionType('louer')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                transactionType === 'louer'
                  ? 'bg-[#7A2234] text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Biens à louer' : 'For Rent'}
            </button>
            <button
              onClick={() => setTransactionType('acheter')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                transactionType === 'acheter'
                  ? 'bg-[#171512] text-white shadow-sm'
                  : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              {language === 'fr' ? 'Biens à vendre' : 'For Sale'}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#6F6255] hover:text-[#7A2234] flex items-center space-x-1 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Réinitialiser' : 'Reset Filters'}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center space-x-1 bg-[#FAF9F6] p-1 rounded-lg border border-[#171512]/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-[#7A2234]' : 'text-[#6F6255]'}`}
                aria-label="Vue grille"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-[#7A2234]' : 'text-[#6F6255]'}`}
                aria-label="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1 whitespace-nowrap">
              {language === 'fr' ? 'Type de bien' : 'Property Type'}
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#7A2234]"
            >
              <option value="">{language === 'fr' ? 'Tous les types' : 'All Types'}</option>
              <option value="appartement">{language === 'fr' ? 'Appartement' : 'Apartment'}</option>
              <option value="echoppe">{language === 'fr' ? 'Échoppe bordelaise' : 'Townhouse'}</option>
              <option value="maison">{language === 'fr' ? 'Maison / Villa' : 'House / Villa'}</option>
              <option value="loft">{language === 'fr' ? 'Loft & Verrière' : 'Loft'}</option>
              <option value="hotel-particulier">{language === 'fr' ? 'Hôtel Particulier' : 'Mansion'}</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1 whitespace-nowrap">
              {language === 'fr' ? 'Quartier' : 'District'}
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#7A2234]"
            >
              <option value="">{language === 'fr' ? 'Tous les secteurs' : 'All Districts'}</option>
              <option value="chartrons">Chartrons</option>
              <option value="cauderan">Caudéran</option>
              <option value="triangle-dor">Triangle d'Or</option>
              <option value="bastide">Bastide</option>
              <option value="saint-michel">Saint-Michel</option>
              <option value="saint-augustin">Saint-Augustin</option>
              <option value="nansouty">Nansouty</option>
              <option value="bacalan">Bacalan</option>
              <option value="talence">Talence</option>
              <option value="merignac">Mérignac</option>
              <option value="pessac">Pessac</option>
              <option value="begles">Bègles</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1 whitespace-nowrap">
              {language === 'fr' ? 'Budget Max' : 'Max Budget'}
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#7A2234]"
            >
              <option value="">{language === 'fr' ? 'Indifférent' : 'Any Price'}</option>
              {transactionType === 'louer' ? (
                <>
                  <option value="1200">1 200 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                  <option value="1800">1 800 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                  <option value="2500">2 500 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                  <option value="4000">4 000 € / {language === 'fr' ? 'mois' : 'mo'}</option>
                </>
              ) : (
                <>
                  <option value="500000">500 000 €</option>
                  <option value="1000000">1 000 000 €</option>
                  <option value="3000000">3 000 000 €</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1 whitespace-nowrap">
              {language === 'fr' ? 'Surface Min (m²)' : 'Min Area (m²)'}
            </label>
            <select
              value={minSurface}
              onChange={(e) => setMinSurface(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#7A2234]"
            >
              <option value="">{language === 'fr' ? 'Toutes surfaces' : 'Any Area'}</option>
              <option value="40">40 m² +</option>
              <option value="70">70 m² +</option>
              <option value="100">100 m² +</option>
              <option value="150">150 m² +</option>
            </select>
          </div>
        </div>

      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#6F6255]">
        <span>
          <strong className="text-[#171512] font-semibold">{filteredProperties.length}</strong> {language === 'fr' ? 'bien(s) issu(s) de la base de données' : 'properties loaded dynamically from database'}
        </span>
      </div>

      {/* Properties Display */}
      {pageLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#7A2234] mx-auto animate-spin" />
          <p className="text-xs text-[#6F6255]">{language === 'fr' ? 'Chargement du catalogue…' : 'Loading catalog…'}</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className={`grid ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'grid-cols-1 gap-6'
        }`}>
          {filteredProperties.map((property: any) => (
            <PropertyCard
              key={property.id}
              property={property}
              aspectRatio={viewMode === 'list' ? 'video' : 'square'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#171512]/10 space-y-4">
          <Home className="w-12 h-12 text-[#7A2234]/40 mx-auto" />
          <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
            {language === 'fr' ? 'Aucun bien ne correspond exactement à votre recherche' : 'No exact property matches found'}
          </h3>
          <button
            onClick={handleReset}
            className="bg-[#7A2234] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow hover:bg-[#5C1D27] transition-colors whitespace-nowrap"
          >
            {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset Filters'}
          </button>
        </div>
      )}

    </div>
  );
}

export default function PropertySearchPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center font-serif-display text-xl">Chargement du catalogue...</div>}>
      <PropertySearchContent />
    </Suspense>
  );
}
