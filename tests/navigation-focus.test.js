'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('Back restores a captured top-of-page position as well as a scrolled position',()=>{
    for(const y of [0,420]){
        const scrolls=[];
        const card={dataset:{id:'chest-pain'},focus(){}};
        const ctx={window:{scrollTo:opts=>scrolls.push(opts.top)},location:{hash:'#library'},document:{getElementById:()=>null}};
        vm.runInNewContext(fs.readFileSync(require.resolve('../assets/navigation-store.js'),'utf8'),ctx);
        const api=ctx.window.EM_NAVIGATION;
        api.recordBackContext('library');
        api.rememberClick({closest:()=>card},'#library',y);
        api.captureBackSource();
        api.restoreBackFocus({querySelector:()=>card});
        assert.deepEqual(scrolls,[y]);
    }
});
test('a direct navigation cannot reuse an earlier opening card',()=>{
    const selectors=[];
    const card={dataset:{id:'chest-pain'}};
    const ctx={window:{scrollTo(){}},location:{hash:'#library'},document:{getElementById:()=>null}};
    vm.runInNewContext(fs.readFileSync(require.resolve('../assets/navigation-store.js'),'utf8'),ctx);
    const api=ctx.window.EM_NAVIGATION;
    api.recordBackContext('library');
    api.rememberClick({closest:()=>card},'#library',420);
    api.captureBackSource();
    api.rememberClick(null,'#learn~home',0);
    api.captureBackSource();
    api.restoreBackFocus({querySelector:selector=>{selectors.push(selector);return null;}});
    assert.ok(!selectors.includes('[data-id="chest-pain"]'));
});
