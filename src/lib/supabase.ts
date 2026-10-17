import { createClient } from '@supabase/supabase-js';
import { ovhDb } from './ovh_client';

const provider = process.env.DATABASE_PROVIDER || 'supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gflxxtsgqmznnpjkgjpg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YjirgmGKhMPnNkJOkDtSmg_2gQwDdiV';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

// If DATABASE_PROVIDER is 'ovh', use the OVH MySQL bridge; otherwise use Supabase
export const supabase: any = provider === 'ovh' ? ovhDb : supabaseClient;

export function withTimeout<T = any>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database network timeout')), ms)
    )
  ]);
}
