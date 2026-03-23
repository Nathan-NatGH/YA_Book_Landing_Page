
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://vsd6ipt7k7hl7tzkmydqhg.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_6c2Rd92lLqrDf73u2L-vSw__daS9VZW";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  const testEmail = `test-${Date.now()}@example.com`;

  try {
    const { data: tableData, error: tableError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Table Error:', tableError.message);
    } else {
      console.log('Table exists! Data:', tableData);
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}

testSupabase();
