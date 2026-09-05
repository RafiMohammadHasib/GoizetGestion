'use client';

import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Send,
  Grid,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// Exact Profile Data from https://www.instagram.com/goizetgestion/
const PROFILE = {
  username: 'goizetgestion',
  fullName: 'GOIZET GESTION',
  postsCount: 19,
  followersCount: 123,
  followingCount: 1,
  profileUrl: 'https://www.instagram.com/goizetgestion/',
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

// 10 Actual Posts from @goizetgestion Instagram Profile
const ACTUAL_POSTS = [
  {
    id: 'post_1',
    image: '/images/instagram/post_1.png',
    type: 'carousel' as const,
    slidesCount: 4,
    likes: 34,
    commentsCount: 3,
    location: 'Bordeaux Centre',
    timeAgoFr: 'Récemment',
    timeAgoEn: 'Recently',
    captionFr: 'Chambre spacieuse et lumineuse avec parquet d\'origine, dressing sur-mesure et vue dégagée sur les façades en pierre bordelaise. Nouveau bien en gestion locative. 🔑✨',
    captionEn: 'Spacious and bright bedroom with original wooden floor, bespoke closet, and unobstructed views over Bordeaux stone facades. New property under management. 🔑✨',
    tags: ['#GoizetGestion', '#LocationBordeaux', '#AppartementBordeaux', '#GestionLocative']
  },
  {
    id: 'post_2',
    image: '/images/instagram/post_2.png',
    type: 'carousel' as const,
    slidesCount: 5,
    likes: 48,
    commentsCount: 6,
    location: 'Chartrons, Bordeaux',
    captionFr: 'Superbe terrasse en bois exotique sans vis-à-vis avec salon extérieur et accès direct à la cuisine ouverte. L\'art de vivre bordelais en plein air. 🌿🏡',
    captionEn: 'Superb private wooden terrace with outdoor dining and direct access to open kitchen. Bordeaux outdoor living at its finest. 🌿🏡',
    tags: ['#TerrasseBordeaux', '#Chartrons', '#MaisonBordeaux', '#GoizetGestion']
  },
  {
    id: 'post_3',
    image: '/images/instagram/post_3.png',
    type: 'carousel' as const,
    slidesCount: 3,
    likes: 29,
    commentsCount: 2,
    location: 'Triangle d\'Or, Bordeaux',
    captionFr: 'Cuisine contemporaine blanche entièrement équipée et aménagée avec îlot dînatoire. Rénovation soignée et finitions haut de gamme. 🍽️✨',
    captionEn: 'Contemporary white fully-fitted kitchen with dining area. Meticulous renovation and high-end finishes. 🍽️✨',
    tags: ['#CuisineDesign', '#RenovationBordeaux', '#TriangleDor', '#LocationPrestige']
  },
  {
    id: 'post_4',
    image: '/images/instagram/post_4.png',
    type: 'carousel' as const,
    slidesCount: 4,
    likes: 51,
    commentsCount: 5,
    location: 'Caudéran, Bordeaux',
    captionFr: 'Espace lounge & détente sur terrasse ensoleillée avec mobilier en résine tressée. Propriété confiée en mandat de gestion exclusif. ☀️🥂',
    captionEn: 'Sun-drenched outdoor lounge terrace with wicker furniture. Exclusive management mandate entrusted to Goizet Gestion. ☀️🥂',
    tags: ['#Cauderan', '#TerrassePleinSud', '#GestionSereine', '#BordeauxImmobilier']
  },
  {
    id: 'post_5',
    image: '/images/instagram/post_5.png',
    type: 'carousel' as const,
    slidesCount: 6,
    likes: 62,
    commentsCount: 8,
    location: 'Saint-Seurin, Bordeaux',
    captionFr: 'Salon chaleureux baigné de lumière naturelle avec grande fenêtre haussmannienne, parquet ancien et espace bureau dédié pour le télétravail. 🛋️💼',
    captionEn: 'Warm and sunlit living room with tall Haussmannian French window, classic wooden flooring, and dedicated home office space. 🛋️💼',
    tags: ['#Haussmannien', '#SaintSeurin', '#SalonDesign', '#ImmobilierBordeaux']
  },
  {
    id: 'post_6',
    image: '/images/instagram/post_6.png',
    type: 'carousel' as const,
    slidesCount: 3,
    likes: 38,
    commentsCount: 4,
    location: 'Nansouty, Bordeaux',
    captionFr: 'Belle hauteur sous plafond et luminaires suspendus artisanaux en fibres naturelles. Équilibre parfait entre authenticité et modernité. 🌾💡',
    captionEn: 'High ceilings with artisan natural fiber pendant lights. A harmonious blend of architectural authenticity and modern design. 🌾💡',
    tags: ['#Nansouty', '#DecorationInterieure', '#ArchitectureBordelaise']
  },
  {
    id: 'post_7',
    image: '/images/instagram/post_7.png',
    type: 'carousel' as const,
    slidesCount: 4,
    likes: 43,
    commentsCount: 5,
    location: 'Bastide, Bordeaux',
    captionFr: 'Cuisine pleine de caractère avec mur d\'accent terracotta, suspension industrielle et rangements optimisés. Loué en 72h ! 🔴🍳',
    captionEn: 'Character kitchen featuring a terracotta accent wall, industrial pendant light, and optimized cabinetry. Rented in 72h! 🔴🍳',
    tags: ['#Bastide', '#CuisineModerne', '#LocationRapide', '#GoizetGestion']
  },
  {
    id: 'post_8',
    image: '/images/instagram/post_8.png',
    type: 'carousel' as const,
    slidesCount: 5,
    likes: 77,
    commentsCount: 11,
    location: 'Bordeaux Centre Historique',
    captionFr: 'Coup de cœur absolu : magnifique pièce sous charpente cathédrale en bois massif avec mur en pierre blonde bordelaise et mezzanine. 🏛️🪵',
    captionEn: 'Absolute masterpiece: cathedral ceiling with exposed solid wood trusses, authentic blond Bordeaux limestone wall, and mezzanine loft. 🏛️🪵',
    tags: ['#PatrimoineBordeaux', '#CharpenteApparente', '#PierreBordelaise', '#LoftBordeaux']
  },
  {
    id: 'post_9',
    image: '/images/instagram/post_9.png',
    type: 'carousel' as const,
    slidesCount: 4,
    likes: 59,
    commentsCount: 7,
    location: 'Saint-Pierre, Bordeaux',
    captionFr: 'Mezzanine d\'architecte avec poutres laquées blanches, verrière zénithale et étagères végétalisées. Un havre de paix au cœur de la ville. 🌿🕊️',
    captionEn: 'Architectural mezzanine with white lacquered beams, skylight, and green interior shelving. A peaceful haven in the city center. 🌿🕊️',
    tags: ['#SaintPierre', '#MezzanineDesign', '#Verriere', '#GoizetGestion']
  },
  {
    id: 'post_10',
    image: '/images/instagram/post_10.png',
    type: 'carousel' as const,
    slidesCount: 3,
    likes: 31,
    commentsCount: 2,
    location: 'Bordeaux Métropole',
    captionFr: 'Appartement contemporain avec vue dégagée sur la métropole bordelaise. Accompagnement complet pour bailleurs et investisseurs. 🌆🔑',
    captionEn: 'Contemporary apartment with panoramic city views over Bordeaux metropolitan area. Complete advisory for landlords and investors. 🌆🔑',
    tags: ['#BordeauxMetropole', '#InvestissementLocatif', '#GestionImmobiliere']
  }
];

export default function InstagramFeed() {
  const { language } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<typeof ACTUAL_POSTS[0] | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [newComments, setNewComments] = useState<Record<string, string[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [showHeartAnim, setShowHeartAnim] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'grid' | 'instagram_grid'>('instagram_grid');

  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    ACTUAL_POSTS.forEach((p) => {
      initialLikes[p.id] = p.likes;
    });
    setLikeCounts(initialLikes);
  }, []);

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

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0] border-t border-[#171512]/5 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#748C8C]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* ========================================================== */}
        {/* 📷 OFFICIAL INSTAGRAM PROFILE HEADER (EXACT STATS & BIO)  */}
        {/* ========================================================== */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#171512]/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
            
            {/* Profile Avatar with Story Ring */}
            <div className="relative shrink-0">
              <div className="p-1 rounded-full bg-gradient-to-tr from-[#748C8C] via-[#90A5A5] to-[#4F6565] shadow-lg">
                <div className="p-1 bg-white rounded-full">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#748C8C] flex items-center justify-center overflow-hidden">
                    <img
                      src="/logomark-cream.png"
                      alt="Goizet Gestion Instagram Profile"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-1 right-1 bg-[#171512] text-[#748C8C] p-1.5 rounded-full border-2 border-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Profile Meta & Actions */}
            <div className="flex-1 text-center md:text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center justify-center md:justify-start space-x-2.5">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#171512] tracking-tight">
                    {PROFILE.username}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-[#748C8C] fill-[#748C8C]/20" />
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <a
                    href={PROFILE.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#748C8C] hover:bg-[#4F6565] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-md flex items-center space-x-2 group"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                    <span>{language === 'fr' ? 'S\'abonner' : 'Follow'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <a
                    href={PROFILE.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#171512] hover:bg-[#2C2723] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 border border-white/10"
                  >
                    <span>{language === 'fr' ? 'Message' : 'Message'}</span>
                  </a>
                </div>
              </div>

              {/* Exact Stats: 19 posts · 123 followers · 1 following */}
              <div className="flex items-center justify-center md:justify-start space-x-6 sm:space-x-8 text-sm text-[#171512] pt-1">
                <div>
                  <span className="font-bold">{PROFILE.postsCount}</span>{' '}
                  <span className="text-[#6F6255] text-xs">{language === 'fr' ? 'publications' : 'posts'}</span>
                </div>
                <div>
                  <span className="font-bold">{PROFILE.followersCount}</span>{' '}
                  <span className="text-[#6F6255] text-xs">{language === 'fr' ? 'abonnés' : 'followers'}</span>
                </div>
                <div>
                  <span className="font-bold">{PROFILE.followingCount}</span>{' '}
                  <span className="text-[#6F6255] text-xs">{language === 'fr' ? 'abonnement' : 'following'}</span>
                </div>
              </div>

              {/* Exact Bio Lines from Instagram Screenshot */}
              <div className="space-y-1 text-xs sm:text-sm text-[#171512] leading-relaxed pt-1 max-w-xl">
                {(language === 'fr' ? PROFILE.bioLinesFr : PROFILE.bioLinesEn).map((line, idx) => (
                  <p key={idx} className={idx === 0 ? 'font-semibold text-[#171512]' : 'text-[#6F6255]'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================== */}
        {/* 📑 GRID HEADER & REAL POSTS GRID (10 ACTUAL POSTS)         */}
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
              href={PROFILE.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#748C8C] hover:text-[#4F6565] transition-colors flex items-center space-x-1.5"
            >
              <span>{language === 'fr' ? 'Tout voir sur Instagram' : 'View all on Instagram'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* 10 Posts Grid (5 Columns on Large Desktop, 3 on Tablet, 2 on Mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {ACTUAL_POSTS.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedPost(post)}
                onDoubleClick={() => handleDoubleClick(post.id)}
                className="group relative aspect-square bg-[#171512] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-[#171512]/10"
              >
                {/* Real Cropped Post Image */}
                <img
                  src={post.image}
                  alt={post.captionFr}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Carousel ❐ Badge at Top-Right (as on Instagram) */}
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
                ? 'Consultez l\'ensemble de nos 19 publications et reportages photos sur Instagram.'
                : 'Browse all 19 publications and photo tours on our Instagram profile.'}
            </p>
          </div>

          <a
            href={PROFILE.profileUrl}
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
      {/* 🖼️ INTERACTIVE LIGHTBOX MODAL FOR REAL POSTS               */}
      {/* ========================================================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#171512]/10 grid grid-cols-1 md:grid-cols-12 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Media Container */}
              <div 
                className="md:col-span-7 bg-[#171512] relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[520px]"
                onDoubleClick={() => handleDoubleClick(selectedPost.id)}
              >
                <img
                  src={selectedPost.image}
                  alt={selectedPost.captionFr}
                  className="w-full h-full object-cover max-h-[60vh] md:max-h-[85vh]"
                />

                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#748C8C]" />
                  <span>1/{selectedPost.slidesCount}</span>
                </div>
              </div>

              {/* Post Details & Interactive Comments */}
              <div className="md:col-span-5 flex flex-col justify-between bg-[#FAF9F6] p-6 max-h-[60vh] md:max-h-[85vh] overflow-y-auto no-scrollbar">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#171512]/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#748C8C] to-[#4F6565]">
                      <div className="w-9 h-9 rounded-full bg-[#748C8C] flex items-center justify-center p-1">
                        <img
                          src="/logomark-cream.png"
                          alt="Goizet Gestion"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-[#171512] text-xs">goizetgestion</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#748C8C]" />
                      </div>
                      <p className="text-[11px] text-[#6F6255] flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#748C8C]" />
                        <span>{selectedPost.location}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={PROFILE.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#748C8C] hover:text-[#4F6565]"
                  >
                    {language === 'fr' ? 'Suivre' : 'Follow'}
                  </a>
                </div>

                {/* Caption & Comments */}
                <div className="py-4 space-y-3 flex-1 overflow-y-auto pr-1">
                  <div className="text-xs leading-relaxed space-y-2">
                    <p className="text-[#171512]">
                      <span className="font-bold mr-1.5">goizetgestion</span>
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

                  {/* Added Local Comments */}
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

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#171512]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => handleToggleLike(selectedPost.id, e)}
                        className="p-1 text-[#171512] hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            likedPosts[selectedPost.id]
                              ? 'text-red-500 fill-red-500 scale-110'
                              : 'text-[#171512]'
                          } transition-transform`}
                        />
                      </button>
                      <button className="p-1 text-[#171512] hover:text-[#748C8C] transition-colors cursor-pointer">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <a
                        href={PROFILE.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#171512] hover:text-[#748C8C] transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </a>
                    </div>

                    <button
                      onClick={(e) => handleToggleSave(selectedPost.id, e)}
                      className="p-1 text-[#171512] hover:text-[#748C8C] transition-colors cursor-pointer"
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

                  {/* Open on Instagram */}
                  <a
                    href={PROFILE.profileUrl}
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
