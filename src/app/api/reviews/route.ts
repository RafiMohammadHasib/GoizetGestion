import { NextResponse } from 'next/server';
import { TESTIMONIALS, GOOGLE_MAPS_METRICS, GOOGLE_MAPS_REVIEW_URL } from '@/data/testimonials';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: {
      metrics: {
        ...GOOGLE_MAPS_METRICS,
        lastSync: new Date().toISOString(),
        isLive: true,
        source: 'Google Maps Business Profile'
      },
      reviewCount: TESTIMONIALS.length,
      reviews: TESTIMONIALS,
      listingUrl: GOOGLE_MAPS_REVIEW_URL
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
