// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function removeSupabaseKeys(projectRef) {
  try {
    // Default keys Supabase uses; plus our custom key
    const defaults = [
      `sb-${projectRef}-auth-token`,
      `sb-${projectRef}-persist-session`,
      'bm-auth-v1', // our custom key from supabaseClient.js
    ];
    defaults.forEach((k) => localStorage.removeItem(k));
    // And remove any other sb-* leftovers for good measure
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('sb-')) localStorage.removeItem(k);
    });
  } catch {}
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const projectRef = useMemo(() => {
    try {
      return new URL(import.meta.env.VITE_SUPABASE_URL).host.split('.')[0]; // e.g. pdryhnlzpenhzwhcvodr
    } catch { return ''; }
  }, []);

  const loadProfile = async (userId) => {
    const { data: p } = await supabase
      .from('profiles')
      .select('username, public_id')
      .eq('id', userId)
      .single();
    setProfile(p ?? null);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setAuthReady(true);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, sess) => {
        setSession(sess ?? null);
        setUser(sess?.user ?? null);
        if (sess?.user) await loadProfile(sess.user.id);
        else setProfile(null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Small retry if profile row was created by trigger and not yet visible
  useEffect(() => {
    if (user && !profile) {
      const t = setTimeout(() => loadProfile(user.id), 800);
      return () => clearTimeout(t);
    }
  }, [user, profile]);

  const signOut = async () => {
    // 1) Synchronously remove keys BEFORE calling Supabase (avoid any race)
    removeSupabaseKeys(projectRef);

    // 2) Ask Supabase to revoke tokens everywhere
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error('Supabase signOut error:', e?.message || e);
    }

    // 3) Remove keys AGAIN (just in case the SDK re-wrote during signOut)
    removeSupabaseKeys(projectRef);

    // 4) Reset in-memory state
    setSession(null);
    setUser(null);
    setProfile(null);

    // 5) Hard reload to guarantee the UI remounts without any cached state
    window.location.replace('/');
  };

  return (
    <AuthCtx.Provider value={{ session, user, profile, authReady, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
