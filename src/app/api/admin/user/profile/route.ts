import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';
import { getDb, saveDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentAdminSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const payload = await req.json();
    const { name, phone, notifyLead, notifyTenant, notifyReport } = payload;

    const cleanName = (name || '').trim();
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Le nom complet est obligatoire.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const userIndex = (db.users || []).findIndex(
      (u: any) => u.id === session.user.id || u.email.toLowerCase() === session.user.email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable.' },
        { status: 404 }
      );
    }

    db.users[userIndex].name = cleanName;
    if (phone !== undefined) db.users[userIndex].phone = phone;
    if (notifyLead !== undefined) db.users[userIndex].notifyLead = Boolean(notifyLead);
    if (notifyTenant !== undefined) db.users[userIndex].notifyTenant = Boolean(notifyTenant);
    if (notifyReport !== undefined) db.users[userIndex].notifyReport = Boolean(notifyReport);
    db.users[userIndex].updatedAt = new Date().toISOString();

    // Log activity
    if (!db.activityLogs) db.activityLogs = [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      user: cleanName,
      action: 'a mis à jour son profil administrateur',
      object: 'Profil & Notifications',
      timestamp: new Date().toISOString()
    });

    saveDb(db);

    // Sync user in OVH MySQL
    try {
      const { ovhQuery } = await import('@/lib/ovh_client');
      await ovhQuery('admin_users').eq('id', db.users[userIndex].id).update({
        name: cleanName
      });
    } catch {
      // Non-blocking fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Profil administrateur mis à jour avec succès !',
      user: {
        id: db.users[userIndex].id,
        name: db.users[userIndex].name,
        email: db.users[userIndex].email,
        phone: db.users[userIndex].phone,
        role: db.users[userIndex].role,
        avatar: db.users[userIndex].avatar,
        notifyLead: db.users[userIndex].notifyLead,
        notifyTenant: db.users[userIndex].notifyTenant,
        notifyReport: db.users[userIndex].notifyReport
      }
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil.' },
      { status: 500 }
    );
  }
}
