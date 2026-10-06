'use client';

import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { FileText, Scale, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsConditionsPage() {
  const { language } = useLanguage();

  return (
    <div className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-7 sm:space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Conditions Générales' : 'Terms & Conditions' }]} />

      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3.5 py-1 rounded-full border border-[#748C8C]/20">
          <Scale className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'CADRE JURIDIQUE & CONTRACTUEL' : 'LEGAL & CONTRACTUAL TERMS'}</span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Conditions Générales d\'Utilisation & de Services' : 'Terms & Conditions of Service'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Réglementation et conditions régissant l\'utilisation de la plateforme GOIZET GESTION et les prestations de gestion locative.'
            : 'Legal framework governing the use of GOIZET GESTION digital services and property management advisory.'}
        </p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#171512]/10 shadow-sm space-y-8 text-xs text-[#6F6255] leading-relaxed font-sans-ui">
        
        <section className="space-y-3">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">1. Objet et Champ d'Application</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles d'accès et d'utilisation du site web édité par la société <strong>GOIZET GESTION SARL</strong>. Tout utilisateur naviguant sur le site accepte sans réserve les présentes conditions.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">2. Estimation en Ligne et Indicativité des Valeurs</h2>
          <p>
            Les outils d'estimation de loyer et de valeur patrimoniale mis à disposition sur le site fournissent des évaluations indicatives basées sur l'historique des baux bordelais récents. Ces estimations ne constituent pas une expertise immobilière judiciaire opposable ni un engagement ferme de conclusion de bail avant réalisation d'un état des lieux physique par l'un de nos directeurs de secteur.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">3. Mandat de Gestion Locative et Honoraires</h2>
          <p>
            Toute prestation de gestion locative, de mise en location ou de transaction fait l'objet d'un mandat écrit préalable conforme à la loi Hoguet n° 70-9 du 2 janvier 1970 et au décret n° 72-678 du 20 juillet 1972.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Honoraires de gestion :</strong> Taux transparent de 6,5 % TTC calculé sur les encaissements locatifs.</li>
            <li><strong>Garantie Loyers Impayés (GLI) :</strong> Garantie de loyer impayé GarantMe à 2,9 % d'un mois de loyer.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">4. Propriété Intellectuelle</h2>
          <p>
            Tous les contenus textuels, visuels architecturaux HD, photographies de biens, photographies d'équipe, logos, graphismes et structures informatiques développés sur le site sont protégés par le Code de la propriété intellectuelle. Toute reproduction non autorisée expose le contrevenant à des poursuites judiciaires.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#171512]/10">
          <h2 className="font-serif-display text-xl font-semibold text-[#171512]">5. Droit Applicable et Juridiction Compétente</h2>
          <p>
            Les présentes conditions sont régies par le droit français. En cas de différend relatif à l'interprétation ou à l'exécution des présentes, les tribunaux compétents du ressort de la Cour d'Appel de Bordeaux seront seuls compétents.
          </p>
        </section>

      </div>

    </div>
  );
}
