'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('only this installations worker can establish offline readiness',()=>{
 const source=fs.readFileSync('assets/app.js','utf8');
 const start=source.indexOf('    function isAppWorker('),end=source.indexOf('    let offlineStatus',start);
 const ctx={URL,location:{href:'https://example.test/EM-CPs/#settings'}};
 vm.runInNewContext(source.slice(start,end)+'this.check=isAppWorker;',ctx);
 for(const url of ['https://example.test/sw.js','https://example.test/sibling/sw.js','https://elsewhere.test/EM-CPs/sw.js'])assert.equal(ctx.check({scriptURL:url}),false,url);
 assert.equal(ctx.check({scriptURL:'https://example.test/EM-CPs/sw.js?v=older'}),true);
 assert.equal(ctx.check(null),false);
 const stateEnd=source.indexOf('    const PATIENT_CONTEXTS',end);
 for(const [scriptURL,expected] of [['https://example.test/sw.js','Offline setup pending'],['https://example.test/EM-CPs/sw.js?v=older','Ready for offline use']]){
  const state={URL,location:ctx.location,navigator:{serviceWorker:{controller:{scriptURL}}}};
  vm.runInNewContext(source.slice(start,stateEnd)+'this.status=offlineStatus;',state);
  assert.equal(state.status,expected);
 }

});
