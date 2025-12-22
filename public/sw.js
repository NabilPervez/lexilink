const CACHE_NAME = 'lexilink-v1';
const URLS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/api/words' // Cache the word bank? API routes can be cached if strategies allow.
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
