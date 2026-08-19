'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, Check, Sparkles } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Marché Bordeaux',
    readTime: '4 min',
    excerpt: '',
    content: '',
    author: 'Alexandre de Saint-Clair',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    seoTitle: '',
    seoDescription: ''
  });

  const handleTitleChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({
      ...formData,
      title: val,
      slug: slugified,
      seoTitle: `${val} | Le Journal Méridia`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => router.push('/admin/blog'), 1000);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div className="flex items-center space-x-3">
          <Link href="/admin/blog" className="p-2 rounded-xl border border-[#171717]/10 hover:bg-[#F7F7F5]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234]">
              BLOG ARTICLE EDITOR
            </span>
            <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
              {formData.title || 'Create New Article'}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#7A2234] hover:bg-[#5C1D27] text-white px-6 py-2.5 rounded-xl font-semibold shadow flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Article publié avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
        <div>
          <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
            Article Title *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Encadrement des loyers à Bordeaux en 2026 : Le guide complet"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-serif-display text-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-semibold"
            >
              <option value="Marché Bordeaux">Marché Bordeaux</option>
              <option value="Gestion Locative">Gestion Locative</option>
              <option value="Conseils Propriétaires">Conseils Propriétaires</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Estimated Read Time
            </label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
            Short Excerpt (Résumé)
          </label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
            Article Content (Rich Text Markdown)
          </label>
          <textarea
            rows={8}
            placeholder="Rédigez votre article ici..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-sans-ui leading-relaxed"
          />
        </div>
      </form>
    </div>
  );
}
