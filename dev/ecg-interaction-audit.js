/* Local browser coverage of actual dialog events for every ECG and finding. */
(function () {
  'use strict';
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;
  const button = document.createElement('button'); button.textContent = 'Run all ECG interactions'; button.id = 'runInteractions';
  document.querySelector('.qa-row').append(button);
  button.onclick = async function () {
    const out = document.querySelector('#result'), failures = [], counts = {}, api = window.ECG_INTERACTIVE;
    let checks = 0;
    let browserError;
    const onError = event => { browserError = event.error || event.message; };
    window.addEventListener('error', onError);
    const assert = (condition, message) => { checks++; if (!condition) throw Error(message); };
    const tick = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const change = (box, key, value) => { const input = box.querySelector('[data-view="' + key + '"]'); input.value = value; input.dispatchEvent(new Event('change', {bubbles:true})); };
    const validateMarks = (box, label) => {
      const marks = [...box.querySelectorAll('.ecg-finding-marks ellipse')], svg = box.querySelector('.ecg-workbench-canvas svg'), vb = svg.viewBox.baseVal;
      assert(marks.length > 0, label + ': no highlight');
      for (const mark of marks) {
        const [x,y,rx,ry] = ['cx','cy','rx','ry'].map(k=>Number(mark.getAttribute(k)));
        assert([x,y,rx,ry].every(Number.isFinite) && rx > 0 && ry > 0, label + ': invalid circle');
        assert(x-rx>=-1 && y-ry>=-1 && x+rx<=vb.width+1 && y+ry<=vb.height+1, label + ': clipped circle');
        assert(getComputedStyle(mark).stroke === 'rgb(220, 38, 38)', label + ': missing red stroke');
      }
      assert(box.querySelector('.ecg-finding-detail').textContent.length > 40, label + ': missing explanation');
      assert(box.getBoundingClientRect().width <= innerWidth + 1, label + ': modal exceeds viewport');
    };
    for (const [id, entry] of Object.entries(window.ECG_SVG)) {
      const before = checks;
      try {
        api.open(id, button); await tick();
        let box = document.querySelector('#ecgWorkbench');
        assert(box.getAttribute('aria-label') === entry.title, id + ': wrong title');
        assert(box.querySelectorAll('button[data-finding]').length >= 2, id + ': missing lesson buttons');
        validateMarks(box, id + ' initial');
        for (const finding of box.querySelectorAll('button[data-finding]')) {
          finding.click(); validateMarks(box, id + ' ' + finding.textContent);
          assert(finding.getAttribute('aria-pressed') === 'true', id + ': selection not announced');
          box.querySelector('[data-view="findings"]').click();
          assert(!box.querySelector('.ecg-finding-marks'), id + ': hide failed');
          box.querySelector('[data-view="findings"]').click(); validateMarks(box, id + ' restore');
        }
        const target = box.querySelector('.ecg-guided-target');
        if (target) {
          target.focus(); target.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
          validateMarks(box, id + ' keyboard target');
          assert(document.activeElement.matches('button[data-finding]'), id + ': lost keyboard focus');
        }
        for (const zoom of ['1.5','2','3','1']) { change(box,'zoom',zoom); validateMarks(box,id+' zoom '+zoom); assert(box.querySelector('.ecg-workbench-canvas').style.width === Number(zoom)*100+'%',id+': zoom ignored'); }
        if (box.querySelector('[data-view="speed"]')) {
          const settings = box.querySelector('details'); settings.open = true;
          const lane = box.querySelector('[data-view="lane"]');
          for (const option of lane.options) { change(box,'lane',option.value); validateMarks(box,id+' lead '+option.value); assert(lane.value===option.value,id+': lead selection rejected'); }
          change(box,'lane','all');
          for (const speed of ['25','50']) for (const gain of ['5','10','20']) for (const duration of ['3000','6000','10000']) {
            change(box,'speed',speed); change(box,'gain',gain); change(box,'duration',duration); validateMarks(box,id+' scale '+speed+'/'+gain+'/'+duration);
          }
          box.querySelector('[data-view="normal"]').click();
          assert(!box.querySelector('.ecg-finding-marks'), id + ': pathological marks on normal');
          box.querySelector('[data-view="normal"]').click(); validateMarks(box,id+' normal return');
          for(const key of ['artifact','labels','reference']) {
            const control=box.querySelector('[data-view="'+key+'"]'); if(!control)continue;
            control.click();
            if(key==='reference') assert(getComputedStyle(box.querySelector('.ecg-reference')).display!=='none',id+': reference hidden');
            if(key==='labels') assert(getComputedStyle(box.querySelector('.ecg-annotation')).display==='none',id+': labels still visible');
            control.click(); validateMarks(box,id+' toggle '+key);
          }
          box.querySelector('[data-view="measure"]').click();
          const t=box.querySelector('[data-point="a"][data-axis="t"]'); t.value='400'; t.dispatchEvent(new Event('input',{bubbles:true}));
          assert(box.querySelector('.ecg-measurement').textContent.includes('800 ms'),id+': caliper input result');
          assert(box.querySelectorAll('.ecg-calipers [data-handle]').length===4,id+': missing caliper handles');
          box.querySelector('[data-view="measure"]').click();
          // Tap placement exercises the SVG screen-to-paper coordinate conversion.
          box.querySelector('[data-view="measure"]').click();
          const canvas=box.querySelector('.ecg-workbench-canvas'), svg=canvas.querySelector('svg'), base=Number(svg.querySelector('line[stroke="#94a3b8"]').getAttribute('y1'));
          for(const time of [400,1200]) {const point=svg.createSVGPoint(); point.x=80+time*.4; point.y=base; const screen=point.matrixTransform(svg.getScreenCTM()); canvas.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:screen.x,clientY:screen.y}));}
          assert(box.querySelector('.ecg-measurement').textContent.includes('800 ms'),id+': tap coordinates incorrect');
          box.querySelector('[data-view="measure"]').click();
          if(id==='wellens') { for(const variant of ['A','B']) { change(box,'variant',variant); box=document.querySelector('#ecgWorkbench'); validateMarks(box,id+' variant '+variant); } }
          if(id==='vt-vs-svt') {
            change(box,'duration','3000'); box.querySelector('button[data-finding="1"]').click();
            assert(box.querySelector('[data-view="duration"]').value==='10000',id+': capture requires long strip'); validateMarks(box,id+' capture');
            box.querySelector('[data-view="findings"]').click();change(box,'duration','3000');box.querySelector('[data-view="findings"]').click();validateMarks(box,id+' hidden capture then shorter strip');
          }
        } else assert(!box.querySelector('[data-view="measure"]'),id+': uncalibrated measurement tool');
        box.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        assert(!document.querySelector('#ecgWorkbench'),id+': Escape failed');
        assert(document.activeElement===button,id+': close did not restore focus');
        assert(!browserError,id+': uncaught browser error '+browserError);
        counts[id]=checks-before;
      } catch(error) { failures.push(id+': '+error.message); api.close(); }
      out.textContent='Checking ECG interactions… '+Object.keys(counts).length+'/27';
      await tick();
    }
    // Check the universal selector crosses both static and modeled viewer types.
    try {
      api.open('wellens',button,{normal:true});
      for(const [id,entry] of Object.entries(window.ECG_SVG)){change(document.querySelector('#ecgWorkbench'),'diagnosis',id);const box=document.querySelector('#ecgWorkbench');assert(box.getAttribute('aria-label')===entry.title,id+': ECG selector mismatch');validateMarks(box,id+' selector');}
    } catch(error){failures.push('ECG selector: '+error.message);}
    api.close();
    try {
      const frame=document.querySelector('#app'); frame.contentWindow.location.hash='ecg'; await tick();
      const doc=frame.contentDocument, triggers=[...doc.querySelectorAll('[data-ecg-tool="explain"]')];
      assert(triggers.length>=25,'Actual app missing Explain this ECG buttons');
      doc.querySelectorAll('.section-card.closed .sec-head').forEach(h=>h.click());
      for(const trigger of triggers) {trigger.click(); const box=doc.querySelector('#ecgWorkbench');assert(!!box,'Actual app button did not open viewer');assert(box.querySelectorAll('button[data-finding]').length>=2,'Actual app missing lessons');assert(box.querySelector('.ecg-finding-marks ellipse'),'Actual app missing red circle');box.querySelector('.ecg-lightbox-close').click();}
      for(const wave of doc.querySelectorAll('[data-ecg-wavebtn]')){const figure=wave.closest('figure');const hot=figure.querySelector('.ecg-hot[data-wave="'+wave.dataset.ecgWavebtn+'"]');if(!hot)continue;wave.click();assert(figure.querySelector('.ecg-inline-marks'),'Inline wave missing red circle: '+figure.dataset.ecgFig+' '+wave.dataset.ecgWavebtn);wave.click();assert(!figure.querySelector('.ecg-inline-marks'),'Inline red circle did not clear');}
    } catch(error){failures.push('Actual app entry points: '+error.message);}
    window.removeEventListener('error', onError);
    out.textContent=checks+' interaction assertions; '+Object.keys(counts).length+'/27 ECGs passed; '+failures.length+' failed.\n'+failures.join('\n')+'\n'+Object.entries(counts).map(([id,n])=>id+': '+n+' checks').join('\n');
    window.ecgInteractionAudit={checks,counts,failures,width:innerWidth};
  };
}());
