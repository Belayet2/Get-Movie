// Service Worker for Getmovie app

const CACHE_NAME = 'getmovie-cache-v1';

// URLs to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/about/',
    '/about/index.html',
    '/images/logo/movie-logo.png'
];

// Install event - cache important files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
    // Skip chrome-extension URLs and non-GET requests
    if (event.request.url.startsWith('chrome-extension:') || event.request.method !== 'GET') {
        return;
    }

    // Special handling for about page
    if (event.request.url.includes('/about') && !event.request.url.endsWith('/')) {
        // For the about page, use navigation preload if available
        const aboutUrl = new URL(event.request.url);

        // Ensure we're using the correct path with trailing slash
        if (!aboutUrl.pathname.endsWith('/')) {
            aboutUrl.pathname += '/';
        }

        // Create a new request with the corrected URL and same credentials
        const newRequest = new Request(aboutUrl.toString(), {
            method: event.request.method,
            headers: event.request.headers,
            mode: 'same-origin', // Important: Don't follow redirects
            credentials: event.request.credentials,
            redirect: 'manual' // Don't automatically follow redirects
        });

        // Respond with the new request
        event.respondWith(
            fetch(newRequest)
                .then(response => {
                    // Clone the response to store in cache
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            // Only cache same-origin requests
                            if (event.request.url.startsWith(self.location.origin)) {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return response;
                })
                .catch(() => {
                    // If fetch fails, try to get from cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Standard fetch handling for other requests
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response to store in cache
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        // Only cache same-origin requests
                        if (event.request.url.startsWith(self.location.origin)) {
                            cache.put(event.request, responseToCache);
                        }
                    });

                return response;
            })
            .catch(() => {
                // If fetch fails, try to get from cache
                return caches.match(event.request);
            })
    );
}); 