'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminMediaPage() {
  const { language } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const mediaAssets = [
    { name: 'bordeaux_hero.jpg', url: '/images/hero.jpg', size: '1.4 MB', dimensions: '1920x1080', date: '2026-08-19' },
    { name: 'bordeaux_team.jpg', url: '/images/team.jpg', size: '1.1 MB', dimensions: '1920x1080', date: '2026-08-19' },
    { name: 'echoppe_garden.jpg', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', size: '850 KB', dimensions: '1600x900', date: '2026-08-18' },
    { name: 'chartrons_interior.jpg', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', size: '920 KB', dimensions: '1600x900', date: '2026-08-17' }
  ];

  const handleCopy = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            {language === 'fr' ? 'MÉDIATHÈQUE GOIZET GESTION' : 'GOIZET GESTION MEDIA ASSETS'}
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            {language === 'fr' ? 'Médiathèque' : 'Media Library'} ({mediaAssets.length})
          </h1>
        </div>

        <button className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 cursor-pointer transition-all">
          <Upload className="w-4 h-4" />
          <span>{language === 'fr' ? 'Importer un média' : 'Upload Media'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {mediaAssets.map((asset, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#171717]/10 overflow-hidden shadow-xs space-y-2 group">
            <div className="relative h-40 overflow-hidden bg-[#171512]">
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>

            <div className="p-3 space-y-1">
              <span className="font-semibold text-[#171717] truncate block">{asset.name}</span>
              <div className="flex justify-between text-[10px] text-[#6B6B6B]">
                <span>{asset.size}</span>
                <span>{asset.dimensions}</span>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#171717]/5">
                <button
                  onClick={() => handleCopy(asset.url, idx)}
                  className="text-[10px] font-semibold text-[#748C8C] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>
                    {copiedIndex === idx 
                      ? (language === 'fr' ? 'Copié !' : 'Copied!')
                      : (language === 'fr' ? 'Copier URL' : 'Copy URL')
                    }
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
