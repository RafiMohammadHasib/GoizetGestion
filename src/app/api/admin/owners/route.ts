import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const owners = data.map((o: any) => ({
        id: o.id,
        name: o.name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        notes: o.notes,
        status: o.status,
        propertiesCount: Number(o.properties_count || 0),
        createdAt: o.created_at
      }));
      return NextResponse.json({ owners, total: owners.length });
    }

    const db = getDb();
    return NextResponse.json({ owners: db.owners || [], total: (db.owners || []).length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch owners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `own_${Date.now()}`;
    const newOwner = {
      id,
      name: body.name,
      email: body.email,
      phone: body.phone || 'Non renseigné',
      address: body.address || 'Bordeaux',
      notes: body.notes || 'Nouveau propriétaire converti depuis le CRM.',
      status: body.status || 'Managed',
      properties_count: Number(body.propertiesCount || 1)
    };

    await supabase.from('owners').upsert(newOwner, { onConflict: 'id' });

    const db = getDb();
    if (!db.owners) db.owners = [];
    db.owners.unshift({
      id: newOwner.id,
      name: newOwner.name,
      email: newOwner.email,
      phone: newOwner.phone,
      address: newOwner.address,
      notes: newOwner.notes,
      status: newOwner.status,
      propertiesCount: newOwner.properties_count,
      createdAt: new Date().toISOString()
    });
    saveDb(db);

    return NextResponse.json({ success: true, owner: newOwner });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create owner' }, { status: 500 });
  }
}
