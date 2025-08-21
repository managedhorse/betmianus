// /api/check-email.js
import { createClient } from '@supabase/supabase-js';

const URL = process.env.VITE_SUPABASE_URL;               // <- from your Vercel env
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY; // <- from your Vercel env

const admin = URL && SERVICE_ROLE
  ? createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } })
  : null;

export default async function handler(req, res) {
  // Always respond 200 so the client can continue gracefully
  if (req.method !== 'POST') {
    return res.status(200).json({ exists: false, providers: [], note: 'bad_method' });
  }

  // Body might be a string on some hosts
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const email = (body.email || '').trim().toLowerCase();
  if (!email) return res.status(200).json({ exists: false, providers: [], note: 'missing_email' });

  if (!admin) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(200).json({ exists: false, providers: [], note: 'server_misconfigured' });
  }

  try {
    const { data, error } = await admin.auth.admin.getUserByEmail(email);

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
