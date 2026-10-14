'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PropertyCard from '@/components/properties/PropertyCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  MapPin, Maximize2, Bed, Bath, Calendar, ShieldCheck, Sparkles, Send, 
  Check, Loader2, PhoneCall, MessageCircle, Video, Clock, FileText, ChevronRight, Camera
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  getLocalizedTitle, 
  getLocalizedDescription, 
  getLocalizedFeatures, 
  getLocalizedPriceSuffix,
  getLocalizedLocation 
} from '@/lib/propertyLocalization';
import { isValidEmail, isValidPhone, getLocalizedErrorMessage } from '@/lib/security';

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
  const [errorMsg, setErrorMsg] = useState('');

  // Lead Generation Form State
  const [leadMode, setLeadMode] = useState<'visite' | 'info' | 'rappel'>('visite');
  const [visitType, setVisitType] = useState<'onsite' | 'video'>('onsite');
  const [preferredSlot, setPreferredSlot] = useState('Matin (9h - 12h)');
  const [infoTopic, setInfoTopic] = useState('Dossier complet du bien');

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

  // 2-Scroll View Counter Listener
  useEffect(() => {
    if (!property?.id && !property?.slug) return;
    const targetId = property.id;
    const targetSlug = property.slug || slug;
    const sessionKey = `viewed_property_${targetSlug}`;

    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      return;
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
    setErrorMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg(language === 'fr' ? 'Veuillez renseigner votre nom.' : 'Please enter your name.');
      return;
    }

    if (leadMode === 'rappel' && !phone.trim()) {
      setErrorMsg(language === 'fr' ? 'Le numéro de téléphone est obligatoire pour un rappel.' : 'Phone number is required for a callback.');
      return;
    }

    if (leadMode !== 'rappel' && !email.trim() && !phone.trim()) {
      setErrorMsg(language === 'fr' ? 'Veuillez renseigner au moins un email ou un téléphone.' : 'Please provide at least an email or phone number.');
      return;
    }

    if (phone.trim() && !isValidPhone(phone.trim())) {
      setErrorMsg(language === 'fr' ? 'Numéro de téléphone invalide.' : 'Invalid phone number.');
      return;
    }

    if (email.trim() && !isValidEmail(email.trim())) {
      setErrorMsg(language === 'fr' ? 'Adresse email invalide.' : 'Invalid email address.');
      return;
    }

    setLoading(true);

    try {
      let subject = `Demande de visite: ${property.title} (${property.reference || property.id})`;
      let compiledMessage = message.trim();

      if (leadMode === 'visite') {
        subject = `Demande de visite (${visitType === 'onsite' ? 'Sur place' : 'Visio'}) : ${property.title}`;
        compiledMessage = `Type de visite: ${visitType === 'onsite' ? 'Sur place à Bordeaux' : 'Vidéo à distance (WhatsApp/FaceTime)'}\nCréneau préféré: ${preferredSlot}\n\n${compiledMessage}`;
      } else if (leadMode === 'info') {
        subject = `Demande d'information (${infoTopic}) : ${property.title}`;
        compiledMessage = `Objet de la demande: ${infoTopic}\n\n${compiledMessage}`;
      } else if (leadMode === 'rappel') {
        subject = `Demande de rappel rapide : ${property.title}`;
        compiledMessage = `Souhaite être rappelé rapidement au ${phone} concernant le bien ${property.title} (Réf ${property.reference || ''}).\n\n${compiledMessage}`;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          name: name.trim(),
          email: email.trim() || 'contact-rappel@client.goizet',
          phone: phone.trim() || 'Non renseigné',
          propertyId: property.id,
          propertySlug: property.slug,
          propertyTitle: property.title,
          leadType: property.transactionType === 'acheter' ? 'Buyer Request' : 'Tenant Request',
          budget: `${property.price.toLocaleString('fr-FR')} € ${property.priceSuffix || '/mois'}`,
          surface: `${property.surface} m² • ${property.rooms} pièces`,
          subject,
          message: `${compiledMessage}\n\nPropriété ciblée: ${property.title} - Ref ${property.reference || ''}`,
          timeSlot: preferredSlot,
          source: 'Page Détail Bien',
          language
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (language === 'fr' ? 'Erreur lors de la transmission' : 'Error sending request'));
      }

      setProperty((prev: any) => prev ? { ...prev, enquiriesCount: (Number(prev.enquiriesCount) || 0) + 1 } : prev);
      setIsBooked(true);
    } catch (e: unknown) {
      const rawMessage = e instanceof Error ? e.message : '';
      setErrorMsg(getLocalizedErrorMessage(rawMessage, language));
    } finally {
      setLoading(false);
    }
  };

  const title = getLocalizedTitle(property, language);
  const description = getLocalizedDescription(property, language);
  const priceSuffix = getLocalizedPriceSuffix(property, language);
  const localizedFeatures = getLocalizedFeatures(property, language);

  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage || '/placeholder.jpg'];
  const whatsappUrl = `https://wa.me/33612345678?text=${encodeURIComponent(
    `Bonjour Goizet Gestion, je souhaite organiser une visite pour le bien : ${title} (Réf: ${property.reference || ''}) à ${property.location}.`
  )}`;

  return (
    <div className="pt-36 sm:pt-40 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 sm:space-y-8">
      
      {/* Top Breadcrumb Nav */}
      <Breadcrumbs
        items={[
          { label: language === 'fr' ? 'Nos Biens' : 'Properties', href: '/biens' },
          { label: title }
        ]}
      />

      {/* Main Header & Price Title */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#171512]/10">
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
            {title}
          </h1>

          <div className="flex items-center space-x-2 text-xs text-[#6F6255]">
            <MapPin className="w-4 h-4 text-[#748C8C] shrink-0" />
            <span className="font-medium text-[#171512]">{getLocalizedLocation(property, language)}</span>
            <span>·</span>
            <span>{property.address}</span>
          </div>
        </div>

        {/* Price Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#171512]/10 shadow-xs text-left lg:text-right shrink-0 min-w-[260px]">
          <span className="text-[10px] uppercase tracking-wider text-[#6F6255] block">
            {property.transactionType === 'louer' 
              ? (language === 'fr' ? 'Loyer mensuel' : 'Monthly Rent') 
              : (language === 'fr' ? 'Prix de vente' : 'Sale Price')}
          </span>
          <div className="flex items-baseline space-x-1.5 lg:justify-end">
            <span className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#171512]">
              {property.price.toLocaleString('fr-FR')} €
            </span>
            {property.transactionType === 'louer' && (
              <span className="text-xs text-[#6F6255]">{language === 'fr' ? '/ mois' : '/ mo'}</span>
            )}
          </div>
          {property.charges && (
            <span className="text-[11px] text-[#6F6255] block mt-1 font-light">
              {language === 'fr' ? `dont ${property.charges} € / mois de charges` : `inc. ${property.charges} € / mo charges`}
            </span>
          )}
          <a
            href="#contact"
            className="mt-3 block w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white text-center py-2.5 rounded-xl font-semibold text-xs shadow-brand transition-all cursor-pointer"
          >
            {language === 'fr' ? 'Organiser une visite' : 'Schedule a viewing'}
          </a>
        </div>
      </div>

      {/* Photography Gallery */}
      <div className="space-y-4">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-xl border border-[#171512]/10 bg-[#171512]/5">
          <img
            src={images[activeImage]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute bottom-4 right-4 bg-[#171512]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 border border-white/15">
            <Camera className="w-3.5 h-3.5 text-[#748C8C]" />
            <span>{activeImage + 1} / {images.length} {language === 'fr' ? 'Photos' : 'Photos'}</span>
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-28 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImage === idx ? 'border-[#748C8C] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Specs & Details + Lead Generation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
        
        {/* Left: Property Details, Location & Features */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
          
          {/* Key Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-[#171512]/10 shadow-xs text-center">
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
              <span className="font-semibold text-sm text-[#171512] font-mono">{property.reference || property.id}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="font-serif-display text-3xl font-medium text-[#171512]">
              {language === 'fr' ? 'Description du bien' : 'Property Overview'}
            </h2>
            <p className="text-sm text-[#6F6255] leading-relaxed font-light whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Features & Amenities */}
          <div className="space-y-4">
            <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
              {language === 'fr' ? 'Prestations & Équipements' : 'Features & Amenities'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localizedFeatures?.map((feat: string) => (
                <div key={feat} className="flex items-center space-x-2.5 bg-white p-3.5 rounded-xl border border-[#171512]/5 text-xs text-[#171512]">
                  <Check className="w-4 h-4 text-[#748C8C] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown Transparency */}
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#171512]/10 space-y-4">
            <h3 className="font-serif-display text-xl font-medium text-[#171512]">
              {language === 'fr' ? 'Détails financiers & Conditions' : 'Financial Details & Conditions'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6F6255]">
              <div className="bg-white p-3 rounded-xl border border-[#171512]/5 flex justify-between">
                <span>{language === 'fr' ? 'Loyer principal' : 'Base rent'} :</span>
                <strong className="text-[#171512]">{property.price.toLocaleString('fr-FR')} €</strong>
              </div>
              {property.charges ? (
                <div className="bg-white p-3 rounded-xl border border-[#171512]/5 flex justify-between">
                  <span>{language === 'fr' ? 'Charges mensuelles' : 'Monthly charges'} :</span>
                  <strong className="text-[#171512]">{property.charges} € / mois</strong>
                </div>
              ) : null}
              {property.deposit ? (
                <div className="bg-white p-3 rounded-xl border border-[#171512]/5 flex justify-between">
                  <span>{language === 'fr' ? 'Dépôt de garantie' : 'Security deposit'} :</span>
                  <strong className="text-[#171512]">{property.deposit.toLocaleString('fr-FR')} €</strong>
                </div>
              ) : null}
              <div className="bg-white p-3 rounded-xl border border-[#171512]/5 flex justify-between">
                <span>{language === 'fr' ? 'Classe énergie (DPE)' : 'Energy rating (DPE)'} :</span>
                <strong className="text-[#171512]">Classe {property.energyRating}</strong>
              </div>
            </div>
          </div>

          {/* Neighborhood Context */}
          <div className="bg-white p-6 rounded-2xl border border-[#171512]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
                {language === 'fr' ? 'ENVIRONNEMENT & SITUATION' : 'NEIGHBORHOOD & LOCATION'}
              </span>
              <Link
                href="/quartiers"
                className="text-[11px] font-semibold text-[#748C8C] hover:text-[#171512] flex items-center space-x-1"
              >
                <span>{language === 'fr' ? 'Guide des quartiers' : 'Districts guide'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
              {getLocalizedLocation(property, language)}
            </h3>
            <p className="text-xs text-[#6F6255] leading-relaxed font-light">
              {language === 'fr'
                ? 'Idéalement situé au sein de Bordeaux, ce bien bénéficie d\'une desserte optimale (tramway, bus, vélos en libre-service) et de la proximité immédiate de tous les commerces, cafés et services de proximité.'
                : 'Ideally situated in Bordeaux, this property enjoys optimal transport connections (tram, buses, shared bikes) and immediate proximity to local shops, cafés, and amenities.'}
            </p>
          </div>

        </div>

        {/* Right: High-Conversion Lead Generation Engine */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6" id="contact">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#171512]/10 shadow-xl space-y-6 sticky top-28">
            
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C] block mb-1">
                {language === 'fr' ? 'CONTACT & VISITES' : 'CONTACT & VIEWINGS'}
              </span>
              <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
                {language === 'fr' ? 'Intéressé par ce bien ?' : 'Interested in this property?'}
              </h3>
              <p className="text-xs text-[#6F6255] mt-1">
                {language === 'fr'
                  ? 'Planifiez une visite ou posez vos questions à notre équipe.'
                  : 'Schedule a tour or ask our team any questions.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#171512]/5 p-1 rounded-2xl text-[11px]">
              <button
                type="button"
                onClick={() => setLeadMode('visite')}
                className={`py-2 px-1 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                  leadMode === 'visite' ? 'bg-white text-[#171512] shadow-xs' : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                {language === 'fr' ? 'Visite' : 'Viewing'}
              </button>
              <button
                type="button"
                onClick={() => setLeadMode('info')}
                className={`py-2 px-1 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                  leadMode === 'info' ? 'bg-white text-[#171512] shadow-xs' : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                {language === 'fr' ? 'Infos' : 'Inquiry'}
              </button>
              <button
                type="button"
                onClick={() => setLeadMode('rappel')}
                className={`py-2 px-1 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                  leadMode === 'rappel' ? 'bg-white text-[#171512] shadow-xs' : 'text-[#6F6255] hover:text-[#171512]'
                }`}
              >
                {language === 'fr' ? 'Rappel' : 'Call me'}
              </button>
            </div>

            {isBooked ? (
              <div className="p-6 bg-[#FAF9F6] rounded-2xl text-center space-y-3 border border-[#748C8C]/20">
                <ShieldCheck className="w-12 h-12 text-[#748C8C] mx-auto" />
                <h4 className="font-serif-display text-xl font-medium text-[#171512]">
                  {language === 'fr' ? 'Demande bien transmise' : 'Request confirmed'}
                </h4>
                <p className="text-xs text-[#6F6255] leading-relaxed">
                  {language === 'fr'
                    ? 'Un conseiller de la Maison Goizet Gestion vous contactera dans les plus brefs délais pour confirmer votre rendez-vous.'
                    : 'An advisor will contact you shortly to confirm your viewing schedule.'}
                </p>
                <button
                  onClick={() => setIsBooked(false)}
                  className="text-xs text-[#748C8C] underline font-semibold cursor-pointer pt-2"
                >
                  {language === 'fr' ? 'Envoyer une autre demande' : 'Send another request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-4 text-xs">
                
                {/* Specific Fields according to Mode */}
                {leadMode === 'visite' && (
                  <div className="space-y-3 bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#171512]/5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255]">
                      {language === 'fr' ? 'Format de visite' : 'Viewing format'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVisitType('onsite')}
                        className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all text-left cursor-pointer ${
                          visitType === 'onsite'
                            ? 'border-[#748C8C] bg-white text-[#171512] font-semibold shadow-2xs'
                            : 'border-[#171512]/10 text-[#6F6255]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                        <span className="truncate">{language === 'fr' ? 'Sur place' : 'In person'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisitType('video')}
                        className={`p-2 rounded-xl border flex items-center space-x-1.5 transition-all text-left cursor-pointer ${
                          visitType === 'video'
                            ? 'border-[#748C8C] bg-white text-[#171512] font-semibold shadow-2xs'
                            : 'border-[#171512]/10 text-[#6F6255]'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                        <span className="truncate">{language === 'fr' ? 'Vidéo / Visio' : 'Video call'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1">
                        {language === 'fr' ? 'Créneau préféré' : 'Preferred slot'}
                      </label>
                      <select
                        value={preferredSlot}
                        onChange={(e) => setPreferredSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none text-xs"
                      >
                        <option value="Matin (9h - 12h)">{language === 'fr' ? 'Matin (9h - 12h)' : 'Morning (9am - 12pm)'}</option>
                        <option value="Après-midi (14h - 17h)">{language === 'fr' ? 'Après-midi (14h - 17h)' : 'Afternoon (2pm - 5pm)'}</option>
                        <option value="Fin de journée (17h - 19h)">{language === 'fr' ? 'Fin de journée (17h - 19h)' : 'Evening (5pm - 7pm)'}</option>
                        <option value="Samedi">{language === 'fr' ? 'Samedi' : 'Saturday'}</option>
                      </select>
                    </div>
                  </div>
                )}

                {leadMode === 'info' && (
                  <div className="space-y-2 bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#171512]/5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6F6255] mb-1">
                      {language === 'fr' ? 'Votre demande concerne :' : 'Your question is about:'}
                    </label>
                    <select
                      value={infoTopic}
                      onChange={(e) => setInfoTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#171512]/15 rounded-xl font-medium focus:outline-none text-xs"
                    >
                      <option value="Dossier complet du bien">{language === 'fr' ? 'Recevoir le dossier complet du bien' : 'Full property brochure'}</option>
                      <option value="Charges & copropriété">{language === 'fr' ? 'Détails des charges & copropriété' : 'Charges & building details'}</option>
                      <option value="Date de disponibilité">{language === 'fr' ? 'Date de disponibilité exacte' : 'Exact availability date'}</option>
                      <option value="Conditions de location">{language === 'fr' ? 'Conditions de location & garants' : 'Rental conditions & guarantors'}</option>
                    </select>
                  </div>
                )}

                {/* Common Contact Fields */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1 text-[10px]">
                    {language === 'fr' ? 'Nom et prénom *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Martin"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1 text-[10px]">
                      {language === 'fr' ? 'Téléphone *' : 'Phone *'}
                    </label>
                    <input
                      type="tel"
                      required={leadMode === 'rappel'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1 text-[10px]">
                      {language === 'fr' ? 'Email *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      required={leadMode !== 'rappel'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@exemple.fr"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                    />
                  </div>
                </div>

                {leadMode !== 'rappel' && (
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1 text-[10px]">
                      {language === 'fr' ? 'Message ou disponibilités' : 'Message or availability'}
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        leadMode === 'visite'
                          ? (language === 'fr' ? 'Précisez vos jours et heures de préférence...' : 'Preferred days and times...')
                          : (language === 'fr' ? 'Posez votre question...' : 'Ask your question...')
                      }
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
                    />
                  </div>
                )}

                {errorMsg && (
                  <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 rounded-xl font-semibold text-xs shadow-brand flex items-center justify-center space-x-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'fr' ? 'Transmission…' : 'Sending…'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {leadMode === 'visite'
                          ? (language === 'fr' ? 'Demander cette visite' : 'Request this tour')
                          : leadMode === 'info'
                          ? (language === 'fr' ? 'Envoyer ma question' : 'Send inquiry')
                          : (language === 'fr' ? 'Être rappelé rapidement' : 'Request call back')}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Direct Contact Buttons (Phone & WhatsApp) */}
            <div className="pt-3 border-t border-[#171512]/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6255] block text-center">
                {language === 'fr' ? 'Ou contactez directement un conseiller :' : 'Or contact an advisor directly:'}
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:+33556000000"
                  className="p-2.5 rounded-xl border border-[#171512]/10 bg-[#FAF9F6] hover:bg-[#171512]/5 flex items-center justify-center space-x-1.5 font-semibold text-[#171512] transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#748C8C]" />
                  <span>05 56 00 00 00</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center space-x-1.5 font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-16 border-t border-[#171512]/10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-3xl font-light text-[#171512]">
              {language === 'fr' ? 'Autres biens à Bordeaux' : 'Other Properties in Bordeaux'}
            </h2>
            <Link
              href="/biens"
              className="text-xs font-semibold text-[#748C8C] hover:text-[#171512] flex items-center space-x-1"
            >
              <span>{language === 'fr' ? 'Tout le catalogue' : 'All catalog'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {similarProperties.map((sim: any) => (
              <PropertyCard key={sim.id} property={sim} aspectRatio="video" />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Floating Lead Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#171512]/10 p-3 flex items-center justify-between sm:hidden shadow-2xl">
        <div className="space-y-0.5">
          <div className="flex items-baseline space-x-1">
            <span className="font-serif-display text-lg font-semibold text-[#171512]">
              {property.price.toLocaleString('fr-FR')} €
            </span>
            {property.transactionType === 'louer' && (
              <span className="text-[10px] text-[#6F6255]">{language === 'fr' ? '/ mois' : '/ mo'}</span>
            )}
          </div>
          <span className="text-[10px] text-[#748C8C] font-medium block truncate max-w-[150px]">
            {getLocalizedLocation(property, language)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="tel:+33556000000"
            className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#171512]/10 flex items-center justify-center text-[#171512]"
            aria-label="Appeler l'agence"
          >
            <PhoneCall className="w-4 h-4 text-[#748C8C]" />
          </a>

          <a
            href="#contact"
            className="bg-brand-gradient text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Organiser visite' : 'Book tour'}</span>
          </a>
        </div>
      </div>

    </div>
  );
}
