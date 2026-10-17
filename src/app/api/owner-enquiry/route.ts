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
            ? 'Too many requests. Please wait a moment before trying again.' 
            : 'Trop de requêtes. Veuillez patienter avant de réessayer.',
          errorCode: 'RATE_LIMIT'
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

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

    if (!cleanPhone || !isValidPhone(cleanPhone)) {
      return NextResponse.json({ 
        error: language === 'en' ? 'Invalid phone number.' : 'Numéro de téléphone invalide.',
        errorCode: 'INVALID_PHONE'
      }, { status: 400 });
    }

    const isEn = language === 'en';

    // Map serviceType to readable French/English label for subject
    const serviceLabels: Record<string, string> = {
      'Rental management': isEn ? '360° Rental Management' : 'Gestion Locative 360°',
      'Property letting': isEn ? 'Letting & Tenant Placement' : 'Mise en Location & Recherche Locataires',
      'Rent out my property': isEn ? 'Rent out my property (Owner)' : 'Louer mon bien (Propriétaire)',
      'Sell my property': isEn ? 'Sell my property (Owner)' : 'Vendre mon bien (Propriétaire)',
      'Rent a property': isEn ? 'Rent a property (Tenant)' : 'Louer un bien (Locataire)',
      'Buy a property': isEn ? 'Buy a property (Buyer)' : 'Acheter un bien (Acheteur)',
      'Rental valuation': isEn ? 'Rental Valuation & Yield' : 'Estimation Locative & Rendement',
      'Property sales': isEn ? 'Luxury Property Sales' : 'Vente Immobilière de Prestige'
    };

    const propTypeLabels: Record<string, string> = {
      'appartement': isEn ? 'Apartment' : 'Appartement',
      'maison': isEn ? 'House / Villa' : 'Maison',
      'immeuble': isEn ? 'Building' : 'Immeuble',
      'echoppe': isEn ? 'Échoppe' : 'Échoppe',
      'hotel-particulier': isEn ? 'Townhouse / Mansion' : 'Hôtel Particulier'
    };

    const displayPropType = propTypeLabels[sanitizedPropType.toLowerCase()] || sanitizedPropType;
    const displayService = serviceLabels[sanitizedService] || sanitizedService;
    const formattedLocation = sanitizedAddress 
      ? `${sanitizedAddress}, ${sanitizedNeighborhood}` 
      : sanitizedNeighborhood;

    const surfaceDisplay = surface ? `${surface} m²${rooms ? ` • ${rooms} ${isEn ? 'rooms' : 'pièces'}` : ''}` : '';

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
      ? (isEn
          ? `Search: ${displayService} (${displayPropType}${budget ? ` • Budget: ${budget} €` : ''})`
          : `Recherche: ${displayService} (${displayPropType}${budget ? ` • Budget: ${budget} €` : ''})`)
      : (isEn
          ? `File: ${displayService} (${displayPropType} in ${sanitizedNeighborhood})`
          : `Dossier: ${displayService} (${displayPropType} à ${sanitizedNeighborhood})`);

    const surfaceDisplayFinal = surfaceDisplay || (rooms ? `${rooms} ${isEn ? 'bdrm' : 'ch.'}` : undefined);

    const defaultMsg = isEn
      ? `${isClientSearch ? 'Client search' : 'Owner'} for: ${displayService}. Property: ${displayPropType}.${budget ? ` Budget: ${budget} €.` : ''}`
      : `${isClientSearch ? 'Client en recherche' : 'Propriétaire'} pour: ${displayService}. Bien: ${displayPropType}.${budget ? ` Budget: ${budget} €.` : ''}`;

    const newLead: CRMLead = {
      id: `lead_${Date.now()}`,
      name: sanitizedName,
      email: cleanEmail || '',
      phone: cleanPhone,
      leadType: resolvedLeadType,
      serviceType: sanitizedService,
      status: 'NEW',
      subject: leadSubject,
      message: sanitizedMessage || defaultMsg,
      propertyAddress: `${displayPropType} • ${formattedLocation}`,
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
          author: isClientSearch 
            ? (isEn ? 'Goizet Search Portal' : 'Portail Recherche Goizet') 
            : (isEn ? 'Goizet Owner Portal' : 'Portail Propriétaire Goizet'),
          text: isEn
            ? `Request received for ${displayService}. Guaranteed callback at ${cleanPhone}.`
            : `Demande reçue pour ${displayService}. Rappel garanti au ${cleanPhone}.`,
          date: isEn ? 'Just now' : 'À l\'instant'
        }
      ],
      activities: [
        {
          id: `act_${Date.now()}`,
          text: isEn
            ? `File (${displayService}) submitted from website.`
            : `Dossier (${displayService}) soumis depuis le site web.`,
          date: isEn ? 'Just now' : 'À l\'instant'
        }
      ]
    };

    // Save to Central In-Memory / JSON DB
    const db = getDb();
    db.leads.unshift(newLead);
    saveDb(db);

    // Sync to MySQL Database
    try {
      const { mysqlDb } = await import('@/lib/mysql');
      await mysqlDb.from('crm_leads').insert({
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

      await mysqlDb.from('activity_logs').insert({
        id: `log_${Date.now()}`,
        user_name: sanitizedName,
        action: `a soumis un dossier propriétaire pour ${displayService}`,
        object: newLead.propertyAddress || 'Bordeaux',
        timestamp: new Date().toISOString()
      });
    } catch (sqlErr) {
      console.warn('MySQL sync warning in owner-enquiry route:', sqlErr);
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
      { 
        error: language === 'en'
          ? 'A server error occurred while processing your request.'
          : 'Une erreur serveur est survenue lors de l\'enregistrement de votre demande.'
      },
      { status: 500 }
    );
  }
}
