'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, Globe, Shield, Phone, Mail, MapPin, BarChart, 
  Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, 
  CheckCircle2, Loader2, UserCheck, ShieldAlert, Sparkles,
  Percent, Clock, Bell, Share2, Search, Sliders, Save, Check, RefreshCw
} from 'lucide-react';

type TabType = 'agency' | 'rental' | 'system' | 'profile';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('agency');
  const [loading, setLoading] = useState(true);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    avatar?: string;
    notifyLead?: boolean;
    notifyTenant?: boolean;
    notifyReport?: boolean;
  }>({
    name: 'Administrateur Goizet Gestion',
    email: 'admin@gg.fr.com',
    phone: '+33 6 95 57 70 33',
    role: 'Super Admin',
    avatar: '/apple-touch-icon.png',
    notifyLead: true,
    notifyTenant: true,
    notifyReport: false
  });

  // Global Agency & System Settings
  const [settings, setSettings] = useState({
    siteName: 'GOIZET GESTION',
    tagline: 'Immobilier & Gestion Locative à Bordeaux',
    phone: '+33 6 95 57 70 33',
    phoneEdgar: '+33 7 81 96 83 95',
    email: 'goizetgestion@gmail.com',
    leadEmail: 'goizetgestion@gmail.com',
    address: '48 rue Calvé, 33000 Bordeaux',
    openingHours: 'Lundi - Vendredi : 09h00 - 19h00 | Samedi : Sur rendez-vous',
    siret: '944 393 487 00011',
    licenseNumber: 'CPI33012025000000128 — CCI Bordeaux',
    financialGuarantee: 'Galian Assurances — 120 000 €',
    managementFeeRate: 6.5,
    defaultDepositMonths: 1,
    gliInsuranceRate: 2.5,
    autoReplyTenant: true,
    autoReplyOwner: true,
    maintenanceMode: false,
    sessionTimeoutHours: 24,
    rateLimitingStrict: true,
    instagramUrl: 'https://instagram.com/goizetgestion',
    linkedinUrl: 'https://linkedin.com/company/goizet-gestion',
    gaMeasurementId: 'G-GOIZET2026',
    gtmContainerId: 'GTM-GOIZET01',
    defaultSeoTitle: 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
    defaultMetaDescription: 'Maison de conseil immobilier et gestion locative sur-mesure à Bordeaux (Chartrons, Caudéran, Triangle d\'Or). Mandat transparent et rendement optimisé.',
    updatedAt: ''
  });

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

  // Fetch initial settings & session from backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data?.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
        if (data?.user) {
          setCurrentUser(prev => ({ ...prev, ...data.user }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Save Global Settings (Agency, Rental rules, System/SEO)
  const handleSaveGlobal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingGlobal(true);
    setGlobalError('');
    setGlobalSuccess('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement.');
      }

      setGlobalSuccess('Paramètres de l\'agence enregistrés avec succès dans la base de données !');
      if (data.settings?.updatedAt) {
        setSettings(prev => ({ ...prev, updatedAt: data.settings.updatedAt }));
      }
      setTimeout(() => setGlobalSuccess(''), 4500);
    } catch (err: any) {
      setGlobalError(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setSavingGlobal(false);
    }
  };

  // Save Profile & Preferences
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await fetch('/api/admin/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          phone: currentUser.phone,
          notifyLead: currentUser.notifyLead,
          notifyTenant: currentUser.notifyTenant,
          notifyReport: currentUser.notifyReport
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du profil.');
      }

      setProfileSuccess('Profil administrateur et notifications mis à jour avec succès !');
      setTimeout(() => setProfileSuccess(''), 4500);
    } catch (err: any) {
      setProfileError(err.message || 'Une erreur est survenue.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
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

      setPasswordSuccess(data.message || 'Votre mot de passe a été mis à jour avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (err: any) {
      setPasswordError(err.message || 'Une erreur est survenue.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto pb-16 font-sans-ui text-[#171717]">
      
      {/* ============================================================== */}
      {/* UNIFIED HEADER BAR — ZERO DUPLICATE BUTTONS                    */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#171717]/10 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GOIZET GESTION CONFIGURATION SYSTÈME</span>
          </div>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Paramètres & Règles Système
          </h1>
          <p className="text-xs text-[#6F6255] mt-0.5">
            Gérez l'identité de l'agence, les règles de gestion locative, les intégrations et votre sécurité.
          </p>
        </div>

        {/* SINGLE AUTHORITATIVE SAVE BUTTON FOR GLOBAL SETTINGS */}
        {activeTab !== 'profile' && (
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {settings.updatedAt && (
              <span className="text-[10px] text-[#6F6255] hidden md:inline-block font-mono">
                Dernière synchro : {new Date(settings.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => handleSaveGlobal()}
              disabled={savingGlobal}
              className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-2 whitespace-nowrap disabled:opacity-50 transition-all cursor-pointer"
            >
              {savingGlobal ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les paramètres</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Global Alerts */}
      {globalSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center space-x-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{globalSuccess}</span>
        </div>
      )}

      {globalError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center space-x-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* NAVIGATION TABS                                                */}
      {/* ============================================================== */}
      <div className="flex items-center space-x-1.5 p-1 bg-[#EAE8E2]/60 rounded-2xl border border-[#171717]/10 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('agency')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'agency'
              ? 'bg-white text-[#171717] shadow-xs'
              : 'text-[#6F6255] hover:text-[#171717]'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#748C8C]" />
          <span>Identité & Agence</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rental')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'rental'
              ? 'bg-white text-[#171717] shadow-xs'
              : 'text-[#6F6255] hover:text-[#171717]'
          }`}
        >
          <Percent className="w-4 h-4 text-[#748C8C]" />
          <span>Gestion Locative & Tarifs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-white text-[#171717] shadow-xs'
              : 'text-[#6F6255] hover:text-[#171717]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#748C8C]" />
          <span>Système, SEO & Réseaux</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-white text-[#171717] shadow-xs'
              : 'text-[#6F6255] hover:text-[#171717]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#748C8C]" />
          <span>Profil & Sécurité</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: AGENCY IDENTITY & CONTACT DETAILS                       */}
      {/* ============================================================== */}
      {activeTab === 'agency' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
              <div>
                <h2 className="font-serif-display text-xl font-medium text-[#171717]">
                  1. Raison Sociale & Image de Marque
                </h2>
                <p className="text-[11px] text-[#6F6255]">
                  Informations affichées publiquement sur le site et les documents de mandats.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20">
                Portail Public
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Nom Officiel de l'Agence
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
                  Slogan / Baseline Officielle
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Ligne Paul Goizet
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
                  Ligne Edgar Goizet
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
                  Email Principal de l'Agence
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Adresse Siège Social Bordeaux
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

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Horaires d'Ouverture du Cabinet
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.openingHours}
                    onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Legal Compliance Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
              2. Mentions Légales & Agréments Professionnels (Loi Hoguet)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
                  Carte Professionnelle CPI (CCI Bordeaux)
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
                  Garantie Financière & Organisme
                </label>
                <input
                  type="text"
                  value={settings.financialGuarantee}
                  onChange={(e) => setSettings({ ...settings, financialGuarantee: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RENTAL MANAGEMENT & OPERATIONAL DEFAULTS                */}
      {/* ============================================================== */}
      {activeTab === 'rental' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
              <div>
                <h2 className="font-serif-display text-xl font-medium text-[#171717]">
                  Barèmes & Règles de Gestion Locative
                </h2>
                <p className="text-[11px] text-[#6F6255]">
                  Ces taux sont utilisés pour pré-remplir les simulateurs de rendement et les propositions de mandats.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20">
                Gestion Métier
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10 space-y-2">
                <span className="block font-semibold uppercase tracking-wider text-[#171717] text-[11px]">
                  Honoraires de Gestion Standard
                </span>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="20"
                    value={settings.managementFeeRate}
                    onChange={(e) => setSettings({ ...settings, managementFeeRate: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-[#171717]/15 rounded-xl font-bold font-mono text-base text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#748C8C]">
                    % HT
                  </span>
                </div>
                <span className="text-[10px] text-[#6F6255] block">
                  Soit {(settings.managementFeeRate * 1.2).toFixed(2)} % TTC pour le mandat Sérénité.
                </span>
              </div>

              <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10 space-y-2">
                <span className="block font-semibold uppercase tracking-wider text-[#171717] text-[11px]">
                  Garantie Loyers Impayés (GLI)
                </span>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={settings.gliInsuranceRate}
                    onChange={(e) => setSettings({ ...settings, gliInsuranceRate: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-[#171717]/15 rounded-xl font-bold font-mono text-base text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#748C8C]">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-[#6F6255] block">
                  Taux négocié avec l'assureur partenaire.
                </span>
              </div>

              <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10 space-y-2">
                <span className="block font-semibold uppercase tracking-wider text-[#171717] text-[11px]">
                  Dépôt de Garantie Standard
                </span>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="2"
                    value={settings.defaultDepositMonths}
                    onChange={(e) => setSettings({ ...settings, defaultDepositMonths: parseInt(e.target.value) || 1 })}
                    className="w-full pl-3.5 pr-14 py-2.5 bg-white border border-[#171717]/15 rounded-xl font-bold font-mono text-base text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#748C8C] text-xs">
                    Mois HC
                  </span>
                </div>
                <span className="text-[10px] text-[#6F6255] block">
                  1 mois (non meublé) ou 2 mois (meublé).
                </span>
              </div>
            </div>

            {/* Automation Rules */}
            <div className="pt-4 border-t border-[#171717]/10 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Automatisations & Relations Clients
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start space-x-3 p-4 bg-[#F7F7F5] border border-[#171717]/10 rounded-2xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                  <input
                    type="checkbox"
                    checked={settings.autoReplyTenant}
                    onChange={(e) => setSettings({ ...settings, autoReplyTenant: e.target.checked })}
                    className="w-4 h-4 rounded text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C] mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-[#171717] text-xs block">
                      Accusé de réception automatique (Candidats Locataires)
                    </span>
                    <span className="text-[11px] text-[#6F6255]">
                      Envoie un email immédiat accusant réception du dossier avec la liste des pièces justificatives.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 bg-[#F7F7F5] border border-[#171717]/10 rounded-2xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                  <input
                    type="checkbox"
                    checked={settings.autoReplyOwner}
                    onChange={(e) => setSettings({ ...settings, autoReplyOwner: e.target.checked })}
                    className="w-4 h-4 rounded text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C] mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-[#171717] text-xs block">
                      Accusé de réception automatique (Propriétaires Bailleurs)
                    </span>
                    <span className="text-[11px] text-[#6F6255]">
                      Confirme la prise en charge de la demande d'estimation ou de mandat sous 24h ouvrées.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SYSTEM, SEO & SOCIAL CHANNELS                           */}
      {/* ============================================================== */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Operations & Routing */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
              Routage des Leads & Sécurité Système
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Email de Réception des Leads CRM
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={settings.leadEmail}
                    onChange={(e) => setSettings({ ...settings, leadEmail: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                  />
                </div>
                <span className="text-[10px] text-[#6F6255] mt-1 block">
                  Toutes les alertes d'estimation et candidatures locataires seront transmises à cette adresse.
                </span>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Expiration de Session Admin (Heures)
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#748C8C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={settings.sessionTimeoutHours}
                    onChange={(e) => setSettings({ ...settings, sessionTimeoutHours: parseInt(e.target.value) || 24 })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                  >
                    <option value={8}>8 Heures (Poste de travail)</option>
                    <option value={24}>24 Heures (Standard recommandé)</option>
                    <option value={72}>72 Heures (3 jours)</option>
                    <option value={168}>7 Jours (Longue durée)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Status Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-start space-x-3 p-4 bg-[#F7F7F5] border border-[#171717]/10 rounded-2xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 accent-amber-600 focus:ring-amber-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#171717] text-xs block">
                    Mode Maintenance Public
                  </span>
                  <span className="text-[11px] text-[#6F6255]">
                    Si activé, les visiteurs publics voient un écran d'attente soigné, pendant que vous conservez l'accès au tableau de bord.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 bg-[#F7F7F5] border border-[#171717]/10 rounded-2xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                <input
                  type="checkbox"
                  checked={settings.rateLimitingStrict}
                  onChange={(e) => setSettings({ ...settings, rateLimitingStrict: e.target.checked })}
                  className="w-4 h-4 rounded text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#171717] text-xs block">
                    Protection Anti-Bruteforce Stricte
                  </span>
                  <span className="text-[11px] text-[#6F6255]">
                    Limite les tentatives de connexion abusives à 5 essais par minute par adresse IP.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Social Channels Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
              Réseaux Sociaux & Présence Digitale
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Instagram de l'Agence
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/goizetgestion"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  LinkedIn Entreprise
                </label>
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/goizet-gestion"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
          </div>

          {/* Analytics & SEO */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-3 border-b border-[#171717]/10">
              Mesure d'Audience & Référencement (SEO)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

            <div className="space-y-4 text-xs pt-2 border-t border-[#171717]/10">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Titre SEO Global (Balise Title)
                </label>
                <input
                  type="text"
                  value={settings.defaultSeoTitle}
                  onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                  Meta Description par Défaut
                </label>
                <textarea
                  rows={3}
                  value={settings.defaultMetaDescription}
                  onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: USER PROFILE & SECURITY                                 */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          
          {/* Section: User Profile & Notification Alerts */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
              <div>
                <h2 className="font-serif-display text-xl font-medium text-[#171717]">
                  Profil Administrateur & Notifications
                </h2>
                <p className="text-[11px] text-[#6F6255]">
                  Vos coordonnées professionnelles et vos préférences d'alertes instantanées.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/25">
                {currentUser.role || 'Super Admin'}
              </span>
            </div>

            {profileSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center space-x-2.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center space-x-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    required
                    value={currentUser.name || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-bold text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                    Email de Connexion
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email || ''}
                    className="w-full px-3.5 py-2.5 bg-[#EAE8E2]/60 border border-[#171717]/10 rounded-xl font-mono text-[#6F6255] cursor-not-allowed text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5 text-[11px]">
                    Téléphone Direct
                  </label>
                  <input
                    type="text"
                    value={currentUser.phone || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    placeholder="+33 6 95 57 70 33"
                    className="w-full px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-mono text-[#171717] focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Notification preferences */}
              <div className="pt-2 border-t border-[#171717]/10 space-y-3">
                <span className="block font-bold uppercase tracking-wider text-[#171717] text-[11px]">
                  Préférences de Notification Email
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2.5 p-3 bg-[#F7F7F5] border border-[#171717]/10 rounded-xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                    <input
                      type="checkbox"
                      checked={Boolean(currentUser.notifyLead)}
                      onChange={(e) => setCurrentUser({ ...currentUser, notifyLead: e.target.checked })}
                      className="w-4 h-4 rounded text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C]"
                    />
                    <span className="text-[11px] font-medium text-[#171717]">
                      Nouveau Lead / Mandat
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-[#F7F7F5] border border-[#171717]/10 rounded-xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                    <input
                      type="checkbox"
                      checked={Boolean(currentUser.notifyTenant)}
                      onChange={(e) => setCurrentUser({ ...currentUser, notifyTenant: e.target.checked })}
                      className="w-4 h-4 rounded text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C]"
                    />
                    <span className="text-[11px] font-medium text-[#171717]">
                      Dossier Locataire Soumis
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-[#F7F7F5] border border-[#171717]/10 rounded-xl cursor-pointer hover:bg-[#F2F2EE] transition-all">
                    <input
                      type="checkbox"
                      checked={Boolean(currentUser.notifyReport)}
                      onChange={(e) => setCurrentUser({ ...currentUser, notifyReport: e.target.checked })}
                      className="w-4 h-4 rounded text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C]"
                    />
                    <span className="text-[11px] font-medium text-[#171717]">
                      Bilan Hebdomadaire
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Profile */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-brand flex items-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Mettre à jour mon profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section: Password & Authentication Security */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#171717]/10 gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#748C8C]/15 border border-[#748C8C]/25 text-[#748C8C] flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif-display text-xl font-medium text-[#171717]">
                    Modification du Mot de Passe
                  </h2>
                  <p className="text-[11px] text-[#6F6255]">
                    Modifiez le mot de passe d'accès sécurisé à l'URL <code className="bg-[#FAF9F6] px-1 py-0.5 rounded border border-[#171717]/10 text-[#748C8C] font-mono font-bold">/admin</code>.
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/20 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-[#748C8C]" />
                <span>Chiffrement SHA-256</span>
              </div>
            </div>

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

              {/* Submit Password Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-brand flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
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
      )}

    </div>
  );
}
