// src/components/GoogleSignInButton.jsx
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Google Sign-In button that:
 * - Loads GIS once
 * - Initializes once
 * - Renders only when visible and container has width
 * - Uses fixed pixel width (defaults 320px)
 *
 * Props:
 * - isActive: boolean -> call with true when its tab is active
 * - onError: (msg: string) => void
 * - onSuccess: () => void
 * - widthPx: number (200..400) default 320
 * - text/theme/size/shape/context: GIS customization options
 */
export default function GoogleSignInButton({
  isActive = true,
  onError,
  onSuccess,
  widthPx = 320, // IMPORTANT: GIS wants px, not %
  text = 'continue_with',
  theme = 'outline',
  size = 'large',
  shape = 'rectangular',
  context = 'signin',
}) {
  const containerRef = useRef(null);
  const [rendered, setRendered] = useState(false);

  // Load the GIS script once
  useEffect(() => {
    if (window.google && window.google.accounts) return;

    const id = 'gis-sdk';
    if (document.getElementById(id)) return;

    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.id = id;
    document.head.appendChild(s);
  }, []);

  // Initialize GIS exactly once per page
  useEffect(() => {
    function initOnce() {
      if (!window.google || !window.google.accounts?.id) return false;
      if (window.__gisInitialized) return true;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        onError?.('Missing VITE_GOOGLE_CLIENT_ID');
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            // Exchange the Google ID token with Supabase
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
        // login_uri: can be used for redirect mode if you prefer
      });

      window.__gisInitialized = true;
      return true;
    }

    initOnce();
  }, [onError, onSuccess]);

  // Only render when:
  //  - Google is ready
  //  - This tab/panel is active (visible)
  //  - Container has measurable width
  const tryRender = () => {
    if (rendered) return;
    if (!isActive) return;

    const g = window.google?.accounts?.id;
    const el = containerRef.current;
    if (!g || !el) return;

    // visible & has width
    const width = el.getBoundingClientRect().width;
    const isVisible = !!el.offsetParent || window.getComputedStyle(el).display !== 'none';
    if (!isVisible || width < 10) return;

    // Clear any stale contents (React remounts, etc.)
    el.innerHTML = '';

    try {
      g.renderButton(el, {
        theme,
        size,
        text,
        shape,
        context,
        width: Math.min(Math.max(widthPx, 200), 400), // clamp 200..400
      });
      setRendered(true);
    } catch (e) {
      onError?.('Could not render Google button.');
    }
  };

  // Re-try render on:
  //  - mount
  //  - when active changes
  //  - size changes (ResizeObserver)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // try immediately and again next tick (in case of Chakra transitions)
    const t1 = setTimeout(tryRender, 0);
    const t2 = setTimeout(tryRender, 250);

    // observe size changes
    const ro = new ResizeObserver(() => tryRender());
    ro.observe(el);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]); // when tab becomes active, we can finally render

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        // give the box some min-height so layout doesn't collapse while waiting
        minHeight: 44, // ~button height
      }}
    />
  );
}
