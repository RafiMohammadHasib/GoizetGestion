'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Maximize2, Bed, Bath, ArrowUpRight, Sparkles, Camera, Calendar, Check } from 'lucide-react';
import { Property } from '@/types';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { 
  getLocalizedTitle, 
  getLocalizedDescription, 
  getLocalizedFeatures, 
  getLocalizedPriceSuffix,
  getLocalizedLocation
} from '@/lib/propertyLocalization';

interface PropertyCardProps {
  property: Property;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export default function PropertyCard({ property, aspectRatio = 'square' }: PropertyCardProps) {
  const { language } = useLanguage();

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-[16/10]'
      : aspectRatio === 'portrait'
      ? 'aspect-[4/5]'
      : 'aspect-square';

  const title = getLocalizedTitle(property, language);
  const description = getLocalizedDescription(property, language);
  const priceSuffix = getLocalizedPriceSuffix(property, language);
  const localizedFeatures = getLocalizedFeatures(property, language);

  const imageCount = property.images?.length || 1;
  const coverImage = property.images?.[0] || (property as any).coverImage || '/placeholder.jpg';

  const handleOpenInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-inquiry-modal', {
          detail: {
            id: property.id,
            title,
            slug: property.slug,
            reference: (property as any).reference,
            price: property.price,
            priceSuffix,
            location: property.location,
            image: coverImage,
            transactionType: property.transactionType,
            surface: property.surface,
            rooms: property.rooms,
          }
        })
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="group bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between h-full">
        {/* Clickable Card Header & Media Area */}
        <Link
          href={`/biens/${property.slug}`}
          className="block relative cursor-pointer"
          data-cursor={language === 'fr' ? 'VOIR' : 'VIEW'}
        >
          {/* Image Gallery Container */}
          <div className={`relative ${aspectClass} overflow-hidden bg-[#171512]/5`}>
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/80 via-[#171512]/15 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              <span className="bg-[#171512]/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                {property.transactionType === 'louer' ? (language === 'fr' ? 'À Louer' : 'For Rent') : (language === 'fr' ? 'À Vendre' : 'For Sale')}
              </span>
              {property.isExclusive && (
                <span className="bg-brand-gradient text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 shadow-brand">
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'fr' ? 'Exclusivité' : 'Exclusive'}</span>
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 flex items-center space-x-1.5 z-10">
              {imageCount > 1 && (
                <span className="bg-[#171512]/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/10 flex items-center space-x-1">
                  <Camera className="w-3 h-3 text-[#748C8C]" />
                  <span>{imageCount}</span>
                </span>
              )}
              {property.energyRating && (
                <div className="bg-white/95 backdrop-blur-md text-[#171512] font-semibold text-xs px-2.5 py-1 rounded-md border border-[#171512]/10">
                  DPE {property.energyRating}
                </div>
              )}
            </div>

            {/* Price & Location Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 z-10">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-serif-display text-2xl sm:text-3xl font-semibold tracking-tight">
                  {property.price.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} €
                </span>
                {priceSuffix && (
                  <span className="text-xs text-white/80 font-light">{priceSuffix}</span>
                )}
                {property.charges && (
                  <span className="text-[10px] text-white/70 font-light">
                    ({language === 'fr' ? `dont ${property.charges} € ch.` : `inc. ${property.charges} € ch.`})
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1 text-xs text-white/95 font-light">
                <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
                <span className="truncate font-medium">{getLocalizedLocation(property, language)}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Property Information Body */}
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <Link href={`/biens/${property.slug}`}>
              <h3 className="font-serif-display text-xl font-medium text-[#171512] group-hover:text-[#748C8C] transition-colors line-clamp-1 leading-snug">
                {title}
              </h3>
            </Link>

            <p className="text-xs text-[#6F6255] line-clamp-2 leading-relaxed">
              {description}
            </p>

            {/* Key features pills if present */}
            {localizedFeatures && localizedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {localizedFeatures.slice(0, 3).map((feat: string) => (
                  <span
                    key={feat}
                    className="inline-flex items-center space-x-1 bg-[#FAF9F6] border border-[#171512]/5 text-[#6F6255] text-[10px] px-2.5 py-0.5 rounded-md"
                  >
                    <Check className="w-2.5 h-2.5 text-[#748C8C]" />
                    <span className="truncate max-w-[120px]">{feat}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Specifications Strip */}
          <div className="pt-3 border-t border-[#171512]/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6F6255]">
              <div className="flex items-center space-x-3.5 sm:space-x-4">
                <span className="flex items-center space-x-1" title={language === 'fr' ? 'Surface habitable' : 'Living space'}>
                  <Maximize2 className="w-3.5 h-3.5 text-[#748C8C]" />
                  <span className="font-medium text-[#171512]">{property.surface} m²</span>
                </span>
                <span className="flex items-center space-x-1" title={language === 'fr' ? 'Chambres' : 'Bedrooms'}>
                  <Bed className="w-3.5 h-3.5 text-[#748C8C]" />
                  <span className="font-medium text-[#171512]">{property.bedrooms} {language === 'fr' ? 'ch.' : 'beds'}</span>
                </span>
                <span className="flex items-center space-x-1" title={language === 'fr' ? 'Pièces' : 'Rooms'}>
                  <Bath className="w-3.5 h-3.5 text-[#748C8C]" />
                  <span className="font-medium text-[#171512]">{property.rooms} {language === 'fr' ? 'p.' : 'rooms'}</span>
                </span>
              </div>

              <Link
                href={`/biens/${property.slug}`}
                className="text-[11px] font-semibold text-[#748C8C] hover:text-[#171512] transition-colors flex items-center space-x-0.5 shrink-0"
              >
                <span>{language === 'fr' ? 'Fiche complète' : 'Details'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Direct High-Conversion Lead Action Bar */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={handleOpenInquiry}
                type="button"
                className="flex-1 bg-[#171512] hover:bg-[#2C2723] text-white py-2.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                title={language === 'fr' ? 'Organiser une visite de ce bien' : 'Schedule a viewing for this property'}
              >
                <Calendar className="w-3.5 h-3.5 text-[#748C8C]" />
                <span className="whitespace-nowrap">{language === 'fr' ? 'Organiser une visite' : 'Schedule a viewing'}</span>
              </button>

              <Link
                href={`/biens/${property.slug}#contact`}
                className="bg-[#FAF9F6] hover:bg-[#171512]/5 text-[#171512] border border-[#171512]/10 py-2.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors whitespace-nowrap"
                title={language === 'fr' ? 'Demander des informations' : 'Request information'}
              >
                <span>{language === 'fr' ? 'Infos' : 'Inquire'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
