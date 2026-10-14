import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gflxxtsgqmznnpjkgjpg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YjirgmGKhMPnNkJOkDtSmg_2gQwDdiV';

export const supabase = createClient(supabaseUrl, supabaseKey);

export function withTimeout<T>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase network timeout')), ms)
    )
  ]);
}
