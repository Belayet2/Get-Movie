const CACHE_NAME = 'getmovie-cache-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Resources to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/images/logo/movie-logo.png',
    '/about',
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
    // Skip cross-origin requests and API calls
    if (event.request.url.startsWith(self.location.origin)) {
        // Skip handling routes that cause redirect issues
        if (event.request.url.includes('/movies') && !event.request.url.includes('.')) {
            return; // Let the browser handle this request normally
        }

        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request, {
                    // Add redirect: 'follow' to handle redirects properly
                    redirect: 'follow'
                }).then((response) => {
                    // Don't cache redirected responses
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
                    // You might want to return a custom offline page here
                });
            })
        );
    }
}); 