// DizziGo Website Service Worker
// Provides offline functionality and caching for better performance

const CACHE_NAME = 'dizzigo-website-v1.0.0';
const STATIC_CACHE = 'dizzigo-static-v1.0.0';
const DYNAMIC_CACHE = 'dizzigo-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cacheFirst',
    NETWORK_FIRST: 'networkFirst',
    CACHE_ONLY: 'cacheOnly',
    NETWORK_ONLY: 'networkOnly',
    STALE_WHILE_REVALIDATE: 'staleWhileRevalidate'
};

// Route configurations
const ROUTES = [
    {
        pattern: /.*\.(css|js|woff2?|ttf|eot)$/,
        strategy: CACHE_STRATEGIES.CACHE_FIRST,
        cache: STATIC_CACHE
    },
    {
        pattern: /.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
        strategy: CACHE_STRATEGIES.CACHE_FIRST,
        cache: STATIC_CACHE
    },
    {
        pattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
        strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
        cache: STATIC_CACHE
    },
    {
        pattern: /^https:\/\/cdnjs\.cloudflare\.com/,
        strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
        cache: STATIC_CACHE
    },
    {
        pattern: /^https:\/\/api\./,
        strategy: CACHE_STRATEGIES.NETWORK_FIRST,
        cache: DYNAMIC_CACHE
    }
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            self.skipWaiting() // Activate immediately
        ])
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control immediately
            self.clients.claim()
        ])
    );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Find matching route
    const route = ROUTES.find(route => route.pattern.test(request.url));
    
    if (route) {
        event.respondWith(handleRequest(request, route));
    } else {
        // Default strategy for HTML pages
        event.respondWith(handleRequest(request, {
            strategy: CACHE_STRATEGIES.NETWORK_FIRST,
            cache: DYNAMIC_CACHE
        }));
    }
});

// Handle requests based on caching strategy
async function handleRequest(request, route) {
    const { strategy, cache: cacheName } = route;
    
    switch (strategy) {
        case CACHE_STRATEGIES.CACHE_FIRST:
            return cacheFirst(request, cacheName);
        
        case CACHE_STRATEGIES.NETWORK_FIRST:
            return networkFirst(request, cacheName);
        
        case CACHE_STRATEGIES.CACHE_ONLY:
            return cacheOnly(request, cacheName);
        
        case CACHE_STRATEGIES.NETWORK_ONLY:
            return networkOnly(request);
        
        case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            return staleWhileRevalidate(request, cacheName);
        
        default:
            return fetch(request);
    }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('🌐 Service Worker: Network request failed:', request.url);
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('🌐 Service Worker: Network request failed, checking cache:', request.url);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return createOfflinePage();
        }
        
        throw error;
    }
}

// Cache Only Strategy
async function cacheOnly(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    throw new Error('Resource not in cache');
}

// Network Only Strategy
async function networkOnly(request) {
    return fetch(request);
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in background
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => {
        // Ignore network errors in background
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // If no cached version, wait for network
    return networkResponsePromise;
}

// Create offline page
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DizziGo - Offline</title>
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    background: #0a0e1a;
                    color: #e2e8f0;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                }
                .offline-container {
                    max-width: 500px;
                    padding: 2rem;
                }
                .offline-title {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: #00ff88;
                }
                .offline-message {
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    color: #94a3b8;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #00ff88, #00d4ff);
                    color: #0a0e1a;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">🤖</div>
                <h1 class="offline-title">DizziGo is Offline</h1>
                <p class="offline-message">
                    Looks like you're not connected to the internet. 
                    Don't worry, some content is still available offline!
                </p>
                <button class="retry-btn" onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Background sync for analytics and other data
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered');
    
    if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalytics());
    }
});

// Sync analytics data when back online
async function syncAnalytics() {
    try {
        // Implement analytics sync logic here
        console.log('📊 Service Worker: Syncing analytics data');
    } catch (error) {
        console.error('📊 Service Worker: Analytics sync failed:', error);
    }
}

// Push notifications (for future use)
self.addEventListener('push', event => {
    console.log('📬 Service Worker: Push notification received');
    
    const options = {
        body: 'New updates available for DizziGo!',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore Features',
                icon: '/assets/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('DizziGo Update', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            
            case 'GET_VERSION':
                event.ports[0].postMessage({ version: CACHE_NAME });
                break;
            
            case 'CACHE_URLS':
                event.waitUntil(
                    cacheUrls(event.data.urls)
                );
                break;
            
            case 'CLEAR_CACHE':
                event.waitUntil(
                    clearCache(event.data.cacheName)
                );
                break;
        }
    }
});

// Cache specific URLs
async function cacheUrls(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    return cache.addAll(urls);
}

// Clear specific cache
async function clearCache(cacheName) {
    return caches.delete(cacheName);
}

// Periodic cache cleanup
setInterval(() => {
    cleanupCaches();
}, 1000 * 60 * 60 * 24); // Daily cleanup

async function cleanupCaches() {
    try {
        const cacheNames = await caches.keys();
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        const requests = await dynamicCache.keys();
        
        // Remove old cached requests (older than 7 days)
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        for (const request of requests) {
            const response = await dynamicCache.match(request);
            const cacheDate = response.headers.get('date');
            
            if (cacheDate && new Date(cacheDate).getTime() < oneWeekAgo) {
                await dynamicCache.delete(request);
                console.log('🗑️ Service Worker: Cleaned up old cache entry:', request.url);
            }
        }
    } catch (error) {
        console.error('🗑️ Service Worker: Cache cleanup failed:', error);
    }
}

// Error handling
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

console.log('🤖 DizziGo Service Worker loaded successfully!');