'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { language } = useLanguage();

  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center space-x-2 text-xs text-[#6F6255]">
      <Link
        href="/"
        className="flex items-center space-x-1 hover:text-[#7A2234] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{language === 'fr' ? 'Accueil' : 'Home'}</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-[#171512]/30 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-[#171512] truncate max-w-[240px] sm:max-w-md">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#7A2234] transition-colors truncate max-w-[180px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
