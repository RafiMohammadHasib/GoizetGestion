const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gflxxtsgqmznnpjkgjpg.supabase.co';
const supabaseKey = 'sb_publishable_YjirgmGKhMPnNkJOkDtSmg_2gQwDdiV';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Keys in Supabase row:', Object.keys(data[0]));
  console.log('Sample row:', JSON.stringify(data[0], null, 2));
}

check();
