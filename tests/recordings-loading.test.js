'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function fixture(){
 let resolve,reject,reloads=0;
 const pending=new Promise((yes,no)=>{resolve=yes;reject=no;});
 const context={window:{},loadFixture:()=>pending,location:{reload:()=>reloads++}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync('assets/em-learning-data.js','utf8'),context);
 // Substitute only the transport; exercise the production view and promise handlers.
 const source=fs.readFileSync('assets/em-learning.js','utf8')
  .replace(/import\('[^']+'\)/,'loadFixture()')
  .replace('window.EM_LEARNING={','window.EM_LEARNING={mountVisual,');
 vm.runInContext(source,context);
 const button={};const body={isConnected:true,innerHTML:'',querySelector:()=>button};
 return {api:context.window.EM_LEARNING,body,button,resolve,reject,reloads:()=>reloads};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('a failed recording import exposes reload and a working ECG escape route',async()=>{
 const f=fixture();f.api.mountVisual(f.body,'recordings');
 assert.match(f.body.innerHTML,/Loading recorded ECGs/);
 f.reject(Error('network'));await settle();
 assert.match(f.body.innerHTML,/role="alert"/);
 assert.match(f.body.innerHTML,/href="#ecg-hub"/);
 assert.match(f.body.innerHTML,/Reload recordings/);
 f.button.onclick();assert.equal(f.reloads(),1);
});
test('late recording success or failure cannot alter a detached view',async()=>{
 for(const outcome of ['resolve','reject']){
  const f=fixture();f.api.mountVisual(f.body,'recordings');
  f.body.isConnected=false;f.body.innerHTML='detached previous page';
  f[outcome](outcome==='reject'?Error('network'):undefined);await settle();
  assert.equal(f.body.innerHTML,'detached previous page');
 }
});
