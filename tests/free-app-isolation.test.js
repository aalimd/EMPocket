'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
test('free entry point ships every runtime locally without paid content or account dependencies',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(scripts.some(s=>s.startsWith('assets/data.js?')));
 assert.ok(scripts.some(s=>s.startsWith('assets/ecg-explorer.js?')));
 for(const url of scripts){
  assert.match(url,/^assets\/[a-z-]+\.js\?v=/);
  const source=fs.readFileSync(path.join(root,url.split('?')[0]),'utf8');
  assert.doesNotMatch(source,/EM_P_CONTENT|EM_P_STORAGE_KEY|em-p-|\/EM-P\b|workspaces\.php|content-loader\.js/);
 }
 assert.doesNotMatch(html,/content-loader|account\.html|\/EM-P\b/);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
 assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');
 for(const shortcut of manifest.shortcuts)assert.ok(shortcut.url.startsWith('./#'));
});
