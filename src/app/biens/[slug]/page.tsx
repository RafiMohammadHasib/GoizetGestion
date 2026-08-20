'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PropertyCard from '@/components/properties/PropertyCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { MapPin, Maximize2, Bed, Bath, Calendar, ShieldCheck, Sparkles, Send, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language } = useLanguage();

  const [property, setProperty] = useState<any>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.property) {
          setProperty(data.property);

          // Fetch similar properties
          const simRes = await fetch(`/api/properties?status=Published`);
          const simData = await simRes.json();
          if (simData.properties) {
            setSimilarProperties(
              simData.properties
                .filter((p: any) => p.id !== data.property.id)
                .slice(0, 2)
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setPageLoading(false);
      }
    }
    fetchProperty();
  }, [slug]);

  // 2-Scroll View Counter Listener (Hook called unconditionally at top level)
  useEffect(() => {
    if (!property?.id && !property?.slug) return;
    const targetId = property.id;
    const targetSlug = property.slug || slug;
    const sessionKey = `viewed_property_${targetSlug}`;

    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      return; // Already counted for this user session
    }

    let scrollCount = 0;
    let lastScrollPos = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      const currentPos = window.scrollY;
      if (Math.abs(currentPos - lastScrollPos) > 60) {
        scrollCount += 1;
        lastScrollPos = currentPos;

        if (scrollCount >= 2) {
          sessionStorage.setItem(sessionKey, 'true');
          window.removeEventListener('scroll', handleScroll);

          fetch(`/api/properties/view?id=${encodeURIComponent(targetId)}&slug=${encodeURIComponent(targetSlug)}`, {
            method: 'POST'
          }).then(() => {
            setProperty((prev: any) => prev ? { ...prev, views: (Number(prev.views) || 0) + 1 } : prev);
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [property?.id, property?.slug, slug]);

  if (pageLoading) {
    return (
      <div className="pt-40 pb-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#748C8C] mx-auto animate-spin" />
        <p className="text-xs text-[#6F6255]">
          {language === 'fr' ? 'Chargement du bien…' : 'Loading property…'}
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-40 pb-20 text-center space-y-4">
        <h1 className="font-serif-display text-4xl text-[#171512]">
          {language === 'fr' ? 'Bien non trouvé' : 'Property not found'}
        </h1>
        <p className="text-xs text-[#6F6255]">
          {language === 'fr'
            ? 'La propriété demandée n\'existe pas ou n\'est plus disponible.'
            : 'The requested property does not exist or is no longer available.'}
        </p>
        <Link href="/biens" className="inline-block bg-brand-gradient text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-brand">
          {language === 'fr' ? 'Retour au catalogue' : 'Back to the catalog'}
        </Link>
      </div>
    );
  }

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          propertyId: property.id,
          propertySlug: property.slug,
          propertyTitle: property.title,
          subject: `Demande de visite: ${property.title} (${property.reference})`,
          message: `${message}\n\nPropriété ciblée: ${property.title} - Ref ${property.reference}`
        })
      });
      setProperty((prev: any) => prev ? { ...prev, enquiriesCount: (Number(prev.enquiriesCount) || 0) + 1 } : prev);
      setIsBooked(true);
    } catch (e) {
      setIsBooked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Breadcrumb Nav */}
      <Breadcrumbs
        items={[
          { label: language === 'fr' ? 'Nos Biens' : 'Properties', href: '/biens' },
          { label: property.title }
        ]}
      />

      {/* Main Header & Price Title */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#171712]/10">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#171512] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
              {property.transactionType === 'louer' ? (language === 'fr' ? 'À Louer' : 'For Rent') : (language === 'fr' ? 'À Vendre' : 'For Sale')}
            </span>
            {property.isExclusive && (
              <span className="bg-brand-gradient text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 whitespace-nowrap shadow-brand">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'fr' ? 'Exclusivité Goizet Gestion' : 'Exclusive Listing'}</span>
              </span>
            )}
            <span className="bg-white border border-[#171512]/10 text-[#171512] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
              DPE {property.energyRating}
            </span>
            <span className="bg-white border border-[#171512]/10 text-[#6F6255] text-[10px] font-semibold px-3 py-1 rounded-full whitespace-nowrap flex items-center space-x-1">
              <span>{property.views || 0} {language === 'fr' ? 'consultations' : 'views'}</span>
            </span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl font-light text-[#171512] leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center space-x-2 text-xs text-[#6F6255]">
            <MapPin className="w-4 h-4 text-[#748C8C]" />
            <span>{property.address}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#171512]/10 shadow-sm text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-[#6F6255] block">
            {language === 'fr' ? 'Prix du bien' : 'Property Price'}
          </span>
          <div className="flex items-baseline space-x-1 justify-end">
            <span className="font-serif-display text-4xl font-semibold text-[#171512]">
              {property.price.toLocaleString('fr-FR')} €
            </span>
          </div>
          {property.charges && (
            <span className="text-[11px] text-[#6F6255] block mt-1">
              {language === 'fr' ? `dont ${property.charges} € / mois de charges` : `inc. ${property.charges} € / mo charges`}
            </span>
          )}
        </div>
      </div>

      {/* Photography Gallery */}
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-2xl border border-[#171512]/10">
          <img
            src={property.images?.[activeImage] || property.coverImage}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>

        {property.images?.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {property.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImage === idx ? 'border-[#748C8C] scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Specs & Details + Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        
        {/* Left Specs */}
        <div className="lg:col-span-8 space-y-10">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-[#171512]/10 shadow-sm text-center">
            <div className="space-y-1">
              <Maximize2 className="w-5 h-5 text-[#748C8C] mx-auto" />
              <span className="text-[10px] uppercase text-[#6F6255] block">{language === 'fr' ? 'Surface' : 'Living Area'}</span>
              <span className="font-semibold text-sm text-[#171512]">{property.surface} m²</span>
            </div>
            <div className="space-y-1">
              <Bed className="w-5 h-5 text-[#748C8C] mx-auto" />
              <span className="text-[10px] uppercase text-[#6F6255] block">{language === 'fr' ? 'Chambres' : 'Bedrooms'}</span>
              <span className="font-semibold text-sm text-[#171512]">{property.bedrooms}</span>
            </div>
            <div className="space-y-1">
              <Bath className="w-5 h-5 text-[#748C8C] mx-auto" />
              <span className="text-[10px] uppercase text-[#6F6255] block">{language === 'fr' ? 'Pièces' : 'Rooms'}</span>
              <span className="font-semibold text-sm text-[#171512]">{property.rooms}</span>
            </div>
            <div className="space-y-1">
              <Calendar className="w-5 h-5 text-[#748C8C] mx-auto" />
              <span className="text-[10px] uppercase text-[#6F6255] block">Ref</span>
              <span className="font-semibold text-sm text-[#171512] font-mono">{property.reference}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif-display text-3xl font-medium text-[#171512]">
              {language === 'fr' ? 'Description du bien' : 'Property Overview'}
            </h2>
            <p className="text-sm text-[#6F6255] leading-relaxed font-light whitespace-pre-line">
              {(language === 'en' && property.descriptionEn) ? property.descriptionEn : property.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
              {language === 'fr' ? 'Prestations & Équipements' : 'Features & Amenities'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.features?.map((feat: string) => (
                <div key={feat} className="flex items-center space-x-2.5 bg-white p-3.5 rounded-xl border border-[#171512]/5 text-xs text-[#171512]">
                  <Check className="w-4 h-4 text-[#748C8C] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Inquiry Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#171512]/10 shadow-xl space-y-6 sticky top-32">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C] block mb-1">
                {language === 'fr' ? 'DEMANDE DE VISITE CRM' : 'BOOK A VIEWING'}
              </span>
              <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
                {language === 'fr' ? 'Organiser une visite' : 'Schedule a Tour'}
              </h3>
            </div>

            {isBooked ? (
              <div className="p-6 bg-[#FAF9F6] rounded-xl text-center space-y-2 border border-[#748C8C]/20">
                <ShieldCheck className="w-10 h-10 text-[#748C8C] mx-auto" />
                <h4 className="font-serif-display text-lg font-semibold text-[#171512]">
                  {language === 'fr' ? 'Demande transmise au CRM' : 'Viewing Request Confirmed'}
                </h4>
                <p className="text-xs text-[#6F6255]">
                  {language === 'fr'
                    ? 'Un conseiller vous recontactera rapidement.'
                    : 'A dedicated advisor will contact you shortly to confirm the viewing.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Nom complet *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'fr' ? 'Sarah Martin' : 'Sarah Martin'}
                    className="w-full px-3.5 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Email *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.martin@domaine.fr"
                    className="w-full px-3.5 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Téléphone *' : 'Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full px-3.5 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Message' : 'Message'}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'fr' ? 'Disponibilités souhaitées...' : 'Preferred viewing schedule...'}
                    className="w-full px-3.5 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-xs shadow-brand flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? (language === 'fr' ? 'Transmet au CRM...' : 'Submitting...') : (language === 'fr' ? 'Envoyer ma demande' : 'Submit Viewing Request')}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-16 border-t border-[#171512]/10 space-y-8">
          <h2 className="font-serif-display text-3xl font-light text-[#171512]">
            {language === 'fr' ? 'Biens similaires à Bordeaux' : 'Similar Properties in Bordeaux'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {similarProperties.map((sim: any) => (
              <PropertyCard key={sim.id} property={sim} aspectRatio="video" />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
