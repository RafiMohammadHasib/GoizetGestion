import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInjection, isValidEmail, isValidPhone, checkRateLimit } from '@/lib/security';
import { getDb, saveDb, CRMLead } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { propertyType, surface, rooms, neighborhood, name, email, phone } = body;

    const sanitizedName = sanitizeInjection(name || '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!sanitizedName || !isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Identifiants ou email invalides.' }, { status: 400 });
    }

    const surfNum = parseInt(surface, 10) || 50;
    const estMin = Math.round(surfNum * 14.5 * 0.95);
    const estMax = Math.round(surfNum * 17.5 * 1.05);

    // Save lead to CRM database
    const db = getDb();
    const newLead: CRMLead = {
      id: `lead_${Date.now()}`,
      name: sanitizedName,
      email: cleanEmail,
      phone: cleanPhone || 'Non renseigné',
      leadType: 'Valuation Request',
      status: 'NEW',
      propertyAddress: `Secteur ${neighborhood || 'Bordeaux'}`,
      budget: `Est. ${estMin} € - ${estMax} € / mois`,
      surface: `${surfNum} m² (${rooms || 2} pièces)`,
      source: 'Calculateur Estimation En Ligne',
      assignedTo: 'Alexandre de Saint-Clair',
      createdAt: new Date().toISOString(),
      notes: [
        { id: `note_${Date.now()}`, author: 'Système Estimation', text: `Fourchette calculée: ${estMin} € - ${estMax} € / mo`, date: 'À l\'instant' }
      ],
      activities: [
        { id: `act_${Date.now()}`, text: 'Demande d\'estimation enregistrée.', date: 'À l\'instant' }
      ]
    };

    db.leads.unshift(newLead);
    saveDb(db);

    return NextResponse.json({
      success: true,
      estimationMin: estMin,
      estimationMax: estMax,
      message: 'Votre estimation a été calculée et enregistrée en CRM.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du calcul d\'estimation.' }, { status: 500 });
  }
}
