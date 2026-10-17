'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Filter, Phone, Mail, Clock, Calendar, CheckCircle2, MessageSquare, 
  ArrowRight, Search, Plus, UserCheck, AlertCircle, FileText, ChevronRight, X,
  RefreshCw, Loader2, MapPin, Euro, GripVertical, Building, Sparkles, Home, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminCRMPage() {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const stages = [
    { id: 'NEW', title: language === 'fr' ? 'Nouveaux prospects' : 'New Leads', color: 'bg-[#748C8C]', badgeBg: 'bg-[#748C8C]/15 text-[#3D5252]' },
    { id: 'CONTACTED', title: language === 'fr' ? 'Contactés' : 'Contacted', color: 'bg-amber-500', badgeBg: 'bg-amber-50 text-amber-700' },
    { id: 'QUALIFIED', title: language === 'fr' ? 'Qualifiés' : 'Qualified', color: 'bg-blue-500', badgeBg: 'bg-blue-50 text-blue-700' },
    { id: 'APPOINTMENT', title: language === 'fr' ? 'Visite / RDV' : 'Viewing / Meeting', color: 'bg-purple-500', badgeBg: 'bg-purple-50 text-purple-700' },
    { id: 'CONVERTED', title: language === 'fr' ? 'Gagné / Signé' : 'Won / Signed', color: 'bg-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { id: 'LOST', title: language === 'fr' ? 'Clôturé' : 'Closed', color: 'bg-gray-400', badgeBg: 'bg-gray-100 text-gray-600' }
  ];

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/crm');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to load CRM leads:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();

    // Realtime Supabase Channel
    const channel = supabase
      .channel('admin-crm-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }

    try {
      await fetch('/api/admin/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;

    const noteObj = {
      id: `note_${Date.now()}`,
      author: 'Paul & Edgar Goizet',
      text: newNote.trim(),
      date: new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    const updatedNotes = [...(selectedLead.notes || []), noteObj];
    const updatedLead = { ...selectedLead, notes: updatedNotes };

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    setNewNote('');

    try {
      await fetch('/api/admin/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, note: noteObj })
      });
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dragOverStage === stageId) {
        setDragOverStage(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      handleStatusChange(leadId, stageId);
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const filteredLeads = leads.filter(l => {
    if (filterType !== 'ALL') {
      const typeStr = (l.leadType || '').toUpperCase();
      const srvStr = (l.serviceType || '').toUpperCase();
      const subjStr = (l.subject || '').toUpperCase();

      if (filterType === 'OWNER') {
        const isOwner = typeStr.includes('OWNER') || srvStr.includes('MANAGEMENT') || srvStr.includes('LETTING') || srvStr.includes('RENT OUT') ||
                        subjStr.includes('GESTION') || subjStr.includes('CONFIER') || subjStr.includes('PROPRIÉTAIRE');
        if (!isOwner) return false;
      } else if (filterType === 'SELLER') {
        if (!typeStr.includes('SELLER') && !srvStr.includes('SELL') && !srvStr.includes('SALES') && !subjStr.includes('VENTE')) return false;
      } else if (filterType === 'TENANT') {
        if (!typeStr.includes('TENANT') && !srvStr.includes('RENT A') && !subjStr.includes('VISITE') && !subjStr.includes('LOCATAIRE')) return false;
      } else if (filterType === 'BUYER') {
        if (!typeStr.includes('BUYER') && !srvStr.includes('BUY') && !subjStr.includes('ACHAT') && !subjStr.includes('ACQUÉREUR')) return false;
      } else if (filterType === 'VALUATION') {
        if (!typeStr.includes('VALUATION') && !srvStr.includes('VALUATION') && !subjStr.includes('ESTIMATION')) return false;
      } else if (filterType === 'CALLBACK') {
        if (!typeStr.includes('CALLBACK') && !subjStr.includes('RAPPEL')) return false;
      } else if (!typeStr.includes(filterType) && !srvStr.includes(filterType)) {
        return false;
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (l.name || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.propertyAddress || '').toLowerCase().includes(q) ||
        (l.surface || '').toLowerCase().includes(q) ||
        (l.subject || '').toLowerCase().includes(q) ||
        (l.serviceType || '').toLowerCase().includes(q) ||
        (l.phone || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getBadgeStyle = (type: string, service?: string) => {
    const t = (type || '').toLowerCase();
    const s = (service || '').toLowerCase();

    if (t.includes('valuation') || s.includes('valuation') || s.includes('estimation')) return 'bg-purple-50 text-purple-800 border-purple-200/80';
    if (s.includes('letting') || s.includes('location')) return 'bg-teal-50 text-teal-800 border-teal-200/80';
    if (t.includes('owner') || s.includes('management') || s.includes('gestion')) return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    if (t.includes('seller') || s.includes('sales') || s.includes('vente')) return 'bg-amber-50 text-amber-800 border-amber-200/80';
    if (t.includes('callback') || s.includes('rappel')) return 'bg-rose-50 text-rose-800 border-rose-200/80';
    if (t.includes('tenant') || t.includes('locataire')) return 'bg-sky-50 text-sky-800 border-sky-200/80';
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  const getLeadTypeLabel = (type: string, service?: string) => {
    const isFr = language === 'fr';
    const text = (service || type || '').trim();
    const low = text.toLowerCase();

    if (low.includes('rental management') || low.includes('gestion')) {
      return isFr ? 'Gestion Locative 360°' : '360° Rental Management';
    }
    if (low.includes('letting') || low.includes('location') || low.includes('locat') || low.includes('tenant') || low.includes('visite')) {
      return isFr ? 'Demande Visite Locataire' : 'Tenant Request';
    }
    if (low.includes('valuation') || low.includes('estimat')) {
      return isFr ? 'Estimation Propriétaire' : 'Owner Valuation';
    }
    if (low.includes('sales') || low.includes('vente') || low.includes('seller') || low.includes('mandat')) {
      return isFr ? 'Mandat Vente' : 'Sales Mandate';
    }
    if (low.includes('buyer') || low.includes('achat') || low.includes('acquéreur') || low.includes('acquereur')) {
      return isFr ? 'Recherche Acquéreur' : 'Buyer Request';
    }
    if (low.includes('callback') || low.includes('rappel')) {
      return isFr ? 'Demande de Rappel' : 'Callback Request';
    }
    if (low.includes('owner') || low.includes('propriétaire') || low.includes('proprietaire') || low.includes('bailleur')) {
      return isFr ? 'Dossier Propriétaire' : 'Owner Enquiry';
    }
    if (low.includes('contact') || low.includes('message')) {
      return isFr ? 'Message de Contact' : 'Contact Message';
    }
    return isFr ? (type || 'Demande Contact') : (type || 'Contact Message');
  };

  const formatSource = (src: string) => {
    if (!src) return '';
    if (language === 'en') {
      return src
        .replace(/Hero Lead Form - Espace Propriétaire/gi, 'Hero Lead Form - Owner Portal')
        .replace(/Hero Lead Form - Espace Locataire\/Acheteur/gi, 'Hero Lead Form - Tenant/Buyer Portal')
        .replace(/Espace Propriétaire/gi, 'Owner Portal')
        .replace(/Espace Locataire\/Acheteur/gi, 'Tenant/Buyer Portal')
        .replace(/Formulaire Confier mon bien/gi, 'Entrust Property Form')
        .replace(/Modal Visite Rapide/gi, 'Quick Viewing Modal')
        .replace(/Page Dédiée \/confier-un-bien/gi, 'Dedicated Entrust Page')
        .replace(/Page Détail Bien/gi, 'Property Detail Page')
        .replace(/Calculateur Estimation En Ligne/gi, 'Online Valuation Tool')
        .replace(/Catalogue Biens Off-Market Form/gi, 'Off-Market Property Catalog Form')
        .replace(/Formulaire de contact rapide/gi, 'Quick Contact Form')
        .replace(/Formulaire Contact/gi, 'Contact Form')
        .replace(/Site Web/gi, 'Website Form')
        .replace(/Recherche Google/gi, 'Google Search');
    }
    return src;
  };

  const formatPropertyAddress = (addr: string) => {
    if (!addr) return '';
    if (language === 'en') {
      return addr
        .replace(/\bappartement\b/gi, 'Apartment')
        .replace(/\bmaison\b/gi, 'House')
        .replace(/\bimmeuble\b/gi, 'Building')
        .replace(/\bechoppe\b/gi, 'Échoppe')
        .replace(/\bhotel-particulier\b/gi, 'Townhouse / Mansion')
        .replace(/\bterrain\b/gi, 'Land / Plot')
        .replace(/autre secteur/gi, 'Other district')
        .replace(/triangle-dor/gi, 'Golden Triangle')
        .replace(/bordeaux-centre/gi, 'Bordeaux Center')
        .replace(/Non renseigné/gi, 'Not specified');
    }
    return addr
      .replace(/\bapartment\b/gi, 'Appartement')
      .replace(/\bhouse\b/gi, 'Maison')
      .replace(/\bbuilding\b/gi, 'Immeuble');
  };

  const formatSubject = (subj: string) => {
    if (!subj) return '';
    if (language === 'en') {
      return subj
        .replace(/^Dossier\s*:\s*/i, 'File: ')
        .replace(/^Recherche\s*:\s*/i, 'Search: ')
        .replace(/Louer mon bien \(Propriétaire\)/gi, 'Rent out my property (Owner)')
        .replace(/Vendre mon bien \(Propriétaire\)/gi, 'Sell my property (Owner)')
        .replace(/Louer un bien \(Locataire\)/gi, 'Rent a property (Tenant)')
        .replace(/Acheter un bien \(Acheteur\)/gi, 'Buy a property (Buyer)')
        .replace(/Gestion Locative 360°/gi, '360° Rental Management')
        .replace(/Mise en Location & Recherche Locataires/gi, 'Letting & Tenant Placement')
        .replace(/Estimation Locative & Rendement/gi, 'Rental Valuation & Yield')
        .replace(/Vente Immobilière de Prestige/gi, 'Luxury Property Sales')
        .replace(/Demande d'information/gi, 'Information Request')
        .replace(/Demande de contact/gi, 'Contact Request')
        .replace(/Demande de visite/gi, 'Viewing Request')
        .replace(/Demande de rappel rapide/gi, 'Quick Callback Request')
        .replace(/Estimation Loyer\s*:\s*/gi, 'Rental Valuation: ')
        .replace(/\(maison à /gi, '(House in ')
        .replace(/\(appartement à /gi, '(Apartment in ')
        .replace(/\(immeuble à /gi, '(Building in ')
        .replace(/\(echoppe à /gi, '(Échoppe in ')
        .replace(/\(autre à /gi, '(Other in ')
        .replace(/\(maison\s*•\s*/gi, '(House • ')
        .replace(/\(appartement\s*•\s*/gi, '(Apartment • ')
        .replace(/\(immeuble\s*•\s*/gi, '(Building • ')
        .replace(/\s+à\s+([A-Z])/g, ' in $1');
    }
    return subj;
  };

  const formatMessage = (msg: string) => {
    if (!msg) return '';
    if (language === 'en') {
      return msg
        .replace(/^Propriétaire pour\s*:\s*/gi, 'Owner for: ')
        .replace(/^Client en recherche pour\s*:\s*/gi, 'Client search for: ')
        .replace(/Louer mon bien \(Propriétaire\)/gi, 'Rent out my property (Owner)')
        .replace(/Vendre mon bien \(Propriétaire\)/gi, 'Sell my property (Owner)')
        .replace(/Louer un bien \(Locataire\)/gi, 'Rent a property (Tenant)')
        .replace(/Acheter un bien \(Acheteur\)/gi, 'Buy a property (Buyer)')
        .replace(/Gestion Locative 360°/gi, '360° Rental Management')
        .replace(/Mise en Location & Recherche Locataires/gi, 'Letting & Tenant Placement')
        .replace(/Estimation Locative & Rendement/gi, 'Rental Valuation & Yield')
        .replace(/Bien\s*:\s*maison/gi, 'Property: House')
        .replace(/Bien\s*:\s*appartement/gi, 'Property: Apartment')
        .replace(/Bien\s*:\s*immeuble/gi, 'Property: Building')
        .replace(/Bien\s*:\s*echoppe/gi, 'Property: Échoppe')
        .replace(/Bien\s*:\s*hotel-particulier/gi, 'Property: Townhouse')
        .replace(/Surface\s*:\s*/gi, 'Surface: ')
        .replace(/Pièces\s*:\s*/gi, 'Rooms: ')
        .replace(/Quartier\s*:\s*/gi, 'District: ')
        .replace(/Loyer estimé\s*:\s*/gi, 'Estimated rent: ')
        .replace(/Formulaire d'estimation propriétaire reçu\./gi, 'Owner valuation form received.')
        .replace(/Type de visite souhaitée\s*:\s*/gi, 'Requested tour format: ')
        .replace(/Type de visite\s*:\s*Sur place à Bordeaux/gi, 'Tour format: In person in Bordeaux')
        .replace(/Type de visite\s*:\s*Vidéo à distance/gi, 'Tour format: Remote video')
        .replace(/Créneau préféré\s*:\s*Matin \(9h - 12h\)/gi, 'Preferred slot: Morning (9am - 12pm)')
        .replace(/Créneau préféré\s*:\s*Après-midi \(14h - 17h\)/gi, 'Preferred slot: Afternoon (2pm - 5pm)')
        .replace(/Créneau préféré\s*:\s*Fin de journée \(17h - 19h\)/gi, 'Preferred slot: Late afternoon (5pm - 7pm)')
        .replace(/Créneau préféré\s*:\s*Samedi/gi, 'Preferred slot: Saturday')
        .replace(/Sujets demandés\s*:\s*/gi, 'Requested topics: ')
        .replace(/Bonjour, je souhaite obtenir des renseignements complémentaires concernant vos services d'accompagnement immobilier à Bordeaux\./gi, 'Hello, I would like to get additional information regarding your real estate services in Bordeaux.')
        .replace(/Propriété ciblée\s*:\s*/gi, 'Targeted property: ')
        .replace(/Call me/gi, 'Please call me');
    }
    return msg;
  };

  const formatNoteAuthor = (author: string) => {
    if (!author) return '';
    if (language === 'en') {
      return author
        .replace(/Portail Propriétaire Goizet/gi, 'Goizet Owner Portal')
        .replace(/Portail Recherche Goizet/gi, 'Goizet Search Portal')
        .replace(/Calculateur Goizet/gi, 'Goizet Valuation Tool')
        .replace(/Système/gi, 'System');
    }
    return author;
  };

  const formatNoteDate = (d: string) => {
    if (!d) return '';
    if (language === 'en') {
      return d
        .replace(/À l'instant/gi, 'Just now')
        .replace(/Il y a (\d+) jours?/gi, '$1 days ago')
        .replace(/Il y a (\d+) heures?/gi, '$1 hours ago')
        .replace(/Hier/gi, 'Yesterday');
    }
    return d;
  };

  const formatNoteText = (txt: string) => {
    if (!txt) return '';
    if (language === 'en') {
      return txt
        .replace(/Demande reçue pour Louer mon bien \(Propriétaire\)\./gi, 'Request received for Rent out my property (Owner).')
        .replace(/Demande reçue pour Vendre mon bien \(Propriétaire\)\./gi, 'Request received for Sell my property (Owner).')
        .replace(/Demande reçue pour Louer un bien \(Locataire\)\./gi, 'Request received for Rent a property (Tenant).')
        .replace(/Demande reçue pour Acheter un bien \(Acheteur\)\./gi, 'Request received for Buy a property (Buyer).')
        .replace(/Demande reçue pour ([^.]+)\./gi, 'Request received for $1.')
        .replace(/Rappel garanti au/gi, 'Guaranteed callback at')
        .replace(/Premier contact qualifié avec succès par l'équipe commercial\./gi, 'First contact successfully qualified by the sales team.')
        .replace(/Demande enregistrée en base CRM\./gi, 'Request registered in CRM database.')
        .replace(/Estimation indicative\s*:\s*/gi, 'Indicative valuation: ')
        .replace(/Dossier \(([^)]+)\) soumis depuis le site web\./gi, 'File ($1) submitted from website.');
    }
    return txt;
  };

  const formatTimeSlot = (slot: string) => {
    if (!slot) return '';
    if (language === 'en') {
      return slot
        .replace(/Matin \(9h - 12h\)/gi, 'Morning (9am - 12pm)')
        .replace(/Après-midi \(14h - 17h\)/gi, 'Afternoon (2pm - 5pm)')
        .replace(/Fin de journée \(17h - 19h\)/gi, 'Late afternoon (5pm - 7pm)')
        .replace(/Samedi/gi, 'Saturday');
    }
    return slot;
  };

  const formatSurface = (surf: string) => {
    if (!surf) return '';
    if (language === 'en') {
      return surf
        .replace(/pièces?/gi, 'rooms')
        .replace(/ch\./gi, 'bdrm');
    }
    return surf;
  };

  return (
    <div suppressHydrationWarning className="space-y-6 max-w-full">
      
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
              GOIZET GESTION CRM
            </span>
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Live</span>
            </span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#171717] mt-0.5">
            {language === 'fr' ? 'Pipeline des Opportunités' : 'Opportunity Pipeline'}
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            {language === 'fr'
              ? 'Génération de prospects propriétaires (Gestion, Location, Estimation, Vente) & visites locataires avec conversion drag & drop'
              : 'Owner lead generation (Management, Letting, Valuation, Sales) & tenant viewings with drag & drop conversion'}
          </p>
        </div>

        {/* Search, Filter Pills & Refresh */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Live Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder={language === 'fr' ? 'Rechercher prospects, adresse, service...' : 'Search leads, address, service...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#171717]/10 rounded-xl text-xs focus:outline-none focus:border-[#748C8C] w-40 sm:w-56 shadow-2xs"
            />
          </div>

          <button
            onClick={() => fetchLeads()}
            className="p-2 rounded-xl bg-white border border-[#171717]/10 hover:bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#171717] transition-colors shadow-2xs"
            title={language === 'fr' ? 'Actualiser les prospects' : 'Refresh Leads'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <div className="flex space-x-1 bg-white p-1 rounded-xl border border-[#171717]/10 text-xs font-semibold shadow-2xs">
            {[
              { id: 'ALL', label: language === 'fr' ? 'Tous les prospects' : 'All Leads' },
              { id: 'OWNER', label: language === 'fr' ? 'Propriétaires' : 'Owners' },
              { id: 'SELLER', label: language === 'fr' ? 'Vendeurs' : 'Sellers' },
              { id: 'TENANT', label: language === 'fr' ? 'Locataires' : 'Tenants' },
              { id: 'BUYER', label: language === 'fr' ? 'Acheteurs' : 'Buyers' },
              { id: 'VALUATION', label: language === 'fr' ? 'Estimations' : 'Valuations' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  filterType === f.id ? 'bg-brand-gradient text-white shadow-brand' : 'text-[#6B6B6B] hover:text-[#171717]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#748C8C]" />
          <span className="text-xs text-[#6B6B6B]">
            {language === 'fr' ? 'Chargement du Pipeline CRM...' : 'Loading Opportunity Pipeline...'}
          </span>
        </div>
      ) : (
        /* Zero Side-Scroll Modern 6-Column Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {stages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.status === stage.id);
            const isOver = dragOverStage === stage.id;

            return (
              <div 
                key={stage.id} 
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={(e) => handleDragLeave(e, stage.id)}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`p-2.5 rounded-2xl border transition-all duration-200 flex flex-col min-h-[520px] max-h-[calc(100vh-220px)] ${
                  isOver 
                    ? 'bg-[#748C8C]/10 border-[#748C8C] shadow-md ring-2 ring-[#748C8C]/30 scale-[1.01]' 
                    : 'bg-[#F2EFEB]/60 border-[#171717]/8'
                }`}
              >
                
                {/* Stage Header */}
                <div className="flex items-center justify-between px-1 pb-2.5 border-b border-[#171717]/5 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-xs font-bold text-[#171717] tracking-tight truncate">{stage.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white text-[#171717] px-2 py-0.5 rounded-full border border-[#171717]/10 shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container with Smooth Vertical Scrollbar */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5 no-scrollbar">
                  {stageLeads.map(lead => {
                    const isDragging = draggedLeadId === lead.id;
                    const cleanName = (lead.name || 'Prospect').replace(/#\d+/g, '').trim();

                    return (
                      <motion.div
                        key={lead.id}
                        layout
                        draggable
                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedLead(lead)}
                        className={`group bg-white p-3 rounded-xl border border-[#171717]/10 shadow-2xs hover:shadow-md hover:border-[#748C8C]/40 cursor-grab active:cursor-grabbing transition-all space-y-2 select-none ${
                          isDragging ? 'opacity-30 scale-95 border-dashed border-[#748C8C]' : 'opacity-100'
                        }`}
                      >
                        {/* Card Header: Type Badge & Grip */}
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getBadgeStyle(lead.leadType, lead.serviceType)} truncate max-w-[140px]`}>
                            {getLeadTypeLabel(lead.leadType, lead.serviceType)}
                          </span>
                          <GripVertical className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                        </div>

                        {/* Name & Budget / Rent Range */}
                        <div className="space-y-0.5">
                          <h4 className="font-semibold text-xs text-[#171717] group-hover:text-[#748C8C] transition-colors line-clamp-1">
                            {cleanName}
                          </h4>
                          {lead.budget && (
                            <p className="text-[11px] font-bold text-[#171717]">
                              {language === 'en'
                                ? lead.budget.replace(/\/ mois/g, '/ month')
                                : lead.budget.replace(/\/ month/g, '/ mois')}
                            </p>
                          )}
                        </div>

                        {/* Surface & Rooms if available */}
                        {lead.surface && (
                          <div className="inline-flex items-center space-x-1 bg-[#F7F7F5] px-2 py-0.5 rounded-md text-[10px] font-medium text-stone-600 border border-[#171717]/5">
                            <Home className="w-3 h-3 text-[#748C8C]" />
                            <span>{formatSurface(lead.surface)}</span>
                          </div>
                        )}

                        {/* Address / Targeted Property */}
                        {lead.propertyAddress && (
                          <div className="flex items-center space-x-1 text-[10px] text-[#6B6B6B] truncate">
                            <MapPin className="w-3 h-3 text-[#748C8C] shrink-0" />
                            <span className="truncate">{formatPropertyAddress(lead.propertyAddress)}</span>
                          </div>
                        )}

                        {/* Preferred Time Slot */}
                        {lead.preferredTimeSlot && (
                          <div className="flex items-center space-x-1 text-[9px] text-[#748C8C] font-semibold bg-[#748C8C]/10 px-2 py-0.5 rounded-md">
                            <Clock className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{formatTimeSlot(lead.preferredTimeSlot)}</span>
                          </div>
                        )}

                        {/* Footer: Date & Phone */}
                        <div className="flex items-center justify-between text-[10px] text-[#6B6B6B] pt-1.5 border-t border-[#171717]/5">
                          <span className="truncate text-[10px] font-mono text-stone-500">{lead.phone}</span>
                          <span className="shrink-0 font-mono text-[9px] text-stone-400">
                            {new Date(lead.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Empty / Drag Over Drop Zone Target */}
                  {isOver && stageLeads.length === 0 && (
                    <div className="h-28 border-2 border-dashed border-[#748C8C] rounded-xl flex items-center justify-center text-center p-3 text-xs text-[#748C8C] font-semibold animate-pulse bg-white/50">
                      {language === 'fr' ? 'Déposer ici pour déplacer' : 'Drop here to move'}
                    </div>
                  )}

                  {!isOver && stageLeads.length === 0 && (
                    <div className="h-24 border border-dashed border-[#171717]/10 rounded-xl flex items-center justify-center text-center p-3 text-[10px] text-stone-400 italic">
                      {language === 'fr' ? 'Aucun prospect à cette étape' : 'No leads in stage'}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Rich Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white text-[#171717] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#171717]/10 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#171717] p-1.5 rounded-full hover:bg-[#F7F7F5]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lead Top Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getBadgeStyle(selectedLead.leadType, selectedLead.serviceType)}`}>
                    {getLeadTypeLabel(selectedLead.leadType, selectedLead.serviceType)}
                  </span>
                  <span className="text-xs text-[#6B6B6B]">{language === 'fr' ? 'Source :' : 'Source:'} {formatSource(selectedLead.source)}</span>
                  <span className="text-xs text-[#6B6B6B]">
                    • {new Date(selectedLead.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="font-serif-display text-3xl font-medium">{selectedLead.name}</h2>
              </div>

              {/* Stage Selector & Quick Conversion */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#171717]">
                    {language === 'fr' ? 'Étape :' : 'Stage Status:'}
                  </span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#171717]/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#748C8C] cursor-pointer"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {selectedLead.status === 'CONVERTED' ? (
                  <Link
                    href={selectedLead.leadType?.toLowerCase().includes('tenant') ? '/admin/tenants' : '/admin/owners'}
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>
                      {language === 'fr'
                        ? (selectedLead.leadType?.toLowerCase().includes('tenant') ? 'Voir dans le module Locataires →' : 'Voir dans le module Propriétaires →')
                        : (selectedLead.leadType?.toLowerCase().includes('tenant') ? 'View in Tenants Module →' : 'View in Owners Module →')}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedLead.id, 'CONVERTED')}
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {language === 'fr'
                        ? `Convertir en ${selectedLead.leadType?.toLowerCase().includes('tenant') ? 'Locataire' : 'Propriétaire'}`
                        : `Convert to ${selectedLead.leadType?.toLowerCase().includes('tenant') ? 'Tenant' : 'Owner'}`}
                    </span>
                  </button>
                )}
              </div>

              {/* Converted Status Banner */}
              {selectedLead.status === 'CONVERTED' && (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {language === 'fr'
                        ? (selectedLead.leadType?.toLowerCase().includes('tenant')
                            ? 'Dossier signé avec succès ! Ce contact est accessible dans le module Locataires sur la barre latérale.'
                            : 'Dossier signé avec succès ! Ce contact est accessible dans le module Propriétaires sur la barre latérale.')
                        : (selectedLead.leadType?.toLowerCase().includes('tenant')
                            ? 'Won opportunity! This contact is active in the Tenants module on the left sidebar.'
                            : 'Won opportunity! This contact is active in the Owners module on the left sidebar.')}
                    </span>
                  </div>
                  <Link
                    href={selectedLead.leadType?.toLowerCase().includes('tenant') ? '/admin/tenants' : '/admin/owners'}
                    className="ml-3 font-bold text-emerald-700 hover:text-emerald-950 underline whitespace-nowrap text-xs"
                  >
                    {language === 'fr'
                      ? (selectedLead.leadType?.toLowerCase().includes('tenant') ? 'Ouvrir Locataires →' : 'Ouvrir Propriétaires →')
                      : (selectedLead.leadType?.toLowerCase().includes('tenant') ? 'Open Tenants →' : 'Open Owners →')}
                  </Link>
                </div>
              )}

              {/* Property Details / Valuation Breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-[#171717]/10 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#748C8C] flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Détails du bien & Demande' : 'Property & Inquiry Details'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedLead.serviceType && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#6B6B6B] block">
                        {language === 'fr' ? 'Service Demandé' : 'Requested Service'}
                      </span>
                      <span className="font-bold text-[#748C8C]">{getLeadTypeLabel(selectedLead.leadType, selectedLead.serviceType)}</span>
                    </div>
                  )}

                  {selectedLead.preferredTimeSlot && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#6B6B6B] block">
                        {language === 'fr' ? 'Créneau de Rappel' : 'Callback Time Slot'}
                      </span>
                      <span className="font-semibold text-[#171717]">{formatTimeSlot(selectedLead.preferredTimeSlot)}</span>
                    </div>
                  )}

                  {selectedLead.propertyAddress && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#6B6B6B] block">
                        {language === 'fr' ? 'Bien / Quartier' : 'Property / District'}
                      </span>
                      <span className="font-semibold text-[#171717]">{formatPropertyAddress(selectedLead.propertyAddress)}</span>
                    </div>
                  )}

                  {selectedLead.budget && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#6B6B6B] block">
                        {language === 'fr' ? 'Loyer / Budget Estimé' : 'Rent / Estimated Budget'}
                      </span>
                      <span className="font-bold text-[#171717]">
                        {language === 'en'
                          ? selectedLead.budget.replace(/\/ mois/g, '/ month')
                          : selectedLead.budget.replace(/\/ month/g, '/ mois')}
                      </span>
                    </div>
                  )}

                  {selectedLead.surface && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#6B6B6B] block">
                        {language === 'fr' ? 'Surface & Pièces' : 'Surface & Rooms'}
                      </span>
                      <span className="font-semibold text-[#171717]">{formatSurface(selectedLead.surface)}</span>
                    </div>
                  )}

                  {selectedLead.subject && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#6B6B6B] block">
                        {language === 'fr' ? 'Objet de la demande' : 'Subject of Request'}
                      </span>
                      <span className="font-semibold text-[#171717]">{formatSubject(selectedLead.subject)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">Email</span>
                  {selectedLead.email && !selectedLead.email.includes('@lead.goizet.fr') && !selectedLead.email.includes('@client.goizet') ? (
                    <a href={`mailto:${selectedLead.email}`} className="font-semibold text-[#748C8C] hover:underline truncate block">
                      {selectedLead.email}
                    </a>
                  ) : (
                    <span className="text-stone-400 italic block">
                      {language === 'fr' ? 'Non renseigné' : 'Not provided'}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">
                    {language === 'fr' ? 'Téléphone' : 'Phone'}
                  </span>
                  {selectedLead.phone && selectedLead.phone !== 'Non renseigné' ? (
                    <a href={`tel:${selectedLead.phone}`} className="font-semibold text-[#171717] hover:underline block">
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <span className="text-stone-400 italic block">
                      {language === 'fr' ? 'Non renseigné' : 'Not provided'}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">
                    {language === 'fr' ? 'Conseiller Assigné' : 'Assigned Advisor'}
                  </span>
                  <span className="font-semibold text-[#171717]">{selectedLead.assignedTo || 'Paul & Edgar Goizet'}</span>
                </div>
              </div>

              {/* Full Submitted Message */}
              {selectedLead.message && (
                <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10 space-y-1 text-xs">
                  <span className="text-[10px] uppercase text-[#6B6B6B] font-semibold block">
                    {language === 'fr' ? 'Message / Note du formulaire' : 'Form Message / Submission Note'}
                  </span>
                  <p className="text-[#171717] leading-relaxed whitespace-pre-wrap">{formatMessage(selectedLead.message)}</p>
                </div>
              )}

              {/* Internal Notes Section */}
              <div className="space-y-3">
                <h3 className="font-serif-display text-lg font-medium">
                  {language === 'fr' ? "Notes d'équipe & Suivi" : 'Team Notes & Follow-up'}
                </h3>

                <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((n: any, idx: number) => (
                      <div key={idx} className="p-3 bg-[#F7F7F5] rounded-xl border border-[#171717]/5 space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{formatNoteAuthor(n.author)}</span>
                          <span className="text-[10px] text-[#6B6B6B]">{formatNoteDate(n.date)}</span>
                        </div>
                        <p className="text-[#6B6B6B]">{formatNoteText(n.text)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#6B6B6B] italic">
                      {language === 'fr' ? 'Aucune note interne enregistrée.' : 'No internal notes recorded yet.'}
                    </p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={language === 'fr' ? 'Ajouter une note de suivi interne...' : 'Add internal follow-up note...'}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-xs focus:outline-none focus:border-[#748C8C]"
                  />
                  <button
                    type="submit"
                    className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-brand transition-colors cursor-pointer"
                  >
                    {language === 'fr' ? 'Ajouter' : 'Add Note'}
                  </button>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
