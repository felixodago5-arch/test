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

const CACHE_NAME = 'felixjames-v3';

// Install — skip waiting, activate immediately
self.addEventListener('install', () => self.skipWaiting());

// Activate — delete ALL old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network only, no caching
// Offline → return skeleton signal for images
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

  // Everything else — straight network, no interception
  event.respondWith(fetch(event.request));
});