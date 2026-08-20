import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

function mapPropertyFromDb(row: any) {
  return {
    id: row.id,
    reference: row.reference,
    title: row.title,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    transactionType: row.transaction_type,
    propertyType: row.property_type,
    price: Number(row.price),
    charges: row.charges ? Number(row.charges) : undefined,
    deposit: row.deposit ? Number(row.deposit) : undefined,
    surface: Number(row.surface),
    rooms: Number(row.rooms),
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    floor: row.floor !== null ? Number(row.floor) : undefined,
    totalFloors: row.total_floors !== null ? Number(row.total_floors) : undefined,
    yearBuilt: row.year_built !== null ? Number(row.year_built) : undefined,
    energyRating: row.energy_rating,
    gesRating: row.ges_rating,
    address: row.address,
    postalCode: row.postal_code,
    city: row.city,
    neighborhoodSlug: row.neighborhood_slug,
    neighborhoodName: row.neighborhood_name,
    isExclusive: Boolean(row.is_exclusive),
    status: row.status,
    features: Array.isArray(row.features) ? row.features : [],
    images: Array.isArray(row.images) ? row.images : [],
    coverImage: row.cover_image,
    views: Number(row.views || 0),
    enquiriesCount: Number(row.enquiries_count || 0),
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    updatedAt: row.updated_at
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const neighborhood = searchParams.get('neighborhood');
    const propertyType = searchParams.get('propertyType');
    const maxPrice = searchParams.get('maxPrice');
    const minSurface = searchParams.get('minSurface');

    // Single property lookup
    if (slug) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (data) {
        return NextResponse.json({ property: mapPropertyFromDb(data) });
      }
    }

    if (id) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data) {
        return NextResponse.json({ property: mapPropertyFromDb(data) });
      }
    }

    // Filter list
    let query = supabase.from('properties').select('*');

    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('transaction_type', type);
    }
    if (neighborhood) {
      query = query.eq('neighborhood_slug', neighborhood);
    }
    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice, 10));
    }
    if (minSurface) {
      query = query.gte('surface', parseInt(minSurface, 10));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const properties = data.map(mapPropertyFromDb);
      return NextResponse.json({ properties, total: properties.length });
    }

    // Fallback to local DB store
    const db = getDb();
    let properties = db.properties;

    if (slug) {
      const property = properties.find((p: any) => p.slug === slug || p.id === slug);
      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      return NextResponse.json({ property });
    }

    if (id) {
      const property = properties.find((p: any) => p.id === id);
      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      return NextResponse.json({ property });
    }

    if (status && status !== 'ALL') properties = properties.filter((p: any) => p.status === status);
    if (type) properties = properties.filter((p: any) => p.transactionType === type);
    if (neighborhood) properties = properties.filter((p: any) => p.neighborhoodSlug === neighborhood);
    if (propertyType) properties = properties.filter((p: any) => p.propertyType === propertyType);
    if (maxPrice) properties = properties.filter((p: any) => p.price <= parseInt(maxPrice, 10));
    if (minSurface) properties = properties.filter((p: any) => p.surface >= parseInt(minSurface, 10));

    return NextResponse.json({ properties, total: properties.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `prop_${Date.now()}`;
    const slug = body.slug || `${(body.title || 'bien').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const reference = body.reference || `BDX-2026-${Math.floor(100 + Math.random() * 900)}`;

    const row = {
      id,
      reference,
      title: body.title,
      slug,
      description: body.description,
      short_description: body.shortDescription,
      transaction_type: body.transactionType || 'louer',
      property_type: body.propertyType || 'appartement',
      price: Number(body.price || 0),
      charges: Number(body.charges || 0),
      deposit: Number(body.deposit || 0),
      surface: Number(body.surface || 0),
      rooms: Number(body.rooms || 1),
      bedrooms: Number(body.bedrooms || 1),
      bathrooms: Number(body.bathrooms || 1),
      floor: body.floor ? Number(body.floor) : null,
      total_floors: body.totalFloors ? Number(body.totalFloors) : null,
      year_built: body.yearBuilt ? Number(body.yearBuilt) : null,
      energy_rating: body.energyRating || 'B',
      ges_rating: body.gesRating || 'B',
      address: body.address || 'Bordeaux',
      postal_code: body.postalCode || '33000',
      city: body.city || 'Bordeaux',
      neighborhood_slug: body.neighborhoodSlug || 'chartrons',
      neighborhood_name: body.neighborhoodName || 'Chartrons',
      is_exclusive: Boolean(body.isExclusive),
      status: body.status || 'Published',
      features: body.features || [],
      images: body.images || [],
      cover_image: body.coverImage || '/images/hero.jpg',
      views: 0,
      enquiries_count: 0,
      owner_id: body.ownerId || null,
      owner_name: body.ownerName || null,
      seo_title: body.seoTitle || `${body.title} | Goizet Gestion`,
      seo_description: body.seoDescription || body.shortDescription
    };

    await supabase.from('properties').insert(row);

    // Sync to local
    const db = getDb();
    const newProp = mapPropertyFromDb(row);
    db.properties.unshift(newProp);
    saveDb(db);

    return NextResponse.json({ success: true, property: newProp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Property ID is required for update' }, { status: 400 });
    }

    const updates: any = {
      title: body.title,
      slug: body.slug,
      description: body.description,
      short_description: body.shortDescription,
      transaction_type: body.transactionType,
      property_type: body.propertyType,
      price: body.price !== undefined ? Number(body.price) : undefined,
      charges: body.charges !== undefined ? Number(body.charges) : undefined,
      deposit: body.deposit !== undefined ? Number(body.deposit) : undefined,
      surface: body.surface !== undefined ? Number(body.surface) : undefined,
      rooms: body.rooms !== undefined ? Number(body.rooms) : undefined,
      bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : undefined,
      bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : undefined,
      floor: body.floor !== undefined ? (body.floor ? Number(body.floor) : null) : undefined,
      total_floors: body.totalFloors !== undefined ? (body.totalFloors ? Number(body.totalFloors) : null) : undefined,
      year_built: body.yearBuilt !== undefined ? (body.yearBuilt ? Number(body.yearBuilt) : null) : undefined,
      energy_rating: body.energyRating,
      ges_rating: body.gesRating,
      address: body.address,
      postal_code: body.postalCode,
      city: body.city,
      neighborhood_slug: body.neighborhoodSlug,
      neighborhood_name: body.neighborhoodName,
      is_exclusive: body.isExclusive !== undefined ? Boolean(body.isExclusive) : undefined,
      status: body.status,
      features: body.features,
      images: body.images,
      cover_image: body.coverImage,
      owner_id: body.ownerId,
      owner_name: body.ownerName,
      seo_title: body.seoTitle,
      seo_description: body.seoDescription,
      updated_at: new Date().toISOString()
    };

    // Clean undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { error: sbError } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id);

    // Sync local DB
    const db = getDb();
    const index = db.properties.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      db.properties[index] = {
        ...db.properties[index],
        ...updates,
        transactionType: updates.transaction_type ?? db.properties[index].transactionType,
        propertyType: updates.property_type ?? db.properties[index].propertyType,
        coverImage: updates.cover_image ?? db.properties[index].coverImage,
        shortDescription: updates.short_description ?? db.properties[index].shortDescription,
        seoTitle: updates.seo_title ?? db.properties[index].seoTitle,
        seoDescription: updates.seo_description ?? db.properties[index].seoDescription,
        neighborhoodSlug: updates.neighborhood_slug ?? db.properties[index].neighborhoodSlug,
        neighborhoodName: updates.neighborhood_name ?? db.properties[index].neighborhoodName,
        isExclusive: updates.is_exclusive ?? db.properties[index].isExclusive,
        updatedAt: updates.updated_at
      };
      saveDb(db);
    }

    return NextResponse.json({ success: true, updated: updates });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await supabase.from('properties').delete().eq('id', id);

    const db = getDb();
    db.properties = db.properties.filter((p: any) => p.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}

