'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Users, FileText, Settings, Plus, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
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
    { label: 'Add New Property', icon: Plus, href: '/admin/properties/new', category: 'Quick Create' },
    { label: 'Add New Article', icon: Plus, href: '/admin/blog/new', category: 'Quick Create' },
    { label: 'View All CRM Leads', icon: Users, href: '/admin/crm', category: 'Navigation' },
    { label: 'Property Manager', icon: Home, href: '/admin/properties', category: 'Navigation' },
    { label: 'Homepage CMS Editor', icon: Sparkles, href: '/admin/cms/homepage', category: 'Content' },
    { label: 'Global Website Settings', icon: Settings, href: '/admin/settings', category: 'System' }
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
              placeholder="Search properties, leads, owners, content or actions... (Esc to exit)"
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
                No matching results found for "{query}".
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
