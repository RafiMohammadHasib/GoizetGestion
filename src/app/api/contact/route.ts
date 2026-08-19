import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInjection, isValidEmail, isValidPhone, checkRateLimit } from '@/lib/security';
import { getDb, saveDb, CRMLead } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();
    const { fullName, name, email, phone, subject, message } = body;

    const sanitizedName = sanitizeInjection(fullName || name || '');
    const sanitizedSubject = sanitizeInjection(subject || 'Demande de contact');
    const sanitizedMessage = sanitizeInjection(message || '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json({ error: 'Le nom complet est obligatoire.' }, { status: 400 });
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    // Append lead to Central Database Store
    const db = getDb();
    const newLead: CRMLead = {
      id: `lead_${Date.now()}`,
      name: sanitizedName,
      email: cleanEmail,
      phone: cleanPhone || 'Non renseigné',
      leadType: 'Contact Message',
      status: 'NEW',
      subject: sanitizedSubject,
      message: sanitizedMessage,
      source: 'Formulaire de Contact Frontend',
      assignedTo: 'Alexandre de Saint-Clair',
      createdAt: new Date().toISOString(),
      notes: [],
      activities: [
        { id: `act_${Date.now()}`, text: 'Formulaire soumis depuis le site public.', date: 'À l\'instant' }
      ]
    };

    db.leads.unshift(newLead);
    saveDb(db);

    return NextResponse.json(
      {
        success: true,
        message: 'Votre demande a été transmise au CRM Maison Méridia.',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue. Traitement sécurisé.' },
      { status: 500 }
    );
  }
}
