// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a custom storage key so nothing else messes with the default sb-<ref>-auth-token
export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'bm-auth-v1', // <— custom key for your app
  },
});