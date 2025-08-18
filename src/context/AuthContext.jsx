// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

// Remove Supabase localStorage keys (plus any "sb-*" leftovers)
function removeSupabaseKeys(projectRef) {
  try {
    const defaults = [
      `sb-${projectRef}-auth-token`,
      `sb-${projectRef}-persist-session`,
      'bm-auth-v1', // if you set a custom key in supabaseClient
    ];
    defaults.forEach((k) => localStorage.removeItem(k));
    // Defensive: clear any other sb-* keys
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('sb-')) localStorage.removeItem(k);
    }
  } catch {
    // ignore storage errors (Safari private mode, etc.)
  }
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Derive the project ref from your Supabase URL (e.g., pdryhnlzpenhzwhcvodr)
  const projectRef = useMemo(() => {
    try {
      return new URL(import.meta.env.VITE_SUPABASE_URL).host.split('.')[0];
    } catch {
      return '';
    }
  }, []);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) return setProfile(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('username, public_id')
      .eq('id', userId)
      .maybeSingle(); // returns null instead of throwing when no row exists

    if (error) {
      // You can log for diagnostics if you like:
      // console.warn('loadProfile error:', error);
      setProfile(null);
      return;
    }
    setProfile(data ?? null);
  }, []);

  // Initial session + subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      const sess = data?.session ?? null;
      setSession(sess);
      setUser(sess?.user ?? null);

      if (sess?.user?.id) {
        await loadProfile(sess.user.id);
      } else {
        setProfile(null);
      }
      setAuthReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      if (!isMounted) return;
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      if (sess?.user?.id) {
        await loadProfile(sess.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [loadProfile]);

  // Small retry if profile row is created by a DB trigger and isn’t visible yet
  useEffect(() => {
    if (user && !profile) {
      const t = setTimeout(() => loadProfile(user.id), 800);
      return () => clearTimeout(t);
    }
  }, [user, profile, loadProfile]);

  // --- Sign out: await Supabase, clear storage, reset in-memory state
  const signOut = useCallback(async () => {
    // 1) Clear local storage first to avoid any SDK race
    removeSupabaseKeys(projectRef);

    // 2) Revoke tokens (everywhere)
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      // Non-fatal; continue cleanup
      // console.error('supabase signOut error:', e?.message || e);
    }

    // 3) Clear again in case SDK re-wrote during sign-out
    removeSupabaseKeys(projectRef);

    // 4) Reset app state
    setSession(null);
    setUser(null);
    setProfile(null);

    // 5) Return control to the caller (e.g., Logout page will navigate)
    return true;
  }, [projectRef]);

  const value = useMemo(
    () => ({ session, user, profile, authReady, signOut }),
    [session, user, profile, authReady, signOut]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
