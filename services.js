/* ======================================
   Tourism Companion – Service Worker
   GitHub Pages Compatible
   ====================================== */

const CACHE_NAME = 'tourism-companion-v1';
const BASE_PATH = '/TosTripp/';
const OFFLINE_URL = BASE_PATH;

// App shell files (ADD more if needed)
const CORE_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'triallll.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'services.js',
  BASE_PATH + 'offline.js'
];

/* ===============================
   INSTALL
   =============================== */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

/* ===============================
   ACTIVATE
   =============================== */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* ===============================
   FETCH
   Cache-first, network fallback
   =============================== */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

/* ===============================
   MESSAGE – Force update
   =============================== */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
