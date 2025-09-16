// CorpoClicker Enhanced v3.0 - Fixed Service Worker
const CACHE_NAME = 'corpoclicker-v3-fixed';
const STATIC_FILES = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

// Install event
self.addEventListener('install', event => {
    console.log('CorpoClicker Service Worker: Installing v3.0-fixed');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('CorpoClicker Service Worker: Activating v3.0-fixed');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName.startsWith('corpoclicker-') && cacheName !== CACHE_NAME)
                        .map(cacheName => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('Old caches cleaned up');
                return self.clients.claim();
            })
    );
});

// Fetch event - simple cache-first strategy
self.addEventListener('fetch', event => {
    // Only handle GET requests from same origin
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(networkResponse => {
                        // Cache successful responses
                        if (networkResponse && networkResponse.ok) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(error => {
                        console.log('Fetch failed, returning offline page');
                        
                        if (event.request.destination === 'document') {
                            return new Response(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>CorpoClicker - Offline</title>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <style>
                                        body { 
                                            font-family: Arial, sans-serif; 
                                            text-align: center; 
                                            padding: 2rem;
                                            background: linear-gradient(135deg, #fcfcf9, #f5f5f5);
                                        }
                                        .offline-container {
                                            max-width: 400px;
                                            margin: 0 auto;
                                            background: white;
                                            padding: 2rem;
                                            border-radius: 16px;
                                            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                                        }
                                        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
                                        h1 { color: #21808d; }
                                        button {
                                            background: linear-gradient(135deg, #21808d, #2d9aa8);
                                            color: white;
                                            border: none;
                                            padding: 12px 24px;
                                            border-radius: 8px;
                                            cursor: pointer;
                                            font-weight: 600;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline-container">
                                        <div class="offline-icon">🏢</div>
                                        <h1>CorpoClicker Offline</h1>
                                        <p>Brak połączenia z internetem, ale gra nadal działa!</p>
                                        <button onclick="window.location.reload()">Spróbuj ponownie</button>
                                    </div>
                                </body>
                                </html>
                            `, {
                                headers: {
                                    'Content-Type': 'text/html'
                                }
                            });
                        }
                        
                        throw error;
                    });
            })
    );
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

console.log('CorpoClicker Service Worker v3.0-fixed loaded');