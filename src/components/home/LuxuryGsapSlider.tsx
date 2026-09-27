'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Maximize2, Bed, Sparkles, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedTitle, getLocalizedDescription } from '@/lib/propertyLocalization';

export default function LuxuryGsapSlider() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties?status=Published');
        const data = await res.json();
        if (data.properties) {
          setProperties(data.properties.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch featured properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const currentProperty = properties[currentIndex];

  useEffect(() => {
    if (!sliderRef.current || !imageRef.current || !contentRef.current || !currentProperty) return;

    // GSAP Zoom & Fade Transition Timeline
    const tl = gsap.timeline();

    // 1. Zoom image from 1.25 -> 1.05 with smooth power3.out easing
    tl.fromTo(
      imageRef.current,
      { scale: 1.25, opacity: 0.7, filter: 'blur(4px)' },
      { scale: 1.05, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }
    );

    // 2. Animate slide content elements with stagger
    tl.fromTo(
      contentRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
      '-=0.8'
    );

    // 3. Animate progress bar fill width
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        { width: '100%', duration: 0.6, ease: 'power2.inOut' }
      );
    }

    return () => {
      tl.kill();
    };
  }, [currentIndex, currentProperty]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  if (loading || !currentProperty) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#171512] text-white">
        <div className="max-w-7xl mx-auto text-center py-16">
          <Loader2 className="w-8 h-8 text-[#748C8C] mx-auto animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#171512] text-white relative overflow-hidden">
      
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#748C8C]/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/20 px-3.5 py-1 rounded-full border border-[#748C8C]/30 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'COLLECTION EXCLUSIVE' : 'FEATURED GSAP CAROUSEL'}</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-white leading-tight">
              {language === 'fr' ? 'Les résidences d\'exception.' : 'Luxury Bordeaux Residences.'}
            </h2>
          </div>

          {/* Magnetic Control Buttons */}
          <div className="flex items-center space-x-4 shrink-0">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-[#171512] text-white flex items-center justify-center transition-all duration-300 shadow-md group"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <div className="text-xs font-serif-display font-medium text-white/60">
              0{currentIndex + 1} <span className="text-white/30">/</span> 0{properties.length}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-brand-gradient hover:bg-brand-gradient-hover text-white flex items-center justify-center transition-all duration-300 shadow-brand group"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* GSAP Hero Showcase Container */}
        <div ref={sliderRef} className="relative rounded-3xl overflow-hidden min-h-[520px] lg:min-h-[580px] grid grid-cols-1 lg:grid-cols-12 border border-white/15 shadow-2xl bg-[#131A1A]">
          
          {/* Left Column: High-Res Image with GSAP Zoom Effect */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full overflow-hidden">
            <img
              ref={imageRef}
              src={currentProperty.images?.[0] || currentProperty.coverImage}
              alt={currentProperty.title}
              className="w-full h-full object-cover origin-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131A1A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#131A1A]" />

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="bg-brand-gradient text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-brand whitespace-nowrap">
                {currentProperty.transactionType === 'louer' ? (language === 'fr' ? 'À Louer' : 'For Rent') : (language === 'fr' ? 'À Vendre' : 'For Sale')}
              </span>
              <span className="bg-white/90 backdrop-blur-md text-[#171512] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                DPE {currentProperty.energyRating}
              </span>
            </div>
          </div>

          {/* Right Column: Slide Information & Specs */}
          <div ref={contentRef} className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8 relative z-10">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs text-[#748C8C] font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{currentProperty.address}</span>
              </div>

              <h3 className="font-serif-display text-3xl sm:text-4xl font-light text-white leading-snug">
                {getLocalizedTitle(currentProperty, language)}
              </h3>

              <p className="text-xs text-[#9E9285] leading-relaxed line-clamp-3 font-light">
                {getLocalizedDescription(currentProperty, language)}
              </p>
            </div>

            {/* Specs Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center text-xs">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/50 block mb-0.5">{language === 'fr' ? 'Prix' : 'Price'}</span>
                <span className="text-base font-bold text-white tracking-tight">
                  {currentProperty.price?.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} €
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/50 block mb-0.5">{language === 'fr' ? 'Surface' : 'Living Area'}</span>
                <span className="text-base font-bold text-white tracking-tight">{currentProperty.surface} m²</span>
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/50 block mb-0.5">{language === 'fr' ? 'Chambres' : 'Bedrooms'}</span>
                <span className="text-base font-bold text-white tracking-tight">{currentProperty.bedrooms}</span>
              </div>
            </div>

            {/* CTA & Progress Indicator */}
            <div className="space-y-4 pt-2">
              <Link
                href={`/biens/${currentProperty.slug}`}
                className="w-full bg-white hover:bg-[#FAF9F6] text-[#171512] py-4 px-6 rounded-xl font-semibold text-xs transition-all shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <span>{language === 'fr' ? 'Découvrir cette résidence d\'exception' : 'Explore Residence Details'}</span>
                <ArrowUpRight className="w-4 h-4 text-[#748C8C]" />
              </Link>

              {/* Animated Progress Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div ref={progressRef} className="h-full bg-[#748C8C] rounded-full" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
