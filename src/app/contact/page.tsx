'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { sanitizeInjection, isValidEmail, isValidPhone, getLocalizedErrorMessage } from '@/lib/security';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'Confier mon bien en gestion locative',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = sanitizeInjection(formData.fullName);
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim();
    const cleanMessage = sanitizeInjection(formData.message);

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg(language === 'fr' ? 'Veuillez saisir votre nom complet.' : 'Please enter your full name.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg(language === 'fr' ? 'Veuillez saisir une adresse email valide.' : 'Please enter a valid email address.');
      return;
    }

    if (!isValidPhone(cleanPhone)) {
      setErrorMsg(language === 'fr' ? 'Veuillez saisir un numéro de téléphone valide (ex: 06 12 34 56 78).' : 'Please enter a valid phone number.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      setErrorMsg(language === 'fr' ? 'Votre message doit contenir au moins 10 caractères.' : 'Your message must contain at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: formData.subject,
          message: cleanMessage,
          language
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (language === 'fr' ? 'Erreur lors de l\'envoi' : 'Error sending message'));
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : '';
      setErrorMsg(getLocalizedErrorMessage(rawMessage, language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 sm:space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: language === 'fr' ? 'Contact' : 'Contact Us' }]} />

      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#748C8C]">
          {language === 'fr' ? 'GOIZET GESTION BORDEAUX' : 'BOUTIQUE AGENCY BORDEAUX'}
        </span>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
          {language === 'fr' ? 'Discutons de votre projet immobilier.' : 'Let us discuss your real estate plans.'}
        </h1>
        <p className="text-sm text-[#6F6255] font-light leading-relaxed">
          {language === 'fr'
            ? 'Que vous souhaitiez confier votre appartement en gestion, vendre un bien ou réserver une visite, nos conseillers vous répondent sous 2 heures.'
            : 'Whether you want to delegate management, sell a property, or book a viewing, our advisory team responds within 2 hours.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        
        {/* Left Info & Agency Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#171512] text-white p-8 rounded-3xl space-y-6 shadow-2xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
              {language === 'fr' ? 'SIÈGE BORDEAUX & CONTACTS' : 'BORDEAUX HEADQUARTERS & CONTACTS'}
            </span>
            <h2 className="font-serif-display text-3xl font-light">
              48 rue Calvé, 33000 Bordeaux
            </h2>
            <p className="text-xs text-[#9E9285] leading-relaxed">
              {language === 'fr' ? 'Au cœur de Bordeaux.' : 'Located in central Bordeaux.'}
            </p>

            {/* Direct Executive Contacts */}
            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              
              {/* Paul Goizet */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif-display text-base font-semibold text-white">Paul Goizet</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C] bg-[#748C8C]/15 px-2.5 py-0.5 rounded-full">
                    {language === 'fr' ? 'Associé Fondateur' : 'Founding Partner'}
                  </span>
                </div>
                <div className="space-y-1.5 text-white/80">
                  <a href="tel:+33695577033" className="flex items-center space-x-2.5 hover:text-[#748C8C] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span className="font-medium">+33 6 95 57 70 33</span>
                  </a>
                  <a href="mailto:goizetgestion@gmail.com" className="flex items-center space-x-2.5 hover:text-[#748C8C] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>goizetgestion@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Edgar Goizet */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif-display text-base font-semibold text-white">Edgar Goizet</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C] bg-[#748C8C]/15 px-2.5 py-0.5 rounded-full">
                    {language === 'fr' ? 'Associé Fondateur' : 'Founding Partner'}
                  </span>
                </div>
                <div className="space-y-1.5 text-white/80">
                  <a href="tel:+33781968395" className="flex items-center space-x-2.5 hover:text-[#748C8C] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span className="font-medium">+33 7 81 96 83 95</span>
                  </a>
                  <a href="mailto:goizetgestion@gmail.com" className="flex items-center space-x-2.5 hover:text-[#748C8C] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>goizetgestion@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2 text-[#9E9285]">
                <Clock className="w-4 h-4 text-[#748C8C] shrink-0" />
                <span>{language === 'fr' ? 'Lundi — Vendredi : 9h00 - 19h00 (Sur rendez-vous)' : 'Mon — Fri: 9:00 AM - 7:00 PM (By appointment)'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#171512]/10 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#171512]">
              <ShieldCheck className="w-4 h-4 text-[#748C8C]" />
              <span>{language === 'fr' ? 'Habilitations & Enregistrement Légal' : 'Official Certifications & Legal Registration'}</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#6F6255] border-t border-[#171512]/10 pt-3">
              <p>
                <strong>SIRET :</strong> 944 393 487 00011 (RCS Bordeaux)
              </p>
              <p>
                <strong>{language === 'fr' ? 'Carte Professionnelle :' : 'Professional License:'}</strong> N° CPI33012025000000128 (Transactions & Gestion immobilière — CCI Bordeaux)
              </p>
            </div>
          </div>
        </div>

        {/* Right Contact Form with Secure API Submission */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#171512]/10 shadow-2xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#748C8C]">
              {language === 'fr' ? 'FORMULAIRE DE CONTACT SÉCURISÉ' : 'SECURE CONTACT FORM'}
            </span>
            <h2 className="font-serif-display text-2xl font-medium text-[#171512]">
              {language === 'fr' ? 'Envoyez un message direct' : 'Send us a message'}
            </h2>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-8 bg-[#FAF9F6] rounded-2xl text-center space-y-3 border border-[#748C8C]/20">
              <CheckCircle2 className="w-12 h-12 text-[#748C8C] mx-auto" />
              <h3 className="font-serif-display text-2xl font-medium text-[#171512]">
                {language === 'fr' ? 'Message transmis avec succès' : 'Message Sent Successfully'}
              </h3>
              <p className="text-xs text-[#6F6255]">
                {language === 'fr'
                  ? 'Merci pour votre message. Un conseiller Goizet Gestion étudie votre demande et vous rappelle dans un délai de 2 heures.'
                  : 'Thank you for reaching out. A Goizet Gestion advisor will review your message and reach out within 2 hours.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Nom & Prénom *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sophie Martin"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                    {language === 'fr' ? 'Téléphone *' : 'Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                  {language === 'fr' ? 'Adresse Email *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="sophie.martin@exemple.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                  {language === 'fr' ? 'Objet de votre demande *' : 'Subject *'}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                >
                  <option value="Confier mon bien en gestion locative">{language === 'fr' ? 'Confier mon bien en gestion locative (Gestion 360°)' : 'Complete Property Management'}</option>
                  <option value="Mise en location & Recherche de locataires">{language === 'fr' ? 'Mise en location & Recherche de locataires' : 'Property Letting & Tenant Placement'}</option>
                  <option value="Demande d'estimation immobilière">{language === 'fr' ? 'Demande d\'estimation locative ou vente' : 'Rental / Sales Valuation Request'}</option>
                  <option value="Vendre un bien à Bordeaux">{language === 'fr' ? 'Vendre un bien à Bordeaux (Transaction)' : 'Selling Property in Bordeaux'}</option>
                  <option value="Visiter un appartement / Recherche">{language === 'fr' ? 'Visiter un appartement / Recherche locataire' : 'Property Search & Viewings'}</option>
                  <option value="Autre demande">{language === 'fr' ? 'Autre demande' : 'Other Inquiry'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171512] mb-1">
                  {language === 'fr' ? 'Votre message *' : 'Your Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={language === 'fr' ? 'Bonjour, je possède un appartement T3 aux Chartrons et je souhaite...' : 'Hello, I own a property in Bordeaux...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C] focus:ring-1 focus:ring-[#748C8C] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2 whitespace-nowrap disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? (language === 'fr' ? 'Traitement sécurisé...' : 'Processing...') : (language === 'fr' ? 'Transmettre mon message' : 'Send Message')}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
