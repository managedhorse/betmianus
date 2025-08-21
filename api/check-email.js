// /api/check-email.js
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = URL && SERVICE_ROLE
  ? createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } })
  : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ exists: false, providers: [], note: 'bad_method' });
  }

  const raw = req.body?.email || '';
  const email = raw.trim().toLowerCase();
  if (!email) return res.status(200).json({ exists: false, providers: [], note: 'missing_email' });

  if (!admin) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(200).json({ exists: false, providers: [], note: 'server_misconfigured' });
  }

  try {
    const { data, error } = await admin.auth.admin.getUserByEmail(email);

    // Not found → exists: false
    if (error && (error.status === 404 || /not found/i.test(error.message))) {
      return res.status(200).json({ exists: false, providers: [] });
    }
    if (error) {
      console.error('getUserByEmail error:', error);
      return res.status(200).json({ exists: false, providers: [], note: 'server_error' });
    }

    const user = data?.user || null;
    const providers = (user?.identities || []).map(i => i.provider);
    return res.status(200).json({ exists: !!user, providers });
  } catch (e) {
    console.error('check-email unexpected error:', e);
    return res.status(200).json({ exists: false, providers: [], note: 'server_error' });
  }
}
