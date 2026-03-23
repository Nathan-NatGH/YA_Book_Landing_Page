
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://erdbahuczgjgcvlylpna.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_6c2Rd92lLqrDf73u2L-vSw__daS9VZW";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  const testEmail = `test-${Date.now()}@example.com`;

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ email: testEmail }])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
    } else {
      console.log('Successfully inserted email only. Connection is working!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}

testSupabase();
