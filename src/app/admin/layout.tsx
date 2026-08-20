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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
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
      group: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      group: 'CRM & Leads',
      items: [
        { label: 'CRM & Pipeline', href: '/admin/crm', icon: Users },
        { label: 'Owners', href: '/admin/owners', icon: UserCheck },
        { label: 'Tenants', href: '/admin/tenants', icon: Users }
      ]
    },
    {
      group: 'Real Estate',
      items: [
        { label: 'Properties', href: '/admin/properties', icon: Home },
        { label: 'Add Property', href: '/admin/properties/new', icon: Plus }
      ]
    },
    {
      group: 'Content & CMS',
      items: [
        { label: 'Homepage Editor', href: '/admin/cms/homepage', icon: Sparkles },
        { label: 'Blog CMS', href: '/admin/blog', icon: FileText },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon }
      ]
    },
    {
      group: 'Site & System',
      items: [
        { label: 'SEO & Redirects', href: '/admin/seo', icon: Search },
        { label: 'Global Settings', href: '/admin/settings', icon: Settings },
        { label: 'Users & Roles', href: '/admin/users', icon: Shield }
      ]
    }
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#171717] font-sans-ui flex flex-col md:flex-row">
      
      {/* Command Palette CMD+K */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      {/* Collapsible Sidebar Navigation */}
      <aside className={`bg-white border-r border-[#171717]/10 flex flex-col justify-between z-40 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        
        <div className="p-4 space-y-6">
          {/* Header Branding */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient text-white flex items-center justify-center font-serif-display font-bold shrink-0 shadow-brand">
                GG
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <span className="font-serif-display font-semibold text-sm block leading-tight">GOIZET GESTION</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#748C8C] font-bold">Admin OS</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[#6B6B6B] hover:text-[#171717] p-1 rounded-md hover:bg-[#F7F7F5]"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
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
                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
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
        <div className="p-4 border-t border-[#171717]/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 text-xs font-semibold text-[#748C8C] hover:underline px-2 py-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            {isSidebarOpen && <span>View Live Site</span>}
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-[#171717]/5">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#748C8C]/20 text-[#748C8C] font-bold flex items-center justify-center shrink-0">
                GG
              </div>
              {isSidebarOpen && (
                <div className="truncate text-xs">
                  <span className="font-semibold block truncate">Gestionnaire</span>
                  <span className="text-[10px] text-[#6B6B6B]">Super Admin</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="text-[#6B6B6B] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#171717]/10 px-6 py-3.5 flex items-center justify-between z-30 sticky top-0">
          
          {/* Global Search Trigger (Cmd+K) */}
          <button
            onClick={() => setIsCmdOpen(true)}
            className="flex items-center space-x-3 bg-[#F7F7F5] border border-[#171717]/10 px-4 py-2 rounded-xl text-xs text-[#6B6B6B] hover:border-[#171717]/30 transition-all max-w-sm w-full"
          >
            <Search className="w-4 h-4 text-[#6B6B6B]" />
            <span className="truncate">Search properties, leads, owners...</span>
            <kbd className="bg-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#171717]/10 ml-auto">
              ⌘K
            </kbd>
          </button>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Create Dropdown (+) */}
            <div className="relative">
              <button
                onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                className="bg-brand-gradient hover:bg-brand-gradient-hover text-white p-2 rounded-xl transition-all shadow-brand text-xs flex items-center space-x-1"
                aria-label="Quick Create"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">New</span>
              </button>

              {isQuickCreateOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#171717]/10 rounded-xl shadow-xl p-1.5 text-xs font-semibold z-50 space-y-0.5">
                  <Link
                    href="/admin/properties/new"
                    onClick={() => setIsQuickCreateOpen(false)}
                    className="flex items-center space-x-2 p-2 hover:bg-[#F7F7F5] rounded-lg text-[#171717]"
                  >
                    <Home className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>New Property</span>
                  </Link>
                  <Link
                    href="/admin/crm"
                    onClick={() => setIsQuickCreateOpen(false)}
                    className="flex items-center space-x-2 p-2 hover:bg-[#F7F7F5] rounded-lg text-[#171717]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>New Lead</span>
                  </Link>
                  <Link
                    href="/admin/blog/new"
                    onClick={() => setIsQuickCreateOpen(false)}
                    className="flex items-center space-x-2 p-2 hover:bg-[#F7F7F5] rounded-lg text-[#171717]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>New Blog Post</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl border border-[#171717]/10 hover:bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#171717]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#748C8C]" />
            </button>

          </div>

        </header>

        {/* Page Main Canvas */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

      </div>

    </div>
  );
}
