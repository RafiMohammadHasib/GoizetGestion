'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types';
import { MapPin, Maximize2, Bed, Bath, ArrowUpRight, Calendar, Sparkles, Navigation, X, Layers, Compass, Eye, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedTitle, getLocalizedPriceSuffix, getLocalizedLocation } from '@/lib/propertyLocalization';

export const BORDEAUX_DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  'triangle-dor': { lat: 44.8432, lng: -0.5768 },
  'chartrons': { lat: 44.8564, lng: -0.5715 },
  'cauderan': { lat: 44.8510, lng: -0.6120 },
  'bastide': { lat: 44.8420, lng: -0.5570 },
  'saint-michel': { lat: 44.8340, lng: -0.5670 },
  'saint-augustin': { lat: 44.8320, lng: -0.6020 },
  'nansouty': { lat: 44.8250, lng: -0.5740 },
  'bacalan': { lat: 44.8690, lng: -0.5530 },
  'talence': { lat: 44.8050, lng: -0.5890 },
  'merignac': { lat: 44.8380, lng: -0.6430 },
  'pessac': { lat: 44.8060, lng: -0.6310 },
  'begles': { lat: 44.8080, lng: -0.5510 }
};

type MapStyle = 'streets' | 'satellite' | 'osm';

const MAP_STYLES: Record<MapStyle, { url: string; subdomains: string[]; maxZoom: number; attribution: string }> = {
  streets: {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  },
  satellite: {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Earth'
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
};

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: Property | null) => void;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  onSelectProperty
}: PropertyMapProps) {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [isStreetView, setIsStreetView] = useState<boolean>(false);
  const [streetViewTarget, setStreetViewTarget] = useState<Property | null>(null);

  // Helper to generate consistent deterministic coordinates for each property in its neighborhood
  const getCoords = (property: Property): [number, number] => {
    const slug = property.neighborhoodSlug || (property as any).neighborhood_slug;
    const base = BORDEAUX_DISTRICT_COORDS[slug] || { lat: 44.840, lng: -0.575 };
    // Stable pseudo-random jitter based on property id string hash
    const str = property.id || property.slug || 'prop';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const latOffset = (((Math.abs(hash) % 100) - 50) / 50) * 0.0032;
    const lngOffset = ((((Math.abs(hash >> 3)) % 100) - 50) / 50) * 0.0042;
    return [base.lat + latOffset, base.lng + lngOffset];
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [44.842, -0.578],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true
    });

    const styleConfig = MAP_STYLES[mapStyle];
    const initialTileLayer = L.tileLayer(styleConfig.url, {
      attribution: styleConfig.attribution,
      maxZoom: styleConfig.maxZoom,
      subdomains: styleConfig.subdomains
    });
    initialTileLayer.addTo(map);
    tileLayerRef.current = initialTileLayer;

    mapInstanceRef.current = map;

    // Multiple layout passes to ensure container dimensions are recognized and tiles requested
    const t1 = setTimeout(() => map.invalidateSize(), 60);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        })
      : null;

    if (resizeObserver && mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Tile Layer when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const styleConfig = MAP_STYLES[mapStyle];
    const newTileLayer = L.tileLayer(styleConfig.url, {
      attribution: styleConfig.attribution,
      maxZoom: styleConfig.maxZoom,
      subdomains: styleConfig.subdomains
    });
    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
    map.invalidateSize();
  }, [mapStyle]);

  // Sync Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for each property
    properties.forEach((prop) => {
      const coords = getCoords(prop);
      const isSelected = activeProperty?.id === prop.id || selectedPropertyId === prop.id;
      const formattedPrice = prop.price >= 100000 
        ? `${(prop.price / 1000).toLocaleString('fr-FR')} k€` 
        : `${prop.price.toLocaleString('fr-FR')} €`;

      const iconHtml = `
        <div class="property-map-pin group cursor-pointer transition-all duration-300 transform ${
          isSelected 
            ? 'scale-110 z-30 ring-4 ring-[#748C8C]/40' 
            : 'hover:scale-105'
        }">
          <div class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-md border flex items-center space-x-1 whitespace-nowrap ${
            isSelected
              ? 'bg-[#171512] text-white border-[#171512] shadow-xl'
              : prop.isExclusive
              ? 'bg-gradient-to-r from-[#4F6565] to-[#748C8C] text-white border-white/20'
              : 'bg-white text-[#171512] border-[#171512]/15 hover:bg-[#171512] hover:text-white'
          }">
            ${prop.isExclusive ? '<span class="text-amber-300 text-[10px]">★</span>' : ''}
            <span>${formattedPrice}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-div-icon',
        iconSize: [80, 32],
        iconAnchor: [40, 16]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveProperty(prop);
        setStreetViewTarget(prop);
        if (onSelectProperty) onSelectProperty(prop);
        map.panTo(coords, { animate: true, duration: 0.5 });
      });

      markersRef.current.set(prop.id, marker);
    });

    // Fit bounds if properties exist
    if (properties.length > 0) {
      const latLngs = properties.map(getCoords);
      const bounds = L.latLngBounds(latLngs);
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [properties, selectedPropertyId, activeProperty?.id]);

  // Handle external selection
  useEffect(() => {
    if (!selectedPropertyId) return;
    const prop = properties.find(p => p.id === selectedPropertyId);
    if (prop) {
      setActiveProperty(prop);
      setStreetViewTarget(prop);
      const map = mapInstanceRef.current;
      if (map) {
        const coords = getCoords(prop);
        map.panTo(coords, { animate: true });
      }
    }
  }, [selectedPropertyId, properties]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([44.842, -0.578], 13, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleQuickInquiry = (e: React.MouseEvent, prop: Property) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-inquiry-modal', {
          detail: {
            id: prop.id,
            title: prop.title,
            slug: prop.slug,
            reference: (prop as any).reference,
            price: prop.price,
            priceSuffix: prop.priceSuffix,
            location: prop.location,
            image: prop.images[0] || (prop as any).coverImage,
            transactionType: prop.transactionType,
            surface: prop.surface,
            rooms: prop.rooms,
          }
        })
      );
    }
  };

  const targetCoords = streetViewTarget
    ? getCoords(streetViewTarget)
    : activeProperty
    ? getCoords(activeProperty)
    : [44.8432, -0.5768];

  return (
    <div className="relative w-full h-[640px] sm:h-[700px] lg:h-[760px] rounded-3xl overflow-hidden border border-[#171512]/10 shadow-xl bg-[#F7F5F0]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Layer & View Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        {/* Status Badge */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#171512]/10 shadow-sm flex items-center space-x-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[#171512]">
            {properties.length} {language === 'fr' ? 'biens géolocalisés' : 'mapped properties'}
          </span>
        </div>

        {/* Street / Satellite / 360° Switcher */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#171512]/10 shadow-md p-1 flex items-center space-x-1">
          <button
            onClick={() => {
              setIsStreetView(false);
              setMapStyle('streets');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              !isStreetView && mapStyle === 'streets'
                ? 'bg-[#171512] text-white shadow-sm'
                : 'text-[#6F6255] hover:text-[#171512] hover:bg-[#171512]/5'
            }`}
            title={language === 'fr' ? 'Vue Plan des rues' : 'Street Map view'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Plan des rues' : 'Street Map'}</span>
          </button>

          <button
            onClick={() => {
              setIsStreetView(false);
              setMapStyle('satellite');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              !isStreetView && mapStyle === 'satellite'
                ? 'bg-[#171512] text-white shadow-sm'
                : 'text-[#6F6255] hover:text-[#171512] hover:bg-[#171512]/5'
            }`}
            title={language === 'fr' ? 'Vue Satellite' : 'Satellite view'}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Satellite' : 'Satellite'}</span>
          </button>

          <button
            onClick={() => {
              setStreetViewTarget(activeProperty || properties[0] || null);
              setIsStreetView(true);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              isStreetView
                ? 'bg-brand-gradient text-white shadow-brand'
                : 'text-[#6F6255] hover:text-[#171512] hover:bg-[#171512]/5'
            }`}
            title={language === 'fr' ? 'Google Street View 360°' : 'Google Street View 360°'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Street View 360°' : 'Street View 360°'}</span>
          </button>
        </div>
      </div>

      {/* Floating Map Zoom & Recenter Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#171512]/10 shadow-md p-1 flex flex-col">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#171512] hover:bg-[#171512]/5 text-lg font-bold transition-colors cursor-pointer"
            aria-label={language === 'fr' ? 'Zoom avant' : 'Zoom in'}
          >
            +
          </button>
          <div className="h-px bg-[#171512]/10 my-0.5" />
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#171512] hover:bg-[#171512]/5 text-lg font-bold transition-colors cursor-pointer"
            aria-label={language === 'fr' ? 'Zoom arrière' : 'Zoom out'}
          >
            −
          </button>
        </div>

        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-[#171512]/10 shadow-md flex items-center justify-center text-[#171512] hover:bg-[#171512] hover:text-white transition-all cursor-pointer"
          title={language === 'fr' ? 'Recentrer sur Bordeaux' : 'Recenter on Bordeaux'}
          aria-label={language === 'fr' ? 'Recentrer la carte' : 'Recenter map'}
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Google Street View 360° Panoramic Overlay */}
      {isStreetView && (
        <div className="absolute inset-0 z-30 bg-[#171512] flex flex-col animate-in fade-in duration-300">
          {/* Street View Top Control Bar */}
          <div className="absolute top-4 left-4 right-4 z-40 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#171512]/10 shadow-xl flex items-center space-x-2.5 pointer-events-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#171512]">
                Google Street View 360°
              </span>
              <span className="text-xs text-[#6F6255] border-l border-[#171512]/15 pl-2.5">
                {streetViewTarget ? getLocalizedLocation(streetViewTarget, language) : 'Bordeaux Centre'}
              </span>
            </div>

            <div className="flex items-center space-x-2 pointer-events-auto">
              <a
                href={`https://www.google.com/maps?layer=c&cbll=${targetCoords[0]},${targetCoords[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/95 backdrop-blur-md hover:bg-[#171512] hover:text-white text-[#171512] px-3.5 py-2 rounded-2xl border border-[#171512]/10 shadow-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Google Maps plein écran' : 'Open in Google Maps'}</span>
              </a>

              <button
                onClick={() => setIsStreetView(false)}
                className="bg-[#171512] hover:bg-[#2C2723] text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Retour au plan' : 'Back to map'}</span>
              </button>
            </div>
          </div>

          {/* Embedded Google Street View 360 */}
          <iframe
            src={`https://maps.google.com/maps?q=&layer=c&cbll=${targetCoords[0]},${targetCoords[1]}&cbp=11,0,0,0,0&output=svembed`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            title="Google Street View 360"
          />
        </div>
      )}

      {/* Active Property Popup Card Overlay */}
      {!isStreetView && activeProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[380px] z-20">
          <div className="bg-white rounded-3xl p-4 border border-[#171512]/10 shadow-2xl relative space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setActiveProperty(null)}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-[#171512]/10 flex items-center justify-center text-[#171512] hover:bg-[#171512] hover:text-white transition-colors cursor-pointer"
              aria-label={language === 'fr' ? 'Fermer la prévisualisation' : 'Close preview'}
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Property Image & Badges */}
            <Link href={`/biens/${activeProperty.slug}`} className="block relative h-40 rounded-2xl overflow-hidden bg-[#171512]/5 group">
              <img
                src={activeProperty.images[0] || (activeProperty as any).coverImage}
                alt={getLocalizedTitle(activeProperty, language)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/80 via-transparent to-transparent" />
              
              <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                <span className="bg-[#171512]/85 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-white/20">
                  {activeProperty.transactionType === 'louer' ? (language === 'fr' ? 'À Louer' : 'For Rent') : (language === 'fr' ? 'À Vendre' : 'For Sale')}
                </span>
                {activeProperty.isExclusive && (
                  <span className="bg-brand-gradient text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-brand">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{language === 'fr' ? 'Exclusif' : 'Exclusive'}</span>
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white flex items-baseline justify-between">
                <span className="font-serif-display text-xl font-semibold">
                  {activeProperty.price.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} € {getLocalizedPriceSuffix(activeProperty, language)}
                </span>
                <span className="text-[10px] text-white/80 font-light">
                  {activeProperty.surface} m²
                </span>
              </div>
            </Link>

            {/* Info Snippet */}
            <div className="space-y-1.5 px-1">
              <div className="flex items-center space-x-1 text-[11px] text-[#748C8C] font-semibold">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{getLocalizedLocation(activeProperty, language)}</span>
              </div>
              <h4 className="font-serif-display text-base font-medium text-[#171512] line-clamp-1">
                {getLocalizedTitle(activeProperty, language)}
              </h4>
              <div className="flex items-center space-x-3 text-xs text-[#6F6255] pt-0.5">
                <span>{activeProperty.bedrooms} {language === 'fr' ? 'ch.' : 'beds'}</span>
                <span>·</span>
                <span>{activeProperty.rooms} {language === 'fr' ? 'pièces' : 'rooms'}</span>
                <span>·</span>
                <span>DPE {activeProperty.energyRating}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-1 flex items-center gap-2 border-t border-[#171512]/10">
              <button
                onClick={(e) => handleQuickInquiry(e, activeProperty)}
                className="flex-1 bg-brand-gradient hover:bg-brand-gradient-hover text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-brand transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Demander une visite' : 'Request tour'}</span>
              </button>

              <button
                onClick={() => {
                  setStreetViewTarget(activeProperty);
                  setIsStreetView(true);
                }}
                className="py-2.5 px-3 rounded-xl border border-[#748C8C]/30 bg-[#748C8C]/10 hover:bg-brand-gradient hover:text-white text-[#4F6565] transition-all flex items-center justify-center space-x-1.5 text-xs font-semibold cursor-pointer shrink-0"
                title={language === 'fr' ? 'Voir dans Street View 360°' : 'View in 360° Street View'}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>360°</span>
              </button>

              <Link
                href={`/biens/${activeProperty.slug}`}
                className="p-2.5 rounded-xl border border-[#171512]/10 bg-[#FAF9F6] hover:bg-[#171512] hover:text-white text-[#171512] transition-colors flex items-center justify-center shrink-0"
                title={language === 'fr' ? 'Fiche complète' : 'View details'}
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

