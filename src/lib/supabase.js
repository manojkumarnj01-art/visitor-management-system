import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[VMS Supabase] Supabase credentials not found in environment variables. Local mock mode enabled."
  );
} else {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("[VMS Supabase] Failed to initialize Supabase client:", err);
  }
}

export const supabaseClient = client;
window.supabaseClient = client;
window.supabase = {
  createClient: (url, key) => {
    const finalUrl = url || supabaseUrl;
    const finalKey = key || supabaseAnonKey;
    if (!finalUrl || !finalKey) {
      console.warn("[VMS Supabase] Cannot create client: missing URL or Key.");
      return null;
    }
    try {
      return createClient(finalUrl, finalKey);
    } catch (err) {
      console.error("[VMS Supabase] createClient failed:", err);
      return null;
    }
  }
};