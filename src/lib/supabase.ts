/**
 * GOIZET GESTION - Central Database Client
 * The system is 100% integrated with MySQL (OVH).
 * Supabase has been completely removed.
 * This file routes all queries directly to MySQL while maintaining API compatibility.
 */
import { ovhDb } from './ovh_client';

// Primary MySQL Database Client
export const mysqlDb: any = ovhDb;
export const dbClient: any = ovhDb;
export const supabase: any = ovhDb; // Aliased so all routes work seamlessly with MySQL

export function withTimeout<T = any>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database network timeout')), ms)
    )
  ]);
}
