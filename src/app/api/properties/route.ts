import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const neighborhood = searchParams.get('neighborhood');
    const propertyType = searchParams.get('propertyType');
    const maxPrice = searchParams.get('maxPrice');
    const minSurface = searchParams.get('minSurface');

    // Single property lookup by slug or id
    if (slug) {
      const property = db.properties.find(
        (p: any) => p.slug === slug || p.id === slug
      );
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
      return NextResponse.json({ property });
    }

    if (id) {
      const property = db.properties.find((p: any) => p.id === id);
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
      return NextResponse.json({ property });
    }

    // Filter properties list
    let properties = db.properties;

    if (status && status !== 'ALL') {
      properties = properties.filter((p: any) => p.status === status);
    }

    if (type) {
      properties = properties.filter((p: any) => p.transactionType === type);
    }

    if (neighborhood) {
      properties = properties.filter((p: any) => p.neighborhoodSlug === neighborhood);
    }

    if (propertyType) {
      properties = properties.filter((p: any) => p.propertyType === propertyType);
    }

    if (maxPrice) {
      properties = properties.filter((p: any) => p.price <= parseInt(maxPrice, 10));
    }

    if (minSurface) {
      properties = properties.filter((p: any) => p.surface >= parseInt(minSurface, 10));
    }

    return NextResponse.json({ properties, total: properties.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
