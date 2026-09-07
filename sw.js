/* EM Pocket service worker — resilient app-shell caching for offline clinical reference. */
const CACHE_VERSION = 'v149';
const SCOPE_KEY = new URL(self.registration.scope).pathname.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'root';
const CACHE_PREFIX = 'em-cps-' + SCOPE_KEY + '-';
const CACHE = CACHE_PREFIX + CACHE_VERSION;
const CORE_ASSETS = [
    './',
    './index.html',
    './assets/app.css?v=20260907-header2',
    './assets/student-learning.js?v=20260907-header2',
    './assets/app.js?v=20260907-header2',
    './assets/data.js?v=20260907-header2',
    './assets/evidence.js?v=20260907-header2',
    './assets/ecg-svg.js?v=20260907-header2',
    './assets/ecg-engine.js?v=20260907-header2',
    './assets/ecg-case-tracings.js?v=20260907-header2',
    './assets/ecg-interactive.js?v=20260907-header2',
    './assets/ecg-curriculum.js?v=20260907-header2',
  './assets/ecg-explorer.js?v=20260907-header2'
];
const OPTIONAL_ASSETS = [
    './manifest.json?v=20260907-header2',
    './assets/icon.svg?v=20260907-header2',
    './assets/icon-192.png?v=20260907-header2',
    './assets/icon-512.png?v=20260907-header2',
    './assets/icon-maskable-512.png?v=20260907-header2',
    './assets/apple-touch-icon.png?v=20260907-header2'
];

const APP_SHELL = new URL('./index.html', self.registration.scope).href;

function cacheResponse(request, response) {
    if (response && response.status === 200 && response.type === 'basic') {
        return caches.open(CACHE).then((cache) => cache.put(request, response.clone()))
            .catch(() => undefined); // Storage failure must not discard a usable network response.
    }
    return Promise.resolve();
}

function matchCached(request) {
    return caches.open(CACHE).then((cache) => cache.match(request)).catch(() => undefined);
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll(CORE_ASSETS)
                .then(() => Promise.allSettled(OPTIONAL_ASSETS.map((asset) => cache.add(asset)))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys
                .filter((key) => key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE)
                .map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return cacheResponse(event.request, response).then(() => response);
                })
                .catch(async () => (await matchCached(event.request)) || (await matchCached(APP_SHELL)) || Response.error())
        );
        return;
    }

    const networkUpdate = fetch(event.request)
        .then((response) => cacheResponse(event.request, response).then(() => response));
    event.waitUntil(networkUpdate.catch(() => undefined));
    event.respondWith(
        matchCached(event.request).then((cached) => cached || networkUpdate.catch(() => Response.error()))
    );
});
