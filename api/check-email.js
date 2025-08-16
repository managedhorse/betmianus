// /api/check-email.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-side only!

const admin = createClient(url, service, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    // Get the single user (if any) for this email
    const { data, error } = await admin.auth.admin.getUserByEmail(email);

    // Supabase throws/not-found differently across versions; normalize to "exists: false"
    if (error && /not\s*found/i.test(error.message || '')) {
      return res.status(200).json({ exists: false, providers: [] });
    }
    if (error) return res.status(500).json({ error: error.message });

    const providers = (data?.user?.identities || []).map(i => i.provider); // e.g. ["google"] or ["email","google"]
    return res.status(200).json({ exists: !!data?.user, providers });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}