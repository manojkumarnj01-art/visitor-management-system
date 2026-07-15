import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[VMS Supabase] Supabase credentials not found in environment variables.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Expose globally for integration with classic scripts like app.js
window.supabaseClient = supabaseClient;
window.supabase = {
  createClient: (url, key) => createClient(url || supabaseUrl, key || supabaseAnonKey)
};
