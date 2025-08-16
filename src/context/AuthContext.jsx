import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const loadProfile = async (userId) => {
    try {
      const { data: p } = await supabase
        .from('profiles')
        .select('username, public_id')
        .eq('id', userId)
        .single();
      setProfile(p ?? null);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }
      setAuthReady(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, sess) => {
        setSession(sess ?? null);
        setUser(sess?.user ?? null);
        if (sess?.user) {
          await loadProfile(sess.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Tiny retry if user exists but profile not yet created by trigger
  useEffect(() => {
    if (user && !profile) {
      const t = setTimeout(() => {
        loadProfile(user.id);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [user, profile]);

  const signOut = async () => {
    try {
      // Revoke refresh token everywhere and remove local session
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) console.error('Supabase signOut error:', error.message);
    } finally {
      // Extra cleanup in case anything is lingering
      try {
        Object.keys(localStorage).forEach((k) => {
          // Supabase stores auth under keys like "sb-<ref>-auth-token" (and -persist-session)
          if (k.startsWith('sb-')) localStorage.removeItem(k);
        });
      } catch {}
      setSession(null);
      setUser(null);
      setProfile(null);

      // Hard redirect guarantees UI reset (safe for SPA)
      window.location.href = '/';
    }
  };

  return (
    <AuthCtx.Provider value={{ session, user, profile, authReady, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
