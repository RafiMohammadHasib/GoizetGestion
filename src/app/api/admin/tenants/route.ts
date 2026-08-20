import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const tenants = data.map((t: any) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        propertyId: t.property_id,
        propertyTitle: t.property_title,
        leaseStart: t.lease_start,
        leaseEnd: t.lease_end,
        rentAmount: Number(t.rent_amount || 0),
        depositAmount: Number(t.deposit_amount || 0),
        status: t.status,
        createdAt: t.created_at
      }));
      return NextResponse.json({ tenants, total: tenants.length });
    }

    const db = getDb();
    const fallbackTenants = (db.tenants || []).length > 0 ? db.tenants : [
      {
        id: 'ten_1',
        name: 'Claire Fontaine',
        email: 'claire.fontaine@domaine.fr',
        phone: '06 98 76 54 32',
        propertyTitle: 'T3 Chartrons Bordeaux',
        rentAmount: 2000,
        status: 'Active',
        createdAt: '2026-01-15T10:00:00Z'
      }
    ];
    return NextResponse.json({ tenants: fallbackTenants, total: fallbackTenants.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `ten_${Date.now()}`;
    const newTenant = {
      id,
      name: body.name,
      email: body.email,
      phone: body.phone || 'Non renseigné',
      property_id: body.propertyId || null,
      property_title: body.propertyTitle || 'Bordeaux Centre',
      lease_start: body.leaseStart || new Date().toISOString(),
      lease_end: body.leaseEnd || null,
      rent_amount: Number(body.rentAmount || 0),
      deposit_amount: Number(body.depositAmount || 0),
      status: body.status || 'Active'
    };

    await supabase.from('tenants').upsert(newTenant, { onConflict: 'id' });

    const db = getDb();
    if (!db.tenants) db.tenants = [];
    db.tenants.unshift({
      id: newTenant.id,
      name: newTenant.name,
      email: newTenant.email,
      phone: newTenant.phone,
      propertyId: newTenant.property_id,
      propertyTitle: newTenant.property_title,
      leaseStart: newTenant.lease_start,
      leaseEnd: newTenant.lease_end,
      rentAmount: newTenant.rent_amount,
      depositAmount: newTenant.deposit_amount,
      status: newTenant.status,
      createdAt: new Date().toISOString()
    });
    saveDb(db);

    return NextResponse.json({ success: true, tenant: newTenant });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
  }
}
