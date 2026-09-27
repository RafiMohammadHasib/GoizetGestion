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

    // Load local DB leads
    const db = getDb();
    const localLeads = db.leads || [];

    // Unified deduplicated map of leads (id -> lead)
    const leadsMap = new Map<string, any>();

    // 1. Add local leads
    localLeads.forEach((l: any) => {
      leadsMap.set(l.id, {
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        leadType: l.leadType,
        serviceType: l.serviceType,
        preferredTimeSlot: l.preferredTimeSlot,
        status: l.status || 'NEW',
        subject: l.subject,
        message: l.message,
        propertyAddress: l.propertyAddress,
        budget: l.budget,
        surface: l.surface,
        assignedTo: l.assignedTo,
        source: l.source,
        notes: Array.isArray(l.notes) ? l.notes : [],
        activities: Array.isArray(l.activities) ? l.activities : [],
        createdAt: l.createdAt
      });
    });

    // 2. Overlay / Merge with Supabase data
    if (!error && data && data.length > 0) {
      data.forEach((l: any) => {
        leadsMap.set(l.id, {
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          leadType: l.lead_type || l.leadType,
          serviceType: l.service_type || l.serviceType,
          preferredTimeSlot: l.preferred_time_slot || l.preferredTimeSlot,
          status: l.status,
          subject: l.subject,
          message: l.message,
          propertyAddress: l.property_address || l.propertyAddress,
          budget: l.budget,
          surface: l.surface,
          assignedTo: l.assigned_to || l.assignedTo,
          source: l.source,
          notes: Array.isArray(l.notes) ? l.notes : [],
          activities: Array.isArray(l.activities) ? l.activities : [],
          createdAt: l.created_at || l.createdAt
        });
      });
    }

    let allLeads = Array.from(leadsMap.values());
    allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (status && status !== 'ALL') {
      allLeads = allLeads.filter((l: any) => l.status === status);
    }
    if (type && type !== 'ALL') {
      allLeads = allLeads.filter((l: any) => 
        (l.leadType || '').toUpperCase().includes(type.toUpperCase()) ||
        (l.serviceType || '').toUpperCase().includes(type.toUpperCase())
      );
    }

    return NextResponse.json({ leads: allLeads, total: allLeads.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      fullName,
      email,
      phone,
      leadType = 'Contact Message',
      serviceType,
      status = 'NEW',
      subject,
      message,
      propertyAddress,
      budget,
      surface,
      preferredTimeSlot,
      source = 'CRM Saisie Directe'
    } = body;

    const leadName = (fullName || name || '').trim();
    if (!leadName) {
      return NextResponse.json({ error: 'Le nom complet est obligatoire' }, { status: 400 });
    }

    const newLead: any = {
      id: `lead_${Date.now()}`,
      name: leadName,
      email: (email || '').trim().toLowerCase() || 'contact@client.goizet',
      phone: (phone || '').trim() || 'Non renseigné',
      leadType,
      serviceType,
      status,
      subject: subject || `Demande ${leadType}`,
      message: message || '',
      propertyAddress,
      budget,
      surface,
      preferredTimeSlot,
      source,
      assignedTo: 'Paul & Edgar Goizet',
      createdAt: new Date().toISOString(),
      notes: [],
      activities: [
        { id: `act_${Date.now()}`, text: 'Lead créé dans le CRM Goizet Gestion.', date: 'À l\'instant' }
      ]
    };

    const db = getDb();
    if (!db.leads) db.leads = [];
    db.leads.unshift(newLead);
    saveDb(db);

    try {
      await supabase.from('crm_leads').insert({
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        lead_type: newLead.leadType,
        service_type: newLead.serviceType,
        status: newLead.status,
        subject: newLead.subject,
        message: newLead.message,
        property_address: newLead.propertyAddress,
        budget: newLead.budget,
        surface: newLead.surface,
        preferred_time_slot: newLead.preferredTimeSlot,
        source: newLead.source,
        assigned_to: newLead.assignedTo,
        created_at: newLead.createdAt,
        notes: newLead.notes,
        activities: newLead.activities
      });
    } catch (sbErr) {
      console.warn('Supabase sync warning in CRM POST:', sbErr);
    }

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
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
