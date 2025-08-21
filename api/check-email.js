// /api/check-email.js
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!URL || !SERVICE_ROLE) return res.status(500).json({ error: 'Server misconfigured' });

  try {
    const { data, error } = await admin.auth.admin.getUserByEmail(email);

    // Not found is fine
    if (error && (error.status === 404 || /not found/i.test(error.message)))
      return res.status(200).json({ exists: false, providers: [] });

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
