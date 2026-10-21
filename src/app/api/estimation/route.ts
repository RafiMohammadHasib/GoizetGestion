import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInjection, isValidEmail, isValidPhone, checkRateLimit } from '@/lib/security';
import { getDb, saveDb, CRMLead } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const language = body?.language === 'en' ? 'en' : 'fr';

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: language === 'en' ? 'Too many requests. Please wait a moment.' : 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
      );
    }

    const { propertyType, surface, rooms, neighborhood, email, phone } = body;
    const rawName = body.name || [body.firstName, body.lastName].filter(Boolean).join(' ') || '';

    const sanitizedName = sanitizeInjection(rawName);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!sanitizedName || sanitizedName.length < 2 || !isValidEmail(cleanEmail)) {
      return NextResponse.json({ 
        error: language === 'en' ? 'Invalid name or email address.' : 'Identifiants ou email invalides.' 
      }, { status: 400 });
    }

    if (cleanPhone && !isValidPhone(cleanPhone)) {
      return NextResponse.json({
        error: language === 'en' ? 'Invalid phone number.' : 'Numéro de téléphone invalide.'
      }, { status: 400 });
    }

    const surfNum = parseInt(surface, 10) || 50;
    const estMin = Math.round(surfNum * 14.5 * 0.95);
    const estMax = Math.round(surfNum * 17.5 * 1.05);

    const propLabel = propertyType || 'Appartement';
    const districtLabel = neighborhood || 'Bordeaux Centre';
    const formattedAddress = `${propLabel} • ${districtLabel}, Bordeaux`;

    // Save lead to CRM database
    const db = getDb();
    const entropy = Math.random().toString(36).substring(2, 7);
    const newLead: CRMLead = {
      id: `lead_${Date.now()}_${entropy}`,
      name: sanitizedName,
      email: cleanEmail,
      phone: cleanPhone || 'Non renseigné',
      leadType: 'Valuation Request',
      status: 'NEW',
      propertyAddress: formattedAddress,
      budget: `Est. ${estMin} € - ${estMax} € / mois`,
      surface: `${surfNum} m² • ${rooms || 2} pièces`,
      subject: `Estimation Loyer: ${propLabel} (${surfNum} m²) à ${districtLabel}`,
      message: `Formulaire d'estimation propriétaire reçu. Bien: ${propLabel}, Surface: ${surfNum} m², Pièces: ${rooms || 2}, Quartier: ${districtLabel}. Loyer estimé: ${estMin} € à ${estMax} € / mois.`,
      source: 'Calculateur Estimation En Ligne',
      assignedTo: 'Paul & Edgar Goizet',
      createdAt: new Date().toISOString(),
      notes: [
        { id: `note_${Date.now()}`, author: 'Calculateur Goizet', text: `Estimation indicative: ${estMin} € - ${estMax} € / mois (${surfNum} m² à ${districtLabel}).`, date: 'À l\'instant' }
      ],
      activities: [
        { id: `act_${Date.now()}`, text: 'Formulaire d\'estimation propriétaire soumis.', date: 'À l\'instant' }
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
        action: `a calculé une estimation loyer (${estMin}€ - ${estMax}€/mois)`,
        object: newLead.propertyAddress || 'Bordeaux',
        timestamp: new Date().toISOString()
      });
    } catch (sqlErr) {
      console.warn('MySQL sync warning in estimation route:', sqlErr);
    }

    return NextResponse.json({
      success: true,
      estimationMin: estMin,
      estimationMax: estMax,
      estimation: {
        min: estMin,
        max: estMax,
        unit: '€ / mois'
      },
      valuation: {
        rentMin: estMin,
        rentMax: estMax,
        saleMin: Math.round(surfNum * 4600 * 0.95),
        saleMax: Math.round(surfNum * 5400 * 1.05)
      },
      message: 'Votre estimation a été calculée et enregistrée en CRM.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du calcul d\'estimation.' }, { status: 500 });
  }
}
