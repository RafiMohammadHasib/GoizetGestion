/**
 * GOIZET GESTION - Official MySQL Database Client (OVH Cloud)
 */
import { ovhDb, from, pingBridge, installTables } from './ovh_client';

export const mysqlDb = ovhDb;
export const db = ovhDb;
export { from, pingBridge, installTables };

export function withTimeout<T = any>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('MySQL network timeout')), ms)
    )
  ]);
}
