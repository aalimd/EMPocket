/* EM Pocket service worker — resilient app-shell caching for offline clinical reference. */
const CACHE_VERSION = 'v170';
// Preserve case, separators and the full path: sibling installations must never share caches.
const SCOPE_KEY = encodeURIComponent(new URL(self.registration.scope).pathname);
const CACHE_PREFIX = 'em-cps-scope-' + SCOPE_KEY + '-';
const CACHE = CACHE_PREFIX + CACHE_VERSION;
const CORE_ASSETS = [
    './',
    './assets/app.css?v=20260910-complete-r11',
    './assets/em-learning-data.js?v=20260910-complete-r11',
    './assets/ecg-recordings.js?v=20260910-complete-r11',
    './assets/ptb-xl-LICENSE.txt',
    './assets/em-learning.js?v=20260910-complete-r11',
    './assets/student-learning.js?v=20260910-complete-r11',
    './assets/app.js?v=20260910-complete-r11',
    './assets/data.js?v=20260910-complete-r11',
    './assets/evidence.js?v=20260910-complete-r11',
    './assets/ecg-svg.js?v=20260910-complete-r11',
    './assets/ecg-engine.js?v=20260910-complete-r11',
    './assets/ecg-case-tracings.js?v=20260910-complete-r11',
    './assets/ecg-interactive.js?v=20260910-complete-r11',
    './assets/ecg-curriculum.js?v=20260910-complete-r11',
  './assets/ecg-explorer.js?v=20260910-complete-r11'
];
const OPTIONAL_ASSETS = [
    './manifest.json?v=20260910-complete-r11',
    './assets/icon.svg?v=20260910-complete-r11',
    './assets/icon-192.png?v=20260910-complete-r11',
    './assets/icon-512.png?v=20260910-complete-r11',
    './assets/icon-maskable-512.png?v=20260910-complete-r11',
    './assets/apple-touch-icon.png?v=20260910-complete-r11'
];

// Cache the canonical directory URL: Pages redirects index.html to this URL.
const APP_SHELL = new URL('./', self.registration.scope).href;
const APP_PAGES = new Set([new URL(APP_SHELL).pathname, new URL('./index.html', APP_SHELL).pathname]);
const APP_ASSETS = new Set(CORE_ASSETS.concat(OPTIONAL_ASSETS).filter(path => path !== './')
    .map(path => new URL(path, APP_SHELL).pathname));

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

// Some static hosts return their HTML fallback with status 200 for a missing script.
// Do not activate an offline bundle containing that response in place of JavaScript/CSS.
async function validateCore(cache) {
    for (const asset of CORE_ASSETS) {
        const response = await cache.match(new URL(asset, APP_SHELL).href);
        const type = response && response.headers.get('Content-Type') || '';
        const path = new URL(asset, APP_SHELL).pathname;
        const expected = path.endsWith('.js') ? /^(?:application|text)\/(?:x-)?(?:java|ecma)script(?:\s*;|$)/i :
            path.endsWith('.css') ? /^text\/css(?:\s*;|$)/i : path.endsWith('.txt') ? /^text\/plain(?:\s*;|$)/i : /^text\/html(?:\s*;|$)/i;
        if (!expected.test(type.trim())) throw new Error('Invalid offline asset type: ' + asset);
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll(CORE_ASSETS)
                .then(() => validateCore(cache))
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
    // Hash routes use only the app shell. Even a root worker must leave other apps alone.
    if (event.request.mode === 'navigate' ? !APP_PAGES.has(url.pathname) : !APP_ASSETS.has(url.pathname)) return;

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
