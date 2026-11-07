'use client';

import { useEffect } from 'react';

// Registers public/sw.js (offline page + PWA install support). Production
// only, so `next dev` runs without a worker in the way.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.warn('Service worker registration failed:', err));
  }, []);

  return null;
}
