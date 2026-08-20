'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/data/articles';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function JournalIndexPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Toutes' : 'All Categories', matchFr: 'Toutes' },
    { id: 'market', label: language === 'fr' ? 'Marché Bordeaux' : 'Bordeaux Market', matchFr: 'Marché Bordeaux' },
    { id: 'management', label: language === 'fr' ? 'Gestion Locative' : 'Property Management', matchFr: 'Gestion Locative' },
    { id: 'advice', label: language === 'fr' ? 'Conseils Propriétaires' : 'Landlord Advisory', matchFr: 'Conseils Propriétaires' }
  ];

  const filteredArticles = ARTICLES.filter((art) => {
    if (selectedCategory === 'all') return true;
    const catObj = categories.find(c => c.id === selectedCategory);
    return catObj ? art.category === catObj.matchFr : true;
  });

  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  const featuredTitle = (language === 'en' && featured?.titleEn) ? featured.titleEn : featured?.title;
  const featuredExcerpt = (language === 'en' && featured?.excerptEn) ? featured.excerptEn : featured?.excerpt;
  const featuredCategory = (language === 'en' && featured?.categoryEn) ? featured.categoryEn : featured?.category;
  const featuredReadTime = (language === 'en' && featured?.readTimeEn) ? featured.readTimeEn : featured?.readTime;
  const featuredRole = (language === 'en' && featured?.author?.roleEn) ? featured.author.roleEn : featured?.author?.role;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Le Journal Immobilier' : 'Real Estate Journal' }]} />

      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
          {language === 'fr' ? 'LE JOURNAL IMMOBILIER BORDEAUX' : 'BORDEAUX REAL ESTATE JOURNAL'}
        </span>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Analyses, guides & actualités du marché.' : 'Market Analysis, Guides & News.'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Décryptage des tendances locatives, encadrement des loyers à Bordeaux, optimisation de la rentabilité et valorisation de votre patrimoine.'
            : 'Insights into rental trends, rent control rules, portfolio yield optimization, and market updates.'}
        </p>
      </div>

      {/* Featured Headline Hero Article */}
      {featured && (
        <Link href={`/journal/${featured.slug}`} className="group block">
          <div className="bg-white rounded-3xl overflow-hidden border border-[#171512]/10 shadow-xl grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
              <img
                src={featured.image}
                alt={featuredTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-brand-gradient text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap shadow-brand">
                {language === 'fr' ? 'À La Une' : 'Featured Story'}
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs text-[#6F6255]">
                  <span className="font-semibold text-[#748C8C]">{featuredCategory}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>{featuredReadTime}</span>
                  </span>
                </div>

                <h2 className="font-serif-display text-3xl sm:text-4xl font-medium text-[#171512] group-hover:text-[#748C8C] transition-colors leading-snug">
                  {featuredTitle}
                </h2>

                <p className="text-xs text-[#6F6255] leading-relaxed line-clamp-3">
                  {featuredExcerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-[#171512]/10 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-[#171512]">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold block">{featured.author.name}</span>
                    <span className="text-[10px] text-[#6F6255]">{featuredRole}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#748C8C] flex items-center space-x-1 group-hover:underline whitespace-nowrap">
                  <span>{language === 'fr' ? 'Lire l\'article' : 'Read Article'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Filter Category Pills */}
      <div className="flex flex-wrap gap-2 border-b border-[#171512]/10 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-brand-gradient text-white shadow-brand'
                : 'bg-white text-[#6F6255] border border-[#171512]/10 hover:text-[#171512]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => {
          const title = (language === 'en' && article.titleEn) ? article.titleEn : article.title;
          const excerpt = (language === 'en' && article.excerptEn) ? article.excerptEn : article.excerpt;
          const category = (language === 'en' && article.categoryEn) ? article.categoryEn : article.category;
          const readTime = (language === 'en' && article.readTimeEn) ? article.readTimeEn : article.readTime;
          const role = (language === 'en' && article.author.roleEn) ? article.author.roleEn : article.author.role;

          return (
            <Link key={article.id} href={`/journal/${article.slug}`} className="group flex flex-col">
              <div className="bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex-1 flex flex-col justify-between">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#748C8C] uppercase tracking-wider whitespace-nowrap">
                    {category}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] text-[#6F6255]">
                      <Clock className="w-3 h-3 text-[#748C8C]" />
                      <span>{readTime}</span>
                    </div>

                    <h3 className="font-serif-display text-xl font-medium text-[#171512] group-hover:text-[#748C8C] transition-colors leading-snug line-clamp-2">
                      {title}
                    </h3>

                    <p className="text-xs text-[#6F6255] line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#171512]/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-[#171512]">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold block text-[11px]">{article.author.name}</span>
                        <span className="text-[9px] text-[#6F6255]">{role}</span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-[#748C8C] flex items-center space-x-1 group-hover:underline whitespace-nowrap">
                      <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
