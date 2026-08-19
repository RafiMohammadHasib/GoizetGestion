'use client';

import React, { useState } from 'react';
import { Search, Globe, Link as LinkIcon, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminSEOPage() {
  const [redirects, setRedirects] = useState([
    { oldUrl: '/ancienne-page-gestion', newUrl: '/gestion-locative', type: '301' },
    { oldUrl: '/location-chartrons-v1', newUrl: '/biens?neighborhood=chartrons', type: '301' }
  ]);

  const [newOldUrl, setNewOldUrl] = useState('');
  const [newNewUrl, setNewNewUrl] = useState('');
  const [redirectType, setRedirectType] = useState<'301' | '302'>('301');
  const [revalidating, setRevalidating] = useState(false);
  const [revalidated, setRevalidated] = useState(false);

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOldUrl || !newNewUrl) return;
    setRedirects([...redirects, { oldUrl: newOldUrl, newUrl: newNewUrl, type: redirectType }]);
    setNewOldUrl('');
    setNewNewUrl('');
  };

  const handleRevalidateSitemap = () => {
    setRevalidating(true);
    setTimeout(() => {
      setRevalidating(false);
      setRevalidated(true);
      setTimeout(() => setValidated(false), 2500);
    }, 800);
  };
  const setValidated = (val: boolean) => setRevalidated(val);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234]">
            MAISON MÉRIDIA SEO ENGINE
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            SEO Audit & Redirect Manager
          </h1>
        </div>

        <button
          onClick={handleRevalidateSitemap}
          disabled={revalidating}
          className="bg-[#171717] hover:bg-[#7A2234] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${revalidating ? 'animate-spin' : ''}`} />
          <span>{revalidating ? 'Regenerating...' : 'Regenerate Sitemap.xml'}</span>
        </button>
      </div>

      {revalidated && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Sitemap.xml et robots.txt régénérés avec succès à la racine du site !</span>
        </div>
      )}

      {/* SEO Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Meta Titles</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif-display text-3xl font-bold text-[#171717]">100%</span>
          <span className="text-[11px] text-[#6B6B6B] block">17 / 17 pages auditées</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Meta Descriptions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif-display text-3xl font-bold text-[#171717]">100%</span>
          <span className="text-[11px] text-[#6B6B6B] block">Descriptions optimisées</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Canonical Tags</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif-display text-3xl font-bold text-[#171717]">Active</span>
          <span className="text-[11px] text-[#6B6B6B] block">Indexation Google propre</span>
        </div>
      </div>

      {/* Redirect Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
        <div className="space-y-1 pb-3 border-b border-[#171717]/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A2234]">
            301 / 302 REDIRECTS ENGINE
          </span>
          <h2 className="font-serif-display text-xl font-medium text-[#171717]">
            URL Redirect Rules
          </h2>
        </div>

        {/* Existing Redirects List */}
        <div className="space-y-2 text-xs">
          {redirects.map((r, idx) => (
            <div key={idx} className="p-3 bg-[#F7F7F5] rounded-xl border border-[#171717]/5 flex items-center justify-between font-mono text-[11px]">
              <div className="flex items-center space-x-2 truncate">
                <span className="text-red-700">{r.oldUrl}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
                <span className="text-emerald-700">{r.newUrl}</span>
              </div>
              <span className="font-bold text-[#7A2234] bg-white px-2 py-0.5 rounded border ml-2">
                {r.type}
              </span>
            </div>
          ))}
        </div>

        {/* Add Redirect Form */}
        <form onSubmit={handleAddRedirect} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 text-xs">
          <input
            type="text"
            required
            placeholder="/ancienne-url-propriete"
            value={newOldUrl}
            onChange={(e) => setNewOldUrl(e.target.value)}
            className="sm:col-span-5 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
          />
          <input
            type="text"
            required
            placeholder="/nouvelle-url-biens"
            value={newNewUrl}
            onChange={(e) => setNewNewUrl(e.target.value)}
            className="sm:col-span-5 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
          />
          <button
            type="submit"
            className="sm:col-span-2 bg-[#7A2234] text-white py-2.5 rounded-xl font-semibold hover:bg-[#5C1D27] transition-colors whitespace-nowrap"
          >
            Add Redirect
          </button>
        </form>
      </div>

    </div>
  );
}
