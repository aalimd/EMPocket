/* Local browser acceptance checks for ECG image goals, crops, guided findings and self-checks.
   PLAYWRIGHT_MODULE=/path/to/playwright node dev/ecg-foundations-browser.cjs
   Uses isolated storage and blocks service workers; screenshots are written to /tmp. */
const{chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{for(const width of[1280,390,320]){
 const c=await b.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>document.getElementById('disclaimerOverlay')?.remove(),{once:true}));await p.goto((process.env.EM_PREVIEW_URL || 'http://localhost/EM-CPs/') + '#ecg',{waitUntil:'networkidle'});await p.waitForSelector('.ecg-foundations');
 assert.match(await p.locator('.ecg-foundations').innerText(),/one normal beat/);assert.equal(await p.locator('.ecg-beat-map').evaluate(e=>e.getBoundingClientRect().width<=e.parentElement.clientWidth),true);
 while(await p.locator('.section-card.closed').count())await p.locator('.section-card.closed').first().locator('.sec-head').click();
 let readings=0,crops=0;const figures=p.locator('.ecg-fig');
 for(const figure of await figures.all()){
  const id=await figure.getAttribute('data-ecg-fig');assert.ok((await figure.locator('.ecg-image-purpose').innerText()).length>45,id+' purpose');
  const check=figure.locator('.ecg-image-check');assert.equal(await check.evaluate(e=>e.open),false,id+' exposed self-check');assert.equal(await check.locator('p').isVisible(),false);
  await check.locator('summary').click();assert.equal(await check.locator('p').isVisible(),true);await check.locator('summary').click();
  const select=figure.locator('[data-ecg-panel]');if(await select.count()){
   assert.equal(await select.evaluate(e=>e.selectedIndex>0),width<700,id+' wrong default crop');
   const vals=await select.locator('option').evaluateAll(es=>es.map(e=>e.value));
   for(const value of vals){await select.selectOption(value);assert.equal(await figure.locator('.ecg-media svg').getAttribute('viewBox'),value);if(value!==vals[0]){crops++;assert.equal(await figure.locator('.ecg-media').evaluate(e=>e.scrollWidth<=e.clientWidth+2),true,id+' cropped view overflow');}}
  }
  await figure.locator('.ecg-image-reading summary').click();const buttons=await figure.locator('[data-ecg-finding]').all();
  for(const button of buttons){const index=await button.getAttribute('data-ecg-finding');await button.click();const viewer=p.locator('#ecgWorkbench');await viewer.waitFor();assert.equal(await viewer.locator('button[data-finding="'+index+'"]').getAttribute('aria-pressed'),'true',id+' wrong finding');assert.ok((await viewer.locator('.ecg-finding-detail').innerText()).length>50);assert.ok(await viewer.locator('.ecg-finding-marks ellipse').count(),id+' no marker');
   if(await viewer.locator('[data-view="context"]').count()){
    assert.match(await viewer.locator('.ecg-finding-detail').innerText(),/Highlighted leads:.*Focused on the first highlighted region in /,id+' missing focused lead context');
    const svg=viewer.locator('.ecg-workbench-canvas svg'),crop=await svg.getAttribute('viewBox');
    const full=await p.evaluate(id=>ECG_SVG[id].svg.match(/viewBox="([^"]+)"/)[1],id);
    assert.notEqual(crop,full,id+' viewer did not focus the feature');
    await viewer.locator('[data-view="context"]').click();assert.equal(await svg.getAttribute('viewBox'),full);
    await viewer.locator('[data-view="context"]').click();assert.equal(await svg.getAttribute('viewBox'),crop);
   }
   await viewer.locator('.ecg-lightbox-close').click();assert.equal(await button.evaluate(e=>e===document.activeElement),true,id+' lost focus');readings++;}
  await figure.locator('.ecg-image-reading summary').click();
 }
 const metadata=await p.evaluate(()=>({tca:ECG_SVG['tca-toxicity'].learning,hypok:ECG_SVG.hypokalemia.learning}));
 assert.match(metadata.tca.answer,/calibrated/);assert.doesNotMatch(metadata.tca.answer,/uncalibrated|cannot count/);assert.match(metadata.hypok.answer,/380 ms/);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,width+' page overflow');assert.deepEqual(errors,[]);
 await p.locator('.ecg-foundations').screenshot({path:'/tmp/em-foundations-intro-'+width+'.png',style:'.topbar,.ios-tabbar,.toast,.skip-link{visibility:hidden}'});
 for(const id of['rate-calibration','hypertrophy','ischemia-map','omi-equivalents','toxic-metabolic-mimics','normal-12lead','pericarditis-ber']){
  const fig=p.locator('.ecg-fig[data-ecg-fig="'+id+'"]').first(),select=fig.locator('[data-ecg-panel]');if(width<700&&await select.count()){const v=await select.locator('option').nth(1).getAttribute('value');await select.selectOption(v);}
  await fig.screenshot({path:'/tmp/em-role-after-'+id+'-'+width+'.png',style:'.topbar,.ios-tabbar,.toast,.skip-link{visibility:hidden}'});
 }
 console.log(width+': '+await figures.count()+' image roles; '+readings+' correct guided selections/highlights; '+crops+' crop views; concealed/revealed self-checks; no page overflow or JS errors');
 await c.close();
}}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
