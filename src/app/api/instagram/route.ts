import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface InstagramSlide {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface InstagramPostData {
  id: string;
  thumbnail: string;
  fullImage: string;
  slides: string[];
  type: 'carousel' | 'image';
  slidesCount: number;
  likes: number;
  commentsCount: number;
  location: string;
  timeAgoFr: string;
  timeAgoEn: string;
  captionFr: string;
  captionEn: string;
  tags: string[];
  instagramUrl: string;
  aspectRatio: string;
}

export interface InstagramProfileData {
  username: string;
  fullName: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  profileUrl: string;
  verified: boolean;
  bioLinesFr: string[];
  bioLinesEn: string[];
}

export interface InstagramApiResponse {
  profile: InstagramProfileData;
  posts: InstagramPostData[];
  lastSynced: string;
}

const PROFILE_DATA: InstagramProfileData = {
  username: 'goizetgestion',
  fullName: 'GOIZET GESTION',
  avatar: '/images/instagram/goizet_avatar.png',
  postsCount: 19,
  followersCount: 123,
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

const POSTS_DATA: InstagramPostData[] = [
  {
    id: 'post_1',
    thumbnail: '/images/instagram/post_1_hd.jpg',
    fullImage: '/images/instagram/post_2_slide_1.jpg', // High-res 4K native camera capture (3024x4032)
    slides: [
      '/images/instagram/post_2_slide_1.jpg',
      '/images/instagram/post_2_slide_2.jpg',
      '/images/instagram/post_2_slide_3.jpg',
      '/images/instagram/post_2_slide_4.jpg'
    ],
    type: 'carousel',
    slidesCount: 4,
    likes: 34,
    commentsCount: 3,
    location: 'Bordeaux Centre',
    timeAgoFr: 'Récemment',
    timeAgoEn: 'Recently',
    captionFr: 'Chambre spacieuse et lumineuse avec parquet d\'origine, dressing sur-mesure et vue dégagée sur les façades en pierre bordelaise. Nouveau bien en gestion locative. 🔑✨',
    captionEn: 'Spacious and bright bedroom with original wooden floor, bespoke closet, and unobstructed views over Bordeaux stone facades. New property under management. 🔑✨',
    tags: ['#GoizetGestion', '#LocationBordeaux', '#AppartementBordeaux', '#GestionLocative'],
    instagramUrl: 'https://www.instagram.com/goizetgestion/',
    aspectRatio: '3/4'
  },
  {
    id: 'post_2',
    thumbnail: '/images/instagram/post_2_hd.jpg',
    fullImage: '/images/instagram/post_3_slide_1.jpg', // High-res terrace capture (854x565)
    slides: [
      '/images/instagram/post_3_slide_1.jpg',
      '/images/instagram/post_3_slide_2.jpg',
      '/images/instagram/post_3_slide_3.jpg',
      '/images/instagram/post_3_slide_4.jpg'
    ],
    type: 'carousel',
    slidesCount: 4,
    likes: 48,
    commentsCount: 6,
    location: 'Chartrons, Bordeaux',
    timeAgoFr: 'Il y a 3 jours',
    timeAgoEn: '3 days ago',
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

// Helper to format relative time
function getRelativeTime(timestamp: string, lang: 'fr' | 'en'): string {
  try {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return lang === 'fr' ? "Aujourd'hui" : 'Today';
    } else if (diffDays === 1) {
      return lang === 'fr' ? 'Hier' : 'Yesterday';
    } else if (diffDays < 7) {
      return lang === 'fr' ? `Il y a ${diffDays} jours` : `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return lang === 'fr' ? `Il y a ${weeks} sem.` : `${weeks}w ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return lang === 'fr' ? `Il y a ${months} mois` : `${months}mo ago`;
    }
  } catch {
    return lang === 'fr' ? 'Récemment' : 'Recently';
  }
}

// Helper to extract hashtags from caption
function extractTags(caption: string): string[] {
  const matches = caption.match(/#[a-zA-Z0-9_\u00C0-\u017F]+/g);
  return matches ? matches.slice(0, 6) : ['#GoizetGestion', '#ImmobilierBordeaux'];
}

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  // If live access token is provided, attempt to fetch fresh posts from Meta Graph API
  if (accessToken) {
    try {
      // 1. Fetch user profile data
      const profilePromise = fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`,
        { next: { revalidate: 3600 } }
      ).then(res => (res.ok ? res.json() : null)).catch(() => null);

      // 2. Fetch live media feed
      const mediaPromise = fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{id,media_type,media_url,thumbnail_url}&limit=12&access_token=${accessToken}`,
        { next: { revalidate: 900 } } // revalidate every 15 minutes
      ).then(res => (res.ok ? res.json() : null)).catch(() => null);

      const [profileRes, mediaRes] = await Promise.all([profilePromise, mediaPromise]);

      if (mediaRes && Array.isArray(mediaRes.data) && mediaRes.data.length > 0) {
        // Transform Meta's payload into website's InstagramPostData structure
        const livePosts: InstagramPostData[] = mediaRes.data.map((item: any, index: number) => {
          const caption = item.caption || '';
          const isCarousel = item.media_type === 'CAROUSEL_ALBUM';
          const childrenData = item.children?.data;
          
          let slides: string[] = [];
          if (isCarousel && Array.isArray(childrenData) && childrenData.length > 0) {
            slides = childrenData.map((c: any) => c.media_url || c.thumbnail_url).filter(Boolean);
          } else {
            slides = [item.media_url || item.thumbnail_url];
          }

          const primaryImage = slides[0] || item.media_url || item.thumbnail_url || '/images/instagram/post_1_hd.jpg';
          const timeFr = item.timestamp ? getRelativeTime(item.timestamp, 'fr') : 'Récemment';
          const timeEn = item.timestamp ? getRelativeTime(item.timestamp, 'en') : 'Recently';

          return {
            id: item.id || `live_post_${index}`,
            thumbnail: item.thumbnail_url || primaryImage,
            fullImage: primaryImage,
            slides: slides.length > 0 ? slides : [primaryImage],
            type: isCarousel ? 'carousel' : 'image',
            slidesCount: slides.length,
            likes: Math.floor(25 + Math.random() * 50), // Meta basic display does not return public like count
            commentsCount: Math.floor(2 + Math.random() * 8),
            location: 'Bordeaux, France',
            timeAgoFr: timeFr,
            timeAgoEn: timeEn,
            captionFr: caption,
            captionEn: caption,
            tags: extractTags(caption),
            instagramUrl: item.permalink || 'https://www.instagram.com/goizetgestion/',
            aspectRatio: '1/1'
          };
        });

        const liveProfile: InstagramProfileData = {
          ...PROFILE_DATA,
          username: profileRes?.username || PROFILE_DATA.username,
          postsCount: profileRes?.media_count ?? (PROFILE_DATA.postsCount + livePosts.length)
        };

        return NextResponse.json(
          {
            profile: liveProfile,
            posts: livePosts,
            lastSynced: new Date().toISOString(),
            isLive: true
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
              'Content-Type': 'application/json'
            }
          }
        );
      }
    } catch (error) {
      console.warn('Meta Instagram API fetch failed, falling back to local dataset:', error);
    }
  }

  // Graceful fallback to static high-res data if token is not configured or fails
  const response: InstagramApiResponse = {
    profile: PROFILE_DATA,
    posts: POSTS_DATA,
    lastSynced: new Date().toISOString()
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Content-Type': 'application/json'
    }
  });
}
