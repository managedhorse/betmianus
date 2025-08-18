import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Reliable Google Sign-In button:
 * - Loads GIS once and tracks "sdkReady"
 * - Initializes once (global)
 * - Renders on: mount, when sdkReady flips true, and whenever isActive changes
 * - Uses fixed pixel width (GIS requires px, not %)
 */
export default function GoogleSignInButton({
  isActive = true,
  onError,
  onSuccess,
  widthPx = 320,          // 200..400 recommended by GIS
  text = 'continue_with', // 'signin_with' | 'continue_with' | etc.
  theme = 'outline',      // 'outline' | 'filled_blue' | 'filled_black'
  size = 'large',         // 'large' | 'medium' | 'small'
  shape = 'rectangular',  // 'rectangular' | 'pill' | 'circle' | 'square'
  context = 'signin', 
  observeResize = true,    
}) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(
    !!(typeof window !== 'undefined' && window.google?.accounts?.id)
  );
  const [rendered, setRendered] = useState(false);

  // --- load the GIS script once, and flip sdkReady on load
  useEffect(() => {
    if (sdkReady) return;

    const EXISTING = document.getElementById('gis-sdk');
    const onLoad = () => setSdkReady(true);

    if (EXISTING) {
      // If it’s already on the page, attach load handler (or mark ready immediately)
      if (window.google?.accounts?.id) {
        setSdkReady(true);
      } else {
        EXISTING.addEventListener('load', onLoad);
        return () => EXISTING.removeEventListener('load', onLoad);
      }
      return;
    }

    const s = document.createElement('script');
    s.id = 'gis-sdk';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.addEventListener('load', onLoad);
    document.head.appendChild(s);
    return () => s.removeEventListener('load', onLoad);
  }, [sdkReady]);

  // --- initialize GIS exactly once (after sdkReady)
  useEffect(() => {
    if (!sdkReady) return;
    if (window.__gisInitialized) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      onError?.('Missing VITE_GOOGLE_CLIENT_ID');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
            });
            if (error) throw error;
            onSuccess?.();
          } catch (e) {
            onError?.(e?.message || 'Google sign-in failed.');
          }
        },
        ux_mode: 'popup',
      });
      window.__gisInitialized = true;
    } catch (e) {
      onError?.('Failed to initialize Google Identity Services.');
    }
  }, [sdkReady, onError, onSuccess]);

  // --- render the button
  const tryRender = () => {
    if (rendered) return;
    if (!isActive) return;                        // only render for the active tab
    if (!window.__gisInitialized) return;

    const el = containerRef.current;
    const api = window.google?.accounts?.id;
    if (!el || !api) return;

    // Clear any previous contents, then render
    el.innerHTML = '';
    try {
      api.renderButton(el, {
        theme,
        size,
        text,
        shape,
        context,
        width: Math.min(Math.max(widthPx, 200), 400), // clamp 200..400
      });
      setRendered(true);
    } catch (e) {
      // If rendering fails (rare), schedule a small retry
      setTimeout(() => {
        try {
          api.renderButton(el, {
            theme,
            size,
            text,
            shape,
            context,
            width: Math.min(Math.max(widthPx, 200), 400),
          });
          setRendered(true);
        } catch {
          onError?.('Could not render Google button.');
        }
      }, 150);
    }
  };

  // render when: mounted, sdkReady flips, isActive flips
  useEffect(() => {
    // immediate + short delayed attempt to avoid layout races
    const t1 = setTimeout(tryRender, 0);
    const t2 = setTimeout(tryRender, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkReady, isActive]);

  // also re-try if the container resizes (e.g., modal transitions)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let ro;
   if (observeResize && 'ResizeObserver' in window) {
     ro = new ResizeObserver(() => tryRender());
     ro.observe(el);
   }
    return () => ro?.disconnect?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: 44, // keep layout height while the SDK loads
      }}
    />
  );
}
