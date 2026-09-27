'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ARTICLES } from '@/data/articles';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ArrowLeft, Clock, Calendar, User, Share2, Calculator, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SingleArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = ARTICLES.find((a) => a.slug === slug);
  const { language } = useLanguage();

  if (!article) {
    return (
      <div className="pt-40 text-center space-y-4">
        <h1 className="font-serif-display text-4xl">Article non trouvé</h1>
        <Link href="/journal" className="text-[#748C8C] underline font-semibold">
          Retour au Journal
        </Link>
      </div>
    );
  }

  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <article className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-7 sm:space-y-8">
      
      {/* Breadcrumbs Nav */}
      <Breadcrumbs
        items={[
          { label: language === 'fr' ? 'Le Journal' : 'Journal', href: '/journal' },
          { label: article.title }
        ]}
      />

      {/* Header Info */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-[#748C8C]/10 text-[#748C8C] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {(language === 'en' && article.categoryEn) ? article.categoryEn : article.category}
          </span>
          <span className="text-[#6F6255]">•</span>
          <span className="text-[#6F6255]">{(language === 'en' && article.publishedAtEn) ? article.publishedAtEn : article.publishedAt}</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {(language === 'en' && article.titleEn) ? article.titleEn : article.title}
        </h1>

        <p className="text-base sm:text-xl text-[#6F6255] font-light leading-relaxed italic border-l-2 border-[#748C8C] pl-4">
          {(language === 'en' && article.excerptEn) ? article.excerptEn : article.excerpt}
        </p>

        {/* Author Card */}
        <div className="flex items-center space-x-4 pt-4 border-t border-[#171512]/10">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-12 h-12 rounded-full object-cover border border-[#171512]/10"
          />
          <div>
            <h3 className="text-sm font-semibold text-[#171512]">{article.author.name}</h3>
            <p className="text-xs text-[#6F6255]">{(language === 'en' && article.author.roleEn) ? article.author.roleEn : article.author.role}</p>
          </div>
        </div>
      </div>

      {/* Featured Hero Image */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-[#171512]/10">
        <img
          src={article.image}
          alt={(language === 'en' && article.titleEn) ? article.titleEn : article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-lg max-w-none text-[#171512] font-sans-ui leading-relaxed space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-[#171512]/10 space-y-4">
          <h3 className="font-serif-display text-xl font-semibold text-[#171512] m-0">
            {language === 'fr' ? 'Sommaire de l\'analyse' : 'Analysis Executive Summary'}
          </h3>
          <ul className="text-xs text-[#6F6255] space-y-2 m-0 pl-4 list-disc">
            <li>{language === 'fr' ? 'L\'état des lieux du marché locatif à Bordeaux en 2026' : 'State of the Bordeaux residential rental market in 2026'}</li>
            <li>{language === 'fr' ? 'Rendements moyens et vacances locatives par secteur' : 'Average gross yields and rental void periods by district'}</li>
            <li>{language === 'fr' ? 'Recommandations juridiques et encadrement des loyers' : 'Legal compliance & municipal rent cap optimization'}</li>
          </ul>
        </div>

        <div className="whitespace-pre-line text-sm text-[#2C2723] leading-relaxed">
          {(language === 'en' && article.contentEn) ? article.contentEn : article.content}
        </div>
      </div>

      {/* In-Article Conversion Banner */}
      <div className="bg-[#171512] text-white p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl border border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
          {language === 'fr' ? 'VOUS POSSÉDEZ UN BIEN À BORDEAUX ?' : 'DO YOU OWN A PROPERTY IN BORDEAUX?'}
        </span>
        <h3 className="font-serif-display text-3xl font-light">
          {language === 'fr'
            ? 'Calculez la valeur locative exacte de votre appartement avec nos experts.'
            : 'Calculate the precise rental yield and valuation of your property.'}
        </h3>
        <p className="text-xs text-[#9E9285] max-w-lg leading-relaxed">
          {language === 'fr'
            ? 'Découvrez combien vous pouvez louer votre bien en toute conformité et sans risque de vacance locative.'
            : 'Discover how much rental revenue your asset can generate without void periods and in total regulatory compliance.'}
        </p>
        <Link
          href="/estimation"
          className="inline-flex items-center space-x-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white py-3.5 px-6 rounded-full text-xs font-semibold shadow-brand transition-all whitespace-nowrap"
        >
          <Calculator className="w-4 h-4" />
          <span>{language === 'fr' ? 'Obtenir une estimation gratuite' : 'Get a Free Property Valuation'}</span>
        </Link>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-[#171512]/10 space-y-6">
          <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
            {language === 'fr' ? 'Articles similaires' : 'Related Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((rel) => {
              const relTitle = (language === 'en' && rel.titleEn) ? rel.titleEn : rel.title;
              const relCategory = (language === 'en' && rel.categoryEn) ? rel.categoryEn : rel.category;

              return (
                <Link key={rel.id} href={`/journal/${rel.slug}`} className="group bg-white p-6 rounded-2xl border border-[#171512]/10 flex flex-col justify-between space-y-3">
                  <span className="text-[10px] font-bold text-[#748C8C] uppercase">{relCategory}</span>
                  <h3 className="font-serif-display text-xl font-medium text-[#171512] group-hover:text-[#748C8C] transition-colors">{relTitle}</h3>
                  <span className="text-xs font-semibold text-[#748C8C] flex items-center space-x-1 whitespace-nowrap">
                    <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </article>
  );
}
