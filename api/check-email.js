// /api/check-email.js
import { createClient } from '@supabase/supabase-js';

const url =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL; // allow either; use one in Vercel

const service = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST be set (server-only)

if (!url || !service) {
  // Helps catch misconfig in logs immediately
  console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const admin = createClient(url, service, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const { data, error } = await admin.auth.admin.getUserByEmail(email);

    // When not found, Supabase either returns null user OR an error depending on version.
    if (error && /not\s*found/i.test(error.message || '')) {
      return res.status(200).json({ exists: false, providers: [] });
    }
    if (error) {
      console.error('getUserByEmail error:', error);
      return res.status(200).json({ exists: false, providers: [], note: 'lookup_error' });
    }

    const providers = (data?.user?.identities || []).map(i => i.provider); // e.g. ["google"], ["email","google"]
    return res.status(200).json({ exists: !!data?.user, providers });
  } catch (e) {
    console.error('check-email unexpected error:', e);
    // Still normalize to 200 so the client can proceed (and you see logs)
    return res.status(200).json({ exists: false, providers: [], note: 'server_error' });
  }
}
