'use client';

import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy' }]} />

      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3.5 py-1 rounded-full border border-[#748C8C]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'PROTECTION DES DONNÉES RGPD' : 'GDPR DATA PRIVACY'}</span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Politique de Confidentialité & Vie Privée' : 'Privacy Policy & Data Security'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Chez GOIZET GESTION, la confidentialité et la sécurité de vos données personnelles sont au cœur de nos engagements d\'excellence.'
            : 'At GOIZET GESTION, data privacy, security, and RGPD compliance are core to our advisory standards.'}
        </p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#171512]/10 shadow-sm space-y-8 text-xs text-[#6F6255] leading-relaxed font-sans-ui">
        
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-[#171512] font-semibold text-base font-serif-display">
            <Lock className="w-4 h-4 text-[#748C8C]" />
            <h2>1. Collecte et Utilisation des Données</h2>
          </div>
          <p>
            GOIZET GESTION SARL recueille vos données personnelles uniquement lorsque cela est strictement nécessaire pour répondre à vos demandes de gestion locative, d'estimation immobilière, d'organisation de visite ou de prise de contact.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Données d'identification :</strong> Prénom, nom, adresse postale du bien à estimer.</li>
            <li><strong>Données de contact :</strong> Adresse email, numéro de téléphone.</li>
            <li><strong>Données de projet :</strong> Caractéristiques du bien, budget, type de mandat recherché.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <div className="flex items-center space-x-2 text-[#171512] font-semibold text-base font-serif-display">
            <Database className="w-4 h-4 text-[#748C8C]" />
            <h2>2. Finalité des Traitements</h2>
          </div>
          <p>
            Vos données font l'objet d'un traitement informatique automatisé pour les finalités suivantes :
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Établissement d'estimations de loyer et d'études de valorisation patrimoniale à Bordeaux.</li>
            <li>Gestion des demandes de rappel téléphonique et d'organisation de visites immobilières.</li>
            <li>Envoi d'analyses du marché immobilier bordelais et d'opportunités de gestion (si consenti).</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <div className="flex items-center space-x-2 text-[#171512] font-semibold text-base font-serif-display">
            <UserCheck className="w-4 h-4 text-[#748C8C]" />
            <h2>3. Vos Droits (Accès, Rectification, Suppression)</h2>
          </div>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous bénéficiez à tout moment :
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>D'un droit d'accès et de vérification de l'ensemble de vos données stockées.</li>
            <li>D'un droit de rectification ou de mise à jour de vos informations.</li>
            <li>D'un droit à l'effacement définitif (« droit à l'oubli ») sur simple demande écrite.</li>
            <li>D'un droit à la limitation du traitement et d'opposition au prospection commerciale.</li>
          </ul>
          <p className="pt-2">
            Pour exercer l'un de ces droits, contactez notre Délégué à la Protection des Données (DPO) : <strong>dpo@goizet-gestion.fr</strong> ou par courrier postal au 38 Cours Portal, 33000 Bordeaux.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <div className="flex items-center space-x-2 text-[#171512] font-semibold text-base font-serif-display">
            <Eye className="w-4 h-4 text-[#748C8C]" />
            <h2>4. Durée de Conservation et Non-Cession</h2>
          </div>
          <p>
            Vos informations personnelles ne sont conservées que pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées (maximum 3 ans à compter du dernier contact qualifié).
          </p>
          <p className="font-semibold text-[#171512]">
            GOIZET GESTION s'engage solennellement à ne jamais vendre, louer ni céder vos données personnelles à des tiers à des fins commerciales.
          </p>
        </section>

      </div>

    </div>
  );
}
