// src/components/ScrollReset.jsx
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollReset() {
  const { pathname, search, hash } = useLocation();

  // Turn off browser’s native scroll restoration (back/forward).
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => { window.history.scrollRestoration = prev; };
    }
  }, []);

  // On real route changes (not just in-page #hash jumps), snap to top pre-paint.
  useLayoutEffect(() => {
    if (!hash) {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;   // in case you set smooth globally
      html.style.scrollBehavior = 'auto';       // force instant
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    }
  }, [pathname, search, hash]);

  return null;
}