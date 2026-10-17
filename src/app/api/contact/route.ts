import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInjection, isValidEmail, isValidPhone, checkRateLimit } from '@/lib/security';
import { getDb, saveDb, CRMLead } from '@/lib/db';

export async function POST(req: NextRequest) {
  let language = 'fr';
  try {
    const body = await req.json();
    language = body?.language === 'en' ? 'en' : 'fr';

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: language === 'en'
            ? 'Too many requests. Please try again in a minute.'
            : 'Trop de requêtes. Veuillez réessayer dans une minute.',
          errorCode: 'RATE_LIMIT'
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const { 
      fullName, 
      name, 
      email, 
      phone, 
      subject, 
      message, 
      propertyId, 
      propertySlug, 
      propertyTitle,
      budget,
      surface,
      leadType: customLeadType,
      project,
      timeSlot,
      source: customSource
    } = body;

    const sanitizedName = sanitizeInjection(fullName || name || '');
    const sanitizedSubject = sanitizeInjection(
      subject || (project ? `Demande de rappel: ${project}` : 'Demande de contact')
    );
    const sanitizedMessage = sanitizeInjection(message || (timeSlot ? `Créneau souhaité: ${timeSlot}. Projet: ${project || 'Conseil immobilier'}` : ''));
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json({ 
        error: language === 'en' ? 'Full name is required.' : 'Le nom complet est obligatoire.',
        errorCode: 'NAME_REQUIRED'
      }, { status: 400 });
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return NextResponse.json({ 
        error: language === 'en' ? 'Invalid email address.' : 'Adresse email invalide.',
        errorCode: 'INVALID_EMAIL'
      }, { status: 400 });
    }

    if (cleanPhone && !isValidPhone(cleanPhone)) {
      return NextResponse.json({ 
        error: language === 'en' ? 'Invalid phone number.' : 'Numéro de téléphone invalide.',
        errorCode: 'INVALID_PHONE'
      }, { status: 400 });
    }

    // Determine lead type accurately
    let computedLeadType: CRMLead['leadType'] = 'Contact Message';
    if (customLeadType) {
      computedLeadType = customLeadType;
    } else if (propertyId || propertySlug) {
      computedLeadType = 'Tenant Request';
    } else if (timeSlot) {
      computedLeadType = 'Callback Request';
    } else if (sanitizedSubject.toLowerCase().includes('gestion') || sanitizedSubject.toLowerCase().includes('confier')) {
      computedLeadType = 'Owner Enquiry';
    } else if (sanitizedSubject.toLowerCase().includes('estimation')) {
      computedLeadType = 'Valuation Request';
    } else if (sanitizedSubject.toLowerCase().includes('vente')) {
      computedLeadType = 'Seller Request';
    }

    // Append lead to Central Database Store & Supabase
    const db = getDb();

    let resolvedBudget = budget ? sanitizeInjection(budget) : undefined;
    let resolvedSurface = surface ? sanitizeInjection(surface) : undefined;
    let resolvedAddress = propertyTitle || (propertySlug ? `Propriété: ${propertySlug}` : undefined);

    // If linked to a property, increment enquiries_count and enrich lead
    if (propertyId || propertySlug) {
      const prop = db.properties.find((p: any) => p.id === propertyId || p.slug === propertySlug);
      if (prop) {
        prop.enquiriesCount = (Number(prop.enquiriesCount) || 0) + 1;
        resolvedAddress = `${prop.title} (${prop.reference || prop.id})`;
        if (!resolvedBudget) {
          resolvedBudget = `${prop.price?.toLocaleString('fr-FR')} €/mois`;
        }
        if (!resolvedSurface) {
          resolvedSurface = `${prop.surface} m² • ${prop.rooms || 1} pièces`;
        }
      }
    }

    const newLead: CRMLead = {
      id: `lead_${Date.now()}`,
      name: sanitizedName,
      email: cleanEmail || '',
      phone: cleanPhone || '',
      leadType: computedLeadType,
      serviceType: project || undefined,
      preferredTimeSlot: timeSlot || undefined,
      status: 'NEW',
      subject: sanitizedSubject,
      message: sanitizedMessage,
      propertyAddress: resolvedAddress,
      budget: resolvedBudget,
      surface: resolvedSurface,
      source: customSource || (timeSlot ? 'Demande de Rappel Modal' : (propertySlug ? 'Page Détail Bien' : 'Formulaire de Contact Frontend')),
      assignedTo: 'Paul & Edgar Goizet',
      createdAt: new Date().toISOString(),
      notes: [],
      activities: [
        { id: `act_${Date.now()}`, text: `Demande (${computedLeadType}) soumise depuis le site public.`, date: 'À l\'instant' }
      ]
    };

    db.leads.unshift(newLead);
    saveDb(db);

    // Push to MySQL Database
    try {
      const { mysqlDb } = await import('@/lib/mysql');
      await mysqlDb.from('crm_leads').insert({
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

      // Increment enquiries_count on MySQL properties table
      if (propertyId || propertySlug) {
        let propQuery = mysqlDb.from('properties').select('id, enquiries_count');
        if (propertyId) propQuery = propQuery.eq('id', propertyId);
        else if (propertySlug) propQuery = propQuery.eq('slug', propertySlug);

        const { data: propData } = await propQuery.maybeSingle();
        if (propData) {
          const currentCount = Number(propData.enquiries_count) || 0;
          await mysqlDb
            .from('properties')
            .update({ enquiries_count: currentCount + 1, updated_at: new Date().toISOString() })
            .eq('id', propData.id);
        }
      }

      await mysqlDb.from('activity_logs').insert({
        id: `log_${Date.now()}`,
        user_name: sanitizedName,
        action: propertySlug ? `a envoyé une demande de visite pour ${propertyTitle || propertySlug}` : 'a envoyé un message de contact depuis le site public',
        object: propertyTitle || sanitizedSubject,
        timestamp: new Date().toISOString()
      });
    } catch (sqlErr) {
      console.warn('MySQL sync warning in contact route:', sqlErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Votre demande a été transmise au CRM Goizet Gestion.',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        error: language === 'en'
          ? 'A server error occurred. Please try again.'
          : 'Une erreur serveur est survenue. Traitement sécurisé.' 
      },
      { status: 500 }
    );
  }
}
