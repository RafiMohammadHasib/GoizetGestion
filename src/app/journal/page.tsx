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
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');

  const categories = ['Toutes', 'Marché Bordeaux', 'Gestion Locative', 'Conseils Propriétaires'];

  const filteredArticles = ARTICLES.filter((art) => {
    if (selectedCategory === 'Toutes') return true;
    return art.category === selectedCategory;
  });

  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Le Journal Immobilier' : 'Real Estate Journal' }]} />

      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
          LE JOURNAL IMMOBILIER BORDEAUX
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
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-[#7A2234] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                À La Une
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs text-[#6F6255]">
                  <span className="font-semibold text-[#7A2234]">{featured.category}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#7A2234]" />
                    <span>{featured.readTime}</span>
                  </span>
                </div>

                <h2 className="font-serif-display text-3xl sm:text-4xl font-medium text-[#171512] group-hover:text-[#7A2234] transition-colors leading-snug">
                  {featured.title}
                </h2>

                <p className="text-xs text-[#6F6255] leading-relaxed line-clamp-3">
                  {featured.excerpt}
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
                    <span className="text-[10px] text-[#6F6255]">{featured.author.role}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#7A2234] flex items-center space-x-1 group-hover:underline whitespace-nowrap">
                  <span>Lire l'article</span>
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
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#171512] text-white shadow'
                : 'bg-white text-[#6F6255] border border-[#171512]/10 hover:text-[#171512]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <Link key={article.id} href={`/journal/${article.slug}`} className="group flex flex-col">
            <div className="bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex-1 flex flex-col justify-between">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#7A2234] uppercase tracking-wider whitespace-nowrap">
                  {article.category}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-[#6F6255]">
                    <Clock className="w-3 h-3 text-[#7A2234]" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>

                  <h3 className="font-serif-display text-2xl font-medium text-[#171512] group-hover:text-[#7A2234] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#6F6255] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#171512]/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#6F6255]">Par {article.author.name}</span>
                  <span className="font-semibold text-[#7A2234] flex items-center space-x-1 group-hover:underline whitespace-nowrap">
                    <span>Lire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
