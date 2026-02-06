/* ===============================
   Tourism Companion – Service Worker
   =============================== */

const CACHE_NAME = 'tourism-companion-v1';

// Must match manifest start_url
const OFFLINE_URL = '/';

// Core files required for offline app shell
const CORE_ASSETS = [
  '/',
  '/triallll.html',
  '/manifest.json',
  '/services.js',
    '/offline.js',
];

/* ===============================
   INSTALL – Cache app shell
   =============================== */
self.addEventListener('install', (event) => {
  console.log('[SW] Install');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core assets');
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

/* ===============================
   ACTIVATE – Clean old caches
   =============================== */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* ===============================
   FETCH – Cache-first + fallback
   =============================== */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Serve cached content first
      if (cached) {
        return cached;
      }

      // Fetch from network
      return fetch(event.request)
        .then((response) => {
          // Only cache valid responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback for navigation
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

/* ===============================
   MESSAGE – Skip waiting support
   =============================== */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
