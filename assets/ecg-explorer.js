/* Full-paper teaching workspace. Existing guide records and tracings stay intact. */
(function () {
  'use strict';
  const E = window.ECG_ENGINE;
  if (!E || !window.ECG_SVG) return;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cases = [
    { id:'normal', name:'Normal sinus rhythm', pattern:'normal-sinus', guide:'step-rate-calibration', summary:'A regular sinus rhythm with a consistent P–QRS relationship, narrow QRS complexes and normal precordial progression.' },
    { id:'af', name:'Atrial fibrillation', pattern:'atrial-fibrillation', guide:'step-rhythm-axis', summary:'Irregular ventricular intervals with no organized repeating P waves. This example has narrow QRS complexes and does not model pre-excitation.' },
    { id:'inferior-stemi', name:'Inferior STEMI pattern', pattern:'stemi-criteria', guide:'stemi-criteria', summary:'ST elevation in II, III and aVF with reciprocal depression in aVL. Interpret the distribution with symptoms and serial ECGs.' },
    { id:'wellens-a', name:'Wellens pattern · Type A', pattern:'wellens', variant:'A', guide:'wellens', summary:'Biphasic anterior T waves: initially positive, then negative in V2–V3. The clinical context, often a pain-free interval after angina, is essential.' },
    { id:'wellens-b', name:'Wellens pattern · Type B', pattern:'wellens', variant:'B', guide:'wellens', summary:'Deep anterior T-wave inversion in V2–V3 with preserved R waves. This is a teaching pattern, not proof of a particular coronary lesion.' },
    { id:'de-winter', name:'de Winter pattern', pattern:'dewinter', guide:'dewinter', summary:'Upsloping ST depression with prominent symmetric T waves across V2–V6. Associated aVR elevation is illustrated but is not required.' }
  ];
  cases.push(
    {id:'anterior-stemi',name:'Anterior STEMI pattern',category:'Ischemia',guide:'stemi-criteria',summary:'ST elevation across contiguous anterior leads V2–V4. Use the appropriate V2–V3 thresholds, symptoms and serial recordings.',overrides:{V2:{stMv:.35},V3:{stMv:.40},V4:{stMv:.25}}},
    {id:'lateral-stemi',name:'Lateral STEMI pattern',category:'Ischemia',guide:'stemi-criteria',summary:'ST elevation in I, aVL and V5–V6, with reciprocal inferior depression in this example.',overrides:{I:{stMv:.20},II:{stMv:0},III:{stMv:-.20},aVR:{stMv:-.10},aVL:{stMv:.20},aVF:{stMv:-.10},V5:{stMv:.20},V6:{stMv:.15}}}
  );
  const curriculum=window.ECG_CURRICULUM;
  cases.forEach(c=>{c.category=['normal','af'].includes(c.id)?'Rhythms':'Ischemia';c.source=c.category==='Ischemia'?'acs':'rhythm';});
  if(curriculum)cases.push(...curriculum.cases);
  const categories=[...new Set(cases.map(c=>c.category))];
  cases.sort((a,b)=>categories.indexOf(a.category)-categories.indexOf(b.category));
  function instanceSvg(svg,suffix) {
    const ids={};svg=svg.replace(/\bid="([^"]+)"/g,(_,id)=>{ids[id]=id+suffix;return 'id="'+ids[id]+'"';});
    svg=svg.replace(/url\(#([^)]*)\)/g,(all,id)=>ids[id]?'url(#'+ids[id]+')':all);
    return svg.replace(/aria-labelledby="([^"]+)"/g,(_,list)=>'aria-labelledby="'+list.split(' ').map(id=>ids[id]||id).join(' ')+'"');
  }
  const m = E.layoutMetrics(), cells = [];
  E.layout.LAYOUT_3X4.forEach((row,r) => row.forEach((lead,c) => cells.push({lead,x:m.gutL+c*(m.colW+m.gapX),y:m.marT+r*(m.rowH+m.gapY),width:m.colW,height:m.rowH,start:c*2500,duration:2500})));
  const rhythm = {lead:'II',x:m.gutL,y:m.marT+3*m.rowH+2*m.gapY+m.rhyGap,width:2000,height:m.rhyH,start:0,duration:10000};
  const region = cell => [cell.x+6,cell.y+42,cell.width-12,cell.height-48];
  function segment(data, lead, part, rhythmStrip) {
    const cell = rhythmStrip ? rhythm : cells.find(c=>c.lead===lead);
    const q = data.beatTimes.find(t=>t>=cell.start+220 && t+data.qtMs<cell.start+cell.duration);
    let a=q, b=q+data.qrsMs;
    if(part==='p') {a=q-160;b=q-75;}
    if(part==='pr') {a=q-data.prMs;b=q;}
    if(part==='t') {a=q+data.qrsMs+70;b=q+data.qtMs;}
    if(part==='qt') b=q+data.qtMs;
    if(part==='st') {a=q+data.qrsMs;b=a+100;}
    let lo=0,hi=0;
    for(let t=a;t<=b;t+=2) {const v=E.leadVoltageAt(lead,t,data,t/2);lo=Math.min(lo,v);hi=Math.max(hi,v);}
    return [cell.x+(a-cell.start)*.2-6,cell.y+cell.height/2-hi*80-14,(b-a)*.2+12,(hi-lo)*80+28];
  }
  function findingsFor(record,data) {
    const f=(title,explanation,targets)=>({title,explanation,targets});
    const seg=(leads,part)=>leads.split(' ').map(lead=>segment(data,lead,part));
    if(record.id==='normal') return window.ECG_SVG['normal-12lead'].findings.map(f=>({...f,targets:f.targets.map(r=>r.slice())})).concat([
      f('P wave: atrial activity','The small positive P wave comes before QRS in lead II. Follow the repeating P–QRS relationship rather than naming the rhythm from rate alone.',seg('II','p')),
      f('PR interval','Measure from the beginning of P to the beginning of QRS. The model uses a PR of 160 ms; P duration is included in that interval.',seg('II','pr')),
      f('Narrow QRS','The model uses an 88 ms QRS. Identify the start and end of ventricular depolarization; at 25 mm/s, a small horizontal box represents 40 ms.',seg('II','qrs')),
      f('QT and T-wave endpoint','QT extends from QRS onset to T end. This model uses QT 380 ms. Rate correction and a clear T endpoint are needed when interpreting QTc.',seg('II','qt')),
      f('Limb-lead polarity','Compare the predominantly positive complexes in I and II with the negative aVR view. These are different views of the same modeled cardiac activity.', ['I','II','aVR'].map(lead=>region(cells.find(c=>c.lead===lead)))) ,
      f('Lead labels and electrode placement','The printed labels identify the lead views; they cannot prove correct electrode placement. Confirm placement clinically, including V1/V2 in the fourth intercostal spaces.',cells.filter(c=>['V1','V2'].includes(c.lead)).map(region)),
      f('Sequential columns','Each upper column covers a successive 2.5-second window. The bottom rhythm strip spans all ten seconds. Compare events using their time windows rather than assuming adjacent columns are simultaneous.',[region(cells[0]),region(cells[1])])
    ]);
    if(record.id==='anterior-stemi')return [
      f('Contiguous anterior ST elevation','Locate the J point and elevated ST segments in V2–V4. The displayed elevations are 3.5, 4 and 2.5 mm at standard gain.',seg('V2 V3 V4','st')),
      f('V2–V3 use specific thresholds','In V2–V3, apply sex- and age-specific J-point criteria rather than using the generic 1 mm threshold. The clinical context remains essential.',seg('V2 V3','st')),
      f('Compare the other lead territories','Inspect the inferior and lateral leads as well. The absence of reciprocal changes does not exclude anterior occlusion.',seg('II aVL V6','st'))
    ];
    if(record.id==='lateral-stemi')return [
      f('Lateral ST elevation','ST elevation is illustrated in the high-lateral views I and aVL and the lateral precordial views V5–V6.',seg('I aVL V5 V6','st')),
      f('Inferior reciprocal depression','Compare the depressed ST segments in III and aVF with the lateral elevation. Reciprocal changes support the territorial interpretation.',seg('III aVF','st')),
      f('Read limb and chest leads together','The limb and precordial views provide complementary evidence. A single lead or the tracing alone cannot identify an exact culprit artery.',seg('I V5','st'))
    ];
    if(record.id==='af') return [
      f('Irregular R–R intervals','Compare successive QRS complexes along the continuous lead II strip. The intervals vary; the irregularity is part of the model, not recording artifact.',[region(rhythm)]),
      f('No organized P waves','Inspect the baseline between QRS complexes. There is no repeating sinus P wave, so a consistent PR interval cannot be assigned.',[region(cells.find(c=>c.lead==='II'))]),
      f('Narrow ventricular complexes','The ventricular QRS complexes in this example are narrow. This tracing does not show pre-excited AF.',seg('II V5','qrs'))
    ];
    if(record.id==='inferior-stemi') return [
      f('Inferior ST elevation','Locate the J point and elevated ST segments in the contiguous inferior leads II, III and aVF.',seg('II III aVF','st')),
      f('Reciprocal aVL depression','The ST segment in aVL moves in the opposite direction. This reciprocal change supports interpretation of the inferior pattern.',seg('aVL','st')),
      f('Compare territories','Compare the inferior changes with the anterior lead views. A territorial pattern and its evolution matter more than one isolated tall wave.', ['II','III','aVF','V2'].map(lead=>region(cells.find(c=>c.lead===lead))))
    ];
    if(record.pattern==='wellens') return [
      f(record.variant==='A'?'Biphasic anterior T waves':'Inverted anterior T waves',record.variant==='A'?'Follow T through its initial positive portion and terminal negative portion in V2–V3.':'Follow the deeply inverted T waves in V2–V3; their shape differs from the normal upright anterior comparison.',seg('V2 V3','t')),
      f('Preserved anterior R waves','R waves remain present in the involved leads. Assess this alongside the ST–T pattern and recent symptoms.',seg('V2 V3','qrs')),
      f('Compare with lateral T waves','The modeled abnormality is concentrated in the anterior views. Compare these T waves with V5–V6 while remembering that real patient patterns vary.',seg('V5 V6','t'))
    ];
    return [
      f('Upsloping ST depression','The J point is depressed and the ST segment rises toward the T wave across V2–V6. Inspect ST and T together.',seg('V2 V3 V4 V5 V6','st')),
      f('Tall symmetric T waves','The precordial T waves are prominent and symmetric in this model. Tall T amplitude by itself is nonspecific.',seg('V2 V3 V4 V5 V6','t')),
      f('Associated aVR elevation','This example includes ST elevation in aVR. It can accompany the pattern but is neither required nor independently diagnostic.',seg('aVR','st'))
    ];
  }
  let sequence=0, expandedDialog=null;
  const mounts=new WeakMap();
  function build(id,concealed) {
    const record=cases.find(c=>c.id===id)||cases[0];
    if(record.kind||record.library){
      const item=curriculum.build(record);
      let svg=item.svg.replace(/<g\b[^>]*class="ecg-hot"[\s\S]*?<\/g>/g,'').replace(/ tabindex="[^"]*"/g,'');
      if(concealed){
        svg=svg.replace(/<(title|desc)\b[^>]*>[\s\S]*?<\/\1>/g,'').replace(/(<text\b[^>]*>)([\s\S]*?)<\/text>/g,(_,tag,text)=>{
          const label=text.replace(/<[^>]*>/g,'').trim().split(' ·')[0];
          return /^(?:I{1,3}|aV[LRF]|V[1-9]R?)(?:[–-]V[1-9]R?)?$/.test(label)||/^(?:\d+(?:\.\d+)? s|1 mV \/ 200 ms)$/.test(label)?tag+label+'</text>':'';
        }).replace(/ aria-label(?:ledby)?="[^"]*"/g,'');
        svg=svg.replace(/(<svg[^>]*>)/,'$1<title>Practice ECG</title>');
      }
      return {...item,record,svg:instanceSvg(svg,'-explorer'+(++sequence)),caption:concealed?'Synthetic teaching example. Interpret the waveform before revealing its findings.':item.caption};
    }
    const data=record.overrides?Object.assign(E.createNormalSinusCase({noise:{disabled:true}}),{leadOverrides:record.overrides}):E.createPatternCase(record.pattern,{variant:record.variant,noise:{disabled:true}});
    const drawing=E.render12Lead({caseData:data,title:concealed?'Practice ECG':record.name+' · 12-lead',description:concealed?'Read the full tracing before revealing the interpretation.':record.summary,
      subtitle:concealed?'10-second recording':data.rate+'/min · modeled rhythm',teaching:'Sequential 2.5-second columns · continuous 10-second lead II below',
      rhythmLabel:'II rhythm · 10 s',footer:concealed?'Read rate, rhythm, intervals and ST–T changes.':'Selected teaching pattern; correlate with clinical context.'});
    // Every inline and enlarged instance owns its SVG IDs.
    const suffix='-explorer'+(++sequence);
    const svg=drawing.svg.replace(/ecgEngTitle|ecgEngDesc|ecgEngMinor|ecgEngMajor/g,id=>id+suffix);
    return {record,data,svg,width:drawing.width,height:drawing.height,findings:findingsFor(record,data),format:'Full 12-lead ECG',caption:'Synthetic educational tracing · 12 leads plus a continuous rhythm strip.',scale:'25 mm/s · 10 mm/mV'};
  }
  // A model comparator, never represented as a prior patient ECG.
  function comparison(id) {
    const item=build(id,false),record=item.record;
    if(!record.kind&&!record.library){const normal=build('normal',false);return {...normal,note:'Same lead layout, 25 mm/s and 10 mm/mV. Normal sinus model at 72/min; beat timing may differ.'};}
    let rows,ux=.2,uy=80,duration=6000;
    if(record.kind){rows=item.data.lanes.map((lead,i)=>({lead,lane:lead,baseline:210+i*270}));}
    else {
      const entry=window.ECG_SVG[record.library];
      if(!entry.traceSpec){
        if(id!=='hypertrophy')return null;
        rows=[{lead:'V1',baseline:152,x:46,duration:1230,uy:40},{lead:'V5',baseline:152,x:346,duration:1270,uy:40},{lead:'II',baseline:350,x:46,duration:2740,uy:80}];
      }else{
        duration=['vt-vs-svt','complete-heart-block'].includes(id)?10000:3000;
        const drawing=window.ECG_INTERACTIVE.render(entry.traceSpec,{duration,viewer:true});rows=drawing.rows;ux=drawing.ux;uy=drawing.uy;
      }
    }
    const data=E.createNormalSinusCase({rate:72,noise:{disabled:true}});
    let svg='<svg class="ecg-svg ecg-paper" viewBox="0 0 '+item.width+' '+item.height+'" role="img" aria-label="Normal sinus model in matching lead views">'+E.renderPaperGrid(item.width,item.height);
    rows.forEach(row=>{
      const lead=/^(Normal|Hyperacute|HyperK\?|Type A|Type B)$/.test(row.lead)?'V3':row.lead;
      svg+='<text x="'+(row.x||20)+'" y="'+(row.baseline-30)+'" font-size="18">'+esc(lead)+(id==='hypertrophy'?' · '+(row.uy/8)+' mm/mV':'')+'</text>';
      let d='';for(let t=0;t<=(row.duration||duration);t+=2)d+=(t?' L':'M')+((row.x||80)+t*ux).toFixed(2)+','+(row.baseline-E.leadVoltageAt(lead,t,data,t/2)*(row.uy||uy)).toFixed(2);
      svg+='<path class="ecg-trace" d="'+d+'" fill="none" stroke="#111" stroke-width="2.5"/>';
    });
    svg+='<text x="20" y="28" font-size="16">NORMAL SINUS MODEL · 72/min · 25 mm/s'+(id==='hypertrophy'?' · gain labeled per lead':' · 10 mm/mV')+'</text></svg>';
    return {svg:instanceSvg(svg,'-compare'+(++sequence)),width:item.width,height:item.height,note:(id==='hypertrophy'?'V1/V5 at 5 mm/mV; II at 10 mm/mV, matching the teaching diagram. ':'Matching lead views and scale. ')+'Normal sinus model at 72/min; beat timing may differ. This is not a prior patient ECG.'};
  }
  function containsPoint(target,x,y) {const [a,b,w,h]=target;return ((x-a-w/2)/(w/2))**2+((y-b-h/2)/(h/2))**2<=1;}
  const progressKey='em-ecg-learning-v1';
  function readProgress(){
    let saved={};try{saved=JSON.parse(localStorage.getItem(progressKey)||'{}')||{};}catch(e){}
    const valid=id=>cases.some(c=>c.id===id),ids=v=>Array.isArray(v)?[...new Set(v.filter(valid))]:[];
    const finding=Number.isInteger(saved.finding)&&saved.finding>=0?saved.finding:0;
    // Validate saved findings without rendering entire SVG tracings during startup.
    const counts=new Map();
    function findingCount(id){
      if(!counts.has(id)){
        const record=cases.find(c=>c.id===id);
        let count=0;
        if(record.kind)count=record.lessons.length;
        else if(record.library)count=window.ECG_SVG[record.library].findings.length;
        else {
          const data=record.overrides?Object.assign(E.createNormalSinusCase({noise:{disabled:true}}),{leadOverrides:record.overrides}):E.createPatternCase(record.pattern,{variant:record.variant,noise:{disabled:true}});
          count=findingsFor(record,data).length;
        }
        counts.set(id,count);
      }
      return counts.get(id);
    }
    const review=Array.isArray(saved.review)?[...new Set(saved.review)].filter(key=>{
      if(typeof key!=='string')return false;
      const parts=key.split(':'),[id,n]=parts;
      return parts.length===2&&valid(id)&&/^\d+$/.test(n)&&Number(n)<findingCount(id);
    }):[];
    return {last:valid(saved.last)?saved.last:'normal',finding,completed:ids(saved.completed),review};
  }
  function saveProgress(value){try{localStorage.setItem(progressKey,JSON.stringify(value));return true;}catch(e){return false;}}
  function close() {if(expandedDialog){expandedDialog.close();}}
  function mount(root,options) {
    if(mounts.has(root))mounts.get(root).abort();
    const lifecycle=new AbortController();mounts.set(root,lifecycle);
    const appView=typeof location!=='undefined'&&location.hash.startsWith('#ecg-explorer');
    const requested=options&&options.id;
    const progress=readProgress();let persisted=true;
    const chosen=cases.some(c=>c.id===requested)?requested:(appView?progress.last:'normal');
    const practicing=requested==='practice';
    const state={id:chosen,practice:practicing,revealed:!practicing,finding:0,highlights:true,zoom:'1',answer:'',region:0,viewOptions:false,compare:false,locating:false,locationFeedback:''};
    if(appView&&chosen===progress.last)state.finding=progress.finding;
    function save(){if(appView){progress.last=state.id;progress.finding=state.finding;persisted=saveProgress(progress);}}
    function remember(){if(!appView)return;save();try{history.replaceState(null,'','#ecg-explorer~'+(state.practice?'practice':state.id));}catch(e){}if(window.STUDENT_LEARNING&&!state.practice)window.STUDENT_LEARNING.remember('ecg-explorer~'+state.id);}

    let cached, cacheKey, dialogHost;
    function model() {const key=state.id+':'+(state.practice&&!state.revealed);if(key!==cacheKey){cached=build(state.id,state.practice&&!state.revealed);cacheKey=key;}return cached;}
    function render(host,expanded) {
      const item=model(),hidden=state.practice&&!state.revealed;
      const suppress=hidden||state.locating;
      state.finding=Math.max(0,Math.min(item.findings.length-1,state.finding));
      remember();
      const viewSuffix='-view'+(++sequence);
      const paperSvg=instanceSvg(item.svg,viewSuffix);
      const option=(c,i)=>'<option value="'+c.id+'"'+(state.id===c.id?' selected':'')+'>'+esc(state.practice?'Case '+String(i+1).padStart(2,'0'):c.name)+'</option>';
      const options=state.practice?cases.map(option).join(''):categories.map(category=>'<optgroup label="'+esc(category)+'">'+cases.filter(c=>c.category===category).map(option).join('')+'</optgroup>').join('');
      const source=curriculum&&curriculum.sources[item.record.source];
      host.innerHTML='<div class="explorer-heading"><div><p class="explorer-kicker">ECG LEARNING LIBRARY</p><h1>ECG Explorer</h1><p>'+cases.length+' teaching examples. Select a finding to see exactly where to look.</p></div><button type="button" class="ex-button" data-action="'+(expanded?'close':'enlarge')+'">'+(expanded?'Close enlarged view':'Enlarge ECG')+'</button></div>'+
        '<div class="explorer-controls"><label>Teaching ECG<select data-control="case" aria-label="Teaching ECG">'+options+'</select></label><button type="button" class="ex-button" data-action="previous" aria-label="Previous ECG">← Previous</button><button type="button" class="ex-button" data-action="next" aria-label="Next ECG">Next →</button><label>Zoom<select data-control="zoom" aria-label="ECG zoom">'+[['1','Whole ECG'],['1.5','150%'],['2','200%'],['3','300%']].map(([v,t])=>'<option value="'+v+'"'+(v===state.zoom?' selected':'')+'>'+t+'</option>').join('')+'</select></label><button type="button" class="ex-button" data-action="practice" aria-pressed="'+state.practice+'">ECG Practice</button>'+(!hidden?'<button type="button" class="ex-button" data-action="highlights" aria-pressed="'+state.highlights+'">Red highlights</button>':'')+'</div>'+
        (item.record.stem?'<p class="explorer-clinical-stem">'+esc(item.record.stem)+'</p>':'')+'<div class="explorer-layout"><section class="explorer-sheet" aria-label="ECG teaching paper"><div class="explorer-paper-hint">'+esc(item.scale)+' <span>Whole ECG overview · select a finding for detail.</span></div><div class="explorer-paper" tabindex="0" role="region" aria-label="ECG paper; scroll to inspect"><div class="explorer-canvas" style="width:'+Number(state.zoom)*100+'%">'+paperSvg+'</div></div><p class="explorer-caption">'+esc(item.caption)+'</p></section>'+
        '<aside class="explorer-findings" aria-label="Diagnosis and findings">'+(hidden?'<p class="explorer-kicker">YOUR INTERPRETATION</p><h2>Read before revealing</h2><p>What are the rate, rhythm and important findings? Use the whole ECG.</p>':'<p class="explorer-kicker">'+esc(item.format)+' · CURRENT DIAGNOSIS / PATTERN</p><h2>'+esc(item.record.name)+'</h2><p>'+esc(item.record.summary)+'</p>')+
        (state.practice?'<label class="explorer-answer">Your interpretation<textarea data-control="answer" rows="3" placeholder="Rate, rhythm, intervals, ST–T changes…">'+esc(state.answer)+'</textarea></label>':'')+
        (hidden?'<button type="button" class="ex-button ex-primary" data-action="reveal">Reveal diagnosis &amp; findings</button>':'<h3>Findings <span>'+item.findings.length+'</span></h3><div class="explorer-finding-list">'+item.findings.map((f,i)=>'<button type="button" data-finding="'+i+'" aria-pressed="'+(i===state.finding)+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(f.title)+'</button>').join('')+'</div><div class="explorer-explanation" role="status"><strong>'+esc(item.findings[state.finding].title)+'</strong><p>'+esc(item.findings[state.finding].explanation)+'</p><button class="ex-button" type="button" data-action="focus">Focus this finding</button></div><a class="explorer-guide-link" href="#ecg~'+item.record.guide+'">Open the ECG guide →</a>')+(!hidden&&source?'<p class="explorer-source"><a target="_blank" rel="noopener noreferrer" href="'+source.url+'">'+esc(source.label)+'</a></p>':'')+'</aside></div>';
      const extra=document.createElement('details');extra.className='explorer-options';
      extra.innerHTML='<summary>View options</summary>';
      const zoom=host.querySelector('[data-control="zoom"]').closest('label');extra.append(zoom);
      const highlights=host.querySelector('[data-action="highlights"]');if(highlights)extra.append(highlights);
      host.querySelector('.explorer-controls').append(extra);
      extra.open=state.viewOptions||state.zoom!=='1';
      extra.addEventListener('toggle',()=>{if(extra.isConnected)state.viewOptions=extra.open;});
      if(!hidden){const detail=host.querySelector('.explorer-explanation');host.querySelector('.explorer-findings h3').before(detail);}
      if(!suppress&&state.highlights){
        const svg=host.querySelector('svg'),g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','ecg-finding-marks');
        item.findings[state.finding].targets.forEach(([x,y,w,h])=>{const circle=document.createElementNS(g.namespaceURI,'ellipse');for(const [k,v]of Object.entries({cx:x+w/2,cy:y+h/2,rx:w/2,ry:h/2}))circle.setAttribute(k,v);g.append(circle);});svg.append(g);
      }
      if(!suppress){
        const detail=host.querySelector('.explorer-explanation'),targets=item.findings[state.finding].targets;
        state.region=Math.min(state.region,targets.length-1);
        const [x,y,w,h]=targets[state.region],pad=20;
        const preview=document.createElement('div');preview.className='explorer-detail';
        preview.innerHTML='<p>Marked region '+(state.region+1)+' of '+targets.length+' · detail view</p>'+instanceSvg(host.querySelector('.explorer-canvas svg').outerHTML,'-detail'+(++sequence))+(targets.length>1?'<button type="button" class="ex-button" data-action="region">Next marked region →</button>':'');
        const svg=preview.querySelector('svg');const left=Math.max(0,x-pad),top=Math.max(0,y-pad);
        svg.setAttribute('viewBox',[left,top,Math.min(item.width-left,w+pad*2),Math.min(item.height-top,h+pad*2)].join(' '));
        svg.removeAttribute('aria-labelledby');svg.setAttribute('role','img');svg.setAttribute('aria-label','Detail: '+item.findings[state.finding].title);
        detail.prepend(preview);
        if(state.practice&&window.STUDENT_LEARNING){const rating=document.createElement('section');rating.className='explorer-confidence';rating.innerHTML='<p>How did you do? Self-assessment, not a mastery score.</p>'+window.STUDENT_LEARNING.ratingHtml('ecg:'+state.id);host.querySelector('.explorer-findings').append(rating);}
      }
      const toolbar=host.querySelector('.explorer-controls');
      const progressBar=document.createElement('section');progressBar.className='explorer-progress';progressBar.setAttribute('aria-label','Learning progress');
      progressBar.innerHTML='<div><strong>'+progress.completed.length+' / '+cases.length+' cases completed</strong><progress max="'+cases.length+'" value="'+progress.completed.length+'" aria-label="Completed ECG cases"></progress><small>'+(persisted?'Progress stays on this device.':'Storage unavailable; progress lasts for this visit.')+'</small></div><button class="ex-button" data-action="continue">Continue learning →</button>'+(progress.review.length?'<button class="ex-button" data-action="review-next">Review saved findings ('+progress.review.length+')</button>':'');
      toolbar.before(progressBar);
      if(!hidden){
        const actions=document.createElement('div');actions.className='explorer-learning-actions';
        actions.innerHTML='<button class="ex-button" data-action="complete" aria-pressed="'+progress.completed.includes(state.id)+'">'+(progress.completed.includes(state.id)?'✓ Case completed':'Mark case complete')+'</button><button class="ex-button" data-action="save-review" aria-pressed="'+progress.review.includes(state.id+':'+state.finding)+'">'+(progress.review.includes(state.id+':'+state.finding)?'Finding saved for review':'Review this finding later')+'</button><button class="ex-button" data-action="locate-practice" aria-pressed="'+state.locating+'">'+(state.locating?'Exit location exercise':'Practice locating this finding')+'</button>';
        host.querySelector('.explorer-findings').append(actions);
        const compareButton=document.createElement('button');compareButton.className='ex-button';compareButton.dataset.action='compare';compareButton.setAttribute('aria-pressed',String(state.compare));compareButton.textContent='Compare normal';toolbar.append(compareButton);
      }
      if(state.locating&&!hidden){
        const detail=host.querySelector('.explorer-explanation');detail.innerHTML='<strong>Locate: '+esc(item.findings[state.finding].title)+'</strong><p>Tap the matching region on the main ECG. You can also use the keyboard: focus the ECG and move the cursor with arrow keys, then press Enter.</p><p class="explorer-location-feedback" role="status">'+esc(state.locationFeedback)+'</p><button class="ex-button" data-action="show-location">Show location and explanation</button>';
        host.querySelector('.explorer-sheet').prepend(detail);
        host.querySelector('.explorer-paper').setAttribute('aria-label','Locate '+item.findings[state.finding].title+'. Use arrow keys to move, Shift for smaller steps, Enter to check.');
      }
      if(state.compare&&!suppress){
        const ref=comparison(state.id),section=document.createElement('section');section.className='explorer-comparison';section.setAttribute('aria-label','Normal comparison');
        if(ref){section.innerHTML='<div class="explorer-paper-hint">Normal sinus reference · 72/min</div><div class="explorer-reference-paper" tabindex="0" role="region" aria-label="Normal ECG; synchronized scrolling"><div class="explorer-reference-canvas" style="width:'+Number(state.zoom)*100+'%">'+instanceSvg(ref.svg,'-ref'+(++sequence))+'</div></div><p>'+esc(ref.note)+'</p>';
          const paper=host.querySelector('.explorer-paper');section.querySelector('.explorer-reference-paper').style.maxHeight=paper.getBoundingClientRect().height+'px';
          host.querySelector('.explorer-sheet').after(section);
          const reference=section.querySelector('.explorer-reference-paper');let syncing=false;
          for(const [a,b] of [[paper,reference],[reference,paper]])a.addEventListener('scroll',()=>{if(syncing)return;syncing=true;b.scrollLeft=a.scrollLeft;b.scrollTop=a.scrollTop;requestAnimationFrame(()=>{syncing=false;});},{passive:true});
        }else{section.innerHTML='<p>This mixed-gain voltage diagram already contains high- and low-voltage examples. A matched normal overlay is unavailable; compare its labeled amplitudes using the stated gain.</p>';host.querySelector('.explorer-sheet').after(section);}
      }
      host.querySelector('.explorer-layout').classList.toggle('has-comparison',state.compare&&!suppress);
      if(state.practice&&state.revealed&&!state.locating){const note=document.createElement('p');note.className='explorer-practice-feedback';note.textContent='Compare your interpretation with each explained finding below. Your written answer is not automatically graded.';host.querySelector('.explorer-answer').after(note);}
      if(expanded&&root.isConnected)render(root,false);
    }
    function locate(host) {
      const mark=host.querySelector('.ecg-finding-marks ellipse'),paper=host.querySelector('.explorer-paper');if(!mark)return;
      const a=mark.getBoundingClientRect(),b=paper.getBoundingClientRect();paper.scrollLeft+=a.left-b.left-40;paper.scrollTop+=a.top-b.top-40;
      const detail=host.querySelector('.explorer-explanation');if(detail&&window.innerWidth<=1100)detail.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
    function bind(host,expanded) {
      let cursor={x:0,y:0};
      function checkLocation(x,y){
        const correct=model().findings[state.finding].targets.some(r=>containsPoint(r,x,y));
        state.locationFeedback=correct?'Correct region. Reveal the explanation to check the waveform feature.':'That point is outside the marked teaching region. Try another lead or segment, or show the explanation.';
        const feedback=host.querySelector('.explorer-location-feedback');if(feedback)feedback.textContent=state.locationFeedback;
      }
      host.addEventListener('click',event=>{
        const paper=event.target.closest('.explorer-paper');if(!state.locating||!paper)return;
        const svg=paper.querySelector('svg'),point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;const p=point.matrixTransform(svg.getScreenCTM().inverse());checkLocation(p.x,p.y);
      },{signal:lifecycle.signal});
      host.addEventListener('keydown',event=>{
        if(!state.locating||!event.target.matches('.explorer-paper')||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter'].includes(event.key))return;
        event.preventDefault();event.stopPropagation();const svg=event.target.querySelector('svg'),vb=svg.viewBox.baseVal;
        if(!cursor.x&&!cursor.y)cursor={x:vb.width/2,y:vb.height/2};
        const step=event.shiftKey?4:20;
        if(event.key==='Enter'){checkLocation(cursor.x,cursor.y);return;}
        cursor.x=Math.max(0,Math.min(vb.width,cursor.x+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0)));
        cursor.y=Math.max(0,Math.min(vb.height,cursor.y+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0)));
        let mark=svg.querySelector('.explorer-cursor');if(!mark){mark=document.createElementNS(svg.namespaceURI,'path');mark.setAttribute('class','explorer-cursor');svg.append(mark);}
        mark.setAttribute('d','M'+(cursor.x-10)+','+cursor.y+'h20 M'+cursor.x+','+(cursor.y-10)+'v20');
        mark.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
      },{signal:lifecycle.signal});
      host.addEventListener('input',event=>{if(event.target.dataset.control==='answer')state.answer=event.target.value;},{signal:lifecycle.signal});
      host.addEventListener('change',event=>{
        const key=event.target.dataset.control;if(key==='answer')return;
        if(key==='case'){state.id=event.target.value;state.finding=0;state.region=0;state.zoom='1';state.answer='';state.revealed=!state.practice;state.locating=false;state.locationFeedback='';}
        else if(key==='zoom')state.zoom=event.target.value;else return;
        render(host,expanded);host.querySelector('[data-control="'+key+'"]').focus({preventScroll:true});
      },{signal:lifecycle.signal});
      host.addEventListener('click',event=>{
        const button=event.target.closest('button');if(!button)return;
        if(button.dataset.confidence&&window.STUDENT_LEARNING){const box=button.closest('[data-rating-key]');const saved=window.STUDENT_LEARNING.rate(box.dataset.ratingKey,button.dataset.confidence);box.querySelectorAll('[data-confidence]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));box.querySelector('.confidence-status').textContent='Self-assessment saved'+(saved?' on this device.':' for this session only.');event.stopPropagation();return;}
        const action=button.dataset.action, index=button.dataset.finding;
        if(action==='enlarge'){
          expandedDialog=document.createElement('dialog');expandedDialog.className='explorer-dialog';expandedDialog.setAttribute('aria-label','ECG Explorer enlarged view');
          dialogHost=document.createElement('div');expandedDialog.append(dialogHost);document.body.append(expandedDialog);bind(dialogHost,true);render(dialogHost,true);
          const dialog=expandedDialog;dialog.addEventListener('close',()=>{dialog.remove();if(expandedDialog===dialog)expandedDialog=null;if(root.isConnected&&!lifecycle.signal.aborted){render(root,false);root.querySelector('[data-action="enlarge"]').focus({preventScroll:true});}},{once:true});dialog.showModal();return;
        }
        if(action==='close'){close();return;}
        if(index!==undefined){state.finding=Number(index);state.region=0;state.highlights=true;state.locationFeedback='';}
        else if(action==='region'){state.region=(state.region+1)%model().findings[state.finding].targets.length;}
        else if(action==='previous'||action==='next'){const i=cases.findIndex(c=>c.id===state.id);state.id=cases[(i+(action==='next'?1:cases.length-1))%cases.length].id;state.finding=0;state.region=0;state.zoom='1';state.answer='';state.revealed=!state.practice;state.locating=false;state.locationFeedback='';}
        else if(action==='practice'){state.practice=!state.practice;state.revealed=!state.practice;state.answer='';state.locating=false;}
        else if(action==='reveal')state.revealed=true;
        else if(action==='compare')state.compare=!state.compare;
        else if(action==='complete'||action==='save-review'){
          const list=action==='complete'?progress.completed:progress.review,key=action==='complete'?state.id:state.id+':'+state.finding,i=list.indexOf(key);if(i<0)list.push(key);else list.splice(i,1);save();
        }
        else if(action==='continue'||action==='review-next'){
          const saved=action==='review-next'?(progress.review.find(key=>key!==state.id+':'+state.finding)||progress.review[0]):null;
          const next=saved?cases.find(c=>c.id===saved.split(':')[0]):cases.find(c=>!progress.completed.includes(c.id)&&c.id!==state.id)||cases.find(c=>!progress.completed.includes(c.id));
          if(next){state.id=next.id;state.finding=saved?Number(saved.split(':')[1]):0;state.region=0;state.zoom='1';state.answer='';state.revealed=!state.practice;state.locating=false;}

        }
        else if(action==='locate-practice'){state.locating=!state.locating;state.locationFeedback='';}
        else if(action==='show-location'){state.locating=false;state.highlights=true;}
        else if(action==='highlights')state.highlights=!state.highlights;
        else if(action==='focus'){state.zoom='2';state.highlights=true;}
        else return;
        render(host,expanded);
        const focus=host.querySelector(index!==undefined||action==='show-location'?'[data-finding="'+(index!==undefined?index:state.finding)+'"]':'[data-action="'+(action==='reveal'?'practice':action)+'"]');if(focus)focus.focus({preventScroll:true});
        if(index!==undefined||action==='focus')locate(host);
        if(action==='locate-practice'&&state.locating){const paper=host.querySelector('.explorer-paper');paper.focus({preventScroll:true});host.querySelector('.explorer-sheet').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
        if(action==='show-location')locate(host);
      },{signal:lifecycle.signal});
      if(expanded)host.addEventListener('keydown',event=>event.stopPropagation());
    }
    bind(root,false);render(root,false);
  }
  window.addEventListener('hashchange',close);
  window.ECG_EXPLORER={mount,build,cases,close,comparison,containsPoint,readProgress};
}());
