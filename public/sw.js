const CACHE_NAME = 'getmovie-cache-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Resources to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/images/logo/movie-logo.png',
    '/about',
];

// Routes that should bypass service worker handling
const BYPASS_ROUTES = [
    '/movies',
    '/admin-login',
    '/admin-control-panel'
];

// Install event - precache static resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        }).then((cachesToDelete) => {
            return Promise.all(cachesToDelete.map((cacheToDelete) => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    // Check if the request is for a route that should bypass the service worker
    const url = new URL(event.request.url);
    const shouldBypass = BYPASS_ROUTES.some(route => 
        url.pathname === route || 
        url.pathname.startsWith(`${route}/`)
    );
    
    if (shouldBypass) {
        // Let the browser handle this request normally
        return;
    }
    
    // For image requests, use a network-first strategy
    if (event.request.destination === 'image') {
        event.respondWith(
            fetch(event.request, { redirect: 'follow' })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // For other requests, use a cache-first strategy
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request, {
                redirect: 'follow'
            }).then((response) => {
                // Don't cache non-successful responses or non-basic responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response as it can only be consumed once
                const responseToCache = response.clone();

                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(error => {
                console.log('Fetch failed:', error);
                // Return a fallback response for offline experience
            });
        })
    );
}); 