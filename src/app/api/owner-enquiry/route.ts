import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInjection, isValidEmail, isValidPhone, checkRateLimit } from '@/lib/security';
import { getDb, saveDb, CRMLead } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter avant de réessayer.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();
    const { 
      name, 
      fullName, 
      email, 
      phone, 
      serviceType = 'Rental management', 
      propertyType = 'Appartement', 
      neighborhood = 'Bordeaux', 
      address = '', 
      surface = '', 
      rooms = '', 
      budget = '', 
      timeSlot = '', 
      message = '',
      source = 'Formulaire Confier mon bien'
    } = body;

    const rawName = fullName || name || '';
    const sanitizedName = sanitizeInjection(rawName);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const sanitizedAddress = sanitizeInjection(address);
    const sanitizedMessage = sanitizeInjection(message);
    const sanitizedService = sanitizeInjection(serviceType);
    const sanitizedPropType = sanitizeInjection(propertyType);
    const sanitizedNeighborhood = sanitizeInjection(neighborhood);

    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json({ error: 'Le nom complet est obligatoire.' }, { status: 400 });
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    if (!cleanPhone || !isValidPhone(cleanPhone)) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 400 });
    }

    // Map serviceType to readable French/English label for subject
    const serviceLabels: Record<string, string> = {
      'Rental management': 'Gestion Locative 360°',
      'Property letting': 'Mise en Location & Recherche Locataires',
      'Rent out my property': 'Louer mon bien (Propriétaire)',
      'Sell my property': 'Vendre mon bien (Propriétaire)',
      'Rent a property': 'Louer un bien (Locataire)',
      'Buy a property': 'Acheter un bien (Acheteur)',
      'Rental valuation': 'Estimation Locative & Rendement',
      'Property sales': 'Vente Immobilière de Prestige'
    };

    const displayService = serviceLabels[sanitizedService] || sanitizedService;
    const formattedLocation = sanitizedAddress 
      ? `${sanitizedAddress}, ${sanitizedNeighborhood}` 
      : sanitizedNeighborhood;

    const surfaceDisplay = surface ? `${surface} m²${rooms ? ` • ${rooms} pièces` : ''}` : '';

    let resolvedLeadType: CRMLead['leadType'] = 'Owner Enquiry';
    if (sanitizedService === 'Sell my property' || sanitizedService === 'Property sales') {
      resolvedLeadType = 'Seller Request';
    } else if (sanitizedService === 'Buy a property') {
      resolvedLeadType = 'Buyer Request';
    } else if (sanitizedService === 'Rent a property') {
      resolvedLeadType = 'Tenant Request';
    } else if (sanitizedService === 'Rental valuation') {
      resolvedLeadType = 'Valuation Request';
    }

    const isClientSearch = resolvedLeadType === 'Tenant Request' || resolvedLeadType === 'Buyer Request';
    const leadSubject = isClientSearch 
      ? `Recherche: ${displayService} (${sanitizedPropType}${budget ? ` • Budget: ${budget} €` : ''})`
      : `Dossier: ${displayService} (${sanitizedPropType} à ${sanitizedNeighborhood})`;

    const surfaceDisplayFinal = surfaceDisplay || (rooms ? `${rooms} ch.` : undefined);

    const newLead: CRMLead = {
      id: `lead_${Date.now()}`,
      name: sanitizedName,
      email: cleanEmail || `${cleanPhone.replace(/\D/g, '')}@lead.goizet.fr`,
      phone: cleanPhone,
      leadType: resolvedLeadType,
      serviceType: sanitizedService,
      status: 'NEW',
      subject: leadSubject,
      message: sanitizedMessage || `${isClientSearch ? 'Client en recherche' : 'Propriétaire'} pour: ${displayService}. Bien: ${sanitizedPropType}.${budget ? ` Budget: ${budget} €.` : ''}`,
      propertyAddress: `${sanitizedPropType} • ${formattedLocation}`,
      propertyType: sanitizedPropType,
      budget: budget ? `${budget} €` : undefined,
      surface: surfaceDisplayFinal,
      preferredTimeSlot: timeSlot || undefined,
      source: source,
      assignedTo: 'Paul & Edgar Goizet',
      createdAt: new Date().toISOString(),
      notes: [
        {
          id: `note_${Date.now()}`,
          author: isClientSearch ? 'Portail Recherche Goizet' : 'Portail Propriétaire Goizet',
          text: `Demande reçue pour ${displayService}. Rappel garanti au ${cleanPhone}.`,
          date: 'À l\'instant'
        }
      ],
      activities: [
        {
          id: `act_${Date.now()}`,
          text: `Dossier (${displayService}) soumis depuis le site web.`,
          date: 'À l\'instant'
        }
      ]
    };

    // Save to Central In-Memory / JSON DB
    const db = getDb();
    db.leads.unshift(newLead);
    saveDb(db);

    // Sync to Supabase
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('crm_leads').insert({
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        lead_type: newLead.leadType,
        status: newLead.status,
        subject: newLead.subject,
        message: newLead.message,
        property_address: newLead.propertyAddress,
        budget: newLead.budget,
        surface: newLead.surface,
        source: newLead.source,
        assigned_to: newLead.assignedTo,
        created_at: newLead.createdAt,
        notes: newLead.notes,
        activities: newLead.activities
      });

      await supabase.from('activity_logs').insert({
        id: `log_${Date.now()}`,
        user_name: sanitizedName,
        action: `a soumis un dossier propriétaire pour ${displayService}`,
        object: newLead.propertyAddress || 'Bordeaux',
        timestamp: new Date().toISOString()
      });
    } catch (sbErr) {
      console.warn('Supabase sync warning in owner-enquiry route:', sbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Votre dossier a été transmis avec succès à la direction de Goizet Gestion. Nous vous recontactons sous 2 heures.',
        leadId: newLead.id,
        service: displayService
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Owner enquiry submission error:', error);
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue lors de l\'enregistrement de votre demande.' },
      { status: 500 }
    );
  }
}
