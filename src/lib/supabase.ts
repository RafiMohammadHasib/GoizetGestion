import { createClient } from '@supabase/supabase-js';
import { ovhDb } from './ovh_client';

// The system has migrated to MySQL. Default to MySQL unless explicitly configured for 'supabase'
const provider = (process.env.DATABASE_PROVIDER || 'mysql').toLowerCase();
const useSupabase = provider === 'supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gflxxtsgqmznnpjkgjpg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YjirgmGKhMPnNkJOkDtSmg_2gQwDdiV';

const supabaseClient = useSupabase ? createClient(supabaseUrl, supabaseKey) : null;

// Primary Database Client (MySQL default)
export const dbClient: any = useSupabase && supabaseClient ? supabaseClient : ovhDb;
export const supabase: any = dbClient; // Kept for backwards compatibility across routes

export function withTimeout<T = any>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database network timeout')), ms)
    )
  ]);
}
