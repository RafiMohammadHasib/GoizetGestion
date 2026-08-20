'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, Globe, Shield, Phone, Mail, MapPin, BarChart } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'GOIZET GESTION',
    tagline: 'Immobilier & Gestion Locative à Bordeaux',
    phone: '+33 6 95 57 70 33',
    phoneEdgar: '+33 7 81 96 83 95',
    email: 'Goizetgestion@gmail.com',
    address: '38 Cours Portal, 33000 Bordeaux',
    siret: '944 393 487 00011',
    licenseNumber: 'CPI33012025000000128 — CCI Bordeaux',
    gaMeasurementId: 'G-GOIZET2026',
    gtmContainerId: 'GTM-GOIZET01',
    defaultSeoTitle: 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
    defaultMetaDescription: 'Maison de conseil immobilier et gestion locative sur-mesure à Bordeaux (Chartrons, Caudéran, Triangle d\'Or). Mandat transparent et rendement optimisé.'
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            GOIZET GESTION CONFIGURATION
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Global Website Settings
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres globaux enregistrés avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        
        {/* Section 1: Business Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
            1. Agency Identity & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Paul Goizet Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Edgar Goizet Phone
              </label>
              <input
                type="text"
                value={settings.phoneEdgar}
                onChange={(e) => setSettings({ ...settings, phoneEdgar: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Agency Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                SIRET Number
              </label>
              <input
                type="text"
                value={settings.siret}
                onChange={(e) => setSettings({ ...settings, siret: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Professional License (Carte Pro CPI)
              </label>
              <input
                type="text"
                value={settings.licenseNumber}
                onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Bordeaux Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Analytics & Integrations */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
            2. Analytics & Tag Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={settings.gaMeasurementId}
                onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Google Tag Manager Container ID
              </label>
              <input
                type="text"
                value={settings.gtmContainerId}
                onChange={(e) => setSettings({ ...settings, gtmContainerId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono"
              />
            </div>
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
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
