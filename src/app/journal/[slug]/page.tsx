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
        <Link href="/journal" className="text-[#7A2234] underline font-semibold">
          Retour au Journal
        </Link>
      </div>
    );
  }

  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <article className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
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
          <span className="bg-[#7A2234] text-white font-bold uppercase tracking-wider px-3 py-1 rounded-full text-[10px] whitespace-nowrap">
            {article.category}
          </span>
          <span className="flex items-center space-x-1 text-[#6F6255]">
            <Clock className="w-3.5 h-3.5 text-[#7A2234]" />
            <span>{article.readTime}</span>
          </span>
          <span className="text-[#6F6255]">•</span>
          <span className="text-[#6F6255]">{article.publishedAt}</span>
        </div>

        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-xl text-[#6F6255] font-light leading-relaxed italic border-l-2 border-[#7A2234] pl-4">
          {article.excerpt}
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
            <p className="text-xs text-[#6F6255]">{article.author.role}</p>
          </div>
        </div>
      </div>

      {/* Featured Hero Image */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-[#171512]/10">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-lg max-w-none text-[#171512] font-sans-ui leading-relaxed space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-[#171512]/10 space-y-4">
          <h3 className="font-serif-display text-xl font-semibold text-[#171512] m-0">Sommaire de l'analyse</h3>
          <ul className="text-xs text-[#6F6255] space-y-2 m-0 pl-4 list-disc">
            <li>L'état des lieux du marché locatif à Bordeaux en 2026</li>
            <li>Rendements moyens et vacances locatives par secteur</li>
            <li>Recommandations juridiques et encadrement des loyers</li>
          </ul>
        </div>

        <div className="whitespace-pre-line text-sm text-[#2C2723] leading-relaxed">
          {article.content}
        </div>
      </div>

      {/* In-Article Conversion Banner */}
      <div className="bg-[#171512] text-white p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl border border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234]">
          VOUS POSSÉDEZ UN BIEN À BORDEAUX ?
        </span>
        <h3 className="font-serif-display text-3xl font-light">
          Calculez la valeur locative exacte de votre appartement avec nos experts.
        </h3>
        <p className="text-xs text-[#9E9285] max-w-lg leading-relaxed">
          Découvrez combien vous pouvez louer votre bien en toute conformité et sans risque de vacance locative.
        </p>
        <Link
          href="/estimation"
          className="inline-flex items-center space-x-2 bg-[#7A2234] hover:bg-[#5C1D27] text-white py-3.5 px-6 rounded-full text-xs font-semibold shadow-xl transition-all whitespace-nowrap"
        >
          <Calculator className="w-4 h-4" />
          <span>Obtenir une estimation gratuite</span>
        </Link>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-[#171512]/10 space-y-6">
          <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
            Articles similaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((rel) => (
              <Link key={rel.id} href={`/journal/${rel.slug}`} className="group bg-white p-6 rounded-2xl border border-[#171512]/10 flex flex-col justify-between space-y-3">
                <span className="text-[10px] font-bold text-[#7A2234] uppercase">{rel.category}</span>
                <h3 className="font-serif-display text-xl font-medium text-[#171512] group-hover:text-[#7A2234] transition-colors">{rel.title}</h3>
                <span className="text-xs font-semibold text-[#7A2234] flex items-center space-x-1 whitespace-nowrap">
                  <span>Lire</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
