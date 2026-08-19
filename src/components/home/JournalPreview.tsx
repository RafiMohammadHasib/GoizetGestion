'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, User } from 'lucide-react';
import { ARTICLES } from '@/data/articles';
import { motion } from 'framer-motion';

export default function JournalPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
              LE JOURNAL IMMOBILIER
            </span>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
              Analyses, conseils & tendances du marché bordelais.
            </h2>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#7A2234] hover:underline"
          >
            <span>Consulter tous les articles du Journal</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden border border-[#171512]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              data-cursor="LIRE"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#7A2234] uppercase tracking-wider">
                  {article.category}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-[#6F6255]">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#7A2234]" />
                      <span>{article.readTime}</span>
                    </span>
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

                <div className="pt-4 border-t border-[#171512]/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-[#171512]">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-[11px]">{article.author.name}</span>
                  </div>

                  <Link
                    href={`/journal/${article.slug}`}
                    className="text-xs font-semibold text-[#7A2234] group-hover:underline flex items-center space-x-1"
                  >
                    <span>Lire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
