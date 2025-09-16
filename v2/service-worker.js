// CorpoClicker Enhanced - Service Worker v3.0.0
// Provides offline functionality and caching

const CACHE_NAME = 'corpoclicker-v3.0.0';
const STATIC_CACHE_NAME = 'corpoclicker-static-v3.0.0';
const RUNTIME_CACHE_NAME = 'corpoclicker-runtime-v3.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    './',
    './index.html',
    './style.css', 
    './app.js',
    './manifest.json'
];

// Files that should be cached at runtime
const RUNTIME_CACHE_URLS = [
    // External resources that might be loaded
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('CorpoClicker Service Worker: Installing v3.0.0');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE_NAME).then(cache => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES.map(url => {
                    // Handle relative URLs
                    return new Request(url, {
                        credentials: 'same-origin'
                    });
                }));
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('CorpoClicker Service Worker: Activating v3.0.0');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            // Delete old versions
                            return cacheName.startsWith('corpoclicker-') && 
                                   cacheName !== STATIC_CACHE_NAME &&
                                   cacheName !== RUNTIME_CACHE_NAME;
                        })
                        .map(cacheName => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            }),
            
            // Take control of all clients immediately
            self.clients.claim()
        ])
    );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external domains (except for specific resources)
    if (url.origin !== location.origin) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(request)) {
        // Static assets: cache first
        event.respondWith(cacheFirst(request));
    } else if (isGameData(request)) {
        // Game data: network first (for real-time updates)
        event.respondWith(networkFirst(request));
    } else {
        // Other requests: stale while revalidate
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Background sync for save data
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'save-game-data') {
        event.waitUntil(syncGameData());
    }
});

// Push notification support (for future updates)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        const options = {
            body: data.body || 'New update available!',
            icon: './icon-192.png',
            badge: './icon-72.png',
            tag: data.tag || 'corpoclicker-notification',
            renotify: true,
            actions: data.actions || [
                {
                    action: 'open',
                    title: 'Open Game'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || 'CorpoClicker Enhanced', 
                options
            )
        );
    } catch (error) {
        console.error('Push notification error:', error);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(clientList => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes('corpoclicker') && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow('./');
                }
            })
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({
                type: 'VERSION',
                version: '3.0.0',
                cacheName: CACHE_NAME
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({
                    type: 'CACHE_CLEARED'
                });
            });
            break;
            
        case 'SAVE_GAME_DATA':
            // Store game data for background sync
            storeGameDataForSync(data).then(() => {
                event.ports[0].postMessage({
                    type: 'GAME_DATA_STORED'
                });
            });
            break;
    }
});

// Utility functions

function isStaticAsset(request) {
    const url = new URL(request.url);
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.svg', '.ico', '.json'];
    const isManifest = url.pathname.endsWith('manifest.json');
    const hasStaticExtension = staticExtensions.some(ext => url.pathname.endsWith(ext));
    
    return isManifest || hasStaticExtension;
}

function isGameData(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') || url.searchParams.has('gamedata');
}

// Cache strategies

async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        
        // Return offline page or basic response
        if (request.destination === 'document') {
            return caches.match('./offline.html') || createOfflineResponse();
        }
        
        throw error;
    }
}

async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE_NAME);
    
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch from network in background
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('Background fetch failed:', error);
        return null;
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Wait for network if no cache
    try {
        return await fetchPromise;
    } catch (error) {
        if (request.destination === 'document') {
            return createOfflineResponse();
        }
        throw error;
    }
}

// Utility functions for game data management

async function syncGameData() {
    try {
        // Retrieve stored game data
        const gameData = await getStoredGameData();
        if (!gameData) {
            console.log('No game data to sync');
            return;
        }
        
        // Attempt to sync with server (if implemented)
        // For now, just keep data in IndexedDB
        console.log('Game data synced successfully');
        
        // Clear sync data after successful sync
        await clearStoredGameData();
        
    } catch (error) {
        console.error('Game data sync failed:', error);
        throw error;
    }
}

async function storeGameDataForSync(gameData) {
    try {
        // Store in IndexedDB for background sync
        const db = await openGameDataDB();
        const transaction = db.transaction(['gamedata'], 'readwrite');
        const store = transaction.objectStore('gamedata');
        
        await store.put({
            id: 'pending-sync',
            data: gameData,
            timestamp: Date.now()
        });
        
        console.log('Game data stored for sync');
    } catch (error) {
        console.error('Failed to store game data:', error);
    }
}

async function getStoredGameData() {
    try {
        const db = await openGameDataDB();
        const transaction = db.transaction(['gamedata'], 'readonly');
        const store = transaction.objectStore('gamedata');
        
        return await store.get('pending-sync');
    } catch (error) {
        console.error('Failed to get stored game data:', error);
        return null;
    }
}

async function clearStoredGameData() {
    try {
        const db = await openGameDataDB();
        const transaction = db.transaction(['gamedata'], 'readwrite');
        const store = transaction.objectStore('gamedata');
        
        await store.delete('pending-sync');
    } catch (error) {
        console.error('Failed to clear stored game data:', error);
    }
}

function openGameDataDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CorpoClickerGameData', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('gamedata')) {
                db.createObjectStore('gamedata', { keyPath: 'id' });
            }
        };
    });
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames
            .filter(name => name.startsWith('corpoclicker-'))
            .map(name => caches.delete(name))
    );
}

function createOfflineResponse() {
    return new Response(
        `<!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CorpoClicker - Offline</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #fcfcf9, #f5f5f5);
                    color: #333;
                }
                .offline-container {
                    text-align: center;
                    max-width: 400px;
                    padding: 2rem;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    color: #21808d;
                    margin-bottom: 1rem;
                }
                p {
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .retry-button {
                    background: linear-gradient(135deg, #21808d, #2d9aa8);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: transform 0.2s;
                }
                .retry-button:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">🏢</div>
                <h1>CorpoClicker Offline</h1>
                <p>Nie można połączyć się z internetem, ale gra nadal działa offline!</p>
                <p>Twoje postępy są zapisywane lokalnie i zostaną zsynchronizowane, gdy połączenie zostanie przywrócone.</p>
                <button class="retry-button" onclick="window.location.reload()">
                    Spróbuj ponownie
                </button>
            </div>
            
            <script>
                // Auto-retry connection every 30 seconds
                setTimeout(() => {
                    if (navigator.onLine) {
                        window.location.reload();
                    }
                }, 30000);
                
                // Listen for online event
                window.addEventListener('online', () => {
                    window.location.reload();
                });
            </script>
        </body>
        </html>`,
        {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'
            }
        }
    );
}

// Performance monitoring
self.addEventListener('activate', event => {
    // Log performance metrics
    console.log('Service Worker activated. Cache performance:');
    
    caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
            caches.open(cacheName).then(cache => {
                cache.keys().then(requests => {
                    console.log(`Cache ${cacheName}: ${requests.length} items`);
                });
            });
        });
    });
});

// Error handling and reporting
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
    
    // Optional: Send error to analytics
    // reportError('service-worker', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled promise rejection:', event.reason);
    
    // Optional: Send error to analytics
    // reportError('service-worker-promise', event.reason);
});

console.log('CorpoClicker Enhanced Service Worker v3.0.0 loaded successfully!');