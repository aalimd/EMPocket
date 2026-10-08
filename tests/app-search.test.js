'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
const start=source.lastIndexOf("        const input = document.getElementById('searchInput');");
const end=source.indexOf("        document.getElementById('printBtn').addEventListener",start);
assert.ok(start>=0&&end>start);
function bind(){
 const listeners={},opened=[],queries=[];let popup=null;
 const input={value:'',addEventListener(type,fn){listeners[type]=fn;},blur(){},focus(){}};
 const context=vm.createContext({setTimeout,clearTimeout,input,searchCursor:-1,
  document:{getElementById:id=>id==='searchInput'?input:null,querySelector:selector=>selector==='.searchwrap'?{addEventListener(){}}:popup},
  runSearch(q){queries.push(q);const items=q.length>=2?[{dataset:{id:q,target:''}}]:[];popup={style:{display:q.length>=2?'block':'none'},querySelectorAll:()=>items,querySelector:()=>items[0]};},
  hideSearchResults(p){if(p)p.style.display='none';},
  paintSearchCursor(){},openSearchHit(id){opened.push(id);}
 });
 vm.runInContext(source.slice(start,end),context);
 return {input,listeners,opened,queries,context,get popup(){return popup;},key(key){listeners.keydown({key,preventDefault(){}});},type(value){input.value=value;listeners.input();}};
}
const settle=()=>new Promise(resolve=>setTimeout(resolve,180));
test('rapid Enter opens the latest search once and the pending timer cannot reopen results',async()=>{
 const x=bind();x.type('chest pain');x.key('Enter');await settle();
 assert.deepEqual(x.opened,['chest pain']);assert.deepEqual(x.queries,['chest pain']);assert.equal(x.popup.style.display,'none');
});
test('Enter after changing a visible query selects the new results, not a stale topic',async()=>{
 const x=bind();x.type('chest pain');await settle();x.type('dyspnea');x.key('Enter');await settle();
 assert.deepEqual(x.opened,['dyspnea']);assert.deepEqual(x.queries,['chest pain','dyspnea']);assert.equal(x.popup.style.display,'none');
});
test('Escape cancels the delayed query and does not reopen the search',async()=>{
 const x=bind();x.type('headache');x.key('Escape');await settle();
 assert.equal(x.input.value,'');assert.deepEqual(x.queries,[]);assert.deepEqual(x.opened,[]);
});
