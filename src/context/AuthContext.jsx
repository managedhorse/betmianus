//src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function dumpSbKeys(label = 'dump') {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sb-'));
    const entries = keys.map(k => [k, localStorage.getItem(k)]);
    console.debug('[AUTH]', label, { keys, entries });
    return { keys, entries };
  } catch (e) {
    console.debug('[AUTH]', label, 'localStorage not available', e?.message);
    return { keys: [], entries: [] };
  }
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const projectRef = useMemo(() => {
    try {
      // e.g. https://pdryhnlzpenhzwhcvodr.supabase.co -> pdryhnlzpenhzwhcvodr
      return new URL(import.meta.env.VITE_SUPABASE_URL).host.split('.')[0];
    } catch { return ''; }
  }, []);

  const sbKey = projectRef ? `sb-${projectRef}-auth-token` : null;

  const loadProfile = async (userId) => {
    const { data: p, error } = await supabase
      .from('profiles')
      .select('username, public_id')
      .eq('id', userId)
      .single();
    if (error) {
      console.debug('[AUTH] loadProfile error', error.message);
    }
    setProfile(p ?? null);
  };

  useEffect(() => {
    (async () => {
      console.debug('================ AUTH MOUNT ================');
      dumpSbKeys('mount:before getSession');
      const { data } = await supabase.auth.getSession();
      console.debug('[AUTH] getSession on mount =>', data.session ? 'HAS session' : 'NO session', data);
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }
      setAuthReady(true);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      console.debug('[AUTH] onAuthStateChange', { event, hasSession: !!sess, userId: sess?.user?.id });
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        await loadProfile(sess.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tiny retry if user exists but profile row not yet created by trigger
  useEffect(() => {
    if (user && !profile) {
      const t = setTimeout(() => {
        console.debug('[AUTH] retry loadProfile (profile still null)');
        loadProfile(user.id);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [user, profile]);

  const signOut = async () => {
    console.debug('================ SIGN OUT START ================');
    const before = await supabase.auth.getSession();
    console.debug('[AUTH] session BEFORE signOut', before);
    dumpSbKeys('before signOut');

    try {
      const res = await supabase.auth.signOut({ scope: 'global' });
      if (res.error) console.error('[AUTH] signOut error', res.error.message);
      else console.debug('[AUTH] signOut ok');
    } catch (e) {
      console.error('[AUTH] signOut threw', e?.message || e);
    }

    // Remove any lingering Supabase keys
    try {
      if (sbKey) localStorage.removeItem(sbKey);
      // Also nuke any other sb- keys for safety
      Object.keys(localStorage).forEach(k => { if (k.startsWith('sb-')) localStorage.removeItem(k); });
    } catch {}

    const after = await supabase.auth.getSession();
    console.debug('[AUTH] session AFTER local cleanup', after);
    dumpSbKeys('after cleanup');

    setSession(null);
    setUser(null);
    setProfile(null);

    // Hard replace so there’s zero chance of stale UI
    console.debug('[AUTH] redirecting to /');
    window.location.replace('/');
  };

  // Optional: on-screen debug toggle via ?debug=1
  const showOverlay = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  return (
    <AuthCtx.Provider value={{ session, user, profile, authReady, signOut }}>
      {children}
      {showOverlay && (
        <div style={{
          position: 'fixed', bottom: 8, left: 8, zIndex: 99999,
          background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '8px 10px',
          borderRadius: 8, fontSize: 12, maxWidth: 320, lineHeight: 1.3
        }}>
          <div><b>Auth Debug</b></div>
          <div>user: {user ? user.id : 'null'}</div>
          <div>email: {user?.email || '-'}</div>
          <div>profile: {profile ? JSON.stringify(profile) : 'null'}</div>
          <div>sbKey: {sbKey || '(none)'}</div>
          <div style={{ marginTop: 6 }}>
            <button
              onClick={() => dumpSbKeys('overlay click')}
              style={{ background: '#444', color: '#fff', border: 0, padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
            >
              Dump storage to console
            </button>
          </div>
        </div>
      )}
    </AuthCtx.Provider>
  );
}