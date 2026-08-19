'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { NEIGHBORHOODS } from '@/data/neighborhoods';
import PropertyCard from '@/components/properties/PropertyCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { MapPin, ArrowLeft, ArrowUpRight, CheckCircle, Calculator, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SingleNeighborhoodPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const hood = NEIGHBORHOODS.find((h) => h.slug === slug);
  const { language } = useLanguage();
  const [hoodProperties, setHoodProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(`/api/properties?status=Published&neighborhood=${slug}`);
        const data = await res.json();
        if (data.properties) {
          setHoodProperties(data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch neighborhood properties:', err);
      } finally {
        setLoading(false);
      }
    }
    if (hood) fetchProperties();
  }, [slug, hood]);

  if (!hood) {
    return (
      <div className="pt-40 text-center space-y-4">
        <h1 className="font-serif-display text-4xl">Secteur non trouvé</h1>
        <Link href="/quartiers" className="text-[#7A2234] underline font-semibold">
          Voir tous nos secteurs
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumbs Nav */}
      <Breadcrumbs
        items={[
          { label: language === 'fr' ? 'Quartiers' : 'Districts', href: '/quartiers' },
          { label: hood.name }
        ]}
      />

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-end p-8 sm:p-12 shadow-2xl border border-[#171512]/10">
        <img
          src={hood.image}
          alt={hood.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/50 to-transparent" />
        
        <div className="relative z-10 space-y-4 text-white max-w-3xl">
          <span className="bg-[#7A2234] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
            SECTEUR PRIVILÉGIÉ — {hood.postalCode} BORDEAUX
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-light leading-tight">
            Location & Gestion Locative à {hood.name}
          </h1>
          <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed">
            {hood.tagline}
          </p>
        </div>
      </div>

      {/* Key Market Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-8 rounded-2xl border border-[#171512]/10 shadow-sm text-center">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#6F6255] block">Loyer Moyen au m²</span>
          <div className="font-serif-display text-3xl font-bold text-[#7A2234]">{hood.avgRentPerM2} € / m²</div>
          <span className="text-[11px] text-[#6F6255]">Calculé sur les baux récents</span>
        </div>
        <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-[#171512]/10 py-4 sm:py-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#6F6255] block">Prix Moyen d'Achat</span>
          <div className="font-serif-display text-3xl font-bold text-[#171512]">{hood.avgSalePerM2.toLocaleString('fr-FR')} € / m²</div>
          <span className="text-[11px] text-[#6F6255]">Valeur vénale patrimoniale</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#6F6255] block">Tension Locative</span>
          <div className="font-serif-display text-3xl font-bold text-[#7A2234]">{hood.demandScore} / 10</div>
          <span className="text-[11px] text-[#6F6255]">Vacance moyenne &lt; 8 jours</span>
        </div>
      </div>

      {/* Description & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif-display text-3xl font-medium text-[#171512]">
            Vivre et investir à Bordeaux — {hood.name}
          </h2>
          <p className="text-sm text-[#6F6255] leading-relaxed font-light whitespace-pre-line">
            {hood.description}
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171512]">
              Atouts majeurs du quartier :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#171512]">
              {hood.highlights.map((item) => (
                <div key={item} className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-[#171512]/5">
                  <CheckCircle className="w-4 h-4 text-[#7A2234]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Card for Neighborhood Landlords */}
        <div className="lg:col-span-5 bg-[#171512] text-white p-8 rounded-2xl border border-white/10 space-y-6 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234] block">
            PROPRIÉTAIRE À {hood.name.toUpperCase()} ?
          </span>
          <h3 className="font-serif-display text-2xl font-medium">
            Estimez la valeur de votre appartement ou échoppe à {hood.name}.
          </h3>
          <p className="text-xs text-[#9E9285] leading-relaxed">
            Profitez de notre expertise locale pour connaître le loyer exact que vous pouvez tirer de votre bien conformément à l'encadrement bordelais.
          </p>
          <Link
            href={`/estimation?neighborhood=${hood.slug}`}
            className="w-full bg-[#7A2234] hover:bg-[#5C1D27] text-white py-3.5 px-6 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <Calculator className="w-4 h-4" />
            <span>Estimer mon bien à {hood.name}</span>
          </Link>
        </div>
      </div>

      {/* Properties in this Neighborhood */}
      <div className="space-y-8 pt-8 border-t border-[#171512]/10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-3xl font-light text-[#171512]">
            Biens disponibles à {hood.name}
          </h2>
          <Link href="/biens" className="text-xs font-semibold text-[#7A2234] hover:underline whitespace-nowrap">
            Voir tous les biens à Bordeaux
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-[#7A2234] mx-auto animate-spin" />
          </div>
        ) : hoodProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hoodProperties.map((p) => (
              <PropertyCard key={p.id} property={p} aspectRatio="video" />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl text-center border border-[#171512]/10 text-xs text-[#6F6255]">
            Aucun bien immédiatement disponible dans ce secteur. Nos annonces hors-marché sont attribuées très rapidement. <Link href="/contact" className="text-[#7A2234] font-semibold underline">Contactez nos conseillers</Link> pour enregistrer votre recherche.
          </div>
        )}
      </div>

    </div>
  );
}
