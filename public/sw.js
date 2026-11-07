// ZerDonghua service worker: shows an offline page when a page load fails.
// Everything else (pages, API data, posters, video) always goes to the
// network: content is dynamic and streaming needs a connection anyway.
// Bump CACHE when offline.html changes.
const CACHE = 'zerdonghua-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const res = await fetch(OFFLINE_URL, { cache: 'reload' });
      if (!res.ok) throw new Error(`Precache ${OFFLINE_URL} failed: ${res.status}`);
      // Cloudflare static assets redirect /offline.html -> /offline, and a
      // redirected response cannot answer a navigation, so store a copy.
      const copy = new Response(await res.blob(), {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
      const cache = await caches.open(CACHE);
      await cache.put(OFFLINE_URL, copy);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Lets the page request start while the worker boots.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('zerdonghua-') && key !== CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.mode !== 'navigate' || request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        return (await event.preloadResponse) || (await fetch(request));
      } catch {
        return (await caches.match(OFFLINE_URL)) || Response.error();
      }
    })(),
  );
});
