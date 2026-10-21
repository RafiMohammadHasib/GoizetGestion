'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  X, 
  MapPin, 
  Send, 
  Grid, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { InstagramPostData, InstagramProfileData } from '@/app/api/instagram/route';

// Initial fallback profile data
const INITIAL_PROFILE: InstagramProfileData = {
  username: 'goizetgestion',
  fullName: 'GOIZET GESTION',
  avatar: '/images/instagram/goizet_avatar.png',
  postsCount: 20,
  followersCount: 132,
  followingCount: 1,
  profileUrl: 'https://www.instagram.com/goizetgestion/',
  verified: true,
  bioLinesFr: [
    'Transaction immobilière',
    'Accompagnement sur mesure',
    'Vente • Location • Gestion',
    'Résidentiel & commercial',
    '📍 Bordeaux'
  ],
  bioLinesEn: [
    'Real Estate Transactions',
    'Bespoke Advisory & Support',
    'Sales • Lettings • Property Management',
    'Residential & Commercial',
    '📍 Bordeaux'
  ]
};

// Initial fallback posts
const INITIAL_POSTS: InstagramPostData[] = [
  {
    id: 'post_new_1',
    thumbnail: '/images/instagram/new_post_1.jpg',
    fullImage: '/images/instagram/new_post_1.jpg',
    slides: ['/images/instagram/new_post_1.jpg'],
    type: 'carousel',
    slidesCount: 1,
    likes: 24,
    commentsCount: 2,
    location: 'Bordeaux Centre',
    timeAgoFr: 'Récemment',
    timeAgoEn: 'Recently',
    captionFr: 'Superbe duplex contemporain rénové avec parquet chaleureux, verrière atelier, pièce de vie lumineuse et finitions haut de gamme. Bien en gestion exclusive Goizet Gestion. 🔑✨',
    captionEn: 'Superb renovated contemporary duplex with warm parquet flooring, atelier glass partition, bright living area, and high-end finishes. Exclusively managed by Goizet Gestion. 🔑✨',
    tags: ['#GoizetGestion', '#DuplexBordeaux', '#LocationBordeaux', '#GestionLocative'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '3/4'
  },
  {
    id: 'post_new_2',
    thumbnail: '/images/instagram/new_post_2.jpg',
    fullImage: '/images/instagram/new_post_2.jpg',
    slides: ['/images/instagram/new_post_2.jpg'],
    type: 'carousel',
    slidesCount: 1,
    likes: 29,
    commentsCount: 3,
    location: 'Bordeaux Chartrons',
    timeAgoFr: 'Il y a 1 sem.',
    timeAgoEn: '1w ago',
    captionFr: 'Maison de ville pleine de charme avec grande pièce de réception, table en bois massif, cuisine ouverte et baie vitrée ouvrant sur jardin terrasse clos. Confort et sérénité. 🌿🏡',
    captionEn: 'Charming townhouse with expansive reception area, solid timber dining table, open-plan kitchen, and sliding door to private garden patio. 🌿🏡',
    tags: ['#MaisonBordeaux', '#Chartrons', '#TerrasseBordeaux', '#GestionImmobiliere'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '3/4'
  },
  {
    id: 'post_new_3',
    thumbnail: '/images/instagram/new_post_3.jpg',
    fullImage: '/images/instagram/new_post_3.jpg',
    slides: ['/images/instagram/new_post_3.jpg'],
    type: 'carousel',
    slidesCount: 1,
    likes: 21,
    commentsCount: 1,
    location: 'Bordeaux Métropole',
    timeAgoFr: 'Il y a 2 sem.',
    timeAgoEn: '2w ago',
    captionFr: 'Espace de vie contemporain aux lignes épurées, carrelage grand format, salon dînatoire traversant et accès direct au jardin arboré avec salon extérieur. ☀️🛋️',
    captionEn: 'Contemporary open living space with sleek finishes, large tiles, through-dining room, and direct garden access with outdoor lounge. ☀️🛋️',
    tags: ['#BordeauxMetropole', '#JardinBordeaux', '#LocationPrestige', '#GoizetGestion'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '3/4'
  },
  {
    id: 'post_1',
    thumbnail: '/images/instagram/post_1_hd.jpg',
    fullImage: '/images/instagram/post_2_slide_1.jpg',
    slides: [
      '/images/instagram/post_2_slide_1.jpg',
      '/images/instagram/post_2_slide_2.jpg',
      '/images/instagram/post_2_slide_3.jpg',
      '/images/instagram/post_2_slide_4.jpg'
    ],
    type: 'carousel',
    slidesCount: 4,
    likes: 16,
    commentsCount: 0,
    location: 'Rue Jean Renaud Dandicolle, Bordeaux',
    timeAgoFr: 'Il y a 7 sem.',
    timeAgoEn: '7w ago',
    captionFr: 'Appartement T1 non meublé - 40m² - Rue Jean Renaud Dandicolle, Bordeaux\n\nIdéalement situé rue Jean Renaud Dandicolle, en plein cœur de Bordeaux, appartement non meublé de type T1 d\'environ 40m² comprenant :\n\n• Une cuisine\n• Une chambre\n• Une salle d\'eau\n• Des toilettes séparées\n• L\'immeuble dispose d\'une cour privative commune permettant le rangement des vélos.\n\nLoyer et charges :\n• Loyer hors charges : 750 €\n• Charges : 40 €\n• Loyer total : 790 €/mois',
    captionEn: 'Unfurnished 1-bedroom flat - 40m² - Rue Jean Renaud Dandicolle, Bordeaux\n\nIdeally located rue Jean Renaud Dandicolle, in the heart of Bordeaux, unfurnished 1-bedroom flat of approx. 40m² comprising:\n\n• Kitchen\n• Bedroom\n• Shower room\n• Separate WC\n• Building features shared bicycle storage courtyard.\n\nRent & charges:\n• Net rent: €750\n• Charges: €40\n• Total rent: €790/month',
    tags: ['#GoizetGestion', '#LocationBordeaux', '#AppartementBordeaux', '#GestionLocative', '#ImmobilierBordeaux'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '3/4'
  },
  {
    id: 'post_2',
    thumbnail: '/images/instagram/post_2_hd.jpg',
    fullImage: '/images/instagram/post_3_slide_1.jpg',
    slides: [
      '/images/instagram/post_3_slide_1.jpg',
      '/images/instagram/post_3_slide_2.jpg',
      '/images/instagram/post_3_slide_3.jpg',
      '/images/instagram/post_3_slide_4.jpg'
    ],
    type: 'carousel',
    slidesCount: 4,
    likes: 48,
    commentsCount: 4,
    location: 'Chartrons, Bordeaux',
    timeAgoFr: 'Il y a 2 mois',
    timeAgoEn: '2mo ago',
    captionFr: 'Superbe terrasse en bois exotique sans vis-à-vis avec salon extérieur et accès direct à la cuisine ouverte. L\'art de vivre bordelais en plein air. 🌿🏡',
    captionEn: 'Superb private wooden terrace with outdoor dining and direct access to open kitchen. Bordeaux outdoor living at its finest. 🌿🏡',
    tags: ['#TerrasseBordeaux', '#Chartrons', '#MaisonBordeaux', '#GoizetGestion'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '4/3'
  },
  {
    id: 'post_3',
    thumbnail: '/images/instagram/post_3_hd.jpg',
    fullImage: '/images/instagram/post_3_hd.jpg',
    slides: [
      '/images/instagram/post_3_hd.jpg',
      '/images/instagram/post_3_slide_3.jpg',
      '/images/instagram/post_3_slide_4.jpg'
    ],
    type: 'carousel',
    slidesCount: 3,
    likes: 29,
    commentsCount: 2,
    location: 'Triangle d\'Or, Bordeaux',
    timeAgoFr: 'Il y a 1 semaine',
    timeAgoEn: '1 week ago',
    captionFr: 'Cuisine contemporaine blanche entièrement équipée et aménagée avec îlot dînatoire. Rénovation soignée et finitions haut de gamme. 🍽️✨',
    captionEn: 'Contemporary white fully-fitted kitchen with dining area. Meticulous renovation and high-end finishes. 🍽️✨',
    tags: ['#CuisineDesign', '#RenovationBordeaux', '#TriangleDor', '#LocationPrestige'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_4',
    thumbnail: '/images/instagram/post_4_hd.jpg',
    fullImage: '/images/instagram/post_4_hd.jpg',
    slides: [
      '/images/instagram/post_4_hd.jpg',
      '/images/instagram/post_3_slide_1.jpg',
      '/images/instagram/post_3_slide_2.jpg'
    ],
    type: 'carousel',
    slidesCount: 3,
    likes: 51,
    commentsCount: 5,
    location: 'Caudéran, Bordeaux',
    timeAgoFr: 'Il y a 2 semaines',
    timeAgoEn: '2 weeks ago',
    captionFr: 'Espace lounge & détente sur terrasse ensoleillée avec mobilier en résine tressée. Propriété confiée en mandat de gestion exclusif. ☀️🥂',
    captionEn: 'Sun-drenched outdoor lounge terrace with wicker furniture. Exclusive management mandate entrusted to Goizet Gestion. ☀️🥂',
    tags: ['#Cauderan', '#TerrassePleinSud', '#GestionSereine', '#BordeauxImmobilier'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_5',
    thumbnail: '/images/instagram/post_5_hd.jpg',
    fullImage: '/images/instagram/post_5_hd.jpg',
    slides: [
      '/images/instagram/post_5_hd.jpg',
      '/images/instagram/post_1_slide_1.jpg',
      '/images/instagram/post_1_slide_2.jpg'
    ],
    type: 'carousel',
    slidesCount: 3,
    likes: 62,
    commentsCount: 8,
    location: 'Saint-Seurin, Bordeaux',
    timeAgoFr: 'Il y a 3 semaines',
    timeAgoEn: '3 weeks ago',
    captionFr: 'Salon chaleureux baigné de lumière naturelle avec grande fenêtre haussmannienne, parquet ancien et espace bureau dédié pour le télétravail. 🛋️💼',
    captionEn: 'Warm and sunlit living room with tall Haussmannian French window, classic wooden flooring, and dedicated home office space. 🛋️💼',
    tags: ['#Haussmannien', '#SaintSeurin', '#SalonDesign', '#ImmobilierBordeaux'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_6',
    thumbnail: '/images/instagram/post_6_hd.jpg',
    fullImage: '/images/instagram/post_6_hd.jpg',
    slides: [
      '/images/instagram/post_6_hd.jpg',
      '/images/instagram/post_2_slide_2.jpg'
    ],
    type: 'carousel',
    slidesCount: 2,
    likes: 38,
    commentsCount: 4,
    location: 'Nansouty, Bordeaux',
    timeAgoFr: 'Il y a 1 mois',
    timeAgoEn: '1 month ago',
    captionFr: 'Belle hauteur sous plafond et luminaires suspendus artisanaux en fibres naturelles. Équilibre parfait entre authenticité et modernité. 🌾💡',
    captionEn: 'High ceilings with artisan natural fiber pendant lights. A harmonious blend of architectural authenticity and modern design. 🌾💡',
    tags: ['#Nansouty', '#DecorationInterieure', '#ArchitectureBordelaise'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_7',
    thumbnail: '/images/instagram/post_7_hd.jpg',
    fullImage: '/images/instagram/post_7_hd.jpg',
    slides: [
      '/images/instagram/post_7_hd.jpg',
      '/images/instagram/post_3_slide_2.jpg'
    ],
    type: 'carousel',
    slidesCount: 2,
    likes: 43,
    commentsCount: 5,
    location: 'Bastide, Bordeaux',
    timeAgoFr: 'Il y a 1 mois',
    timeAgoEn: '1 month ago',
    captionFr: 'Cuisine pleine de caractère avec mur d\'accent terracotta, suspension industrielle et rangements optimisés. Loué en 72h ! 🔴🍳',
    captionEn: 'Character kitchen featuring a terracotta accent wall, industrial pendant light, and optimized cabinetry. Rented in 72h! 🔴🍳',
    tags: ['#Bastide', '#CuisineModerne', '#LocationRapide', '#GoizetGestion'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_8',
    thumbnail: '/images/instagram/post_8_hd.jpg',
    fullImage: '/images/instagram/post_8_hd.jpg',
    slides: [
      '/images/instagram/post_8_hd.jpg',
      '/images/instagram/post_1_slide_1.jpg',
      '/images/instagram/post_1_slide_2.jpg',
      '/images/instagram/post_1_slide_3.jpg'
    ],
    type: 'carousel',
    slidesCount: 4,
    likes: 77,
    commentsCount: 11,
    location: 'Bordeaux Centre Historique',
    timeAgoFr: 'Il y a 2 mois',
    timeAgoEn: '2 months ago',
    captionFr: 'Coup de cœur absolu : magnifique pièce sous charpente cathédrale en bois massif avec mur en pierre blonde bordelaise et mezzanine. 🏛️🪵',
    captionEn: 'Absolute masterpiece: cathedral ceiling with exposed solid wood trusses, authentic blond Bordeaux limestone wall, and mezzanine loft. 🏛️🪵',
    tags: ['#PatrimoineBordeaux', '#CharpenteApparente', '#PierreBordelaise', '#LoftBordeaux'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_9',
    thumbnail: '/images/instagram/post_9_hd.jpg',
    fullImage: '/images/instagram/post_9_hd.jpg',
    slides: [
      '/images/instagram/post_9_hd.jpg',
      '/images/instagram/post_1_slide_4.jpg'
    ],
    type: 'carousel',
    slidesCount: 2,
    likes: 59,
    commentsCount: 7,
    location: 'Saint-Pierre, Bordeaux',
    timeAgoFr: 'Il y a 2 mois',
    timeAgoEn: '2 months ago',
    captionFr: 'Mezzanine d\'architecte avec poutres laquées blanches, verrière zénithale et étagères végétalisées. Un havre de paix au cœur de la ville. 🌿🕊️',
    captionEn: 'Architectural mezzanine with white lacquered beams, skylight, and green interior shelving. A peaceful haven in the city center. 🌿🕊️',
    tags: ['#SaintPierre', '#MezzanineDesign', '#Verriere', '#GoizetGestion'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  },
  {
    id: 'post_10',
    thumbnail: '/images/instagram/post_10_hd.jpg',
    fullImage: '/images/instagram/post_10_hd.jpg',
    slides: [
      '/images/instagram/post_10_hd.jpg',
      '/images/instagram/post_2_slide_1.jpg'
    ],
    type: 'carousel',
    slidesCount: 2,
    likes: 31,
    commentsCount: 2,
    location: 'Bordeaux Métropole',
    timeAgoFr: 'Il y a 3 mois',
    timeAgoEn: '3 months ago',
    captionFr: 'Appartement contemporain avec vue dégagée sur la métropole bordelaise. Accompagnement complet pour bailleurs et investisseurs. 🌆🔑',
    captionEn: 'Contemporary apartment with panoramic city views over Bordeaux metropolitan area. Complete advisory for landlords and investors. 🌆🔑',
    tags: ['#BordeauxMetropole', '#InvestissementLocatif', '#GestionImmobiliere'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '1/1'
  }
];

export default function InstagramFeed() {
  const { language } = useLanguage();
  
  // Dynamic Real-Time Synced State
  const [profile, setProfile] = useState<InstagramProfileData>(INITIAL_PROFILE);
  const [posts, setPosts] = useState<InstagramPostData[]>(INITIAL_POSTS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('En direct');

  // Lightbox Modal & Carousel State
  const [selectedPost, setSelectedPost] = useState<InstagramPostData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Interaction State
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [newComments, setNewComments] = useState<Record<string, string[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [showHeartAnim, setShowHeartAnim] = useState<string | null>(null);

  // 1. Real-time automatic synchronization on page load / reload
  const syncInstagramData = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/instagram', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
          
          // Seed likes
          const initialLikes: Record<string, number> = {};
          data.posts.forEach((p: InstagramPostData) => {
            initialLikes[p.id] = p.likes;
          });
          setLikeCounts(prev => ({ ...initialLikes, ...prev }));
        }
        setLastSyncTime(new Date().toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn('Real-time Instagram sync fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [language]);

  useEffect(() => {
    syncInstagramData();
  }, [syncInstagramData]);

  // Open modal handler (resets slide to 0)
  const handleOpenPost = (post: InstagramPostData) => {
    setSelectedPost(post);
    setCurrentSlideIndex(0);
  };

  // Keyboard navigation for slides
  useEffect(() => {
    if (!selectedPost) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost, currentSlideIndex]);

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedPost) return;
    const slides = selectedPost.slides && selectedPost.slides.length > 0 ? selectedPost.slides : [selectedPost.fullImage];
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedPost) return;
    const slides = selectedPost.slides && selectedPost.slides.length > 0 ? selectedPost.slides : [selectedPost.fullImage];
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = !!likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isLiked ? -1 : 1)
    }));

    if (!isLiked) {
      setShowHeartAnim(postId);
      setTimeout(() => setShowHeartAnim(null), 800);
    }
  };

  const handleDoubleClick = (postId: string) => {
    if (!likedPosts[postId]) {
      handleToggleLike(postId);
    } else {
      setShowHeartAnim(postId);
      setTimeout(() => setShowHeartAnim(null), 800);
    }
  };

  const handleToggleSave = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setNewComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput.trim()]
    }));
    setCommentInput('');
  };

  // Determine current active slide URL in lightbox
  const currentSlideUrl = selectedPost
    ? (selectedPost.slides && selectedPost.slides[currentSlideIndex]) || selectedPost.fullImage || selectedPost.thumbnail
    : '';

  const totalSlides = selectedPost
    ? (selectedPost.slides && selectedPost.slides.length) || selectedPost.slidesCount || 1
    : 1;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0] border-t border-[#171512]/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#748C8C]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* ========================================================== */}
        {/* 📷 OFFICIAL INSTAGRAM PROFILE HEADER (SYNCED LOGO & STATS) */}
        {/* ========================================================== */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#171512]/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
            
            {/* Synchronized High-Resolution Profile Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-[#171512]/10 shadow-lg bg-[#748C8C]">
                <img
                  src={profile.avatar}
                  alt="Goizet Gestion Instagram Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Meta, Live Sync Indicator & Actions */}
            <div className="flex-1 text-center md:text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center justify-center md:justify-start space-x-2.5">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#171512] tracking-tight">
                    {profile.username}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-[#748C8C] fill-[#748C8C]/20" />
                </div>

                {/* Direct Action Buttons & Sync Trigger */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#748C8C] hover:bg-[#4F6565] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-md flex items-center space-x-2 group"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                    <span>{language === 'fr' ? 'S\'abonner' : 'Follow'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#171512] hover:bg-[#2C2723] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 border border-white/10"
                  >
                    <span>{language === 'fr' ? 'Message' : 'Message'}</span>
                  </a>

                  {/* Refresh / Re-sync button */}
                  <button
                    onClick={() => syncInstagramData()}
                    disabled={isSyncing}
                    title={language === 'fr' ? 'Actualiser le flux en direct' : 'Refresh live feed'}
                    className="p-2.5 rounded-full bg-[#FAF9F6] hover:bg-[#EAE6DF] border border-[#171512]/10 text-[#171512] transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#748C8C]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Exact Stats: 19 posts · 123 followers · 1 following */}
              <div className="flex items-center justify-center md:justify-start space-x-6 sm:space-x-8 text-sm text-[#171512] pt-1">
                <div>
                  <span className="font-bold">{profile.postsCount}</span>{' '}
                  <span className="text-[#6F6255] text-xs">{language === 'fr' ? 'publications' : 'posts'}</span>
                </div>
                <div>
                  <span className="font-bold">{profile.followersCount}</span>{' '}
                  <span className="text-[#6F6255] text-xs">{language === 'fr' ? 'abonnés' : 'followers'}</span>
                </div>
                <div>
                  <span className="font-bold">{profile.followingCount}</span>{' '}
                  <span className="text-[#6F6255] text-xs">{language === 'fr' ? 'abonnement' : 'following'}</span>
                </div>
              </div>

              {/* Exact Synced Bio Lines */}
              <div className="space-y-1 text-xs sm:text-sm text-[#171512] leading-relaxed pt-1 max-w-xl">
                {(language === 'fr' ? profile.bioLinesFr : profile.bioLinesEn).map((line, idx) => (
                  <p key={idx} className={idx === 0 ? 'font-semibold text-[#171512]' : 'text-[#6F6255]'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================== */}
        {/* 📑 HIGH RESOLUTION POSTS GRID (SYNCED REAL TIME)          */}
        {/* ========================================================== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#171512]/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#171512] text-white">
                <Grid className="w-4 h-4 text-[#748C8C]" />
              </div>
              <div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-light text-[#171512]">
                  {language === 'fr' ? 'Publications récentes' : 'Recent Publications'}
                </h3>
                <p className="text-xs text-[#6F6255]">
                  {language === 'fr' ? 'Sélection en direct du compte @goizetgestion' : 'Live selection from @goizetgestion'}
                </p>
              </div>
            </div>

            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#748C8C] hover:text-[#4F6565] transition-colors flex items-center space-x-1.5"
            >
              <span>{language === 'fr' ? 'Tout voir sur Instagram' : 'View all on Instagram'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* 5 Posts Grid (Single Clean Row) with High Definition Imagery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {posts.slice(0, 5).map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => handleOpenPost(post)}
                onDoubleClick={() => handleDoubleClick(post.id)}
                className="group relative aspect-square bg-[#171512] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-[#171512]/10"
              >
                {/* High Resolution Post Thumbnail */}
                <img
                  src={post.thumbnail}
                  alt={post.captionFr}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Carousel ❐ Badge at Top-Right */}
                <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-xs p-1.5 rounded-lg text-white shadow-xs">
                  <Layers className="w-3.5 h-3.5" />
                </div>

                {/* Double-Click Heart Animation */}
                <AnimatePresence>
                  {showHeartAnim === post.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.4, opacity: 1 }}
                      exit={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    >
                      <Heart className="w-16 h-16 text-white fill-red-500 filter drop-shadow-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Frosted Hover Overlay with Likes & Comments Count */}
                <div className="absolute inset-0 bg-[#171512]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-3 text-white backdrop-blur-[2px] p-3 text-center">
                  <div className="flex items-center space-x-4 font-bold text-xs sm:text-sm">
                    <div className="flex items-center space-x-1.5">
                      <Heart className="w-4 h-4 fill-white text-white" />
                      <span>{likeCounts[post.id] ?? post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MessageCircle className="w-4 h-4 fill-white text-white" />
                      <span>{post.commentsCount + (newComments[post.id]?.length || 0)}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#90A5A5] font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    {post.location}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* 🌟 DIRECT CALLOUT BANNER                                   */}
        {/* ========================================================== */}
        <div className="bg-gradient-to-r from-[#171512] via-[#2C2723] to-[#171512] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-white/10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#748C8C]">
              <InstagramIcon className="w-4 h-4" />
              <span>@goizetgestion</span>
            </div>
            <h4 className="font-serif-display text-2xl sm:text-3xl font-light">
              {language === 'fr'
                ? 'Suivez nos mandats et nos opportunités en temps réel.'
                : 'Follow our property mandates and opportunities in real time.'}
            </h4>
            <p className="text-xs text-[#DCE4E4] font-light">
              {language === 'fr'
                ? `Consultez l'ensemble de nos ${profile.postsCount} publications et reportages photos sur Instagram.`
                : `Browse all ${profile.postsCount} publications and photo tours on our Instagram profile.`}
            </p>
          </div>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#748C8C] hover:bg-[#4F6565] text-white px-8 py-3.5 rounded-full text-xs font-bold transition-all duration-300 shadow-xl flex items-center space-x-2.5 shrink-0"
          >
            <span>{language === 'fr' ? 'Ouvrir @goizetgestion' : 'Open @goizetgestion'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* ========================================================== */}
      {/* 🖼️ INTERACTIVE LIGHTBOX MODAL — FULL SIZE & HIGH RESOLUTION */}
      {/* ========================================================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#171512]/15 grid grid-cols-1 md:grid-cols-12 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top-Right Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer shadow-lg"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ========================================================== */}
              {/* FULL-SIZE HIGH RESOLUTION MEDIA CONTAINER WITH SLIDES      */}
              {/* ========================================================== */}
              <div 
                className="md:col-span-7 bg-[#0E0D0B] relative flex items-center justify-center overflow-hidden min-h-[340px] md:min-h-[580px] max-h-[55vh] md:max-h-[92vh]"
                onDoubleClick={() => handleDoubleClick(selectedPost.id)}
              >
                {/* Subtle Ambient Blurred Backdrop of the High-Res Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-25 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${currentSlideUrl})` }}
                />

                {/* Full-Size High Resolution Uncropped Image Display */}
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 z-10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlideUrl}
                      src={currentSlideUrl}
                      alt={selectedPost.captionFr}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.4 }}
                      transition={{ duration: 0.2 }}
                      className="max-w-full max-h-[50vh] md:max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
                    />
                  </AnimatePresence>
                </div>

                {/* Slide Counter Badge (Top-Left) */}
                {totalSlides > 1 && (
                  <div className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md">
                    <Layers className="w-3.5 h-3.5 text-[#748C8C]" />
                    <span>{currentSlideIndex + 1} / {totalSlides}</span>
                  </div>
                )}

                {/* Direct High-Resolution Zoom Link (Top-Center) */}
                <a
                  href={currentSlideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={language === 'fr' ? 'Ouvrir en résolution maximale' : 'Open in max resolution'}
                  className="absolute top-4 right-14 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-colors cursor-pointer shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </a>

                {/* Interactive Carousel Navigation Buttons (< and >) */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dot Pagination Indicators (Bottom) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                      {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            idx === currentSlideIndex
                              ? 'bg-[#748C8C] scale-125'
                              : 'bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`Aller au slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ========================================================== */}
              {/* POST DETAILS & SYNCHRONIZED METADATA SIDEBAR              */}
              {/* ========================================================== */}
              <div className="md:col-span-5 flex flex-col justify-between bg-[#FAF9F6] p-6 max-h-[55vh] md:max-h-[92vh] overflow-y-auto no-scrollbar">
                
                {/* Synced Profile Header in Modal */}
                <div className="flex items-center justify-between pb-4 border-b border-[#171512]/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#171512]/10 bg-[#748C8C] shrink-0">
                      <img
                        src={profile.avatar}
                        alt="Goizet Gestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-[#171512] text-xs">{profile.username}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#748C8C]" />
                      </div>
                      <p className="text-[11px] text-[#6F6255] flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#748C8C]" />
                        <span>{selectedPost.location}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#748C8C] hover:text-[#4F6565]"
                  >
                    {language === 'fr' ? 'Suivre' : 'Follow'}
                  </a>
                </div>

                {/* Caption, Tags & Comments */}
                <div className="py-4 space-y-3 flex-1 overflow-y-auto pr-1">
                  <div className="text-xs leading-relaxed space-y-2">
                    <p className="text-[#171512]">
                      <span className="font-bold mr-1.5">{profile.username}</span>
                      {language === 'fr' ? selectedPost.captionFr : selectedPost.captionEn}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag} className="text-[#748C8C] font-medium text-[11px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#6F6255] block pt-1">
                      {language === 'fr' ? selectedPost.timeAgoFr : selectedPost.timeAgoEn}
                    </span>
                  </div>

                  {/* Added Comments */}
                  {(newComments[selectedPost.id] || []).map((comm, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs pt-2">
                      <div className="w-6 h-6 rounded-full bg-[#748C8C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        V
                      </div>
                      <div>
                        <p className="text-[#171512]">
                          <span className="font-bold mr-1.5">visiteur</span>
                          {comm}
                        </p>
                        <span className="text-[10px] text-[#6F6255]">
                          {language === 'fr' ? 'À l\'instant' : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions & Engagement */}
                <div className="pt-3 border-t border-[#171512]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => handleToggleLike(selectedPost.id, e)}
                        className="p-1 text-[#171512] hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Aimer"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            likedPosts[selectedPost.id]
                              ? 'text-red-500 fill-red-500 scale-110'
                              : 'text-[#171512]'
                          } transition-transform`}
                        />
                      </button>
                      <button className="p-1 text-[#171512] hover:text-[#748C8C] transition-colors cursor-pointer" aria-label="Commenter">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <a
                        href={selectedPost.instagramUrl || profile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#171512] hover:text-[#748C8C] transition-colors"
                        aria-label="Partager"
                      >
                        <Share2 className="w-5 h-5" />
                      </a>
                    </div>

                    <button
                      onClick={(e) => handleToggleSave(selectedPost.id, e)}
                      className="p-1 text-[#171512] hover:text-[#748C8C] transition-colors cursor-pointer"
                      aria-label="Enregistrer"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          savedPosts[selectedPost.id] ? 'text-[#748C8C] fill-[#748C8C]' : 'text-[#171512]'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-[#171512]">
                    {(likeCounts[selectedPost.id] ?? selectedPost.likes).toLocaleString()}{' '}
                    {language === 'fr' ? 'J’aime' : 'likes'}
                  </p>

                  {/* Comment Input */}
                  <form
                    onSubmit={(e) => handleAddComment(selectedPost.id, e)}
                    className="flex items-center space-x-2 pt-1"
                  >
                    <input
                      type="text"
                      placeholder={language === 'fr' ? 'Ajouter un commentaire…' : 'Add a comment…'}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 bg-white border border-[#171512]/10 rounded-full px-4 py-2 text-xs focus:outline-hidden focus:border-[#748C8C] transition-colors text-[#171512]"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="p-2 bg-[#748C8C] hover:bg-[#4F6565] disabled:opacity-40 text-white rounded-full transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Direct Link to Original Post */}
                  <a
                    href={selectedPost.instagramUrl || profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs font-bold text-[#748C8C] hover:text-[#4F6565] transition-colors pt-1"
                  >
                    {language === 'fr' ? 'Voir cette publication sur Instagram ↗' : 'View this post on Instagram ↗'}
                  </a>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
