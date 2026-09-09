'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{addEventListener(){}}};vm.createContext(ctx);
for(const file of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive','ecg-curriculum'])vm.runInContext(fs.readFileSync(__dirname+'/../assets/'+file+'.js','utf8'),ctx);
const source=fs.readFileSync(__dirname+'/../assets/app.js','utf8');
for(const name of ['esc','ecgSvgWithRef','ecgFigure']){
 const start=source.indexOf('\n    function '+name+'('),end=source.indexOf('\n    function ',start+1);
 assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end),ctx);
}
test('each ECG has one combined viewer action while retaining distinct label and comparison tools',()=>{
 for(const [id,entry]of Object.entries(ctx.window.ECG_SVG)){
  const html=ctx.ecgFigure(id);
  assert.equal((html.match(/data-ecg-tool="expand"/g)||[]).length,1,id);
  assert.doesNotMatch(html,/data-ecg-tool="explain"/,id);
  assert.match(html,/>Explore ECG<\/button>/,id);
  assert.equal((html.match(/data-ecg-tool="anno"/g)||[]).length,1,id);
  assert.equal((html.match(/data-ecg-tool="compare"/g)||[]).length,entry.hasReference?1:0,id);
  if(entry.svg.includes('ecg-hot')){assert.match(html,/data-ecg-wavebtn=/,id);assert.match(html,/class="ecg-inspector"/,id);}
 }
});
