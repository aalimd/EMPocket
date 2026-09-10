'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),apache=read('.htaccess'),worker=read('sw.js'),manifest=JSON.parse(read('manifest.json'));
const rules=[];
for(const line of read('_headers').split('\n')) {
 if(!line.trim()||line.startsWith('#'))continue;
 if(line.startsWith('/'))rules.push({pattern:line,headers:[]});
 else {const match=line.match(/^\s+([^:]+): (.+)$/);assert.ok(match,line);rules.at(-1).headers.push([match[1],match[2]]);}
}
function headers(url) {
 const pathname=new URL(url,'https://example.test').pathname,result={};
 for(const rule of rules){const pattern='^'+rule.pattern.split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$';
  if(new RegExp(pattern).test(pathname))for(const [key,value]of rule.headers)(result[key]||=[]).push(value);
 }return result;
}
const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(s=>!s.startsWith('#'));
const precache=[...worker.matchAll(/'\.\/([^']*)'/g)].map(m=>'./'+m[1]);
test('all shipped references and precache URLs exist at root and nested deployments',()=>{
 for(const ref of [...refs,...precache,...manifest.icons.map(i=>i.src),...manifest.shortcuts.flatMap(s=>s.icons.map(i=>i.src))]) {
  assert.ok(!/^(?:https?:|\/)/.test(ref),ref);
  for(const base of ['https://example.test/','https://example.test/nested/']) {
   const u=new URL(ref,base);assert.ok(u.href.startsWith(base),ref);
   const local=decodeURIComponent(u.pathname.slice(new URL(base).pathname.length))||'index.html';
   assert.ok(fs.statSync(path.join(root,local)).isFile(),local);
  }
 }
});
test('Cloudflare cache rules are nonoverlapping and mirror Apache runtime classes',()=>{
 const regular='no-cache, max-age=0, must-revalidate',image='public, max-age=604800';
 for(const ref of refs.concat('./','index.html','sw.js','manifest.json')) {
  const pathname=new URL(ref,'https://example.test').pathname;
  const expected=pathname==='/sw.js'?'no-cache, no-store, must-revalidate':/\.(png|svg|webp|jpg|jpeg|gif|ico)$/.test(pathname)?image:regular;
  assert.deepEqual(headers(ref)['Cache-Control'],[expected],ref);
 }
 assert.match(apache,/html\|js\|json\|css/);
 for(const value of [regular,image,'no-cache, no-store, must-revalidate'])assert.ok(apache.includes('"'+value+'"'));
 assert.deepEqual(headers('/manifest.json')['Content-Type'],['application/manifest+json']);
 assert.match(apache,/ForceType application\/manifest\+json/);
});
test('both hosts retain identical security policy without new script permissions',()=>{
 for(const name of ['Content-Security-Policy','X-Content-Type-Options','Referrer-Policy','X-Frame-Options','Permissions-Policy']) {
  const value=apache.match(new RegExp('Header always set '+name+' "([^"\\n]+)"'))[1];
  for(const url of ['/','/assets/app.js','/sw.js','/manifest.json'])assert.deepEqual(headers(url)[name],[value]);
 }
 assert.doesNotMatch(headers('/')['Content-Security-Policy'][0],/unsafe-eval/);
 assert.ok(rules.length<=100);
 for(const line of read('_headers').split('\n'))assert.ok(line.length<=2000);
 for(const rule of rules)assert.ok((rule.pattern.match(/\*/g)||[]).length<=1);
});
test('manifest icons have declared PNG dimensions and relative installation scope',()=>{
 assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');
 for(const icon of manifest.icons){
  const bytes=fs.readFileSync(path.join(root,icon.src.split('?')[0]));
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.equal(bytes.readUInt32BE(16)+'x'+bytes.readUInt32BE(20),icon.sizes);
 }
 const context={window:{}};vm.createContext(context);vm.runInContext(read('assets/data.js'),context);
 const ids=new Set(context.window.CP_DATA.map(c=>c.id));
 ids.add(read('assets/app.js').match(/const ECG_TOPIC_ID = '([^']+)'/)[1]);
 for(const shortcut of manifest.shortcuts){assert.ok(shortcut.url.startsWith('./#'));assert.ok(ids.has(shortcut.url.slice(3)),shortcut.url);}
});
test('one release token covers shell, precache, manifest and service-worker registration',()=>{
 const version=html.match(/assets\/app.js\?v=([^"']+)/)[1];
 for(const source of [html,worker,JSON.stringify(manifest),read('assets/app.js')]) {
  const tokens=[...source.matchAll(/\?v=([a-zA-Z0-9-]+)/g)].map(m=>m[1]);
  assert.ok(tokens.length);assert.ok(tokens.every(t=>t===version));
 }
 assert.match(read('assets/app.js'),/serviceWorker\.register\('\.\/sw\.js\?v=/);
 assert.ok(!fs.existsSync(path.join(root,'_worker.js')));assert.ok(!fs.existsSync(path.join(root,'functions')));
});
