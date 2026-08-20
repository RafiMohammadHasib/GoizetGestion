'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, Home, MapPin, Euro, ArrowLeft, Save, Sparkles, Image as ImageIcon, 
  Check, Maximize2, Bed, ShieldCheck, Eye, Search 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NewPropertyPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    reference: `GG-3300${Math.floor(Math.random() * 90) + 10}`,
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    transactionType: 'louer',
    propertyType: 'appartement',
    price: 1500,
    charges: 100,
    deposit: 1500,
    surface: 75,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 2,
    yearBuilt: 1900,
    energyRating: 'C',
    gesRating: 'C',
    address: '38 Cours Portal',
    postalCode: '33000',
    city: 'Bordeaux',
    neighborhoodSlug: 'chartrons',
    isExclusive: true,
    status: 'Published',
    features: ['Balcon filant', 'Parquet massif', 'Climatisation', 'Cave privative'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    seoTitle: '',
    seoDescription: ''
  });

  const handleTitleChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({
      ...formData,
      title: val,
      slug: slugified,
      seoTitle: `${val} | Maison Méridia Bordeaux`
    });
  };

  const handleFeatureToggle = (feat: string) => {
    if (formData.features.includes(feat)) {
      setFormData({ ...formData, features: formData.features.filter(f => f !== feat) });
    } else {
      setFormData({ ...formData, features: [...formData.features, feat] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Propriété enregistrée et publiée avec succès !');
      setTimeout(() => router.push('/admin/properties'), 1000);
    }, 600);
  };

  const availableFeatures = [
    'Meublé', 'Balcon filant', 'Terrasse', 'Jardin privatif', 'Parking', 
    'Garage double', 'Ascenseur', 'Climatisation', 'Chauffage individuel', 
    'Cheminée', 'Cave privative', 'Piscine chauffée'
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div className="flex items-center space-x-3">
          <Link href="/admin/properties" className="p-2 rounded-xl border border-[#171717]/10 hover:bg-[#F7F7F5]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
              PROPERTY EDITOR & CREATOR
            </span>
            <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
              {formData.title || 'Add New Property Listing'}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        
        {/* Section 1: General & Classification */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
            1. Basic Information & Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Internal Reference *
              </label>
              <input
                type="text"
                required
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Transaction Type *
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium"
              >
                <option value="louer">Rental (À Louer)</option>
                <option value="acheter">Sale (À Vendre)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium"
              >
                <option value="appartement">Appartement</option>
                <option value="echoppe">Échoppe bordelaise</option>
                <option value="maison">Maison / Villa</option>
                <option value="loft">Loft & Ateliers</option>
                <option value="hotel-particulier">Hôtel Particulier</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Appartement Haussmannien T3 avec Balcon aux Chartrons"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-serif-display text-base font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Publishing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Rented">Rented</option>
                <option value="Sold">Sold</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Full Property Description
            </label>
            <textarea
              rows={4}
              placeholder="Description détaillée du bien..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Measurements */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
            2. Pricing & Dimensions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Price (€) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Monthly Charges (€)
              </label>
              <input
                type="number"
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Security Deposit (€)
              </label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Surface (m²) *
              </label>
              <input
                type="number"
                required
                value={formData.surface}
                onChange={(e) => setFormData({ ...formData, surface: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Rooms (Pièces) *
              </label>
              <input
                type="number"
                required
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Bedrooms (Chambres)
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                DPE Rating
              </label>
              <select
                value={formData.energyRating}
                onChange={(e) => setFormData({ ...formData, energyRating: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-bold text-[#748C8C]"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(r => (
                  <option key={r} value={r}>DPE Class {r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Features & Amenities */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
            3. Prestations & Équipements
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableFeatures.map(feat => {
              const isChecked = formData.features.includes(feat);
              return (
                <div
                  key={feat}
                  onClick={() => handleFeatureToggle(feat)}
                  className={`p-3 rounded-xl border cursor-pointer font-semibold transition-all flex items-center space-x-2 ${
                    isChecked ? 'bg-[#748C8C]/10 border-[#748C8C] text-[#748C8C]' : 'bg-[#F7F7F5] border-[#171717]/10 text-[#6B6B6B]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${isChecked ? 'bg-[#748C8C]' : 'bg-[#171717]/20'}`}>
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="truncate">{feat}</span>
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
            className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-xl font-semibold text-xs shadow-brand flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Property'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
