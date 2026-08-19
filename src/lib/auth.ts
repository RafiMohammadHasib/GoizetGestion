import { cookies } from 'next/headers';
import { getDb, AdminUser } from './db';

const SESSION_COOKIE_NAME = 'maison_admin_session';

export interface AdminSession {
  user: AdminUser;
  expiresAt: number;
}

export function createSessionToken(user: AdminUser): string {
  return Buffer.from(JSON.stringify({
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  })).toString('base64');
}

export function parseSessionToken(token: string): { userId: string; role: string; expiresAt: number } | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie || !sessionCookie.value) return null;

  const parsed = parseSessionToken(sessionCookie.value);
  if (!parsed) return null;

  const db = getDb();
  const user = db.users.find((u: AdminUser) => u.id === parsed.userId && u.active);
  if (!user) return null;

  return {
    user,
    expiresAt: parsed.expiresAt
  };
}

// Role-based permissions grid
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Super Admin': ['*'],
  'Administrator': [
    'properties.*', 'leads.*', 'owners.*', 'tenants.*', 'blog.*', 'cms.*', 'media.*', 'seo.*', 'users.view'
  ],
  'Property Manager': [
    'properties.*', 'owners.*', 'tenants.*', 'leads.view', 'leads.edit'
  ],
  'Content Manager': [
    'blog.*', 'cms.*', 'media.*', 'seo.*', 'properties.view'
  ],
  'Sales Agent': [
    'leads.*', 'owners.view', 'tenants.view', 'properties.view'
  ],
  'Editor': [
    'blog.edit', 'cms.edit', 'media.upload'
  ]
};

export function hasPermission(role: string, permission: string): boolean {
  if (role === 'Super Admin') return true;
  const userPerms = ROLE_PERMISSIONS[role] || [];
  if (userPerms.includes('*')) return true;
  if (userPerms.includes(permission)) return true;
  
  // Wildcard check e.g. properties.*
  const scope = permission.split('.')[0];
  if (userPerms.includes(`${scope}.*`)) return true;
  
  return false;
}
