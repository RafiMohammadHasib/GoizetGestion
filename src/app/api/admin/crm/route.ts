import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabase.from('crm_leads').select('*').order('created_at', { ascending: false });

    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }
    if (type && type !== 'ALL') {
      query = query.ilike('lead_type', `%${type}%`);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const leads = data.map((l: any) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        leadType: l.lead_type,
        status: l.status,
        subject: l.subject,
        message: l.message,
        propertyAddress: l.property_address,
        budget: l.budget,
        surface: l.surface,
        assignedTo: l.assigned_to,
        source: l.source,
        notes: Array.isArray(l.notes) ? l.notes : [],
        activities: Array.isArray(l.activities) ? l.activities : [],
        createdAt: l.created_at
      }));
      return NextResponse.json({ leads, total: leads.length });
    }

    // Fallback to local DB
    const db = getDb();
    let leads = db.leads;
    if (status && status !== 'ALL') leads = leads.filter((l: any) => l.status === status);
    if (type && type !== 'ALL') leads = leads.filter((l: any) => l.leadType.toUpperCase().includes(type.toUpperCase()));

    return NextResponse.json({ leads, total: leads.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, note, assignedTo } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 });
    }

    const updateFields: any = { updated_at: new Date().toISOString() };
    if (status) updateFields.status = status;
    if (assignedTo) updateFields.assigned_to = assignedTo;

    // Fetch existing if note is being added
    if (note) {
      const { data: existing } = await supabase.from('crm_leads').select('notes, activities').eq('id', id).single();
      const currentNotes = existing && Array.isArray(existing.notes) ? existing.notes : [];
      updateFields.notes = [...currentNotes, note];
    }

    const { data: updatedLead, error } = await supabase.from('crm_leads').update(updateFields).eq('id', id).select().single();

    // If status is CONVERTED, automatically create Owner or Tenant record
    if (status === 'CONVERTED' && updatedLead) {
      const isOwner = (updatedLead.lead_type || '').toLowerCase().includes('owner') ||
                      (updatedLead.lead_type || '').toLowerCase().includes('valuation') ||
                      (updatedLead.lead_type || '').toLowerCase().includes('seller');

      if (isOwner) {
        // Upsert into owners table
        const ownerRecord = {
          id: `own_${id.replace('lead_', '')}`,
          name: updatedLead.name,
          email: updatedLead.email,
          phone: updatedLead.phone || 'Non renseigné',
          address: updatedLead.property_address || 'Bordeaux Centre',
          notes: `Converti depuis le CRM Opportunity Board (${updatedLead.lead_type}). Budget: ${updatedLead.budget || 'N/A'}.`,
          status: 'Managed',
          properties_count: 1
        };
        await supabase.from('owners').upsert(ownerRecord, { onConflict: 'id' });

        const db = getDb();
        if (!db.owners) db.owners = [];
        const existingIdx = db.owners.findIndex((o: any) => o.id === ownerRecord.id);
        if (existingIdx >= 0) db.owners[existingIdx] = ownerRecord;
        else db.owners.unshift(ownerRecord);
        saveDb(db);
      } else {
        // Upsert into tenants table
        const tenantRecord = {
          id: `ten_${id.replace('lead_', '')}`,
          name: updatedLead.name,
          email: updatedLead.email,
          phone: updatedLead.phone || 'Non renseigné',
          property_title: updatedLead.property_address || 'Appartement Bordeaux',
          rent_amount: parseInt((updatedLead.budget || '1500').replace(/[^0-9]/g, ''), 10) || 1500,
          status: 'Active'
        };
        await supabase.from('tenants').upsert(tenantRecord, { onConflict: 'id' });

        const db = getDb();
        if (!db.tenants) db.tenants = [];
        const existingIdx = db.tenants.findIndex((t: any) => t.id === tenantRecord.id);
        if (existingIdx >= 0) db.tenants[existingIdx] = tenantRecord;
        else db.tenants.unshift(tenantRecord);
        saveDb(db);
      }

      // Log in activity logs
      await supabase.from('activity_logs').insert({
        id: `log_${Date.now()}`,
        user_name: updatedLead.name,
        action: `a été converti avec succès (${isOwner ? 'Nouveau Propriétaire' : 'Nouveau Locataire'})`,
        object: updatedLead.property_address || 'Bordeaux',
        timestamp: new Date().toISOString()
      });
    }

    // Sync to local cache
    const db = getDb();
    db.leads = db.leads.map((l: any) => {
      if (l.id === id) {
        return {
          ...l,
          status: status || l.status,
          assignedTo: assignedTo || l.assignedTo,
          notes: note ? [...(l.notes || []), note] : l.notes
        };
      }
      return l;
    });
    saveDb(db);

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
