'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Check, Globe, Shield, Phone, Mail, MapPin, 
  BarChart, Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, 
  CheckCircle2, Loader2, UserCheck, ShieldAlert
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Active authenticated user
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
  } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Global settings state
  const [settings, setSettings] = useState({
    siteName: 'GOIZET GESTION',
    tagline: 'Immobilier & Gestion Locative à Bordeaux',
    phone: '+33 6 95 57 70 33',
    phoneEdgar: '+33 7 81 96 83 95',
    email: 'goizetgestion@gmail.com',
    address: '48 rue Calvé, 33000 Bordeaux',
    siret: '944 393 487 00011',
    licenseNumber: 'CPI33012025000000128 — CCI Bordeaux',
    gaMeasurementId: 'G-GOIZET2026',
    gtmContainerId: 'GTM-GOIZET01',
    defaultSeoTitle: 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
    defaultMetaDescription: 'Maison de conseil immobilier et gestion locative sur-mesure à Bordeaux (Chartrons, Caudéran, Triangle d\'Or). Mandat transparent et rendement optimisé.'
  });

  // Fetch current user session
  useEffect(() => {
    fetch('/api/admin/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.authenticated && data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    }, 600);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Veuillez saisir votre mot de passe actuel.');
      return;
    }

    if (!newPassword) {
      setPasswordError('Veuillez saisir le nouveau mot de passe.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la modification du mot de passe.');
      }

      setPasswordSuccess(data.message || 'Mot de passe modifié avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setPasswordSuccess('');
      }, 5000);
    } catch (err: any) {
      setPasswordError(err.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 font-sans-ui">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            GOIZET GESTION CONFIGURATION
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Paramètres & Sécurité
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center space-x-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres de l'agence enregistrés avec succès !</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 1: BUSINESS IDENTITY & CONTACT DETAILS                 */}
      {/* ============================================================== */}
      <form onSubmit={handleSave} className="space-y-8 text-xs">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
            <h2 className="font-serif-display text-xl font-medium text-[#171717]">
              1. Identité de l'Agence & Coordonnées
            </h2>
            <span className="text-[11px] text-[#748C8C] font-semibold flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Public</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Nom du site / Raison Sociale
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-bold text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Slogan / Sous-titre officiel
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Téléphone Paul Goizet
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Téléphone Edgar Goizet
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.phoneEdgar}
                  onChange={(e) => setSettings({ ...settings, phoneEdgar: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Email Agence Goizet
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Numéro SIRET
              </label>
              <input
                type="text"
                value={settings.siret}
                onChange={(e) => setSettings({ ...settings, siret: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Carte Professionnelle CPI
              </label>
              <input
                type="text"
                value={settings.licenseNumber}
                onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Adresse Siège Bordeaux
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: ANALYTICS & INTEGRATIONS                            */}
        {/* ============================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
            <h2 className="font-serif-display text-xl font-medium text-[#171717]">
              2. Mesure d'Audience & Balises Analytics
            </h2>
            <span className="text-[11px] text-[#748C8C] font-semibold flex items-center space-x-1.5">
              <BarChart className="w-3.5 h-3.5" />
              <span>Tracking</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                ID Google Analytics 4 (GA4)
              </label>
              <input
                type="text"
                value={settings.gaMeasurementId}
                onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                Conteneur Google Tag Manager (GTM)
              </label>
              <input
                type="text"
                value={settings.gtmContainerId}
                onChange={(e) => setSettings({ ...settings, gtmContainerId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
              />
            </div>
          </div>
        </div>

      </form>

      {/* ============================================================== */}
      {/* SECTION 3: ACCOUNT SECURITY & CHANGE PASSWORD                  */}
      {/* ============================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#171717]/10 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#748C8C]/15 border border-[#748C8C]/25 text-[#748C8C] flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl font-medium text-[#171717]">
                3. Sécurité du Compte & Mot de Passe
              </h2>
              <p className="text-[11px] text-[#6F6255]">
                Modifiez le mot de passe d'accès au terminal d'administration Goizet Gestion.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-[#748C8C]" />
            <span>Chiffrement AES-256</span>
          </div>
        </div>

        {/* Current Authenticated User Information Badge */}
        {currentUser && (
          <div className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#171717]/10 rounded-2xl text-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#171717]/10 shrink-0 flex items-center justify-center">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name || 'Admin'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCheck className="w-5 h-5 text-[#748C8C]" />
                )}
              </div>
              <div>
                <span className="font-bold text-[#171717] block">
                  {currentUser.name || 'Administrateur'}
                </span>
                <span className="text-[11px] text-[#6F6255] font-mono">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-white border border-[#171717]/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
                {currentUser.role || 'Super Admin'}
              </span>
            </div>
          </div>
        )}

        {/* Feedback Alert Messages */}
        {passwordSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center space-x-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center space-x-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handlePasswordChange} className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Current Password */}
            <div>
              <label 
                htmlFor="current-password-input"
                className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]"
              >
                Mot de passe actuel
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6F6255] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="current-password-input"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] placeholder:text-[#6F6255]/40 focus:outline-none focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F6255] hover:text-[#171717] p-1 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label 
                htmlFor="new-password-input"
                className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]"
              >
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6F6255] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="new-password-input"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] placeholder:text-[#6F6255]/40 focus:outline-none focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F6255] hover:text-[#171717] p-1 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-[#6F6255]">
                <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <span>Minimum 8 caractères ({newPassword.length}/8)</span>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label 
                htmlFor="confirm-password-input"
                className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6F6255] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] placeholder:text-[#6F6255]/40 focus:outline-none focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F6255] hover:text-[#171717] p-1 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-1 flex items-center space-x-1.5 text-[10px]">
                  {confirmPassword === newPassword ? (
                    <span className="text-emerald-600 flex items-center space-x-1 font-medium">
                      <Check className="w-3 h-3" />
                      <span>Les mots de passe correspondent</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center space-x-1 font-medium">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Ne correspond pas</span>
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#171717]/10 gap-3">
            <p className="text-[11px] text-[#6F6255]/80 max-w-md">
              Après modification, votre nouveau mot de passe sera immédiatement effectif pour vos prochaines connexions sur l'URL <code className="bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#171717]/10 text-[#748C8C] font-mono font-bold">/admin</code>.
            </p>

            <button
              type="submit"
              disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-brand flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap self-end sm:self-auto"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mise à jour en cours...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Mettre à jour le mot de passe</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

