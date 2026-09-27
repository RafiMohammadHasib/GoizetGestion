'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Quote, CheckCircle2, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { TESTIMONIALS, GOOGLE_MAPS_REVIEW_URL, GOOGLE_MAPS_METRICS } from '@/data/testimonials';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function Testimonials() {
  const { language } = useLanguage();
  const [reviewsList, setReviewsList] = useState(TESTIMONIALS);
  const [metrics, setMetrics] = useState(GOOGLE_MAPS_METRICS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Real-time synchronization from Google Maps API endpoint
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.reviews?.length) {
          setReviewsList(data.data.reviews);
        }
        if (data?.data?.metrics) {
          setMetrics(data.data.metrics);
        }
      })
      .catch(() => {
        // Safe fallback to bundled testimonials
      });
  }, []);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviewsList.length - cardsPerView);
  const totalSlides = maxIndex + 1;

  // Keep currentIndex bounded when resizing
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerView, maxIndex, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Smooth auto-play timer (pauses on user interaction)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Drag / swipe detection
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    if (offset.x < -40 || velocity.x < -0.3) {
      handleNext();
    } else if (offset.x > 40 || velocity.x > 0.3) {
      handlePrev();
    }
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <section id="avis" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-y border-[#171512]/10 overflow-hidden relative scroll-mt-20">
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute -top-40 right-10 w-96 h-96 bg-[#748C8C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-10 w-96 h-96 bg-[#FAF9F6] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header: Title, Trust Badge & Interactive Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            {/* Verified Google Reviews Live Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#171512]/10 shadow-xs">
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171512]">
                {language === 'fr' ? 'Avis Google Maps Vérifiés' : 'Verified Google Maps Reviews'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#748C8C]">
                {metrics.averageRating.toFixed(1)} ★★★★★ ({metrics.totalReviews} {language === 'fr' ? 'avis' : 'reviews'})
              </span>
            </div>

            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#171512] leading-[1.12]">
              {language === 'fr' ? 'Ce que disent nos propriétaires.' : 'What our property owners say.'}
            </h2>

            <p className="text-sm sm:text-base text-[#6F6255] font-light max-w-xl leading-relaxed">
              {language === 'fr'
                ? 'Données et avis réels certifiés par Google Maps. Une réputation d\'excellence bâtie sur la réactivité et la gestion sur-mesure à Bordeaux.'
                : 'Real-time verified client reviews from Google Maps. A reputation built on responsiveness and bespoke property management in Bordeaux.'}
            </p>
          </div>

          {/* Navigation Controls & Direct Google Link */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
            
            {/* Link to Official Google Profile */}
            <a
              href={GOOGLE_MAPS_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F7F5F0] text-[#171512] rounded-full border border-[#171512]/10 shadow-xs hover:shadow-md transition-all duration-300 text-xs font-medium"
            >
              <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'fr' ? `Voir les ${metrics.totalReviews} avis sur Google Maps` : `View all ${metrics.totalReviews} reviews on Google Maps`}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#748C8C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Slider Navigation Buttons + Counter */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-medium text-[#6F6255] tracking-wider select-none">
                <span className="text-[#171512] font-semibold text-sm">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-[#171512]/30 mx-1.5">/</span>
                <span>{String(totalSlides).padStart(2, '0')}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label={language === 'fr' ? 'Avis précédent' : 'Previous review'}
                  className="w-11 h-11 rounded-full bg-white hover:bg-[#171512] text-[#171512] hover:text-white border border-[#171512]/10 transition-all duration-300 flex items-center justify-center shadow-xs active:scale-95 cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label={language === 'fr' ? 'Avis suivant' : 'Next review'}
                  className="w-11 h-11 rounded-full bg-[#171512] hover:bg-[#2C2723] text-white border border-[#171512]/10 transition-all duration-300 flex items-center justify-center shadow-md active:scale-95 cursor-pointer group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Animated Carousel Track */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing -mx-3 px-3 py-4"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            animate={{ x: `-${currentIndex * (100 / cardsPerView)}%` }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 28,
              mass: 0.8
            }}
            className="flex"
          >
            {reviewsList.map((testi) => {
              const quote = language === 'en' && testi.quoteEn ? testi.quoteEn : testi.quote;
              const role = language === 'en' && testi.roleEn ? testi.roleEn : testi.role;
              const location = language === 'en' && testi.locationEn ? testi.locationEn : testi.location;
              const propertyType = language === 'en' && testi.propertyTypeEn ? testi.propertyTypeEn : testi.propertyType;
              const date = language === 'en' && testi.dateEn ? testi.dateEn : testi.date;
              const reviewUrl = testi.googleReviewUrl || GOOGLE_MAPS_REVIEW_URL;

              // Authentic Avatar: Only display actual photos/icons if genuine (Patrick / Martin),
              // otherwise render clean Google initials monogram. NEVER use fake stock portrait photos!
              const hasGenuinePhoto = testi.image && (testi.image.includes('patrick-letreux') || testi.image.includes('martin-blankiet'));

              return (
                <div
                  key={testi.id}
                  style={{ width: `${100 / cardsPerView}%` }}
                  className="shrink-0 px-3 flex flex-col"
                >
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isDragging) e.preventDefault();
                    }}
                    title={language === 'fr' ? `Consulter l'avis authentique de ${testi.name} sur Google Maps` : `View authentic review from ${testi.name} on Google Maps`}
                    className="h-full bg-white rounded-3xl p-7 sm:p-8 border border-[#171512]/10 hover:border-[#748C8C]/50 transition-all duration-300 shadow-[0_4px_20px_rgba(23,21,18,0.03)] hover:shadow-[0_16px_36px_rgba(23,21,18,0.09)] hover:-translate-y-1 flex flex-col justify-between relative group overflow-hidden block cursor-pointer"
                  >
                    
                    {/* Background Watermark Quote Symbol */}
                    <Quote className="w-14 h-14 text-[#748C8C]/10 absolute -top-1 -right-1 pointer-events-none group-hover:text-[#748C8C]/18 group-hover:scale-110 transition-all duration-300" />

                    <div className="space-y-4">
                      {/* Top Header: Star Rating & Verified Pill */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-[#E5A93C]">
                          {[...Array(testi.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#E5A93C]" />
                          ))}
                          <span className="ml-1.5 text-xs font-semibold text-[#171512]">
                            {testi.rating}.0
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {date && (
                            <span className="text-[11px] text-[#6F6255] font-light bg-[#FAF9F6] px-2.5 py-0.5 rounded-full border border-[#171512]/5">
                              {date}
                            </span>
                          )}
                          <span className="text-[10px] text-[#748C8C] group-hover:text-[#171512] font-semibold bg-[#FAF9F6] group-hover:bg-[#748C8C]/15 px-2.5 py-0.5 rounded-full border border-[#171512]/5 inline-flex items-center gap-1 transition-all">
                            <GoogleIcon className="w-3 h-3" />
                            <span className="hidden sm:inline">Google</span>
                            <ArrowUpRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>

                      {/* Editorial Quote */}
                      <p className="font-serif-display text-base sm:text-[17px] text-[#171512] italic font-normal leading-relaxed pt-1">
                        « {quote} »
                      </p>
                    </div>

                    {/* Bottom Reviewer Footer: Authentic Avatar (Genuine Photo or Google Monogram - NO FAKE PORTRAITS) */}
                    <div className="pt-6 mt-6 border-t border-[#171512]/5 flex items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {/* Authentic Google Avatar representation */}
                        <div className="relative shrink-0">
                          {hasGenuinePhoto ? (
                            <img
                              src={testi.image}
                              alt={testi.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#748C8C]/30 border-2 border-white shadow-sm group-hover:ring-[#748C8C] transition-all duration-300"
                            />
                          ) : (
                            <div
                              style={{ backgroundColor: testi.bgColor || '#171512' }}
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-xs tracking-wider shadow-sm ring-2 ring-[#748C8C]/20 border-2 border-white select-none transition-transform group-hover:scale-105"
                            >
                              {testi.initials || testi.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center border border-[#171512]/10">
                            <GoogleIcon className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Name & Details */}
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-[#171512] flex items-center space-x-1.5 truncate">
                            <span className="truncate">{testi.name}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853] shrink-0" />
                          </h3>
                          <p className="text-[11px] text-[#6F6255] truncate mt-0.5">
                            {role} — {location}
                          </p>
                          <span className="inline-block mt-1 text-[10px] bg-[#FAF9F6] text-[#748C8C] font-semibold px-2 py-0.5 rounded-full border border-[#171512]/5 uppercase tracking-wider truncate max-w-full">
                            {propertyType}
                          </span>
                        </div>
                      </div>

                      {/* Direct External Link Icon */}
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#FAF9F6] group-hover:bg-[#171512] text-[#748C8C] group-hover:text-white transition-all duration-300 flex items-center justify-center border border-[#171512]/5 shadow-xs">
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                    </div>

                  </a>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Slide Indicator Dots (Fixed in Middle of Page) */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center pt-4 gap-3">
          
          {/* Interactive Pagination Indicators - Fixed in Middle */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide group ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 bg-[#171512]'
                      : 'w-2 bg-[#171512]/20 hover:bg-[#171512]/40'
                  }`}
                />
              );
            })}
          </div>

          {/* Quick Review Submission Action */}
          <div className="sm:absolute sm:right-0">
            <a
              href={GOOGLE_MAPS_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#748C8C] hover:text-[#171512] transition-colors inline-flex items-center gap-1"
            >
              <span>{language === 'fr' ? 'Vous êtes client ? Déposer un avis' : 'Are you a client? Leave a review'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
