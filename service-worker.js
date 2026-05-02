const CACHE_NAME = 'felixjames-v2';
const ASSETS = [
  '/test/',
  '/test/index.html',
  '/test/style.css',
  '/test/script.js',
  '/test/designs.json',
  '/test/commission.html',
  '/test/status.html',
  '/test/icon-192.png',
  '/test/icon-512.png',
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — smart strategy per file type
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isImage = event.request.destination === 'image';
  const isExternal = url.origin !== self.location.origin;

  // ── External (fonts, CDN) — network only, don't intercept
  if (isExternal) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ── Images — cache first, lazy cache on first load
  if (isImage) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;

        return fetch(event.request).then(response => {
          // Only cache valid responses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Offline placeholder
          return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
              <rect width="200" height="200" fill="#1a1a1a"/>
              <text x="50%" y="50%" fill="#1a9e8f" text-anchor="middle"
                font-size="12" font-family="sans-serif" dy=".3em">Offline</text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
      })
    );
    return;
  }

  // ── Core files (HTML, CSS, JS) — network first, cache fallback
  // This keeps the page fresh and smooth on good connections
  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => {
      // Offline — serve from cache
      return caches.match(event.request);
    })
  );
});