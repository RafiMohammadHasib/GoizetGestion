import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Missing property id or slug' }, { status: 400 });
    }

    // 1. Fetch current views and increment in Supabase
    let targetProperty: any = null;
    if (id) {
      const { data } = await supabase.from('properties').select('id, views').eq('id', id).maybeSingle();
      targetProperty = data;
    } else if (slug) {
      const { data } = await supabase.from('properties').select('id, views').eq('slug', slug).maybeSingle();
      targetProperty = data;
    }

    if (targetProperty) {
      const updatedViews = (Number(targetProperty.views) || 0) + 1;
      await supabase
        .from('properties')
        .update({ views: updatedViews, updated_at: new Date().toISOString() })
        .eq('id', targetProperty.id);
    }

    // 2. Sync in local memory cache
    const db = getDb();
    if (db.properties) {
      const prop = db.properties.find((p: any) => p.id === id || p.slug === slug);
      if (prop) {
        prop.views = (Number(prop.views) || 0) + 1;
        saveDb(db);
      }
    }

    return NextResponse.json({ success: true, message: 'View counted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }
}
