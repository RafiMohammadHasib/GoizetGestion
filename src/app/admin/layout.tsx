'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Home, UserCheck, FileText, Image as ImageIcon, Search, 
  Settings, Activity, Bell, Plus, ChevronDown, LogOut, Sparkles, Menu, X, Shield, BarChart3, Globe, ExternalLink
} from 'lucide-react';
import CommandPalette from '@/components/admin/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Skip layout for login route
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navGroups = [
    {
      group: language === 'fr' ? 'Vue d\'ensemble' : 'Overview',
      items: [
        { label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      group: language === 'fr' ? 'CRM & Prospects' : 'CRM & Pipeline',
      items: [
        { label: language === 'fr' ? 'Pipeline Opportunités' : 'Opportunity Board', href: '/admin/crm', icon: Users },
        { label: language === 'fr' ? 'Propriétaires' : 'Owners', href: '/admin/owners', icon: UserCheck },
        { label: language === 'fr' ? 'Locataires' : 'Tenants', href: '/admin/tenants', icon: Users }
      ]
    },
    {
      group: language === 'fr' ? 'Contenu & Médias' : 'Content & CMS',
      items: [
        { label: language === 'fr' ? 'Éditeur Page d\'Accueil' : 'Homepage Editor', href: '/admin/cms/homepage', icon: Sparkles },
        { label: language === 'fr' ? 'Médiathèque' : 'Media Library', href: '/admin/media', icon: ImageIcon }
      ]
    },
    {
      group: language === 'fr' ? 'Système & Paramètres' : 'System & Settings',
      items: [
        { label: language === 'fr' ? 'SEO & Métadonnées' : 'SEO & Redirects', href: '/admin/seo', icon: Search },
        { label: language === 'fr' ? 'Paramètres Globaux' : 'Global Settings', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#F7F7F5] text-[#171717] font-sans-ui flex flex-col md:flex-row">
      
      {/* Command Palette CMD+K */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      {/* Fixed Collapsible Sidebar Navigation */}
      <aside suppressHydrationWarning className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-[#171717]/10 flex flex-col justify-between transition-all duration-300 overflow-y-auto no-scrollbar shadow-xs ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        
        <div className="p-4 space-y-6">
          {/* Header Branding with Official Logo */}
          <div className="flex items-center justify-center">
            <Link href="/admin" className={`flex items-center space-x-3 overflow-hidden ${
              isSidebarOpen ? 'w-full' : 'justify-center'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-white border border-[#171717]/10 flex items-center justify-center p-1 shrink-0 shadow-xs">
                <img
                  src="/LOGOMARK_3@2x.png"
                  alt="Goizet Gestion"
                  className="w-full h-full object-contain"
                />
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <span className="font-serif-display font-semibold text-sm block leading-tight text-[#171717]">GOIZET GESTION</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#748C8C] font-bold">Admin OS</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {isSidebarOpen && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] px-3 block">
                    {group.group}
                  </span>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isSidebarOpen ? 'space-x-3' : 'justify-center'
                        } ${
                          isActive
                            ? 'bg-brand-gradient text-white shadow-brand'
                            : 'text-[#6B6B6B] hover:text-[#171717] hover:bg-[#F7F7F5]'
                        }`}
                        title={!isSidebarOpen ? item.label : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {isSidebarOpen && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer User Badge */}
        <div className="p-4 border-t border-[#171717]/10 space-y-2 bg-white">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center text-xs font-semibold text-[#748C8C] hover:underline px-2 py-1.5 ${
              isSidebarOpen ? 'space-x-2' : 'justify-center'
            }`}
            title={language === 'fr' ? 'Voir le site public' : 'View Live Site'}
          >
            <Globe className="w-4 h-4 shrink-0" />
            {isSidebarOpen && (
              <>
                <span className="truncate">{language === 'fr' ? 'Voir le site public' : 'View Live Site'}</span>
                <ExternalLink className="w-3 h-3 ml-auto shrink-0" />
              </>
            )}
          </Link>

          <div className={`flex items-center pt-2 border-t border-[#171717]/5 ${
            isSidebarOpen ? 'justify-between' : 'justify-center'
          }`}>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#748C8C]/15 border border-[#748C8C]/30 flex items-center justify-center p-1 shrink-0">
                <img
                  src="/LOGOMARK_3@2x.png"
                  alt="Admin Avatar"
                  className="w-full h-full object-contain"
                />
              </div>
              {isSidebarOpen && (
                <div className="truncate text-xs">
                  <span className="font-semibold block truncate text-[#171717]">Paul & Edgar Goizet</span>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="text-[#6B6B6B] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* Main Content Area (offset by fixed sidebar width) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarOpen ? 'md:pl-64' : 'md:pl-20'
      }`}>
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#171717]/10 px-4 sm:px-6 py-3.5 flex items-center justify-between z-30 sticky top-0">
          
          <div className="flex items-center space-x-3 flex-1 max-w-lg">
            {/* Header Hamburger for Quick Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[#6B6B6B] hover:text-[#171717] p-2 rounded-xl hover:bg-[#F7F7F5] transition-colors"
              title={isSidebarOpen ? 'Minimize sidebar' : 'Expand sidebar'}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5 text-[#171717]" />
            </button>

            {/* Global Search Trigger (Cmd+K) */}
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center space-x-3 bg-[#F7F7F5] border border-[#171717]/10 px-4 py-2 rounded-xl text-xs text-[#6B6B6B] hover:border-[#171717]/30 transition-all w-full max-w-sm"
            >
              <Search className="w-4 h-4 text-[#6B6B6B] shrink-0" />
              <span className="truncate">
                {language === 'fr' ? 'Rechercher prospects, propriétaires...' : 'Search leads, owners...'}
              </span>
              <kbd className="bg-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#171717]/10 ml-auto hidden sm:inline">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Language Switcher Pill [FR | EN] (Protected from Auto-Translation) */}
            <div
              translate="no"
              className="notranslate flex items-center bg-[#F7F7F5] p-1 rounded-xl border border-[#171717]/10 text-[11px] font-semibold"
            >
              <button
                onClick={() => setLanguage('fr')}
                translate="no"
                className={`notranslate px-2 py-0.5 rounded-lg transition-all ${
                  language === 'fr' ? 'bg-white text-[#171717] shadow-2xs font-bold' : 'text-[#6B6B6B] hover:text-[#171717]'
                }`}
              >
                <span translate="no" className="notranslate">FR</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                translate="no"
                className={`notranslate px-2 py-0.5 rounded-lg transition-all ${
                  language === 'en' ? 'bg-white text-[#171717] shadow-2xs font-bold' : 'text-[#6B6B6B] hover:text-[#171717]'
                }`}
              >
                <span translate="no" className="notranslate">EN</span>
              </button>
            </div>

            {/* Quick Create Dropdown (+) */}
            <div className="relative">
              <button
                onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-3.5 py-2 rounded-xl transition-all shadow-brand text-xs flex items-center space-x-1.5"
                aria-label="Quick Create"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">{language === 'fr' ? 'Nouveau' : 'New'}</span>
              </button>

              {isQuickCreateOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#171717]/10 rounded-xl shadow-xl p-1.5 text-xs font-semibold z-50 space-y-0.5">
                  <Link
                    href="/admin/crm"
                    onClick={() => setIsQuickCreateOpen(false)}
                    className="flex items-center space-x-2 p-2 hover:bg-[#F7F7F5] rounded-lg text-[#171717]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>{language === 'fr' ? 'Nouveau Prospect' : 'New Lead'}</span>
                  </Link>
                  <Link
                    href="/admin/owners"
                    onClick={() => setIsQuickCreateOpen(false)}
                    className="flex items-center space-x-2 p-2 hover:bg-[#F7F7F5] rounded-lg text-[#171717]"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>{language === 'fr' ? 'Propriétaires' : 'Owners'}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl border border-[#171717]/10 hover:bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#171717]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#748C8C]" />
            </button>

            {/* Compact Logout Button */}
            <button
              onClick={handleLogout}
              className="text-[#6B6B6B] hover:text-red-600 p-2 rounded-xl border border-[#171717]/10 hover:bg-red-50 transition-colors"
              title={language === 'fr' ? 'Déconnexion' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* Page Main Canvas */}
        <main suppressHydrationWarning className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1800px] w-full mx-auto space-y-6 overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}
