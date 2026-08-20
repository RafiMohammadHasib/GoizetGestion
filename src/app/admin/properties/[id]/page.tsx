'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, Home, MapPin, Euro, ArrowLeft, Save, Sparkles, Image as ImageIcon, 
  Check, Maximize2, Bed, ShieldCheck, Eye, Search, UploadCloud, Trash2, Star, 
  Info, AlertCircle, Loader2, CheckCircle2, ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({
    id: '',
    reference: '',
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    transactionType: 'louer',
    propertyType: 'appartement',
    price: 0,
    charges: 0,
    deposit: 0,
    surface: 0,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    totalFloors: 1,
    yearBuilt: 1900,
    energyRating: 'C',
    gesRating: 'C',
    address: '',
    postalCode: '33000',
    city: 'Bordeaux',
    neighborhoodSlug: 'chartrons',
    neighborhoodName: 'Chartrons',
    isExclusive: true,
    status: 'Published',
    features: [],
    coverImage: '',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetch(`/api/properties?id=${id}`);
        const data = await res.json();
        if (data.property) {
          const p = data.property;
          setFormData({
            id: p.id,
            reference: p.reference || '',
            title: p.title || '',
            slug: p.slug || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            transactionType: p.transactionType || 'louer',
            propertyType: p.propertyType || 'appartement',
            price: p.price || 0,
            charges: p.charges || 0,
            deposit: p.deposit || 0,
            surface: p.surface || 0,
            rooms: p.rooms || 1,
            bedrooms: p.bedrooms || 1,
            bathrooms: p.bathrooms || 1,
            floor: p.floor || 1,
            totalFloors: p.totalFloors || 1,
            yearBuilt: p.yearBuilt || 1900,
            energyRating: p.energyRating || 'C',
            gesRating: p.gesRating || 'C',
            address: p.address || '',
            postalCode: p.postalCode || '33000',
            city: p.city || 'Bordeaux',
            neighborhoodSlug: p.neighborhoodSlug || 'chartrons',
            neighborhoodName: p.neighborhoodName || 'Chartrons',
            isExclusive: Boolean(p.isExclusive),
            status: p.status || 'Published',
            features: p.features || [],
            coverImage: p.coverImage || '',
            seoTitle: p.seoTitle || '',
            seoDescription: p.seoDescription || ''
          });

          const imgs = p.images && p.images.length > 0 ? p.images : (p.coverImage ? [p.coverImage] : []);
          setUploadedImages(imgs);
        } else {
          setErrorMsg(language === 'fr' ? 'Bien introuvable.' : 'Property not found.');
        }
      } catch (err) {
        console.error('Failed to fetch property details:', err);
        setErrorMsg(language === 'fr' ? 'Erreur lors du chargement.' : 'Failed to load property data.');
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id, language]);

  const handleTitleChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({
      ...formData,
      title: val,
      slug: slugified,
      seoTitle: `${val} | Goizet Gestion Bordeaux`
    });
  };

  const handleFeatureToggle = (feat: string) => {
    if (formData.features?.includes(feat)) {
      setFormData({ ...formData, features: formData.features.filter((f: string) => f !== feat) });
    } else {
      setFormData({ ...formData, features: [...(formData.features || []), feat] });
    }
  };

  // Upload handler saving to /public/uploads/properties/
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }

      if (json.urls && json.urls.length > 0) {
        const newImages = [...uploadedImages, ...json.urls];
        setUploadedImages(newImages);
        if (!formData.coverImage) {
          setFormData((prev: any) => ({ ...prev, coverImage: json.urls[0] }));
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? 'Échec du téléversement' : 'Failed to upload images'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetCover = (imgUrl: string) => {
    setFormData((prev: any) => ({ ...prev, coverImage: imgUrl }));
  };

  const handleRemoveImage = (imgUrl: string) => {
    const filtered = uploadedImages.filter(img => img !== imgUrl);
    setUploadedImages(filtered);
    if (formData.coverImage === imgUrl) {
      setFormData((prev: any) => ({ ...prev, coverImage: filtered[0] || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setErrorMsg(language === 'fr' ? 'Veuillez saisir un titre pour le bien.' : 'Please provide a property title.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages,
          coverImage: formData.coverImage || uploadedImages[0] || '/images/hero.jpg'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update property');
      }

      setSuccessMsg(language === 'fr' ? 'Propriété mise à jour avec succès !' : 'Property updated successfully!');
      setTimeout(() => {
        router.push('/admin/properties');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'fr' ? 'Erreur lors de la mise à jour.' : 'Failed to save updates.'));
    } finally {
      setSaving(false);
    }
  };

  const availableFeatures = [
    'Meublé', 'Balcon filant', 'Terrasse', 'Jardin privatif', 'Parking', 
    'Garage double', 'Ascenseur', 'Climatisation', 'Chauffage individuel', 
    'Cheminée', 'Cave privative', 'Piscine chauffée', 'Vue Dégagée', 'Dernier Étage'
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#748C8C]" />
        <span className="text-xs text-[#6B6B6B]">
          {language === 'fr' ? 'Chargement des données du bien...' : 'Loading property details...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div className="flex items-center space-x-3">
          <Link href="/admin/properties" className="p-2.5 rounded-xl border border-[#171717]/10 hover:bg-white bg-[#F7F7F5] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#171717]" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
              {language === 'fr' ? 'MODIFIER LE BIEN' : 'PROPERTY EDITOR'} • {formData.reference}
            </span>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#171717]">
              {formData.title || (language === 'fr' ? 'Modifier la Propriété' : 'Edit Property Listing')}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {formData.slug && (
            <Link
              href={`/biens/${formData.slug}`}
              target="_blank"
              className="p-2 rounded-xl border border-[#171717]/10 hover:bg-white bg-[#F7F7F5] text-xs font-semibold text-[#6B6B6B] hover:text-[#171717] transition-colors flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Voir sur le site' : 'Preview Live'}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => router.push('/admin/properties')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6B6B] hover:text-[#171717] transition-colors"
          >
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? (language === 'fr' ? 'Mise à jour...' : 'Saving...') : (language === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ========================================================================= */}
        {/* SECTION 1: PHOTO UPLOADS & PHOTO OPTIMIZATION GUIDELINES                   */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#171717]/10">
            <div>
              <h2 className="font-serif-display text-xl font-medium text-[#171717] flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-[#748C8C]" />
                <span>{language === 'fr' ? 'Galerie Photos & Couverture' : 'Property Photos & Cover Image'}</span>
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                {language === 'fr' ? 'Gérez et téléversez les photos haute définition stockées dans le dossier public.' : 'Manage and upload high-resolution images stored directly in the system public folder.'}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-[#F7F7F5] px-3 py-1 rounded-full border">
              {uploadedImages.length} {uploadedImages.length > 1 ? 'Photos' : 'Photo'}
            </span>
          </div>

          {/* Professional Photo Ratio & Upload Guidelines Card */}
          <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#748C8C]/20 space-y-3">
            <div className="flex items-center space-x-2 text-[#748C8C]">
              <Info className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {language === 'fr' ? 'Conseils d\'optimisation photo pour un rendu d\'exception' : 'Photo Optimization Guidelines & Best Practices'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="space-y-1 bg-white p-3 rounded-xl border border-[#171717]/5">
                <span className="font-bold text-[#171717] block">
                  {language === 'fr' ? '📐 Ratio Recommandé : 16:9' : '📐 Ideal Ratio: 16:9'}
                </span>
                <p className="text-[11px] leading-relaxed text-[#6B6B6B]">
                  {language === 'fr' 
                    ? 'Format paysage 1920×1080px ou 1600×900px pour le bandeau et le carrousel plein écran.' 
                    : 'Landscape 1920×1080px or 1600×900px for full-width cards and hero showcase.'}
                </p>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-[#171717]/5">
                <span className="font-bold text-[#171717] block">
                  {language === 'fr' ? '⚡ Poids & Formats' : '⚡ Size Limit & Formats'}
                </span>
                <p className="text-[11px] leading-relaxed text-[#6B6B6B]">
                  {language === 'fr' 
                    ? 'Maximum 5 à 10 Mo par photo. Formats acceptés : JPG, WebP, PNG, AVIF.' 
                    : 'Max 5 to 10 MB per image. Accepted formats: JPG, WebP, PNG, AVIF.'}
                </p>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-[#171717]/5">
                <span className="font-bold text-[#171717] block">
                  {language === 'fr' ? '✨ Luminosité & Angle' : '✨ Lighting & Angles'}
                </span>
                <p className="text-[11px] leading-relaxed text-[#6B6B6B]">
                  {language === 'fr' 
                    ? 'Lumière naturelle en journée, plans larges mettant en valeur la pierre et le parquet bordelais.' 
                    : 'Natural daylight, wide-angle lenses highlighting authentic stone, moldings, and floors.'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Drag & Drop / File Input Dropzone */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                uploading 
                  ? 'bg-[#748C8C]/10 border-[#748C8C] animate-pulse' 
                  : 'bg-[#FAF9F6] border-[#171717]/15 hover:border-[#748C8C] hover:bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center mx-auto mb-3">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <h3 className="font-serif-display text-lg font-medium text-[#171717]">
                {uploading 
                  ? (language === 'fr' ? 'Téléversement des photos vers public/uploads...' : 'Uploading photos to public/uploads/properties...') 
                  : (language === 'fr' ? 'Ajouter d\'autres photos par glisser-déposer' : 'Add more photos by drag & drop or clicking here')}
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-1">
                {language === 'fr' ? 'Les images sont stockées directement dans le dossier public du projet.' : 'Images are securely stored directly in the project public/uploads directory.'}
              </p>
            </div>
          </div>

          {/* Uploaded Photos Grid */}
          {uploadedImages.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Photos du Bien Actuel' : 'Current Property Photos'}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, idx) => {
                  const isCover = formData.coverImage === img;
                  return (
                    <div 
                      key={idx} 
                      className={`group relative rounded-2xl overflow-hidden aspect-[4/3] border-2 shadow-2xs transition-all ${
                        isCover ? 'border-[#748C8C] ring-2 ring-[#748C8C]/30' : 'border-[#171717]/10'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover Badge */}
                      {isCover && (
                        <span className="absolute top-2 left-2 bg-[#748C8C] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{language === 'fr' ? 'Couverture' : 'Cover'}</span>
                        </span>
                      )}

                      {/* Action Hover Controls */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(img)}
                            className="p-2 bg-white/90 hover:bg-white text-[#171717] rounded-xl text-[10px] font-semibold shadow-md transition-transform hover:scale-105"
                            title={language === 'fr' ? 'Définir comme photo de couverture' : 'Set as main cover'}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-transform hover:scale-105"
                          title={language === 'fr' ? 'Supprimer la photo' : 'Delete photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: ESSENTIAL PROPERTY INFORMATION                                 */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-4 border-b border-[#171717]/10">
            {language === 'fr' ? 'Informations Principales' : 'Essential Listing Details'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Titre du bien *' : 'Property Title *'}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Statut du Bien' : 'Listing Status'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-3 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
              >
                <option value="Published">{language === 'fr' ? 'Publié' : 'Published'}</option>
                <option value="Draft">{language === 'fr' ? 'Brouillon' : 'Draft'}</option>
                <option value="Reserved">{language === 'fr' ? 'Réservé' : 'Reserved'}</option>
                <option value="Rented">{language === 'fr' ? 'Loué' : 'Rented'}</option>
                <option value="Sold">{language === 'fr' ? 'Vendu' : 'Sold'}</option>
                <option value="Archived">{language === 'fr' ? 'Archivé' : 'Archived'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Transaction' : 'Transaction'}
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
              >
                <option value="louer">{language === 'fr' ? 'À Louer' : 'For Rent'}</option>
                <option value="acheter">{language === 'fr' ? 'À Vendre' : 'For Sale'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Type de bien' : 'Property Type'}
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
              >
                <option value="appartement">{language === 'fr' ? 'Appartement' : 'Apartment'}</option>
                <option value="echoppe">{language === 'fr' ? 'Échoppe' : 'Townhouse'}</option>
                <option value="maison">{language === 'fr' ? 'Maison / Villa' : 'House / Villa'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {formData.transactionType === 'louer' 
                  ? (language === 'fr' ? 'Loyer (€ / mois)' : 'Rent (€ / mo)') 
                  : (language === 'fr' ? 'Prix de Vente (€)' : 'Sale Price (€)')}
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-semibold text-[#171717] focus:outline-none focus:border-[#748C8C]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Surface (m²)' : 'Surface Area (m²)'}
              </label>
              <input
                type="number"
                value={formData.surface}
                onChange={(e) => setFormData({ ...formData, surface: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-semibold text-[#171717] focus:outline-none focus:border-[#748C8C]"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold uppercase tracking-wider text-[#171717] block">
              {language === 'fr' ? 'Description détaillée' : 'Detailed Description'}
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 bg-[#FAF9F6] border border-[#171717]/15 rounded-2xl font-medium focus:outline-none focus:border-[#748C8C]"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: LOCATION & SPECIFICATIONS                                      */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <h2 className="font-serif-display text-xl font-medium text-[#171717] pb-4 border-b border-[#171717]/10">
            {language === 'fr' ? 'Localisation & Prestations' : 'Location & Specifications'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Adresse' : 'Street Address'}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Quartier' : 'District'}
              </label>
              <select
                value={formData.neighborhoodSlug}
                onChange={(e) => setFormData({ ...formData, neighborhoodSlug: e.target.value, neighborhoodName: e.target.options[e.target.selectedIndex].text })}
                className="w-full px-3 py-3 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium focus:outline-none focus:border-[#748C8C]"
              >
                <option value="chartrons">Chartrons</option>
                <option value="cauderan">Caudéran</option>
                <option value="triangle-dor">Triangle d'Or</option>
                <option value="bastide">Bastide</option>
                <option value="saint-michel">Saint-Michel</option>
                <option value="saint-augustin">Saint-Augustin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Pièces' : 'Rooms'}
              </label>
              <input
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Chambres' : 'Bedrooms'}
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'Salles de bain' : 'Bathrooms'}
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#171717] block">
                {language === 'fr' ? 'DPE Énergie' : 'DPE Rating'}
              </label>
              <select
                value={formData.energyRating}
                onChange={(e) => setFormData({ ...formData, energyRating: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#171717]/15 rounded-xl font-medium"
              >
                <option value="A">A (Exemplaire)</option>
                <option value="B">B (Très performant)</option>
                <option value="C">C (Performant)</option>
                <option value="D">D (Standard)</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>

          {/* Features Checkbox Pills */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] block">
              {language === 'fr' ? 'Équipements & Prestations' : 'Amenities & Features'}
            </span>
            <div className="flex flex-wrap gap-2">
              {availableFeatures.map(feat => {
                const isSelected = formData.features?.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => handleFeatureToggle(feat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected 
                        ? 'bg-brand-gradient text-white border-transparent shadow-xs' 
                        : 'bg-[#FAF9F6] text-[#6B6B6B] border-[#171717]/10 hover:text-[#171717]'
                    }`}
                  >
                    {feat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-full text-xs font-semibold shadow-brand flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? (language === 'fr' ? 'Mise à jour en cours...' : 'Saving Changes...') : (language === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes')}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
