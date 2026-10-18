import { NextRequest, NextResponse } from 'next/server';
import { supabase, withTimeout } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const localOwners = db.owners || [];
    const ownersMap = new Map<string, any>();

    // 1. Add local owners
    localOwners.forEach((o: any) => {
      ownersMap.set(o.id, {
        id: o.id,
        name: o.name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        notes: o.notes,
        status: o.status || 'Managed',
        propertiesCount: Number(o.propertiesCount || o.properties_count || 1),
        createdAt: o.createdAt || o.created_at || new Date().toISOString()
      });
    });

    // 2. Auto-sync any CONVERTED leads from db.leads that should be in owners
    let dbChanged = false;
    (db.leads || []).forEach((l: any) => {
      if (l.status === 'CONVERTED') {
        const leadTypeStr = (l.leadType || l.lead_type || '').toLowerCase();
        const serviceTypeStr = (l.serviceType || l.service_type || '').toLowerCase();
        const isOwner = leadTypeStr.includes('owner') ||
                        leadTypeStr.includes('valuation') ||
                        leadTypeStr.includes('seller') ||
                        serviceTypeStr.includes('rent out') ||
                        serviceTypeStr.includes('sell') ||
                        serviceTypeStr.includes('gestion') ||
                        serviceTypeStr.includes('management');

        if (isOwner) {
          const rawId = l.id ? String(l.id) : String(Date.now());
          const ownerId = `own_${rawId.replace('lead_', '')}`;
          const existingOwner = ownersMap.get(ownerId) || (l.email ? Array.from(ownersMap.values()).find((o: any) => o.email === l.email) : undefined);
          if (!existingOwner) {
            const newOwner = {
              id: ownerId,
              name: l.name || 'Propriétaire',
              email: l.email || `${ownerId}@goizet-gestion.fr`,
              phone: l.phone || 'Non renseigné',
              address: l.propertyAddress || l.property_address || 'Bordeaux Centre',
              notes: `Converti depuis le CRM Opportunity Board (${l.leadType || 'Owner Enquiry'}). Budget: ${l.budget || 'N/A'}.`,
              status: 'Managed',
              propertiesCount: 1,
              properties_count: 1,
              createdAt: l.createdAt || new Date().toISOString()
            };
            ownersMap.set(ownerId, newOwner);
            if (!db.owners) db.owners = [];
            db.owners.unshift(newOwner);
            dbChanged = true;
          }
        }
      }
    });

    if (dbChanged) {
      saveDb(db);
    }

    // 3. Merge OVH MySQL / Supabase data if available
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('owners')
          .select('*')
          .order('created_at', { ascending: false }),
        1200
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach((o: any) => {
          if (o && o.id && !ownersMap.has(String(o.id))) {
            ownersMap.set(String(o.id), {
              id: String(o.id),
              name: o.name || 'Propriétaire',
              email: o.email || '',
              phone: o.phone || '',
              address: o.address || '',
              notes: o.notes || '',
              status: o.status || 'Managed',
              propertiesCount: Number(o.properties_count || o.propertiesCount || 1),
              createdAt: o.created_at || o.createdAt || new Date().toISOString()
            });
          }
        });
      }
    } catch (sbErr) {
      // Supabase / OVH offline or timeout fallback — safely continue with local database
    }

    const allOwners = Array.from(ownersMap.values());
    allOwners.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ owners: allOwners, total: allOwners.length });
  } catch (error: any) {
    console.error('Error in GET /api/admin/owners:', error);
    try {
      const fallbackDb = getDb();
      return NextResponse.json({ owners: fallbackDb.owners || [], total: (fallbackDb.owners || []).length });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch owners', details: String(error?.message || error) }, { status: 500 });
    }
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
