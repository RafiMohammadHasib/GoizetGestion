'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/data/articles';
import { FileText, Plus, Edit, Trash2, Clock, Eye } from 'lucide-react';

export default function AdminBlogPage() {
  const [articles, setArticles] = useState(
    ARTICLES.map(a => ({
      ...a,
      status: 'Published' as const,
      views: Math.floor(Math.random() * 800) + 200
    }))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            GOIZET GESTION BLOG CMS
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Journal Immobilier Articles ({articles.length})
          </h1>
        </div>

        <Link
          href="/admin/blog/new"
          className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#171717]/10 shadow-xs overflow-hidden">
        <div className="divide-y divide-[#171717]/5 text-xs">
          {articles.map(art => (
            <div key={art.id} className="p-4 flex items-center justify-between hover:bg-[#F7F7F5]/50 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-16 h-12 rounded-xl object-cover border border-[#171717]/10 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#748C8C]">{art.category}</span>
                  <h3 className="font-serif-display font-medium text-base text-[#171717]">{art.title}</h3>
                  <div className="flex items-center space-x-3 text-[11px] text-[#6B6B6B]">
                    <span>By {art.author.name}</span>
                    <span>•</span>
                    <span>{art.publishedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-mono text-xs font-semibold text-[#6B6B6B]">{art.views} views</span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {art.status}
                </span>
                <Link href={`/admin/blog/new?id=${art.id}`} className="p-1.5 rounded-lg border hover:bg-[#171717] hover:text-white transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
