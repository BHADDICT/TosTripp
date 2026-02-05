// Tourism Companion Pro - Service Worker
// Version 2.0.0

const CACHE_VERSION = 'tourism-companion-v2.0.0';
const RUNTIME_CACHE = 'tourism-runtime';

// Files to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                console.log('[SW] Precaching static assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[SW] Precache failed:', error);
            })
    );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_VERSION && name !== RUNTIME_CACHE)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip non-http requests
    if (!request.url.startsWith('http')) return;
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version and update in background
                    updateCache(request);
                    return cachedResponse;
                }
                
                // Fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        
                        // Clone and cache for future
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => cache.put(request, responseToCache));
                        
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback
                        return caches.match('/index.html');
                    });
            })
    );
});

// Background cache update
function updateCache(request) {
    fetch(request)
        .then((response) => {
            if (response && response.status === 200) {
                caches.open(CACHE_VERSION)
                    .then((cache) => cache.put(request, response));
            }
        })
        .catch(() => {});
}

// Background sync
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('[SW] Syncing data...');
    // Implement your sync logic here
    return Promise.resolve();
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'Tourism Companion notification',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        vibrate: [200, 100, 200],
        data: { dateOfArrival: Date.now() }
    };
    
    event.waitUntil(
        self.registration.showNotification('Tourism Companion Pro', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message from clients
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys()
                .then((names) => Promise.all(names.map((name) => caches.delete(name))))
                .then(() => event.ports[0].postMessage({ success: true }))
        );
    }
});

console.log('[SW] Service Worker loaded');