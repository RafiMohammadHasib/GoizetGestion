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
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const { language } = useLanguage();

  return (
    <nav aria-label="Fil d'Ariane" className={`flex items-center ${className}`}>
      <ol className="inline-flex items-center flex-wrap gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#171512]/10 shadow-[0_2px_8px_rgba(23,21,18,0.04)] text-[11px] sm:text-xs">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-[#6F6255] hover:text-[#748C8C] transition-colors font-medium"
          >
            <Home className="w-3.5 h-3.5 text-[#748C8C] shrink-0" />
            <span>{language === 'fr' ? 'Accueil' : 'Home'}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center space-x-1.5 sm:space-x-2">
              <ChevronRight className="w-3 h-3 text-[#171512]/25 shrink-0" />
              {isLast || !item.href ? (
                <span
                  className="font-semibold text-[#171512] truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                  aria-current="page"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#6F6255] hover:text-[#748C8C] transition-colors font-medium truncate max-w-[130px] sm:max-w-[180px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
