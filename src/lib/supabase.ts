import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gflxxtsgqmznnpjkgjpg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YjirgmGKhMPnNkJOkDtSmg_2gQwDdiV';

export const supabase = createClient(supabaseUrl, supabaseKey);
