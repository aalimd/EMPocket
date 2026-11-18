/* The EM Pocket service worker — resilient app-shell caching for offline clinical reference. */
const CACHE_VERSION = 'v289';
// Preserve case, separators and the full path: sibling installations must never share caches.
const SCOPE_KEY = encodeURIComponent(new URL(self.registration.scope).pathname);
const CACHE_PREFIX = 'em-cps-scope-' + SCOPE_KEY + '-';
const CACHE = CACHE_PREFIX + CACHE_VERSION;
const CORE_ASSETS = [
    './',
    './assets/app.css?v=20261118-audit-v90',
    './assets/design.js?v=20261118-audit-v90',
    './assets/css/tokens.css?v=20261118-audit-v90',
    './assets/css/scientific.css?v=20261118-audit-v90',
    './assets/css/base.css?v=20261118-audit-v90',
    './assets/css/shell.css?v=20261118-audit-v90',
    './assets/css/components.css?v=20261118-audit-v90',
    './assets/css/views.css?v=20261118-audit-v90',
    './assets/css/shift-tools.css?v=20261118-audit-v90',
    './assets/css/ecg.css?v=20261118-audit-v90',
    './assets/css/print.css?v=20261118-audit-v90',
    './assets/em-learning-data.js?v=20261118-audit-v90',
    './assets/ptb-xl-LICENSE.txt',
    './assets/material-symbols-LICENSE.txt',
    './assets/em-learning.js?v=20261118-audit-v90',
    './assets/student-learning.js?v=20261118-audit-v90',
    './assets/shift-tools.js?v=20261118-audit-v90',
    './assets/search-core.js?v=20261118-audit-v90',
    './assets/learning-store.js?v=20261118-audit-v90',
    './assets/prefs-store.js?v=20261118-audit-v90',
    './assets/search-index.js?v=20261118-audit-v90',
    './assets/agreement-store.js?v=20261118-audit-v90',
    './assets/navigation-store.js?v=20261118-audit-v90',
    './assets/app.js?v=20261118-audit-v90',
    './assets/data.js?v=20261118-audit-v90',
    './assets/evidence.js?v=20261118-audit-v90',
    './assets/ecg-svg.js?v=20261118-audit-v90',
    './assets/ecg-engine.js?v=20261118-audit-v90',
    './assets/ecg-case-tracings.js?v=20261118-audit-v90',
    './assets/ecg-interactive.js?v=20261118-audit-v90',
    './assets/ecg-curriculum.js?v=20261118-audit-v90',
  './assets/ecg-explorer.js?v=20261118-audit-v90',
  './assets/ecg-recordings.js?v=20261118-audit-v90'
];
const OPTIONAL_ASSETS = [
    './manifest.json?v=20261118-audit-v90',
    './assets/icon.svg?v=20261118-audit-v90',
    './assets/icon-192.png?v=20261118-audit-v90',
    './assets/icon-512.png?v=20261118-audit-v90',
    './assets/icon-maskable-512.png?v=20261118-audit-v90',
    './assets/apple-touch-icon.png?v=20261118-audit-v90',
    // Optional on purpose: a missing or mis-typed font must never block the
    // offline install, and the UI stays fully usable on the system stack.
    './assets/fonts/PlusJakartaSans-Variable.ttf?v=20261118-audit-v90'
];

// Cache the canonical directory URL: Pages redirects index.html to this URL.
const APP_SHELL = new URL('./', self.registration.scope).href;
const APP_PAGES = new Set([new URL(APP_SHELL).pathname, new URL('./index.html', APP_SHELL).pathname]);
const APP_ASSETS = new Set(CORE_ASSETS.concat(OPTIONAL_ASSETS).filter(path => path !== './')
    .map(path => new URL(path, APP_SHELL).pathname));

function hasExpectedType(path, response) {
    const type = response?.headers?.get('Content-Type')?.split(';')[0].trim().toLowerCase() || '';
    if (APP_PAGES.has(path)) return type === 'text/html';
    if (path.endsWith('.js')) return /^(application|text)\/(x-)?(java|ecma)script$/.test(type);
    if (path.endsWith('.css')) return type === 'text/css';
    if (path.endsWith('.txt')) return type === 'text/plain';
    if (path.endsWith('.json')) return type === 'application/manifest+json' || type === 'application/json';
    if (path.endsWith('.svg')) return type === 'image/svg+xml';
    if (path.endsWith('.png')) return type === 'image/png';
    if (path.endsWith('.ttf')) return ['font/ttf', 'application/x-font-ttf', 'application/octet-stream'].includes(type);
    return false;
}

function cacheResponse(request, response) {
    if (response && response.status === 200 && response.type === 'basic' &&
        hasExpectedType(new URL(request.url || request, APP_SHELL).pathname, response)) {
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
        const url = new URL(asset, APP_SHELL);
        if (!hasExpectedType(url.pathname, await cache.match(url.href))) {
            throw new Error('Invalid offline asset type: ' + asset);
        }
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll(CORE_ASSETS)
                .then(() => validateCore(cache))
                .then(() => Promise.allSettled(OPTIONAL_ASSETS.map(async (asset) => {
                    const url = new URL(asset, APP_SHELL);
                    const response = await fetch(url.href);
                    await cacheResponse(url.href, response);
                }))))
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

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
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

    const networkUpdate = fetch(event.request).then(async (response) => {
        if (response.ok && !hasExpectedType(url.pathname, response)) return Response.error();
        await cacheResponse(event.request, response);
        return response;
    });
    event.waitUntil(networkUpdate.catch(() => undefined));
    event.respondWith(
        matchCached(event.request).then((cached) => cached || networkUpdate.catch(() => Response.error()))
    );
});
