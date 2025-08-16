// /api/login-username.js
const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body ?? {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  // For nickname-only accounts we used pseudo email:
  const pseudoEmail = `${username}@betmian.us.invalid`;

  // Exchange using GoTrue password grant
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: anon },
    body: JSON.stringify({ email: pseudoEmail, password })
  });

  if (!r.ok) return res.status(400).json({ error: 'Invalid credentials' });
  const session = await r.json();
  return res.status(200).json(session);
}