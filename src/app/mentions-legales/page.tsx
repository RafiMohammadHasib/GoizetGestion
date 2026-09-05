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
        <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
          INFORMATIONS JURIDIQUES & RÉGLEMENTATION
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-light text-[#171512]">
          Mentions Légales & Politique de Confidentialité
        </h1>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#171512]/10 shadow-sm space-y-8 text-xs text-[#6F6255] leading-relaxed font-sans-ui">
        
        <section className="space-y-3">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">1. Éditeur du Site & Informations Légales</h2>
          <p>
            Le présent site web, accessible à l'adresse <strong>www.goizet-gestion.fr</strong>, est édité par la société <strong>GOIZET GESTION</strong>, immatriculée au Registre du Commerce et des Sociétés (RCS) de Bordeaux sous le numéro <strong>SIRET 94439348700011</strong> (RCS 944 393 487).
          </p>
            <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Siège social :</strong> 48 rue Calvé, 33000 Bordeaux, France</li>
            <li><strong>Fondateurs & Directeurs de la publication :</strong> Paul Goizet & Edgar Goizet</li>
            <li><strong>Contacts téléphoniques :</strong> Paul Goizet (+33 6 95 57 70 33) & Edgar Goizet (+33 7 81 96 83 95)</li>
            <li><strong>Courriel officiel :</strong> goizetgestion@gmail.com</li>
            <li><strong>Numéro SIRET :</strong> 944 393 487 00011</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">2. Habilitation Professionnelle & Carte CPI</h2>
          <p>
            Titulaire de la <strong>Carte Professionnelle « Transaction et Gestion immobilière »</strong> N° <strong>CPI33012025000000128</strong>, délivrée par la Chambre de Commerce et d'Industrie (CCI) de Bordeaux-Gironde.
          </p>
          <p>
            Garantie financière conforme à la loi Hoguet pour les activités de transaction immobilière et de gestion locative.
          </p>
        </section>

        <section id="confidentialite" className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">3. Protection des Données Personnelles (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, les informations recueillies dans les formulaires d'estimation et de contact font l'objet d'un traitement informatique destiné exclusivement à GOIZET GESTION.
          </p>
          <p>
            Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant. Vous pouvez exercer ce droit en nous écrivant directement à : <strong>goizetgestion@gmail.com</strong>.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">4. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des contenus (textes, images HD, visuels architecturaux, logos, structure générale) présents sur le site GOIZET GESTION sont la propriété exclusive de GOIZET GESTION SARL. Toute reproduction, représentation, modification ou adaptation totale ou partielle est strictement interdite sans autorisation écrite préalable.
          </p>
        </section>

      </div>

    </div>
  );
}
