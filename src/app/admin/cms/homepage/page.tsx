'use client';

import React, { useState } from 'react';
import { Sparkles, Save, Check, Eye, Layout, Layers, Type, Image as ImageIcon, Sliders } from 'lucide-react';

export default function HomepageCMSEditor() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [cmsData, setCmsData] = useState({
    heroBadge: 'MANDATS D\'EXCEPTION & GESTION LOCATIVE À BORDEAUX',
    heroTitleLine1: 'L\'Excellence Immobilière',
    heroTitleLine2: 'sur-mesure à Bordeaux',
    heroSub: 'Nous réinventons les standards de la gestion locative et de la transaction de prestige aux Chartrons, Caudéran et dans le Triangle d\'Or.',
    heroImage: '/images/hero.jpg',
    btnEstimateText: 'Estimer mon bien gratuitement',
    btnExploreText: 'Explorer le catalogue de biens',
    
    sections: {
      hero: true,
      valueStrip: true,
      approach: true,
      services: true,
      gsapSlider: true,
      listings: true,
      ownerCta: true,
      process: true,
      neighborhoods: true,
      testimonials: true,
      journal: true
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    }, 600);
  };

  const handleToggleSection = (key: keyof typeof cmsData.sections) => {
    setCmsData({
      ...cmsData,
      sections: {
        ...cmsData.sections,
        [key]: !cmsData.sections[key]
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234]">
            MAISON MÉRIDIA HOMEPAGE CMS
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Homepage Section Builder
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#7A2234] hover:bg-[#5C1D27] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Save & Publish Homepage'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Homepage mise à jour en direct avec succès !</span>
        </div>
      )}

      {/* Editor Sections */}
      <form onSubmit={handleSave} className="space-y-8 text-xs">
        
        {/* Section 1: Hero Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#171717]/10">
            <Sparkles className="w-5 h-5 text-[#7A2234]" />
            <h2 className="font-serif-display text-xl font-medium text-[#171717]">
              1. Hero Section Content & Typography
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Badge Headline
              </label>
              <input
                type="text"
                value={cmsData.heroBadge}
                onChange={(e) => setCmsData({ ...cmsData, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                  Title Line 1 (Bold Serif)
                </label>
                <input
                  type="text"
                  value={cmsData.heroTitleLine1}
                  onChange={(e) => setCmsData({ ...cmsData, heroTitleLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-serif-display text-base"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                  Title Line 2 (Italic Accent)
                </label>
                <input
                  type="text"
                  value={cmsData.heroTitleLine2}
                  onChange={(e) => setCmsData({ ...cmsData, heroTitleLine2: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-serif-display text-base italic"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Subheading Paragraph
              </label>
              <textarea
                rows={3}
                value={cmsData.heroSub}
                onChange={(e) => setCmsData({ ...cmsData, heroSub: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Background Architectural Image Path
              </label>
              <input
                type="text"
                value={cmsData.heroImage}
                onChange={(e) => setCmsData({ ...cmsData, heroImage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Enable/Disable Homepage Modules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#171717]/10">
            <Layers className="w-5 h-5 text-[#7A2234]" />
            <h2 className="font-serif-display text-xl font-medium text-[#171717]">
              2. Homepage Module Display Controls
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'hero', label: '01. Hero Architecture Section' },
              { key: 'valueStrip', label: '02. Trust Differentiator Strip' },
              { key: 'approach', label: '03. Agency Approach & Team' },
              { key: 'services', label: '04. Services Grid Cards' },
              { key: 'gsapSlider', label: '05. Luxury GSAP Slider' },
              { key: 'listings', label: '06. Property Showcase Cards' },
              { key: 'ownerCta', label: '07. Owner Lead Gen Banner' },
              { key: 'process', label: '08. Management Process Steps' },
              { key: 'neighborhoods', label: '09. Bordeaux Neighborhoods' },
              { key: 'testimonials', label: '10. Verified Reviews' },
              { key: 'journal', label: '11. Journal Articles' }
            ].map((mod) => {
              const isEnabled = (cmsData.sections as any)[mod.key];
              return (
                <div
                  key={mod.key}
                  onClick={() => handleToggleSection(mod.key as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer font-semibold transition-all flex items-center justify-between ${
                    isEnabled ? 'bg-[#7A2234]/10 border-[#7A2234] text-[#7A2234]' : 'bg-[#F7F7F5] border-[#171717]/10 text-[#6B6B6B]'
                  }`}
                >
                  <span className="truncate">{mod.label}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isEnabled ? 'bg-[#7A2234] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {isEnabled ? 'Active' : 'Off'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#7A2234] hover:bg-[#5C1D27] text-white px-8 py-3.5 rounded-xl font-semibold text-xs shadow-xl flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Homepage'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
