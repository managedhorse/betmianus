// src/pages/Logout.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Logout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ranRef = useRef(false); // guard for StrictMode double-invoke

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    // Failsafe: if signOut hangs, still get back home.
    const fallback = setTimeout(() => {
      navigate('/', { replace: true, state: { from: location, forcedLogout: true } });
    }, 2500);

    (async () => {
      try {
        await signOut();                // <-- await it
      } finally {
        clearTimeout(fallback);
        navigate('/', { replace: true, state: { from: location } });
      }
    })();

    return () => clearTimeout(fallback);
  }, [signOut, navigate, location]);

  return null; // or a tiny spinner if you prefer
}