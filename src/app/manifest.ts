import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, THEME_COLOR_DARK } from '@/lib/site';

// Web app manifest, served at /manifest.webmanifest (Next adds the <link>).
// Makes the site installable as an app on Android (Chrome builds a WebAPK
// from it: launcher icon, splash screen, standalone window).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'ZerDonghua - Streaming Donghua Sub Indo',
    short_name: 'ZerDonghua',
    description: SITE_DESCRIPTION,
    lang: 'id',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    // Splash/background match the default dark theme so launch has no flash.
    background_color: THEME_COLOR_DARK,
    theme_color: THEME_COLOR_DARK,
    categories: ['entertainment'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Logo kept inside the 80% safe zone for Android adaptive-icon masks.
      { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
