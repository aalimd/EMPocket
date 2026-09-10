'use strict';
// Run: node --test tests/app-sw.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function worker({ offline = false, storageError = false, cached = {}, scope = 'http://localhost/EM-CPs/' } = {}) {
  const handlers = {};
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
    'http://localhost/EM-CPs/': shell,
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

test('free worker does not intercept paid, sibling or external requests even when offline', async () => {
  for (const offline of [false, true]) {
    const w = worker({ offline, cached: {'http://localhost/EM-CPs/': {body:'free shell'}} });
    for (const url of ['/EM-P/', '/EM-P/api/content.php?bundle=ecg_explorer', '/EM-CPs-copy/assets/app.js', '/account.html', 'https://example.com/EM-CPs/']) {
      for (const mode of ['navigate', 'cors']) assert.equal(await w.fetch(url, mode), undefined, url);
    }
  }
});

test('activation deletes only obsolete caches belonging to this free app', async () => {
  const handlers={},deleted=[];
  const source=fs.readFileSync(require('node:path').join(__dirname,'../sw.js'),'utf8');
  const version=source.match(/const CACHE_VERSION = '([^']+)'/)[1];
  const keys=['em-cps-em-cps-v1','em-cps-em-cps-'+version,'em-p-em-p-v1','em-cps-other-v1','unrelated'];
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../sw.js'),'utf8'),{
    URL,Promise,self:{registration:{scope:'https://zahrani.net/EM-CPs/'},addEventListener:(type,fn)=>handlers[type]=fn,clients:{claim:async()=>{}}},
    caches:{keys:async()=>keys,delete:async key=>deleted.push(key)}
  });
  let pending;handlers.activate({waitUntil:p=>pending=p});await pending;
  assert.deepEqual(deleted,['em-cps-em-cps-v1']);
});

test('root and nested deployments restore direct hash links and index URLs offline', async () => {
  for (const scope of ['https://example.test/', 'https://example.test/reference/']) {
    const shell={body:'canonical shell',redirected:false};
    const w=worker({scope,offline:true,cached:{[scope]:shell}});
    for(const route of ['#ecg','#ecg-explorer~normal','#dyspnea','index.html#ecg','?installed=1#study']) {
      assert.equal(await w.fetch(route,'navigate'),shell,scope+route);
    }
  }
});

test('install caches a nonredirecting shell; optional icon failure does not block activation', async () => {
  for(const failCore of [false,true]) {
    const handlers={},added=[];let skipped=false;
    vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../sw.js'),'utf8'),{
      URL,Promise,self:{registration:{scope:'https://example.test/'},addEventListener:(type,fn)=>handlers[type]=fn,skipWaiting:async()=>{skipped=true;}},
      caches:{open:async()=>({addAll:async urls=>{added.push(...urls);if(failCore)throw Error('core failed');},add:async()=>{throw Error('optional icon unavailable');}})}
    });
    let pending;handlers.install({waitUntil:p=>pending=p});
    if(failCore)await assert.rejects(pending,/core failed/);else await pending;
    assert.equal(skipped,!failCore);
    assert.ok(added.includes('./'));assert.ok(!added.includes('./index.html'));
  }
});
