'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center pt-32 pb-24 px-4 text-center">
      <div className="max-w-md space-y-6">
        <span className="font-serif-display text-8xl font-light text-[#7A2234]">404</span>
        <h1 className="font-serif-display text-3xl font-medium text-[#171512]">
          Page introuvable
        </h1>
        <p className="text-xs text-[#6F6255] leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée. Retrouvez tous nos biens et services d'exception sur notre site.
        </p>
        <div className="pt-4 flex items-center justify-center space-x-3">
          <Link
            href="/"
            className="bg-[#7A2234] text-white px-6 py-3 rounded-full text-xs font-semibold shadow hover:bg-[#5C1D27] transition-all flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
