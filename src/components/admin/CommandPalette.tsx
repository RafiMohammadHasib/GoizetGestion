'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Users, FileText, Settings, Plus, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: language === 'fr' ? 'Tableau de bord principal' : 'Overview Dashboard', icon: Home, href: '/admin', category: language === 'fr' ? 'Navigation' : 'Navigation' },
    { label: language === 'fr' ? 'Pipeline CRM Prospects' : 'View All CRM Leads', icon: Users, href: '/admin/crm', category: language === 'fr' ? 'Navigation' : 'Navigation' },
    { label: language === 'fr' ? 'Répertoire Propriétaires' : 'Owner CRM Directory', icon: Users, href: '/admin/owners', category: language === 'fr' ? 'Navigation' : 'Navigation' },
    { label: language === 'fr' ? 'Gestionnaire Locataires' : 'Tenant Management', icon: Users, href: '/admin/tenants', category: language === 'fr' ? 'Navigation' : 'Navigation' },
    { label: language === 'fr' ? 'Éditeur Page d\'Accueil CMS' : 'Homepage CMS Editor', icon: Sparkles, href: '/admin/cms/homepage', category: language === 'fr' ? 'Contenu' : 'Content' },
    { label: language === 'fr' ? 'Audit SEO & Redirections' : 'SEO Audit & Redirects', icon: Search, href: '/admin/seo', category: language === 'fr' ? 'Système' : 'System' },
    { label: language === 'fr' ? 'Paramètres & Règles Agence' : 'Global Website Settings', icon: Settings, href: '/admin/settings', category: language === 'fr' ? 'Système' : 'System' }
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl bg-white text-[#171717] rounded-2xl shadow-2xl border border-[#171717]/10 overflow-hidden z-10 font-sans-ui space-y-2 p-4"
        >
          {/* Input Header */}
          <div className="flex items-center space-x-3 px-3 py-2 border-b border-[#171717]/10">
            <Search className="w-5 h-5 text-[#6B6B6B]" />
            <input
              type="text"
              autoFocus
              placeholder={language === 'fr' 
                ? 'Rechercher mandats, prospects, propriétaires ou actions... (Échap pour fermer)'
                : 'Search properties, leads, owners, content or actions... (Esc to exit)'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none placeholder-[#6B6B6B]"
            />
            <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#171717] p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto space-y-1 py-2 text-xs">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F7F5] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[#171717]">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B6B6B] bg-[#F7F7F5] px-2 py-0.5 rounded border border-[#171717]/5">
                      {item.category}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-[#6B6B6B]">
                {language === 'fr' 
                  ? `Aucun résultat pour "${query}".`
                  : `No matching results found for "${query}".`}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#171717]/10 flex items-center justify-between text-[11px] text-[#6B6B6B] px-2">
            <span>ProTip: Press <kbd className="bg-[#F7F7F5] px-1.5 py-0.5 rounded border font-mono">⌘K</kbd> anywhere</span>
            <span>GOIZET GESTION SaaS OS</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
