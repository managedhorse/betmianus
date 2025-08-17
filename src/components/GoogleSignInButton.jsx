import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Base64url helpers
function b64url(bytes) {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function randomNonce(len = 16) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return b64url(arr);
}

export default function GoogleSignInButton({
  onError,         // fn(message: string)
  onStart,         // optional: fn()
  onFinish,        // optional: fn()
  locale,          // optional: "en", "fr", etc.
  width = '100%',  // button width
}) {
  const divRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [nonce] = useState(() => randomNonce(16));
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Load GIS script once
    const id = 'google-gsi-script';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = `https://accounts.google.com/gsi/client${locale ? `?hl=${encodeURIComponent(locale)}` : ''}`;
      s.async = true;
      s.defer = true;
      s.onload = () => setReady(true);
      s.onerror = () => onError?.('Failed to load Google Sign-In.');
      document.head.appendChild(s);
    } else {
      setReady(true);
    }
  }, [locale, onError]);

  useEffect(() => {
  if (!ready || !divRef.current || !window.google || !clientId) return;

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          onStart?.();
          const token = response?.credential;
          if (!token) throw new Error('No credential from Google.');
          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token,
            nonce,
          });
          if (error) throw error;
        } catch (e) {
          onError?.(e?.message || 'Google sign-in failed.');
        } finally {
          onFinish?.();
        }
      },
      ux_mode: 'popup',
      nonce,
    });

    const opts = {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      // width must be a number in px; omit if not provided
    };
    if (typeof width === 'number' && Number.isFinite(width)) {
      opts.width = width; // e.g. 320
    }

    window.google.accounts.id.renderButton(divRef.current, opts);

    // Optional One Tap
    // window.google.accounts.id.prompt();
  } catch (e) {
    onError?.('Google Sign-In init failed.');
  }
}, [ready, clientId, nonce, onError, onStart, onFinish, width]);

// Center the button; don't try to force 100% width
return <div ref={divRef} style={{ display: 'flex', justifyContent: 'center' }} />;
}
