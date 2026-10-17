import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';
import { getDb, saveDb, AgencySettings } from '@/lib/db';

const DEFAULT_SETTINGS: AgencySettings = {
  siteName: 'GOIZET GESTION',
  tagline: 'Immobilier & Gestion Locative à Bordeaux',
  phone: '+33 6 95 57 70 33',
  phoneEdgar: '+33 7 81 96 83 95',
  email: 'goizetgestion@gmail.com',
  leadEmail: 'goizetgestion@gmail.com',
  address: '48 rue Calvé, 33000 Bordeaux',
  openingHours: 'Lundi - Vendredi : 09h00 - 19h00 | Samedi : Sur rendez-vous',
  siret: '944 393 487 00011',
  licenseNumber: 'CPI33012025000000128 — CCI Bordeaux',
  financialGuarantee: 'Galian Assurances — 120 000 €',
  managementFeeRate: 6.5,
  defaultDepositMonths: 1,
  gliInsuranceRate: 2.5,
  autoReplyTenant: true,
  autoReplyOwner: true,
  maintenanceMode: false,
  sessionTimeoutHours: 24,
  rateLimitingStrict: true,
  instagramUrl: 'https://instagram.com/goizetgestion',
  linkedinUrl: 'https://linkedin.com/company/goizet-gestion',
  gaMeasurementId: 'G-GOIZET2026',
  gtmContainerId: 'GTM-GOIZET01',
  defaultSeoTitle: 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
  defaultMetaDescription: 'Maison de conseil immobilier et gestion locative sur-mesure à Bordeaux (Chartrons, Caudéran, Triangle d\'Or). Mandat transparent et rendement optimisé.',
  updatedAt: new Date().toISOString()
};

export async function GET() {
  try {
    const session = await getCurrentAdminSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const db = getDb();
    const settings: AgencySettings = db.settings || DEFAULT_SETTINGS;

    return NextResponse.json({
      success: true,
      settings,
      user: session.user
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentAdminSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const payload = await req.json();
    const db = getDb();

    const currentSettings = db.settings || DEFAULT_SETTINGS;

    // Merge and sanitize
    const updatedSettings: AgencySettings = {
      ...currentSettings,
      ...payload,
      managementFeeRate: Number(payload.managementFeeRate ?? currentSettings.managementFeeRate),
      defaultDepositMonths: Number(payload.defaultDepositMonths ?? currentSettings.defaultDepositMonths),
      gliInsuranceRate: Number(payload.gliInsuranceRate ?? currentSettings.gliInsuranceRate),
      sessionTimeoutHours: Number(payload.sessionTimeoutHours ?? currentSettings.sessionTimeoutHours),
      autoReplyTenant: Boolean(payload.autoReplyTenant ?? currentSettings.autoReplyTenant),
      autoReplyOwner: Boolean(payload.autoReplyOwner ?? currentSettings.autoReplyOwner),
      maintenanceMode: Boolean(payload.maintenanceMode ?? currentSettings.maintenanceMode),
      rateLimitingStrict: Boolean(payload.rateLimitingStrict ?? currentSettings.rateLimitingStrict),
      updatedAt: new Date().toISOString()
    };

    db.settings = updatedSettings;

    // Record audit log
    if (!db.activityLogs) db.activityLogs = [];
    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      user: session.user.name || 'Administrateur',
      action: 'a mis à jour les configurations et règles de gestion',
      object: 'Paramètres Agence',
      timestamp: new Date().toISOString()
    });

    saveDb(db);

    // Sync with OVH MySQL if bridge is connected
    try {
      const { ovhQuery } = await import('@/lib/ovh_client');
      await ovhQuery('agency_settings').upsert({
        id: 1,
        site_name: updatedSettings.siteName,
        tagline: updatedSettings.tagline,
        phone: updatedSettings.phone,
        phone_edgar: updatedSettings.phoneEdgar,
        email: updatedSettings.email,
        lead_email: updatedSettings.leadEmail,
        address: updatedSettings.address,
        opening_hours: updatedSettings.openingHours,
        siret: updatedSettings.siret,
        license_number: updatedSettings.licenseNumber,
        financial_guarantee: updatedSettings.financialGuarantee,
        management_fee_rate: updatedSettings.managementFeeRate,
        default_deposit_months: updatedSettings.defaultDepositMonths,
        gli_insurance_rate: updatedSettings.gliInsuranceRate,
        auto_reply_tenant: updatedSettings.autoReplyTenant ? 1 : 0,
        auto_reply_owner: updatedSettings.autoReplyOwner ? 1 : 0,
        maintenance_mode: updatedSettings.maintenanceMode ? 1 : 0,
        session_timeout_hours: updatedSettings.sessionTimeoutHours,
        rate_limiting_strict: updatedSettings.rateLimitingStrict ? 1 : 0,
        instagram_url: updatedSettings.instagramUrl,
        linkedin_url: updatedSettings.linkedinUrl,
        ga_measurement_id: updatedSettings.gaMeasurementId,
        gtm_container_id: updatedSettings.gtmContainerId,
        default_seo_title: updatedSettings.defaultSeoTitle,
        default_meta_description: updatedSettings.defaultMetaDescription,
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    } catch {
      // Non-blocking fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Paramètres enregistrés avec succès !',
      settings: updatedSettings
    });
  } catch (error: any) {
    console.error('Settings save error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement des paramètres.' },
      { status: 500 }
    );
  }
}
