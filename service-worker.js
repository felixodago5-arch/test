const CACHE_NAME = 'felixjames-v3';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <rect width="200" height="200" fill="#1a1a1a"/>
            <text x="50%" y="50%" fill="#1a9e8f" text-anchor="middle"
              font-size="11" font-family="sans-serif" dy=".3em">Loading...</text>
          </svg>`,
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      })
    );
    return;
  }
  event.respondWith(fetch(event.request));
});