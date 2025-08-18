// src/pages/Logout.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Logout() {
  const { signOut } = useAuth();
  const ranRef = useRef(false); // guard for StrictMode double-invoke

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    // signOut itself will hard-reload to "/"
    (async () => {
      try {
        await signOut();
      } catch {
        // As an absolute fallback (shouldn’t hit), still reload:
        window.location.replace('/');
      }
    })();
  }, [signOut]);

  return null; // or a tiny spinner if you want
}