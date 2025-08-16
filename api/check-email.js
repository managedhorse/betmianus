// /api/check-email.js
import { createClient } from '@supabase/supabase-js';

// Use either SUPABASE_URL (preferred) or your existing VITE_SUPABASE_URL
const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only

// Optional: keep a client for future admin ops (not used below)
createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!URL || !SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Use the GoTrue Admin REST endpoint directly (works across versions)
    const r = await fetch(
      `${URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Some deployments return {users:[...]}, others return an array directly
    const json = await r.json().catch(() => ({}));
    const users = Array.isArray(json?.users) ? json.users : Array.isArray(json) ? json : [];

    const user = users[0] || null;
    const providers = (user?.identities || []).map((i) => i.provider); // e.g. ["google"] or ["email","google"]

    return res.status(200).json({ exists: !!user, providers });
  } catch (e) {
    console.error('check-email unexpected error:', e);
    // Normalize to a safe "no" so the client doesn’t explode
    return res.status(200).json({ exists: false, providers: [], note: 'server_error' });
  }
}
