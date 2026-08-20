'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Maximize2, Bed, Bath, ArrowUpRight, Sparkles } from 'lucide-react';
import { Property } from '@/types';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

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

  const title = (language === 'en' && property.titleEn) ? property.titleEn : property.title;
  const description = (language === 'en' && property.descriptionEn) ? property.descriptionEn : property.description;
  const priceSuffix = (language === 'en' && property.priceSuffixEn) ? property.priceSuffixEn : (property.priceSuffix ? (language === 'en' && property.priceSuffix.includes('/ mois') ? property.priceSuffix.replace('/ mois', '/ mo') : property.priceSuffix) : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link
        href={`/biens/${property.slug}`}
        className="group bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full cursor-pointer"
        data-cursor={language === 'fr' ? 'VOIR' : 'VIEW'}
      >
        {/* Image Gallery Container */}
        <div className={`relative ${aspectClass} overflow-hidden`}>
          <img
            src={property.images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#171512]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
              {property.transactionType === 'louer' ? (language === 'fr' ? 'À Louer' : 'For Rent') : (language === 'fr' ? 'À Vendre' : 'For Sale')}
            </span>
            {property.isExclusive && (
              <span className="bg-brand-gradient text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 shadow-brand">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'fr' ? 'Exclusivité' : 'Exclusive'}</span>
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#171512] font-semibold text-xs px-2.5 py-1 rounded-md border border-[#171512]/10">
            DPE {property.energyRating}
          </div>

          {/* Price & Location Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-serif-display text-2xl sm:text-3xl font-semibold tracking-tight">
                {property.price.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} €
              </span>
              {priceSuffix && (
                <span className="text-xs text-white/80 font-light">{priceSuffix}</span>
              )}
            </div>

            <div className="flex items-center space-x-1 text-xs text-white/90 font-light">
              <MapPin className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
        </div>

        {/* Property Information Body */}
        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-serif-display text-xl font-medium text-[#171512] group-hover:text-[#748C8C] transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-[#6F6255] line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Specifications Strip */}
          <div className="pt-4 border-t border-[#171512]/10 flex items-center justify-between text-xs text-[#6F6255]">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1" title={language === 'fr' ? 'Surface habitable' : 'Living space'}>
                <Maximize2 className="w-3.5 h-3.5 text-[#171512]/60" />
                <span className="font-medium text-[#171512]">{property.surface} m²</span>
              </span>
              <span className="flex items-center space-x-1" title={language === 'fr' ? 'Chambres' : 'Bedrooms'}>
                <Bed className="w-3.5 h-3.5 text-[#171512]/60" />
                <span className="font-medium text-[#171512]">{property.bedrooms} {language === 'fr' ? 'ch.' : 'beds'}</span>
              </span>
              <span className="flex items-center space-x-1" title={language === 'fr' ? 'Pièces' : 'Rooms'}>
                <Bath className="w-3.5 h-3.5 text-[#171512]/60" />
                <span className="font-medium text-[#171512]">{property.rooms} {language === 'fr' ? 'p.' : 'rooms'}</span>
              </span>
            </div>

            {/* Interactive Circular Action Icon */}
            <div
              className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#171512]/10 flex items-center justify-center text-[#171512] group-hover:bg-[#171512] group-hover:border-[#171512] group-hover:text-white transition-all duration-300 shadow-xs shrink-0"
              aria-label={language === 'fr' ? 'Voir la fiche du bien' : 'View property details'}
            >
              <ArrowUpRight className="w-4 h-4 text-current transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
