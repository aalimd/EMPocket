'use strict';
// Run: node --test tests/app-sw.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function worker({ offline = false, storageError = false, cached = {} } = {}) {
  const handlers = {};
  const scope = 'http://localhost/EM-CPs/';
  const response = { status: 200, type: 'basic', clone() { return this; } };
  const context = {
    URL, Promise, Response,
    self: { registration: { scope }, location: new URL(scope), addEventListener(type, handler) { handlers[type] = handler; } },
    fetch: async () => { if (offline) throw new Error('offline'); return response; },
    caches: { open: async () => {
      if (storageError) throw new Error('storage unavailable');
      return { match: async request => cached[typeof request === 'string' ? request : request.url], put: async () => {} };
    } }
  };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../sw.js'), 'utf8'), context);
  return {
    response,
    async fetch(path, mode) {
      let result;
      const pending = [];
      handlers.fetch({ request: { method: 'GET', url: new URL(path, scope).href, mode }, respondWith(p) { result = p; }, waitUntil(p) { pending.push(p); } });
      const resolved = await result;
      await Promise.all(pending);
      return resolved;
    }
  };
}

test('cache failures never turn successful app navigations or assets into network errors', async () => {
  const w = worker({ storageError: true });
  assert.equal(await w.fetch('./', 'navigate'), w.response);
  assert.equal(await w.fetch('./assets/app.js', 'cors'), w.response);
});

test('offline navigation falls back to the installed app shell; cached assets stay available', async () => {
  const shell = { body: 'app shell' }, asset = { body: 'runtime' };
  const w = worker({ offline: true, cached: {
    'http://localhost/EM-CPs/index.html': shell,
    'http://localhost/EM-CPs/assets/app.js': asset
  } });
  assert.equal(await w.fetch('./?launch=pwa', 'navigate'), shell);
  assert.equal(await w.fetch('./assets/app.js', 'cors'), asset);
  assert.equal((await w.fetch('./missing.js', 'cors')).type, 'error');
});


test('offline navigation without an installed shell returns a valid error response', async () => {
  for (const storageError of [false, true]) {
    const w = worker({ offline: true, storageError });
    assert.equal((await w.fetch('./', 'navigate')).type, 'error');
  }
});
