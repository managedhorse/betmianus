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
    await supabase.auth.signOut();
  };

  return (
    <AuthCtx.Provider value={{ session, user, profile, authReady, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
