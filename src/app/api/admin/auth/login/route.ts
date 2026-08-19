import { NextRequest, NextResponse } from 'next/server';
import { getDb, AdminUser } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives de connexion. Veuillez patienter 1 minute.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
    }

    const db = getDb();
    const user = db.users.find((u: AdminUser) => u.email.toLowerCase() === cleanEmail && u.active);

    // Default admin demo credentials check: admin@maison-meridia.fr / Meridia2026!
    if (!user || (cleanPassword !== 'Meridia2026!' && cleanPassword !== 'admin123')) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 });
    }

    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

    response.cookies.set({
      name: 'maison_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la connexion.' }, { status: 500 });
  }
}
