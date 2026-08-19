'use client';

import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useLanguage } from '@/context/LanguageContext';

export default function MentionsLegalesPage() {
  const { language } = useLanguage();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Mentions Légales' : 'Legal Notice' }]} />

      <div className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
          INFORMATIONS JURIDIQUES & RÉGLEMENTATION
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-light text-[#171512]">
          Mentions Légales & Politique de Confidentialité
        </h1>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#171512]/10 shadow-sm space-y-8 text-xs text-[#6F6255] leading-relaxed font-sans-ui">
        
        <section className="space-y-3">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">1. Éditeur du Site</h2>
          <p>
            Le présent site web, accessible à l'adresse <strong>www.maison-meridia.fr</strong>, est édité par la société <strong>MAISON MÉRIDIA SARL</strong>, société à responsabilité limitée au capital social de 50 000 €, immatriculée au Registre du Commerce et des Sociétés de Bordeaux sous le numéro RCS 912 345 678.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Siège social :</strong> 38 Cours Portal, 33000 Bordeaux, France</li>
            <li><strong>Directeur de la publication :</strong> Alexandre de Saint-Clair</li>
            <li><strong>Téléphone :</strong> 05 56 00 12 34</li>
            <li><strong>Email :</strong> contact@maison-meridia.fr</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">2. Habilitation Professionnelle</h2>
          <p>
            Titulaire de la Carte Professionnelle « Transactions sur immeubles et fonds de commerce » et « Gestion immobilière » N° <strong>CPI 3301 2026 000 012</strong> délivrée par la Chambre de Commerce et d'Industrie de Bordeaux-Gironde.
          </p>
          <p>
            Garantie financière accordée par SOCAF (26 avenue de la Grande Armée, 75017 Paris) pour un montant de 120 000 €.
          </p>
        </section>

        <section id="confidentialite" className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">3. Protection des Données Personnelles (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, les informations recueillies dans les formulaires d'estimation et de contact font l'objet d'un traitement informatique destiné exclusivement à MAISON MÉRIDIA.
          </p>
          <p>
            Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant. Vous pouvez exercer ce droit en nous écrivant à : <strong>dpo@maison-meridia.fr</strong>.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">4. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des contenus (textes, images HD, visuels architecturaux, logos, structure générale) présents sur le site MAISON MÉRIDIA sont la propriété exclusive de MAISON MÉRIDIA SARL. Toute reproduction, représentation, modification ou adaptation totale ou partielle est strictement interdite sans autorisation écrite préalable.
          </p>
        </section>

      </div>

    </div>
  );
}
