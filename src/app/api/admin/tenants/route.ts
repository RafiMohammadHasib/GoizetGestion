import { NextRequest, NextResponse } from 'next/server';
import { supabase, withTimeout } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const localTenants = (db.tenants || []).length > 0 ? db.tenants : [
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

    const tenantsMap = new Map<string, any>();

    // 1. Add local tenants
    localTenants.forEach((t: any) => {
      tenantsMap.set(t.id, {
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        propertyId: t.propertyId || t.property_id,
        propertyTitle: t.propertyTitle || t.property_title || 'Bordeaux Centre',
        leaseStart: t.leaseStart || t.lease_start,
        leaseEnd: t.leaseEnd || t.lease_end,
        rentAmount: Number(t.rentAmount || t.rent_amount || 0),
        depositAmount: Number(t.depositAmount || t.deposit_amount || 0),
        status: t.status || 'Active',
        createdAt: t.createdAt || t.created_at || new Date().toISOString()
      });
    });

    // 2. Auto-sync any CONVERTED tenant leads from db.leads
    let dbChanged = false;
    (db.leads || []).forEach((l: any) => {
      if (l.status === 'CONVERTED') {
        const leadTypeStr = (l.leadType || l.lead_type || '').toLowerCase();
        const serviceTypeStr = (l.serviceType || l.service_type || '').toLowerCase();
        const isTenant = leadTypeStr.includes('tenant') ||
                         leadTypeStr.includes('buyer') ||
                         serviceTypeStr.includes('rent a') ||
                         serviceTypeStr.includes('buy');

        if (isTenant) {
          const tenantId = `ten_${l.id.replace('lead_', '')}`;
          const existingTenant = tenantsMap.get(tenantId) || Array.from(tenantsMap.values()).find((t: any) => t.email === l.email);
          if (!existingTenant) {
            const newTenant = {
              id: tenantId,
              name: l.name,
              email: l.email,
              phone: l.phone || 'Non renseigné',
              propertyTitle: l.propertyAddress || l.property_address || 'Appartement Bordeaux',
              rentAmount: parseInt((l.budget || '1500').replace(/[^0-9]/g, ''), 10) || 1500,
              status: 'Active',
              createdAt: l.createdAt || new Date().toISOString()
            };
            tenantsMap.set(tenantId, newTenant);
            if (!db.tenants) db.tenants = [];
            db.tenants.unshift(newTenant);
            dbChanged = true;
          }
        }
      }
    });

    if (dbChanged) {
      saveDb(db);
    }

    // 3. Merge Supabase if available
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('tenants')
          .select('*')
          .order('created_at', { ascending: false })
      );

      if (!error && data && data.length > 0) {
        data.forEach((t: any) => {
          if (!tenantsMap.has(t.id)) {
            tenantsMap.set(t.id, {
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
            });
          }
        });
      }
    } catch (sbErr) {
      // Supabase offline / fallback
    }

    const allTenants = Array.from(tenantsMap.values());
    allTenants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ tenants: allTenants, total: allTenants.length });
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
