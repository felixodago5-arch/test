const CACHE_NAME = 'felixjames-v1';
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
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
// ✅ ADDED: auto-cache images + offline placeholder
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Auto-cache images as they load for offline use
        if (event.request.destination === 'image') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for images
        if (event.request.destination === 'image') {
          return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
              <rect width="200" height="200" fill="#1a1a1a"/>
              <text x="50%" y="50%" fill="#1a9e8f" text-anchor="middle" 
                font-size="12" font-family="sans-serif" dy=".3em">Offline</text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      });
    })
  );
});