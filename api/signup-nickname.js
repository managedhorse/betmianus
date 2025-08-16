// /api/signup-nickname.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(url, service, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    // basic username validation
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    // ensure not taken
    const { data: existing } = await admin.from('profiles').select('id').eq('username', username).single();
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    const pseudoEmail = `${username}@betmian.us.invalid`;

    // create auth user and confirm immediately (no email flow)
    const { data, error } = await admin.auth.admin.createUser({
      email: pseudoEmail,
      password,
      email_confirm: true,
      user_metadata: { username, signup_method: 'nickname' }
    });
    if (error) return res.status(400).json({ error: error.message });

    // Return minimal OK
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}