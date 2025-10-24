/*
Service Worker (Client-Side Caching)
This is the only reliable way to control assets caching on GitHub Pages:
*/
const CACHE_NAME = 'kether-v0.1';
const STATIC_ASSETS = [
  '/',
  '/backgrounds/background_1.jpg',
  '/backgrounds/background_2.jpg',
  // '/backgrounds/background_3.jpg', //unused
  '/backgrounds/background_4.jpg',
  '/backgrounds/background_5.jpg',
  // '/backgrounds/background_6.jpg', //unused
  '/assets/FutureRot-B5YUKslE.woff2',
  '/assets/FutureRot-YCNoObm4.woff',
  '/assets/primeicons-C6QP2o4f.woff2',
  '/assets/primeicons-WjwUDZjB.woff',
  '/assets/primereact-a-ERR-hv.js',
  '/favicons/steam-logo-svgrepo.png',
];

// Install event - cache assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS)) // Cache them
      .then(() => self.skipWaiting()) // Done
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // console.log('Service Worker: Activated');
      return self.clients.claim(); // Take control over the page immediately
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Cache static assets for 1 year
  if (event.request.url.includes('/backgrounds/') || 
      event.request.url.includes('/favicons/') ||
      (event.request.url.includes('/assets/') | (event.request.url.includes('.woff') || event.request.url.includes('primereact-a-ERR')))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response; // Return cached version
          }

          console.log('Service Worker: Fetching from network:', event.request.url);
          return fetch(event.request).then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseClone = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          });
        })
        .catch((error) => {
          console.log('Service Worker: Fetch failed:', error);
          // Return a fallback or let the browser handle it
          throw error;
        })
    );
  }
});